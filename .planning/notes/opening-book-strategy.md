---
name: Opening Book Strategy
description: How the ECO opening book is bundled and expanded — Polyglot .bin, tiered download
type: note
date: 2026-04-21
---

Bundle a curated Polyglot `.bin` file (~100–200 KB) covering mainline openings 10-12 moves deep. This works fully offline and fits comfortably in the initial WASM download.

**Format:** Polyglot `.bin` — each entry is 16 bytes (Zobrist hash + move + weight). Binary search on Zobrist key. Parse logic is ~30 lines of Rust using shakmaty's `zobrist_hash`. No existing Rust crate wraps this — implement directly.

**Data source options:**
- Lichess `chess-openings` TSV (public domain, ~50 KB gzipped) — good for naming/identification
- Hand-curated Polyglot `.bin` generated via `python-chess` from PGN — best for engine play

**Expansion:** Full opening book (up to 143 MB) available as an optional on-demand download, cached via PWA service worker. User can trigger download from settings.

`shakmaty-syzygy` covers endgame tablebases only — no opening book support in the shakmaty ecosystem.
