---
title: Agents
nav_order: 4
has_children: true
description: "All 17 sub-agents in Agent Harry, grouped by phase."
---

# Agents

The 17 sub-agents Agent Harry installs into your project. Each has its own page with what it does, when to use it, what it asks you at intake, and what it produces.

## Meta + cross-cutting

- [Orchestrator](agents/orchestrator.html) — routes work, enforces gates, never builds anything itself
- [Critique Partner](agents/critique-partner.html) — adversarial stress-testing; triggered by typing `grill me`
- [Product Fingerprint Curator](agents/product-fingerprint-curator.html) (v4.0) — one-time visual vocabulary setup per project

## Discovery phase

- [Discovery Researcher](agents/discovery-researcher.html) — user interviews, problem framing, secondary research
- [Competitive Analyst](agents/competitive-analyst.html) — competitor teardowns, pattern audits

## Define phase

- [Product Positioner](agents/product-positioner.html) — positioning statements, value props, narrative
- [Feature Prioritizer](agents/feature-prioritizer.html) — RICE / ICE / Kano scoring
- [Ideation Facilitator](agents/ideation-facilitator.html) — divergent concept generation, How Might We
- [PM Strategist](agents/pm-strategist.html) — vision, business model, pricing, north-star
- [Lo-Fi Designer](agents/lo-fi-designer.html) — userflows + three ASCII layout variants

## Deliver phase

- [Figma Designer](agents/figma-designer.html) — hi-fi Figma frames from the lo-fi handoff
- [Design Engineer](agents/design-engineer.html) — runnable code prototype in your stack
- [Usability Tester](agents/usability-tester.html) — test plans, task analysis, finding synthesis
- [Handoff Engineer](agents/handoff-engineer.html) — specs, design tokens, dev handoff docs
- [PM Launch Architect](agents/pm-launch-architect.html) — GTM strategy, beachhead, ICP, battlecard, growth loops
- [PM Metrics Architect](agents/pm-metrics-architect.html) — metrics dashboards, tracking plans, OKRs
- [PRD Author](agents/prd-author.html) — PRDs per prioritized sub-feature

---

## Quick decision table

If you're not sure which agent to invoke:

| You want to... | Run |
|---|---|
| Audit an existing PRD | `discovery-researcher` Mode B |
| Study competitor patterns | `competitive-analyst` Mode A |
| Write a positioning statement | `product-positioner` |
| Score features for the next sprint | `feature-prioritizer` |
| Brainstorm solutions for a problem | `ideation-facilitator` |
| Pick a business model or pricing | `pm-strategist` |
| Sketch layouts for a feature | `lo-fi-designer` |
| Generate hi-fi Figma frames | `figma-designer` |
| Build a runnable prototype | `design-engineer` |
| Plan a usability test | `usability-tester` |
| Generate a dev spec | `handoff-engineer` |
| Plan a launch | `pm-launch-architect` |
| Define success metrics | `pm-metrics-architect` |
| Write a PRD | `prd-author` |
| Set up the visual fingerprint | `product-fingerprint-curator` |
| Stress-test an agent's output | type `grill me` at any Stop Gate (invokes `critique-partner`) |

---

_Current as of v4.0._
