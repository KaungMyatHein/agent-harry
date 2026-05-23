---
title: Feature Prioritizer
parent: Agents
nav_order: 7
description: "RICE / ICE / Kano scoring for what to build next."
---

# Feature Prioritizer

> The agent that takes a list of feature ideas and produces a scored prioritization table, with a clear "in / out / later" cut for the next slice of work.

## What it does

Asks you for the feature list, scores each against your chosen framework (RICE, ICE, Kano, or Weighted Scoring), and produces a ranked table with "in / out / later" tags. Surfaces the strategic bet and the rationale for the cut line.

## When to use it

- After Discovery + positioning, before any design work.
- When the team is arguing about what to build next.
- Before [`prd-author`](prd-author.html) — only "in"-tagged items become PRDs.

## When NOT to use it

- You only have one feature in scope.
- You want brainstorming, not scoring → use [`ideation-facilitator`](ideation-facilitator.html) first.

## What it asks you at intake

- Mode A or Mode B?
- Mode A: feature list, framework preference (RICE / ICE / Kano / weighted), what "in" means for this cycle.
- Mode B: paste existing scored backlog for audit.

## What you get back

A handoff with the scoring table (max 10 rows), the strategic bet, in/out/later tags, and reasoning for the cut line.

## Best practices

- **Set capacity honestly.** "Capacity is 3 features" produces a different cut than "capacity is unlimited."
- **Pick the right framework.** RICE for B2B, ICE for early-stage, Kano for delight tradeoffs.
- **Read the "out" rationale.** Often more informative than "in."

## Common mistakes

- Scoring everything as "high impact" — collapses the scoring.
- Treating the cut line as immovable. It's a recommendation, not a contract.

## Costs and time

~$0.30-0.50

## What runs before / after

```
product-positioner → feature-prioritizer → pm-metrics-architect → prd-author
```

## Related

- [`ideation-facilitator`](ideation-facilitator.html) — generates the feature list
- [`prd-author`](prd-author.html) — writes PRDs for "in"-tagged items

---

_Current as of v4.0._
