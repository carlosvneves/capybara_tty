use capybara_tty::{apply_san_move, difficulty_depth, initial_fen};

#[test]
fn valid_san_applies_move() {
    let result = apply_san_move(&initial_fen(), "e4");
    assert_eq!(result.status(), "applied");
    assert_ne!(result.fen(), initial_fen());
}

#[test]
fn malformed_san_rejected() {
    let initial = initial_fen();
    let result = apply_san_move(&initial, "this-is-not-san");
    assert_eq!(result.status(), "invalid-malformed");
    assert_eq!(result.fen(), initial);
}

#[test]
fn ambiguous_san_rejected() {
    let ambiguous = "4k3/8/8/8/8/8/3N3N/4K3 w - - 0 1";
    let result = apply_san_move(ambiguous, "Nf3");
    assert_eq!(result.status(), "invalid-ambiguous");
    assert_eq!(result.fen(), ambiguous);
}

#[test]
fn depth_map_easy_1_medium_3_hard_5() {
    assert_eq!(difficulty_depth("Easy"), 1);
    assert_eq!(difficulty_depth("Medium"), 3);
    assert_eq!(difficulty_depth("Hard"), 5);
}
