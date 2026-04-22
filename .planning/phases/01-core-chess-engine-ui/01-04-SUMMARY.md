## Plan 01-04 Summary

Completed game-loop integration for command handling, physical-mode resume, clock rules, and restart flow.

### Completed
- Wired command input to wasm SAN apply API in `www/main.js`:
  - valid move updates board/history
  - malformed/ambiguous input flashes red + clears input
  - no persistent invalid text
- Implemented physical board mode flow:
  - after embedded engine move, enters waiting state
  - only Space resumes
  - non-Space keys do not resume
- Implemented clock rules:
  - No clock hides clock panel
  - timeout triggers immediate forfeit banner
  - engine response path does not consume user clock while calculating
- Implemented game-over and restart commands:
  - `resign` ends game immediately with inline banner
  - board stays visible
  - Enter or `new` returns to pre-game config
- Expanded wasm tests in `tests/web.rs`:
  - `invalid_pgn_no_state_change`
  - `physical_mode_space_resume`
  - `game_over_restart_flow`

### Verification
- `cargo test` ✅
- `node --check www/main.js` ✅
- `PATH="$HOME/.cargo/bin:$PATH" wasm-pack build --target web` ✅
- `PATH="$HOME/.cargo/bin:$PATH" wasm-pack test --headless --chrome` ✅

### Deviations from Plan
None - plan executed exactly as written.
