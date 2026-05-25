---
title: PM Metrics Architect
parent: Agents
nav_order: 16
description: "Metrics dashboards, tracking plans, OKRs. Clears the Success-Metrics Gate."
---

# PM Metrics Architect

> The agent that defines and confirms success metrics for a feature. Clears the [Success-Metrics Gate](../concepts/success-metrics-gate.html) — Deliver work can't start until this agent runs and you confirm its output.

## What it does

Asks about your North Star, proposes 3-5 input metrics, defines a metric tree with health metrics + alert thresholds, names a specific target. Output is the metric definition Deliver agents are designed against.

## When to use it

- Between Define and Deliver phases (Success-Metrics Gate fires here).
- When the team's optimization target is unclear.
- For tracking plan design before instrumentation.

## When NOT to use it

- You have confirmed metrics outside Agent Harry — opt out of the gate.
- You're early in Discovery and don't have a feature scoped yet.

## What it asks you at intake

- North Star direction (or proposal).
- Business game type — Attention, Transaction, or Productivity (informs metric choice).
- Existing metrics (if any).

## What you get back

A handoff with:

- North Star metric + classification
- 3-5 input metrics (the constellation)
- Health metrics + alert thresholds
- Target + timeframe

## Confirmation framing

The Stop Gate after `pm-metrics-architect` is special — the TL;DR ends with *"Confirm these metrics so Deliver can proceed? Type `y` to lock in; `revise — <delta>` to adjust before locking."* Your `y` is the signal that clears the gate.

## Best practices

- **Pick ONE North Star.** Multiple norths confuse priorities.
- **Input metrics must add up to the North Star.** If they don't, the tree is broken.
- **Set time-bounded targets.** "Increase signups" isn't actionable. "Increase signups from 200 to 350 per week by Q4" is.

## Common mistakes

- Vanity metrics dressed as North Stars.
- Targets without timeframes.

## Costs and time

~$0.40-0.60

## What runs before / after

```
feature-prioritizer → pm-metrics-architect → (Success-Metrics Gate clears) → prd-author or lo-fi-designer
```

## Related

- [Success-Metrics Gate](../concepts/success-metrics-gate.html) — gate cleared by this agent
- [`prd-author`](prd-author.html) — typical next after gate clears
- [`pm-strategist`](pm-strategist.html) — strategic context

---

_Current as of v4.0._
