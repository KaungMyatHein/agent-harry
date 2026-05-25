---
title: Discovery Researcher
parent: Agents
nav_order: 4
description: "User interviews, problem framing, secondary research."
---

{% include agent-hero.html slug='discovery-researcher' %}


# Discovery Researcher

> The agent that designs research studies (Mode A) or audits existing PRDs and research docs (Mode B). Usually the first agent in a new feature session because it clears the Research-First Gate.

## What it does

In **Mode A**, designs research from scratch: interview scripts, segments, screener questions, secondary research sources. In **Mode B**, audits existing PRDs, research docs, or notes against research-quality standards — surfacing gaps, unstated assumptions, unquantified goals.

## When to use it

- **Right at the start of a new feature** to clear the [Research-First Gate](../concepts/research-first-gate.html).
- **Mode B on an existing PRD** is the cheapest unblock for almost every project — ~$0.30 instead of $1.00+ for Mode A from scratch.
- When you have research data but haven't synthesized it yet.

## When NOT to use it

- You have audited research already → opt out of the Research-First Gate with the explicit phrase instead.
- You want competitor patterns specifically → use [`competitive-analyst`](competitive-analyst.html) instead.

## What it asks you at intake

- Mode A or Mode B?
- Mode A: what's the user / problem / scope?
- Mode B: where's the existing PRD or research (Notion URL, file path)?

## What you get back

A handoff at `./design-workspace/<project>/YYYY-MM-DD_discovery-researcher_<topic>.md` containing:

- Executive Summary (stat-card + 3-bullet TL;DR)
- Mode A: research plan + study artifacts (script, segments, sources)
- Mode B: insights, gaps, open questions, recommended next moves

## Best practices

- **Default to Mode B if you have anything to audit.** A draft PRD counts. Cheaper, faster.
- **Be specific about the question.** "Why are users dropping off?" is too vague. "Why do users abandon at the address-entry step in checkout?" is auditable.
- **Read the Open Questions section.** It tells you what you still don't know — usually shapes the next move.

## Common mistakes

- Skipping straight to Mode A when you have a PRD that hasn't been audited.
- Treating Mode B output as final research — it's an audit, not a study.

## Costs and time

- Mode A: ~$0.50-1.00, ~10 min wall-clock
- Mode B: ~$0.20-0.40, ~5 min

## What runs before / after

```
Goal stated → Research-First Gate refuses
  → discovery-researcher (Mode B usually)
    → Stop Gate
      → next: pm-metrics-architect, product-positioner, or feature-prioritizer
```

## Related

- [Research-First Gate](../concepts/research-first-gate.html) — this agent clears it
- [Mode A vs Mode B](../concepts/mode-a-vs-mode-b.html)
- [`competitive-analyst`](competitive-analyst.html) — sibling Discovery agent

---

_Current as of v4.0._
