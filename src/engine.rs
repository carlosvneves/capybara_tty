use crate::chess_core::{outcome_text, parse_fen, to_fen, ApplySanResult};
use shakmaty::{san::San, Color, Move, Position, Role};

const EASY_DEPTH: u8 = 1;
const MEDIUM_DEPTH: u8 = 3;
const HARD_DEPTH: u8 = 5;

pub fn difficulty_depth(difficulty: &str) -> u8 {
    match difficulty.trim().to_ascii_lowercase().as_str() {
        "easy" => EASY_DEPTH,
        "medium" => MEDIUM_DEPTH,
        "hard" => HARD_DEPTH,
        _ => EASY_DEPTH,
    }
}

pub fn engine_move(fen: &str, depth: u8) -> ApplySanResult {
    let position = match parse_fen(fen) {
        Ok(position) => position,
        Err(_) => {
            return ApplySanResult {
                status: "invalid-fen".to_string(),
                fen: fen.to_string(),
                san: String::new(),
                game_over: false,
                outcome: None,
            };
        }
    };

    let search_depth = normalize_depth(depth);
    let legal_moves: Vec<Move> = position.legal_moves().into_iter().collect();
    if legal_moves.is_empty() {
        return ApplySanResult {
            status: "no-legal-moves".to_string(),
            fen: to_fen(&position),
            san: String::new(),
            game_over: true,
            outcome: outcome_text(&position),
        };
    }

    let mut candidates: Vec<(String, Move)> = legal_moves
        .into_iter()
        .map(|movement| {
            let san = San::from_move(&position, movement.clone()).to_string();
            (san, movement)
        })
        .collect();
    candidates.sort_by(|left, right| left.0.cmp(&right.0));

    let mut best_score = i32::MIN;
    let mut best_move = candidates[0].1.clone();
    let mut best_san = candidates[0].0.clone();

    for (san, movement) in candidates {
        let next = position
            .clone()
            .play(movement.clone())
            .expect("legal move from generated legal move list");
        let score = -negamax(&next, search_depth.saturating_sub(1));
        if score > best_score {
            best_score = score;
            best_move = movement;
            best_san = san;
        }
    }

    let resulting_position = position
        .clone()
        .play(best_move)
        .expect("chosen engine move is legal");
    let outcome = outcome_text(&resulting_position);
    ApplySanResult {
        status: "applied".to_string(),
        fen: to_fen(&resulting_position),
        san: best_san,
        game_over: outcome.is_some(),
        outcome,
    }
}

fn normalize_depth(depth: u8) -> u8 {
    match depth {
        EASY_DEPTH => EASY_DEPTH,
        MEDIUM_DEPTH => MEDIUM_DEPTH,
        HARD_DEPTH => HARD_DEPTH,
        value if value < MEDIUM_DEPTH => EASY_DEPTH,
        value if value < HARD_DEPTH => MEDIUM_DEPTH,
        _ => HARD_DEPTH,
    }
}

fn negamax(position: &shakmaty::Chess, depth: u8) -> i32 {
    if depth == 0 || position.is_game_over() {
        return evaluate(position);
    }

    let mut best = i32::MIN;
    let mut moves: Vec<Move> = position.legal_moves().into_iter().collect();
    moves.sort_by_key(|movement| San::from_move(position, movement.clone()).to_string());

    for movement in moves {
        let next = position
            .clone()
            .play(movement)
            .expect("legal move from generated legal move list");
        let score = -negamax(&next, depth.saturating_sub(1));
        best = best.max(score);
    }
    best
}

fn evaluate(position: &shakmaty::Chess) -> i32 {
    let mut score = 0;
    for piece in position.board().occupied() {
        let Some(role) = position.board().role_at(piece) else {
            continue;
        };
        let Some(color) = position.board().color_at(piece) else {
            continue;
        };
        let value = piece_value(role);
        if color == Color::White {
            score += value;
        } else {
            score -= value;
        }
    }

    if position.turn() == Color::White {
        score
    } else {
        -score
    }
}

fn piece_value(role: Role) -> i32 {
    match role {
        Role::Pawn => 100,
        Role::Knight => 320,
        Role::Bishop => 330,
        Role::Rook => 500,
        Role::Queen => 900,
        Role::King => 20_000,
    }
}
