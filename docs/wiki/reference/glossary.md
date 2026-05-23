---
title: Glossary
parent: Reference
nav_order: 3
description: "Terms defined plainly — MCP, agent, Stop Gate, and the rest."
---

# Glossary

Terms used across Agent Harry, defined plainly.

## Agent

A specialized sub-program with its own intake questions, scope, and output format. Agent Harry installs 17 of them. You invoke an agent by name (or let the orchestrator route to one).

## Alignment Loop

The orchestrator's default operating mode: one agent at a time, with a Stop Gate between each, no upfront plan. See [Alignment Loop](../concepts/alignment-loop.html).

## Anti-pattern

In the [Product Fingerprint](../concepts/product-fingerprint.html): an explicit "this product doesn't do X" statement that prevents drift. Mandatory section, 3-5 entries per fingerprint.

## Audit Ledger

The append-only JSON-lines file at `<project>/.harry-audit.jsonl` where every decision gets logged. See [Audit Ledger](../concepts/audit-ledger.html).

## Confidence Calibration

Every claim agents make carries an implicit or explicit confidence rating: high / medium / low. Low-confidence claims must be flagged as such.

## Cross-cutting (phase)

Agents that don't belong to a single phase — they're called from multiple points or sit alongside the main pipeline. Examples: critique-partner, pm-metrics-architect, product-fingerprint-curator.

## Dashboard

A static HTML file at `<project>/dashboard.html` that visually renders the current Stop Gate. Read-only by default; clickable buttons available via Queue Mode. See [Dashboard](../concepts/dashboard.html).

## Define phase

The phase between Discovery and Deliver. Includes positioning, prioritization, ideation, lo-fi layout exploration, PM strategy.

## Deliver phase

The phase where design and code get produced. Includes figma-designer, design-engineer, usability-tester, handoff-engineer, pm-launch-architect, prd-author.

## Design System (DS)

Your project's component library + design tokens. Either a Figma library, a Storybook, a token file, or an external system like Material 3.

## Discovery phase

The phase before design. User research, problem framing, competitive analysis.

## Entry point (v4.0)

The screen the user is on just before a new flow starts. lo-fi-designer's Primary layout anchors on the entry point's layout for continuity. Per-feature input, captured at lo-fi intake.

## Fingerprint

Shorthand for the [Product Fingerprint](../concepts/product-fingerprint.html). A project-level file (`<project>/product-fingerprint.md`) capturing visual + composition vocabulary.

## Gate

A refusal point in the pipeline. Two main gates: [Research-First Gate](../concepts/research-first-gate.html), [Success-Metrics Gate](../concepts/success-metrics-gate.html). The Product Fingerprint pre-intake check is a third soft gate.

## Handoff

The output artifact every agent produces. Includes Executive Summary, frontmatter, and long-form body. See [SHARED_CONTEXT Schema](shared-context-schema.html).

## MCP

Model Context Protocol — a Claude Code feature that connects external tools (Figma, Notion, Mobbin, etc.) to agents. Required for several agents (figma-designer needs Figma MCP).

## Mode A / Mode B

Generate-from-scratch (A) vs audit-existing (B). Most agents have both modes. See [Mode A vs Mode B](../concepts/mode-a-vs-mode-b.html).

## North Star Metric

The single most important measure of product success. Defined and confirmed by `pm-metrics-architect`.

## Orchestrator

The agent that routes work, enforces gates, and never builds anything itself. Always runs in the background of a session. See [Orchestrator](../agents/orchestrator.html).

## Pivot

A stronger move than `revise` — backs up to an earlier step in the pipeline. Used at a Stop Gate via `pivot — <new direction>`.

## Pre-intake check

A check that fires BEFORE an agent's normal intake questions. In v4.0+, the Product Fingerprint pre-intake check fires for lo-fi-designer, figma-designer, design-engineer.

## PRD

Product Requirements Document. Written by `prd-author` post Success-Metrics Gate, one per "in"-tagged sub-feature.

## Queue Mode

Optional opt-in mode where the dashboard's chip buttons become clickable. Requires the dashboard server (`python3 dashboard-server.py`) and the `/agent-harry-loop` command.

## Revise

A response at the Stop Gate that re-runs the same agent with a tweak. Format: `revise — <delta>`. Soft cap of 3 consecutive revises before the agent suggests pivoting.

## Session ID

The identifier for a single Agent Harry session. Format: `s_YYYYMMDD_NNNN`. Counter resets at midnight UTC. Used in the audit ledger.

## Slug

Kebab-case identifier (lowercase, hyphens). Two kinds: `project_slug` (per project) and `feature_slug` (per feature). Used in file paths and audit ledger.

## Stop Gate

The mandatory pause after every agent run. You see an Executive Summary and pick `y` / `revise` / `grill me` / `cancel`. See [Stop Gate](../concepts/stop-gate.html).

## Sub-agent

Same as "agent." Used when distinguishing from the orchestrator.

## Waterfall mode

A fallback mode where the orchestrator produces a multi-step plan upfront. Opposite of [Alignment Loop](../concepts/alignment-loop.html). Only invoked when explicitly requested.

---

_Current as of v4.0._
