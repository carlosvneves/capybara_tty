---
name: Tutor Mode Contract
description: Behavioral contract for tutor mode vs. standard mode — what changes and what doesn't
type: note
date: 2026-04-21
---

Tutor mode is an overlay on top of the core game — it does not replace the game engine or input mechanism.

**Without tutor mode:** behaves as a traditional chess game. PGN input → move executes immediately. No interruptions.

**With tutor mode:** when a move is entered, the tutor intercepts before execution:
- Board highlights the relevant squares (piece origin, destination, affected pieces)
- Side panel displays a text explanation of the move (opening theory, tactical pattern, special move explanation, etc.)
- Player confirms or reviews before the move is committed

Move history is replayable with tutor annotations — the child can click/select any past move in the history panel and see the board + explanation again, even mid-game.

The tutor is modular and optional (toggle via UI), so free play without interruptions is always available.
