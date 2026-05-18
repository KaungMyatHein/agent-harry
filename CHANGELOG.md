# Changelog

Most recent first. Format: `## YYYY-MM-DD — short summary`, then bullet list.

---

## 2026-05-18 — v2.1: Always-On Stop Gate (per-step approval, even in bypass-permission mode)

- **Always-On Stop Gate added** — `SHARED_CONTEXT.md` and `orchestrator.md` now define a mandatory per-step approval gate. After every sub-agent run, the orchestrator MUST present the Executive Summary + TL;DR, then stop and wait for explicit user input. No auto-proceeding.
- **Bypass-permission mode does NOT waive this gate** — permission bypass authorizes *tools*, not *user-in-the-loop checkpoints*. The Stop Gate is a product-design discipline, not a sandbox restriction. Codified explicitly to prevent the regression.
- **Four-option prompt** — every Stop Gate ends with: `y` (proceed) / `revise <delta>` (iterate the same step) / `grill me` (invoke `grill-me` skill to stress-test) / `cancel` (halt). Silence is not consent.
- **Revision loop spec'd** — on `revise <delta>`, re-invoke the same sub-agent with the delta added to its Goal and the prior handoff as Input. The revised output re-fires the Stop Gate.
- **`grill-me` integration** — orchestrator proactively suggests `grill me` when output is foundational, confidence is low/medium, the output makes non-obvious tradeoffs, or the user has been moving fast.
- **Phase agents updated** — every one of the 9 phase + cross-cutting agents now ends its Output Format with the Stop Gate prompt requirement, so they self-stop even when invoked directly (not via orchestrator).

## 2026-05-18 — v2: Research-First Gate, Executive Summary, Token Budget

Three problems addressed after a real-world Agent Harry feature run cost ~$8 USD and produced AI-friendly-but-human-hostile long-form outputs without any research-first enforcement.

- **Research-First Gate (Hard Block)** — `SHARED_CONTEXT.md` and `orchestrator.md` now define a hard gate: Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`) cannot be invoked unless a Discovery/Define handoff artifact exists or the user has explicitly opted out. Codifies the "don't shortcut Agent Harry pipeline" feedback from 2026-05-18.
- **New `/audit-pipeline` slash command** — `templates/.claude/commands/audit-pipeline.md`. Reports pipeline state (Discovery/Define/Deliver artifact counts), enforces the gate, and surfaces the cheapest unblock path. Designed to be cheap — reads only Executive Summary blocks, not long-form bodies.
- **Executive Summary block (Human-First, Always First)** — Every agent handoff now starts with a stat-card table + 3-bullet TL;DR + one-line next step. The long-form body lives below for AI handoff. Human-readable summary surfaces in <30 seconds; AI-readable detail still available downstream.
- **Token Budget rules** — `SHARED_CONTEXT.md` defines hard output caps (max 6 insights / 4 gaps / 4 concerns / 10 scoring rows / 5 open questions). Orchestrator estimates token cost upfront and refuses plans that exceed $3 USD without explicit user approval.
- **Model routing changed** — 8 phase agents (`discovery-researcher`, `competitive-analyst`, `product-positioner`, `feature-prioritizer`, `ideation-facilitator`, `interaction-designer`, `usability-tester`, `handoff-engineer`) switched from `opus` to `sonnet`. Opus reserved for `orchestrator` and `critique-partner`. Single biggest token cost reduction.
- **Synthesis discipline** — Orchestrator now reads only Executive Summary blocks from prior handoffs by default, not full long-form bodies. Long-form loaded only when a specific decision requires it.
- **Install + Refresh modes updated** — Both now copy `templates/.claude/commands/` alongside `.claude/agents/`. Refresh additionally checks whether the project's `SHARED_CONTEXT.md` is pre-v2 and warns the user to merge the new sections.

## 2026-05-18 — Initial release as `agent-harry`

- Renamed skill from `product-designer-os` to `agent-harry` (personal brand).
- `SKILL.md` description now carries equal-weight brand + semantic + Burmese triggers, so the skill routes whether the user says "install Agent Harry", "set up product designer agents", or "design agent တွေ install လုပ်ပေး".
- Added **Mode 2 — Refresh**: re-copies the 10 agent template files into an already-installed project while preserving `SHARED_CONTEXT.md` and `README.md`. Warns on uncommitted local edits.
- Added **Mode 3 — Update**: runs `git pull --ff-only` on `~/.claude/skills/agent-harry/` and shows the top of this CHANGELOG. Stops if the working tree is dirty (no auto-stash).
- Existing **Mode 1 — Install** (Bundled + Generator) preserved unchanged from the source bundle.
- Templates (`templates/SHARED_CONTEXT.md`, `templates/README.md`, `templates/.claude/agents/*.md`) carried over verbatim from the source bundle — 10 agents covering orchestrator, discovery-researcher, competitive-analyst, product-positioner, feature-prioritizer, ideation-facilitator, interaction-designer, usability-tester, handoff-engineer, critique-partner.
- Repo: `KaungMyatHein/agent-harry` (public, MIT license).
