---
title: PRD Author
parent: Agents
nav_order: 17
description: "PRDs per prioritized sub-feature, post Success-Metrics Gate."
---

# PRD Author

> The agent that writes Product Requirements Documents — one PRD per "in"-tagged sub-feature from prioritization. Each PRD includes the confirmed success metric, scope, segments, value propositions, and release plan.

## What it does

Reads the feature-prioritizer output + confirmed metrics + (optional) lo-fi handoff, and produces a structured PRD following an 8-section template: problem, objectives, segments, value propositions, solution, scope, success metrics, release plan. One PRD per "in"-tagged sub-feature.

In the v3.5+ pipeline, prd-author is the natural first Deliver-phase move after the Success-Metrics Gate clears, because PRDs become input for lo-fi-designer and design-engineer.

## When to use it

- After feature-prioritizer + pm-metrics-architect.
- When engineering or stakeholders need a PRD doc to review.
- To update an existing PRD with design/code references (Mode B).

## When NOT to use it

- Prioritization isn't done → use `feature-prioritizer` first.
- You have a PRD in Notion and just want to enrich it with design references → Mode B.

## What it asks you at intake

- Which "in"-tagged item from prioritization?
- Existing PRD location (for Mode B enrichment)?
- Format: Markdown, Notion-friendly?

## What you get back

PRD at `./design-workspace/<project>/prds/<feature>.md` with the 8 sections, success metric attached, scope boundaries, release plan.

## Best practices

- **One PRD per sub-feature.** Don't bundle multiple "in" items into one PRD.
- **Link the metric explicitly.** The PRD should cite the pm-metrics-architect handoff.
- **Use Mode B to enrich.** After design ships, run Mode B to add "What this looks like" sections.

## Common mistakes

- Writing PRDs before prioritization → ends up specing things that don't ship.
- Generic problem statements that don't ground in research.

## Costs and time

~$0.30-0.50 per PRD

## What runs before / after

```
pm-metrics-architect → prd-author → lo-fi-designer → design-engineer / figma-designer
```

## Related

- [`feature-prioritizer`](feature-prioritizer.html) — names what gets PRDs
- [`pm-metrics-architect`](pm-metrics-architect.html) — provides the metric
- [`lo-fi-designer`](lo-fi-designer.html) — consumes the PRD

---

_Current as of v4.0._
