## Plan 01-01 Summary

Implemented Rust/WASM chess core contracts.

### Completed
- Added `src/chess_core.rs` for SAN parse/apply with explicit invalid statuses:
  - `invalid-malformed`
  - `invalid-ambiguous`
  - `invalid-illegal`
- Added `src/engine.rs` deterministic embedded engine with fixed-depth mapping.
- Reworked `src/lib.rs` exports:
  - `initial_fen`
  - `apply_san_move`
  - `difficulty_depth`
  - `engine_move`
- Added `tests/phase1_core.rs`:
  - `valid_san_applies_move`
  - `malformed_san_rejected`
  - `ambiguous_san_rejected`
  - `depth_map_easy_1_medium_3_hard_5`
- Updated wasm tests in `tests/web.rs` for invalid move behavior coverage.

### Verification
- `cargo test --test phase1_core` ✅
- `cargo test` ✅

### Deviations from Plan
None - plan executed exactly as written.
