# Requirements

<!-- Append new requirements below. Use next available REQ ID. -->

## REQ-001: PGN is the primary and only input mechanism

Physical keyboard (or on-screen virtual keyboard) typing PGN notation is the sole way to submit moves. Drag-and-drop is not supported. This applies across all target devices (PC, tablet, Smart TV via Bluetooth keyboard).

**Source:** exploration session 2026-04-21

---

## REQ-002: Move history is replayable with tutor annotations

In tutor mode, every move in the game history retains its tutor context (board highlight state + side panel explanation). The player can select any past move at any point during the game to replay the tutor explanation for that move.

**Source:** exploration session 2026-04-21

---

## REQ-003: Landscape-only layout

The UI targets landscape orientation only. No portrait support. Single layout must work seamlessly on TV, tablet, and PC browsers/PWA in landscape mode.

**Source:** UI exploration session 2026-04-21

---

## REQ-004: User-selectable piece rendering

Unicode chess pieces (`♔ ♕ ♖ ♗ ♘ ♙`) are the default rendering. ASCII letters (`K Q R B N P` / `k q r b n p`) are available as a user-selectable fallback. Toggled via a settings control. Board font size controlled via CSS `--board-font-size` variable for TV scaling. Path kept open for SVG pieces in a future phase.

**Source:** UI exploration session 2026-04-21

---

## REQ-005: Tutor panel auto-opens on explanation

When tutor mode fires an explanation (move intercepted), the tutor panel force-opens automatically — the child does not need to navigate to it. Child closes the panel manually when done reading.

**Source:** UI exploration session 2026-04-21

---

## REQ-006: Engine selection at game start

Before each game, the user selects between Embedded Minimax or Stockfish. Selecting Stockfish triggers a one-time download cached via PWA service worker. No mid-game engine switching. Subsequent games reuse the cached Stockfish binary without re-downloading.

**Source:** PRD gap exploration 2026-04-21

---

## REQ-007: Pre-game configuration menu

TUI-style keyboard-navigable configuration screen shown before each game. Options: Engine (Embedded/Stockfish), Time Control (UltraBullet/Bullet/Blitz/Rapid/Classical/No clock/Custom), Color (White/Black), Bot Depth/Difficulty, Tutor Mode (On/Off), Physical Board Mode (On/Off). All options navigable via arrow keys; confirmed with Enter.

**Source:** PRD gap exploration 2026-04-21

---

## REQ-008: Blunder shield is advisory, not blocking

When the tutor detects a blunder (score drops drastically), it suggests an alternative move in the tutor panel. The child can proceed with their original move anyway. The move is never rejected outright.

**Source:** PRD gap exploration 2026-04-21

---

## REQ-009: Physical board sync via spacebar

In Physical Board Mode, after the engine plays a move the game pauses. Pressing spacebar signals "I've replicated this move on the real board." The game resumes immediately on keypress.

**Source:** PRD gap exploration 2026-04-21
