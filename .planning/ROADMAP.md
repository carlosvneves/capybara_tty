# Roadmap: capybara-tty

## Overview

capybara-tty is a distraction-free, TUI-inspired chess platform for children, running entirely in the browser via Rust/WebAssembly. The roadmap progresses from a playable core chess game (Phase 1) through Stockfish analysis (Phase 2), a rule-based tutor (Phase 3), and finally an LLM-powered pedagogical layer (Phase 4).

## Phases

- [ ] **Phase 1: Core Chess Engine + UI** — Playable chess game with TUI interface, PGN input, pre-game config menu, and physical board mode
- [ ] **Phase 2: Stockfish Integration** — Optional Stockfish.wasm download, Web Worker integration, and analysis mode
- [ ] **Phase 3: Tutor System** — Deterministic rule-based tutor with opening book, blunder shield, move history replay, and tutor annotations
- [ ] **Phase 4: LLM Pedagogy** — Natural-language move explanations via LLM API (OpenRouter/Gemini/OpenAI/MaritacaAI)

## Phase Details

### Phase 1: Core Chess Engine + UI
**Goal**: A fully playable chess game in the browser — PGN-only input, TUI-style landscape layout, user-selectable piece rendering, pre-game configuration menu, and physical board sync mode
**Depends on**: Nothing (first phase)
**Requirements**: REQ-001, REQ-003, REQ-004, REQ-007, REQ-009
**Success Criteria** (what must be TRUE):
  1. User can start a game via pre-game config menu (engine, time control, color, difficulty, physical mode toggle)
  2. User can enter moves via PGN keyboard input (e.g., `Nf3`, `e4`) and see the board update
  3. User can toggle between Unicode and ASCII piece rendering via settings
  4. Physical Board Mode pauses after engine moves; spacebar resumes
  5. Layout works in landscape on PC, tablet, and TV browsers
**Plans**: TBD

Plans:
- [ ] 01-01: WASM core — shakmaty integration, game state, move validation, PGN parsing
- [ ] 01-02: TUI board renderer — Unicode/ASCII dual rendering, CSS `--board-font-size` variable
- [ ] 01-03: Pre-game configuration menu — keyboard-navigable TUI config screen
- [ ] 01-04: Game shell — landscape layout, collapsible panels, command input, physical board mode

### Phase 2: Stockfish Integration
**Goal**: Optional Stockfish.wasm engine available on demand — downloaded once, cached via PWA service worker, running in a Web Worker to avoid blocking the UI
**Depends on**: Phase 1
**Requirements**: REQ-006
**Success Criteria** (what must be TRUE):
  1. User selects Stockfish in pre-game menu; download prompt appears; binary downloaded and cached
  2. Subsequent game sessions use cached Stockfish without re-downloading
  3. Stockfish runs in a Web Worker — UI remains responsive during analysis
  4. Game plays identically to Phase 1 when using embedded engine
**Plans**: TBD

Plans:
- [ ] 02-01: Stockfish.wasm Web Worker integration + PWA caching

### Phase 3: Tutor System
**Goal**: A modular, optional tutor overlay — opening book validation (ECO/Polyglot), blunder shield (advisory), special move explanations, and replayable annotated move history
**Depends on**: Phase 1
**Requirements**: REQ-002, REQ-005, REQ-008
**Success Criteria** (what must be TRUE):
  1. Tutor mode on/off toggle works; game plays without interruption when off
  2. Opening book validates moves against bundled Polyglot `.bin`; tutor panel shows opening name/deviation
  3. Blunder shield fires when score drops drastically; suggests alternative but does not block the move
  4. Tutor panel auto-opens on any tutor event; child closes manually
  5. Any past move in history is selectable; board highlight + explanation replay correctly
**Plans**: TBD

Plans:
- [ ] 03-01: Opening book — Polyglot `.bin` bundling, Zobrist hash lookup in Rust
- [ ] 03-02: Blunder shield — score delta detection, advisory suggestion in tutor panel
- [ ] 03-03: Move history with tutor annotations — replay mode, panel integration

### Phase 4: LLM Pedagogy
**Goal**: Natural-language move explanations powered by an LLM API — the LLM receives engine/tutor data and translates numbers into child-friendly concepts; graceful offline degradation
**Depends on**: Phase 3
**Requirements**: TBD
**Success Criteria** (what must be TRUE):
  1. LLM explains why a move gained/lost material in plain language in the tutor panel
  2. Works with at least one LLM provider (OpenRouter/Gemini/OpenAI/MaritacaAI)
  3. Offline or API-unavailable: tutor falls back to deterministic Phase 3 explanations silently
**Plans**: TBD

Plans:
- [ ] 04-01: LLM provider integration + offline fallback

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Chess Engine + UI | 0/4 | Not started | - |
| 2. Stockfish Integration | 0/1 | Not started | - |
| 3. Tutor System | 0/3 | Not started | - |
| 4. LLM Pedagogy | 0/1 | Not started | - |
