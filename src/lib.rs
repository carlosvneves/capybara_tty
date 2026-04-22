mod chess_core;
mod engine;
mod utils;

use chess_core::ApplySanResult;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmMoveResult {
    status: String,
    fen: String,
    san: String,
    game_over: bool,
    outcome: String,
}

impl From<ApplySanResult> for WasmMoveResult {
    fn from(value: ApplySanResult) -> Self {
        Self {
            status: value.status,
            fen: value.fen,
            san: value.san,
            game_over: value.game_over,
            outcome: value.outcome.unwrap_or_default(),
        }
    }
}

#[wasm_bindgen]
impl WasmMoveResult {
    #[wasm_bindgen(getter)]
    pub fn status(&self) -> String {
        self.status.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn fen(&self) -> String {
        self.fen.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn san(&self) -> String {
        self.san.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn game_over(&self) -> bool {
        self.game_over
    }

    #[wasm_bindgen(getter)]
    pub fn outcome(&self) -> String {
        self.outcome.clone()
    }
}

#[wasm_bindgen]
pub fn initial_fen() -> String {
    utils::set_panic_hook();
    chess_core::initial_fen()
}

#[wasm_bindgen]
pub fn apply_san_move(fen: &str, san: &str) -> WasmMoveResult {
    utils::set_panic_hook();
    chess_core::apply_san_move(fen, san).into()
}

#[wasm_bindgen]
pub fn difficulty_depth(difficulty: &str) -> u8 {
    engine::difficulty_depth(difficulty)
}

#[wasm_bindgen]
pub fn engine_move(fen: &str, depth: u8) -> WasmMoveResult {
    utils::set_panic_hook();
    engine::engine_move(fen, depth).into()
}
