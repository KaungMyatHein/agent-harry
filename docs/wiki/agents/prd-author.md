---
title: PRD Author
parent: Agents
nav_order: 17
description: "PRDs per prioritized sub-feature, post Success-Metrics Gate."
---

{% include agent-hero.html slug='prd-author' %}


# PRD Author

> The agent that writes Product Requirements Documents — one PRD per "in"-tagged sub-feature from prioritization. In v4.3+, each PRD includes the **structured journey schema** (personas + per-sub-feature primary journey with entry/success/failure exits + optional nested journeys) that design agents consume directly.

## What it does

Reads the feature-prioritizer output + confirmed metrics + (optional) lo-fi handoff. Produces one PRD per "in"-tagged sub-feature with:
- **Frontmatter** (v4.3 schema) — `personas[]`, `sub_features[]` with `primary_journey` (entry_points / success_exit / failure_exits[]) and optional `nested_journeys[]` + `data_inputs[]`
- **Body** — Problem · Success criteria (must reference confirmed metrics) · Scope in/out · Acceptance criteria · Tradeoffs · Open questions · Links

The v4.3 frontmatter is the **single source of truth** for journey thinking — `lo-fi-designer`, `figma-designer`, and `design-engineer` read it to know who the persona is, where the user enters, what success/failure looks like, and which sub-flows deserve their own design treatment. Pre-v4.3 PRDs (without `schema_version: v4.3`) still work — design agents fall back to "infer intent from loose user-stories section" with a `journey_structure_inferred: true` flag.

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

PRD at `./design-workspace/<project>/prds/<feature>.md` with the v4.3 structured frontmatter (personas + sub_features with journeys) + body sections (Problem / Success criteria / Scope in-out / Acceptance criteria / Tradeoffs / Open questions / Links). The auto-detected nested journeys are presented at the per-PRD Stop Gate for you to confirm or edit before write.

**Nested-journey auto-detect criterion:** a sub-flow gets its own nested journey only if (1) it has ≥2 distinct failure scenarios with different recovery paths, OR (2) it has multi-step interaction (more than fill-one-field-and-move-on). Single text fields and dropdowns stay in `data_inputs[]`, not journeys.

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

_Current as of v4.3._
