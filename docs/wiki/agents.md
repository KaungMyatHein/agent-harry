---
title: Agents
nav_order: 4
has_children: true
description: "All 18 sub-agents in Agent Harry, grouped by phase. Each one has its own pixel-mascot and visual identity."
---

# Agents

The sub-agents Agent Harry installs into your project. Each has its own page with what it does, when to use it, what it asks you at intake, and what it produces.

<h3 class="agent-group-h">Meta · Cross-cutting</h3>

<div class="agent-grid">
{% include agent-card.html slug='orchestrator' %}
{% include agent-card.html slug='critique-partner' %}
{% include agent-card.html slug='product-fingerprint-curator' %}
{% include agent-card.html slug='figma-component-bootstrapper' %}
{% include agent-card.html slug='pm-metrics-architect' %}
</div>

<h3 class="agent-group-h">Discovery phase</h3>

<div class="agent-grid">
{% include agent-card.html slug='discovery-researcher' %}
{% include agent-card.html slug='competitive-analyst' %}
</div>

<h3 class="agent-group-h">Define phase</h3>

<div class="agent-grid">
{% include agent-card.html slug='ideation-facilitator' %}
{% include agent-card.html slug='product-positioner' %}
{% include agent-card.html slug='feature-prioritizer' %}
{% include agent-card.html slug='pm-strategist' %}
{% include agent-card.html slug='prd-author' %}
{% include agent-card.html slug='lo-fi-designer' %}
</div>

<h3 class="agent-group-h">Deliver phase</h3>

<div class="agent-grid">
{% include agent-card.html slug='figma-designer' %}
{% include agent-card.html slug='design-engineer' %}
{% include agent-card.html slug='design-fidelity-checker' %}
{% include agent-card.html slug='l6-fidelity-auditor' %}
{% include agent-card.html slug='usability-tester' %}
{% include agent-card.html slug='handoff-engineer' %}
{% include agent-card.html slug='pm-launch-architect' %}
</div>

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
| Quick property/token fidelity sweep | `design-fidelity-checker` |
| Verify a build to L6 honestly (mandatory render pass) + loop to PASS | `l6-fidelity-auditor` |
| Plan a usability test | `usability-tester` |
| Generate a dev spec | `handoff-engineer` |
| Plan a launch | `pm-launch-architect` |
| Define success metrics | `pm-metrics-architect` |
| Write a PRD | `prd-author` |
| Set up the visual fingerprint | `product-fingerprint-curator` |
| Bootstrap a Figma component library | `figma-component-bootstrapper` |
| Stress-test an agent's output | type `grill me` at any Stop Gate (invokes `critique-partner`) |

---

_Current as of v5.0._
