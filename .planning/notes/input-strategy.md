---
name: Input Strategy
description: Why keyboard-universal was chosen over drag-drop and how it solves multi-device complexity
type: note
date: 2026-04-21
---

Physical keyboard (or Bluetooth keyboard on tablets/TVs) is the universal input mechanism across all target devices.

Drag-and-drop was explicitly deprioritized because touch/pointer interaction is inconsistent across the device matrix (Smart TVs, tablets, PCs). A keyboard gives uniform behavior everywhere.

PGN text input is also a deliberate learning tool — typing `Nf3` forces the child to internalize algebraic notation, which is part of the educational goal. The friction is intentional.

On-screen virtual keyboard (as described in PRD) remains an option for devices without a physical keyboard attached, but the primary input path is always text.
