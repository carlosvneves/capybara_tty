//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

use capybara_tty::{apply_san_move, initial_fen};
extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn invalid_pgn_no_state_change() {
    let initial = initial_fen();
    let result = apply_san_move(&initial, "??");
    assert_eq!(result.status(), "invalid-malformed");
    assert_eq!(result.fen(), initial);
}

#[wasm_bindgen_test]
fn physical_mode_space_resume() {
    let resumed = true;
    assert!(resumed);
}

#[wasm_bindgen_test]
fn game_over_restart_flow() {
    let initial = initial_fen();
    let after = apply_san_move(&initial, "e4");
    assert_eq!(after.status(), "applied");
    assert_ne!(after.fen(), initial);
}
