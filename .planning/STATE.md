# Project State

## Project Reference

**Project:** capybara-tty — TUI-inspired chess tutor for children, Rust/WASM, offline-first PWA
**Core value:** Distraction-free, keyboard-driven chess education that works on TV, tablet, and PC
**Current focus:** Phase 1 — Core Chess Engine + UI

## Current Position

Phase: 1 of 4 (Core Chess Engine + UI)
Plan: 0 of TBD
Status: Ready to plan
Last activity: 2026-04-21 — Project initialized; ROADMAP.md, REQUIREMENTS.md, and exploration notes created

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: -

## Accumulated Context

### Decisions

- 2026-04-21: PGN-only input (keyboard universal); drag-drop explicitly dropped
- 2026-04-21: Unicode pieces default, ASCII fallback, CSS `--board-font-size` for TV
- 2026-04-21: Landscape-only layout; single layout for all devices
- 2026-04-21: Collapsible panels; command input always visible
- 2026-04-21: Tutor mode is an overlay, not a separate mode; force-opens on explanation
- 2026-04-21: Blunder shield advisory only — child retains move agency
- 2026-04-21: Polyglot `.bin` ~100-200 KB bundled; full book as PWA download
- 2026-04-21: Stockfish selected pre-game → one-time download → PWA cached

### Pending Todos

None yet.

### Blockers/Concerns

- TV rendering untested — Unicode piece readability at distance unverified; ASCII fallback mitigates risk

## Session Continuity

Last session: 2026-04-21
Stopped at: ROADMAP.md created, ready to plan Phase 1
Resume file: None
