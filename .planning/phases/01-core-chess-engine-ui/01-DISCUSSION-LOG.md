# Phase 1: Core Chess Engine + UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 01-core-chess-engine-ui
**Areas discussed:** Bot difficulty model, PGN input error handling, Clock / time control behavior, Game-over and resign flow

---

## Bot Difficulty Model

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed search depth | Levels map to depth 1–5 ply. Fast, predictable, no randomness. | ✓ |
| Time-limited per move | Fixed thinking budget per level. Strength varies with device speed. | |
| Depth + randomness blunder injection | Fixed depth but suboptimal moves injected at lower difficulties. | |

**User's choice:** Fixed search depth

---

| Option | Description | Selected |
|--------|-------------|----------|
| 3 levels (Easy/Medium/Hard) | Depth 1, 3, 5. Simple for children. | ✓ |
| 5 levels (1–5) | Numeric levels, more granularity. | |
| You decide | Claude picks count and labels. | |

**User's choice:** 3 levels (Easy/Medium/Hard)

**Notes:** User confirmed these difficulty decisions apply to the embedded Minimax engine only. Stockfish (Phase 2) has its own skill level system.

---

## PGN Input Error Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Flash command input red + clear | Brief red flash, input cleared, no dialog. | ✓ |
| Show error message inline | Error in move history/status bar, input stays populated. | |
| Show error message + keep input | Error shown AND input stays for editing. | |

**User's choice:** Flash command input red + clear

---

| Option | Description | Selected |
|--------|-------------|----------|
| Reject + flash red (same as invalid) | Treat ambiguity as error. Child types disambiguated form. | ✓ |
| Show disambiguation prompt | Small prompt listing both pieces and origins. | |
| You decide | Claude picks the disambiguation approach. | |

**User's choice:** Reject + flash red (same as invalid) — teaches correct PGN notation

---

## Clock / Time Control Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Immediate forfeit | Game ends instantly when clock hits 0:00. Standard behavior. | ✓ |
| Move-completion grace period | Move in progress allowed to complete. | |

**User's choice:** Immediate forfeit

**Notes:** User clarified the game can be played with or without time constraints (No clock is a valid option).

---

| Option | Description | Selected |
|--------|-------------|----------|
| Engine moves instantly | No clock time consumed. Fast, simple. | ✓ |
| Engine uses same clock as human | Engine counts against shared timer. | |
| Engine has separate time budget | Fixed time per move independent of game clock. | |

**User's choice:** Engine moves instantly

---

| Option | Description | Selected |
|--------|-------------|----------|
| Hide clock entirely | Clock display disappears. More space for board/panels. | ✓ |
| Show elapsed time instead | Running timer, no countdown, no forfeit. | |
| You decide | Claude decides no-clock layout. | |

**User's choice (No clock selected):** Hide clock entirely

---

| Option | Description | Selected |
|--------|-------------|----------|
| Minutes only (e.g., 15 min) | User types minutes. No increment. Simple. | ✓ |
| Minutes + increment (e.g., 10+5) | Base time + per-move increment. Fischer clock. | |
| You decide | Claude picks the custom format. | |

**User's choice (Custom time control):** Minutes only

---

## Game-Over and Resign Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Inline banner in the game shell | Styled banner in board area. Board stays visible. Terminal-style. | ✓ |
| Full-screen overlay | Modal covers the board with result and options. | |
| Status bar message only | Result in a status line below the board. | |

**User's choice:** Inline banner in the game shell

---

| Option | Description | Selected |
|--------|-------------|----------|
| Type 'resign' in command input | Player types 'resign'. Hard to trigger accidentally. | ✓ |
| Keyboard shortcut with confirm | Ctrl+R shortcut + confirmation prompt. | |
| You decide | Claude picks resign mechanism. | |

**User's choice:** Type 'resign' in command input

---

| Option | Description | Selected |
|--------|-------------|----------|
| Show 'New Game' option in command input area | Prompt changes to 'Press Enter for new game'. Board stays on final position. | ✓ |
| Auto-return to pre-game config after delay | Auto-navigate back after 3–5 seconds. | |
| You decide | Claude picks post-game flow. | |

**User's choice:** Show 'New Game' option in command input area

---

## Claude's Discretion

- Draw condition detection (use all conditions shakmaty exposes natively)
- Exact wording of game-result banner strings
- Move history panel format
- Board highlight style for last move

## Deferred Ideas

None — discussion stayed within phase scope.
