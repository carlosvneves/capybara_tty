---
phase: 1
slug: core-chess-engine-ui
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Rust test harness + wasm-bindgen-test |
| **Config file** | none |
| **Quick run command** | `cargo test` |
| **Full suite command** | `cargo test && wasm-pack build --target web && wasm-pack test --headless --chrome` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cargo test`
- **After every plan wave:** Run `cargo test && wasm-pack build --target web`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | REQ-001 | T-01-01 | Reject malformed/ambiguous SAN safely | unit | `cargo test` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | REQ-004 | — | Piece rendering toggle keeps legal symbols only | integration | `wasm-pack test --headless --chrome` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | REQ-007 | — | Config menu keyboard navigation deterministic | integration | `wasm-pack test --headless --chrome` | ❌ W0 | ⬜ pending |
| 01-04-01 | 04 | 2 | REQ-003, REQ-009 | T-01-02 | Physical mode pause/resume without deadlock | integration | `wasm-pack test --headless --chrome` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase1_core.rs` — Rust unit tests for SAN parsing and move application
- [ ] `tests/web.rs` — expanded wasm behavior tests for exported APIs

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Landscape-only layout readability on TV browser | REQ-003 | Device ergonomics vary by display size and distance | Open app on TV browser in landscape, verify board and panels visible without overlap |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 180s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
