---
title: Critique Partner
parent: Agents
nav_order: 2
description: "Adversarial stress-testing. Triggered by typing `grill me` at any Stop Gate."
---

{% include agent-hero.html slug='critique-partner' %}


# Critique Partner

> The agent you call when an output looks right but you're not sure it IS right. Pushes back on assumptions, surfaces overlooked risks, names what could break.

## What it does

The critique-partner takes the most recent agent's output and stress-tests it. It plays devil's advocate without being contrarian for its own sake — it argues against weak claims, hidden assumptions, and unjustified confidence. After it's done, you decide whether to accept the original output, revise it, or pivot.

It uses Opus model (one of only two agents that does — the other is the orchestrator). Adversarial reasoning is the highest-leverage Opus use case.

## When to use it

- The output is the foundation for several downstream agents (e.g., positioning, prioritization, metrics).
- You feel something is off but can't articulate what.
- You're moving fast and skipped earlier critique steps.
- Confidence on a key claim is low or medium.

## When NOT to use it

- The output is trivial or low-leverage (don't burn Opus on minor decisions).
- You've already iterated 2-3 times with `revise` — pivoting back to an earlier step is usually better at that point.

## How to trigger it

Type `grill me` (or `stress test`) at any Stop Gate. The orchestrator invokes the critique-partner on the agent that just ran. The Stop Gate resumes after the critique finishes.

## What you get back

A structured critique with up to 4 concerns, each with severity (high/medium/low) and a specific "what to do about it" recommendation. Not vague reservations — concrete pushback.

## Best practices

- **Critique high-leverage outputs.** Positioning, metrics, prioritization, the strategic bet. Skip for routine layout choices.
- **Read the severity tags.** High-severity concerns should change your decision; low-severity are mentioned for completeness.
- **Don't grill everything.** Habituated grilling becomes noise. Save it for moments of genuine uncertainty.

## Common mistakes

- Grilling output you already disagree with — just `revise` directly instead.
- Treating the critique as gospel. It's adversarial by design; sometimes the original output was right.

## Costs and time

~$0.30-0.50 per critique (Opus pricing). Adds ~5 minutes to the Stop Gate.

## What runs before / after

```
[any sub-agent] → Stop Gate → "grill me" → critique-partner → revised Stop Gate
```

The original agent's output is preserved either way. The critique either reinforces your acceptance or motivates a revise/pivot.

## Related

- [Stop Gate](../concepts/stop-gate.html) — the `grill me` trigger lives here
- [Orchestrator](orchestrator.html) — invokes critique-partner when you trigger it

---

_Current as of v4.0._
