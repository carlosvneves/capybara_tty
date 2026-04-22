use shakmaty::{
    fen::Fen,
    san::{San, SanError},
    CastlingMode, Chess, EnPassantMode, KnownOutcome, Position,
};

#[derive(Clone, Debug)]
pub struct ApplySanResult {
    pub status: String,
    pub fen: String,
    pub san: String,
    pub game_over: bool,
    pub outcome: Option<String>,
}

pub fn initial_fen() -> String {
    Fen::from_position(&Chess::default(), EnPassantMode::Legal).to_string()
}

pub fn parse_fen(fen: &str) -> Result<Chess, String> {
    let parsed = Fen::from_ascii(fen.as_bytes()).map_err(|_| "invalid-fen".to_string())?;
    parsed
        .into_position(CastlingMode::Standard)
        .map_err(|_| "invalid-fen".to_string())
}

pub fn to_fen(position: &Chess) -> String {
    Fen::from_position(position, EnPassantMode::Legal).to_string()
}

pub fn apply_san_move(fen: &str, san_input: &str) -> ApplySanResult {
    let trimmed = san_input.trim();
    let mut position = match parse_fen(fen) {
        Ok(position) => position,
        Err(_) => {
            return ApplySanResult {
                status: "invalid-fen".to_string(),
                fen: fen.to_string(),
                san: trimmed.to_string(),
                game_over: false,
                outcome: None,
            };
        }
    };

    let parsed = match trimmed.parse::<San>() {
        Ok(parsed) => parsed,
        Err(_) => {
            return ApplySanResult {
                status: "invalid-malformed".to_string(),
                fen: fen.to_string(),
                san: trimmed.to_string(),
                game_over: false,
                outcome: None,
            };
        }
    };

    let movement = match parsed.to_move(&position) {
        Ok(movement) => movement,
        Err(SanError::AmbiguousSan) => {
            return ApplySanResult {
                status: "invalid-ambiguous".to_string(),
                fen: fen.to_string(),
                san: trimmed.to_string(),
                game_over: false,
                outcome: None,
            };
        }
        Err(SanError::IllegalSan) => {
            return ApplySanResult {
                status: "invalid-illegal".to_string(),
                fen: fen.to_string(),
                san: trimmed.to_string(),
                game_over: false,
                outcome: None,
            };
        }
    };

    position = match position.play(movement) {
        Ok(next) => next,
        Err(_) => {
            return ApplySanResult {
                status: "invalid-illegal".to_string(),
                fen: fen.to_string(),
                san: trimmed.to_string(),
                game_over: false,
                outcome: None,
            };
        }
    };

    let next_fen = to_fen(&position);
    let outcome = outcome_text(&position);
    ApplySanResult {
        status: "applied".to_string(),
        fen: next_fen,
        san: trimmed.to_string(),
        game_over: outcome.is_some(),
        outcome,
    }
}

pub fn outcome_text(position: &Chess) -> Option<String> {
    match position.outcome() {
        shakmaty::Outcome::Known(KnownOutcome::Draw) => Some("draw".to_string()),
        shakmaty::Outcome::Known(KnownOutcome::Decisive { winner }) => {
            Some(format!("{winner:?} wins"))
        }
        _ => None,
    }
}
