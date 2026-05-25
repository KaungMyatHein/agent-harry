---
title: Home
nav_order: 1
description: "Agent Harry — multi-agent product design system for Claude Code. 17 specialized sub-agents covering Discovery → Define → Deliver."
permalink: /wiki/
---

# Agent Harry

A multi-agent product design system for [Claude Code](https://claude.com/claude-code). It installs 17 specialized sub-agents into your project — one for each part of the product lifecycle from discovery to design handoff — plus embedded PM capabilities and a project-level visual fingerprint.

You talk to it in plain English ("design the checkout flow"), and it routes the work across the right agents with a checkpoint between each one so you stay in control.

---

## Who this is for

- **Designers** who want a structured pipeline instead of one giant chat prompt
- **PMs** who want PRD → metrics → prioritization stitched into one workflow
- **Designer-engineers** who want a Figma path AND a code path from the same lo-fi handoff

If you've never used Claude Code, [start there](https://docs.claude.com/en/docs/claude-code/overview) first. Agent Harry runs on top of Claude Code; it doesn't replace it.

---

## Quickest path

| If you... | Read |
|---|---|
| Just installed and want to type your first thing | [Getting Started](getting-started.html) |
| Want to see a full session end-to-end | [First Feature Walkthrough](guides/first-feature-walkthrough.html) |
| Hit a refusal and don't know why | [Concepts](#core-concepts) — likely a gate or fingerprint |
| Want to know what a specific agent does | [Agents](#all-agents) below |
| Want to look up a slash command | [Commands](#all-commands) below |

The "hit a refusal" path matters more than it looks. Refusals are intentional — they keep work from running ahead of its foundation. The [Concepts](#core-concepts) pages explain each gate and what to type to clear it.

---

## What is Agent Harry?

It's a Claude Code skill. You install it once per machine, and once per project. After that, you describe what you want and an orchestrator decides which agents to call.

Three things make it different from a single big prompt:

1. **Alignment Loop** — one agent at a time, with a [Stop Gate](concepts/stop-gate.html) between each. The orchestrator never chains multiple agents back-to-back. You drive the pacing.
2. **Refusal gates** — Discovery before Define, Metrics before Deliver, Product Fingerprint before any design work. The orchestrator refuses to skip ahead and tells you what to do instead.
3. **Project-level fingerprint** — 3–7 of your best Figma frames become a shared visual + composition vocabulary. Every future feature inherits the density, copy tone, and anti-patterns of your existing product.

The total cost of a full pipeline run on a real feature is usually $1–3 and 60–90 minutes of wall-clock time.

---

## Core concepts

Read these in order if you're new. Each one is a short page (~3 minutes).

1. [Stop Gate](concepts/stop-gate.html) — what to type after each agent stops
2. [Alignment Loop](concepts/alignment-loop.html) — the orchestrator's philosophy (not waterfall)
3. [Mode A vs Mode B](concepts/mode-a-vs-mode-b.html) — generate-from-scratch vs audit-existing
4. [Research-First Gate](concepts/research-first-gate.html) — why design work might be refused
5. [Success-Metrics Gate](concepts/success-metrics-gate.html) — second refusal point
6. [Product Fingerprint](concepts/product-fingerprint.html) — v4.0 visual vocabulary
7. [Audit Ledger](concepts/audit-ledger.html) — what gets logged for every decision

(Concept pages ship in milestone M2. Until then these links may 404.)

---

## All agents

Grouped by where they fit in the pipeline. Each agent has its own page with intake questions, example sessions, and common mistakes.

### Meta + cross-cutting

- [Orchestrator](agents/orchestrator.html) — routes work, enforces gates, never builds anything itself
- [Critique Partner](agents/critique-partner.html) — adversarial stress-testing; you trigger it by typing `grill me`
- [Product Fingerprint Curator](agents/product-fingerprint-curator.html) (v4.0) — one-time visual vocabulary setup per project

### Discovery phase

- [Discovery Researcher](agents/discovery-researcher.html) — user interviews, problem framing
- [Competitive Analyst](agents/competitive-analyst.html) — competitor teardowns, pattern audits

### Define phase

- [Product Positioner](agents/product-positioner.html) — positioning, value props, narrative
- [Feature Prioritizer](agents/feature-prioritizer.html) — RICE / ICE / Kano scoring
- [Ideation Facilitator](agents/ideation-facilitator.html) — divergent concept generation
- [PM Strategist](agents/pm-strategist.html) — vision, business model, pricing
- [Lo-Fi Designer](agents/lo-fi-designer.html) — userflows + three ASCII layout variants

### Deliver phase

- [Figma Designer](agents/figma-designer.html) — hi-fi Figma frames from the lo-fi handoff
- [Design Engineer](agents/design-engineer.html) — runnable code prototype in your stack
- [Usability Tester](agents/usability-tester.html) — test plans, task analysis, finding synthesis
- [Handoff Engineer](agents/handoff-engineer.html) — specs, design tokens, dev handoff docs
- [PM Launch Architect](agents/pm-launch-architect.html) — GTM, beachhead segment, ICP, battlecard
- [PM Metrics Architect](agents/pm-metrics-architect.html) — metrics dashboards, tracking plans, OKRs
- [PRD Author](agents/prd-author.html) — PRDs per prioritized sub-feature

(Agent pages ship in milestone M3.)

---

## All commands

Slash commands you can run directly from the Claude Code prompt.

| Command | What it does |
|---|---|
| [`/audit-pipeline`](commands/audit-pipeline.html) | Check whether the Research-First + Success-Metrics gates are clear before starting design work |
| [`/agent-harry-notion-sync`](commands/agent-harry-notion-sync.html) | Push confirmed artifacts to your Notion workspace |
| [`/agent-harry-audit`](commands/agent-harry-audit.html) | Render the audit ledger as a readable markdown timeline |
| [`/agent-harry-fingerprint`](commands/agent-harry-fingerprint.html) (v4.0) | Create or refresh the project's `product-fingerprint.md` |
| [`/agent-harry-cost`](commands/agent-harry-cost.html) (v4.1) | Report measured cost from the audit ledger by model / agent / session |

(Command pages ship in milestone M4.)

---

## Reference

For when you need to look up a specific field, event, or term.

- [SHARED_CONTEXT schema](reference/shared-context-schema.html) — handoff format + frontmatter keys
- [Audit ledger events](reference/audit-ledger-events.html) — every event type and when it fires
- [Glossary](reference/glossary.html) — MCP, agent, Stop Gate, and other terms defined plainly

(Reference pages ship in milestone M4.)

---

## Guides

Longer reads for specific situations.

- [First Feature Walkthrough](guides/first-feature-walkthrough.html) — a realistic checkout flow from start to handoff
- [Refresh After Update](guides/refresh-after-update.html) — what to do when the skill ships a new version
- [Troubleshooting](guides/troubleshooting.html) — common errors and their fixes

---

## Learn more

- [GitHub repo](https://github.com/KaungMyatHein/agent-harry) — source code, issues, PRs
- [CHANGELOG](https://github.com/KaungMyatHein/agent-harry/blob/main/CHANGELOG.md) — what shipped in every version
- [RATIONALE](https://github.com/KaungMyatHein/agent-harry/blob/main/RATIONALE.md) — the "why" behind the design decisions (single-author opinionated)

---

_Current as of v4.0. The wiki ships in 4 milestones: M1 (this page + getting started + walkthrough), M2 (concepts), M3 (agents), M4 (commands + guides + reference)._
