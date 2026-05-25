---
title: Ideation Facilitator
parent: Agents
nav_order: 8
description: "Divergent concept generation. How Might We, brainstorming."
---

{% include agent-hero.html slug='ideation-facilitator' %}


# Ideation Facilitator

> The agent that helps you generate solution ideas before committing to any. Goes wide, not deep.

## What it does

Takes a problem statement and produces 8-12 divergent solution concepts using How Might We framing, role-storming, or analogous problems. Each concept gets a 1-paragraph description and an initial feasibility note. The output feeds [`feature-prioritizer`](feature-prioritizer.html).

## When to use it

- You have a clear problem but haven't generated solutions yet.
- The team's stuck on one solution direction and needs alternatives.
- Before prioritization — you need a list to score.

## When NOT to use it

- You already know what you're building.
- The problem isn't well-defined yet → use [`discovery-researcher`](discovery-researcher.html) first.

## What it asks you at intake

- The problem statement.
- Constraints (timeline, capacity, technical).
- Whether to skew toward conservative or radical options.

## What you get back

8-12 concepts with descriptions, feasibility notes, and a recommended next step (usually `feature-prioritizer`).

## Best practices

- **State the problem, not a solution.** "Reduce checkout drop-off" is a problem. "Add a progress bar" is a solution.
- **Go wide first, narrow later.** Don't ask for "the right answer" — ask for options.
- **Mix conservative + radical.** Both anchor the conversation.

## Common mistakes

- Asking for 3 ideas instead of 10+ — too narrow for divergence.
- Closing on one idea before prioritization runs.

## Costs and time

~$0.30-0.40

## What runs before / after

```
discovery-researcher → ideation-facilitator → feature-prioritizer
```

## Related

- [`feature-prioritizer`](feature-prioritizer.html) — typical next move
- [`pm-strategist`](pm-strategist.html) — sibling Define agent

---

_Current as of v4.0._
