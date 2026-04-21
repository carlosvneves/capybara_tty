---
name: Panel Layout Strategy
description: UI panel structure — always-visible input, collapsible secondary panels, keyboard-navigable
type: note
date: 2026-04-21
---

Command input is always visible — it's the primary interaction surface and must never be hidden.

Secondary panels (move history, PGN list, material advantage) are collapsible behind a hamburger/mega-menu style toggle. This keeps the board dominant and reduces visual noise, especially at TV distance.

Panels must be keyboard-navigable (arrow keys to open/close) for TV compatibility — no mouse/touch required to access them.

Exception: tutor panel bypasses this — it force-opens automatically when tutor mode fires an explanation (see REQ-004). Child closes it manually.
