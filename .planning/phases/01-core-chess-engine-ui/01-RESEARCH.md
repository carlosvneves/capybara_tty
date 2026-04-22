# Phase 1: Core Chess Engine + UI - Research

**Researched:** 2026-04-21
**Confidence:** Medium

## Key Implementation Direction

- Keep chess truth in Rust/WASM using `shakmaty` (legality, SAN parse, game outcome).
- Keep UI in vanilla HTML/CSS/JS per `01-UI-SPEC.md` (layout, panels, keyboard flows).
- Export JS-callable API from `src/lib.rs` with `#[wasm_bindgen]`.
- Preserve project constraints from `CLAUDE.md`: no manual edits in `pkg/`, keep crate types, keep `opt-level = "s"`.

## Locked Decisions to Honor in Planning

- PGN keyboard-only input (REQ-001).
- Difficulty fixed depth: Easy=1, Medium=3, Hard=5.
- Engine moves instantly and never consume clock.
- Invalid or ambiguous PGN: flash input red + clear; no persistent error dialog.
- Optional clock; "No clock" hides clock UI entirely.
- Timeout means immediate forfeit.
- Physical mode pauses after engine move; spacebar resumes (REQ-009).
- Post-game stays inline in shell with final board visible.

## Architecture Split

| Capability | Owner |
|---|---|
| SAN parse + legality + apply move | Rust/WASM (`shakmaty`) |
| Minimax move search | Rust/WASM |
| Menu/panels/layout/rendering | Browser JS/CSS |
| Keyboard routing (PGN, menu, panel toggles, spacebar resume) | Browser JS |

## Risks / Pitfalls

1. Spec conflict: `01-CONTEXT.md` says resign command has no confirmation; UI-SPEC copy mentions resign confirmation. Use locked context decisions unless user changes them.
2. Spec conflict: CONTEXT says invalid move feedback is flash+clear only; UI-SPEC includes inline error text. Use locked context decisions.
3. Browser test variance across local runners; keep native tests authoritative and keep wasm browser tests in plan.

## Recommended Plan Shape

1. WASM core first (state model, SAN parse/apply, legal move handling, engine move).
2. TUI renderer + piece mode switch + board sizing token.
3. Pre-game config menu and keyboard navigation.
4. Game shell integration (panels, command input, clocks, physical-mode pause/resume).

## Validation Architecture

### Commands

- `cargo test`
- `wasm-pack build --target web`
- `wasm-pack test --headless --chrome` (or `--firefox` when available)

### Requirement Coverage Targets

- REQ-001: valid SAN applies move; invalid/ambiguous SAN rejected and surfaced to UI contract.
- REQ-003: landscape contract + rotate warning path.
- REQ-004: Unicode default, ASCII fallback, `--board-font-size` respected.
- REQ-007: pre-game config menu keyboard flow (arrows + enter).
- REQ-009: physical board pause state and spacebar resume.

