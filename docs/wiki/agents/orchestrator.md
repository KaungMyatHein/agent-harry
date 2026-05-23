---
title: Orchestrator
parent: Agents
nav_order: 1
description: "Routes work, enforces gates, never builds anything itself."
---

# Orchestrator

> The agent that decides which other agent runs next. Never produces design or code itself. Drives the Alignment Loop.

## What it does

You don't usually invoke the orchestrator by name — you just talk to your project. ("Design the checkout flow.") The orchestrator's job is to understand what you need, enforce the gates in front of your goal, and propose the smallest-next-move.

It runs in the [Alignment Loop](../concepts/alignment-loop.html) by default: Diagnose (≤2 questions) → Propose one agent → Run → Stop Gate → Propose the next agent based on what just happened. It never plans 5 agents ahead.

## When to use it

- **Always.** Every session starts with the orchestrator implicitly.
- When you want a multi-step task organized for you.
- When you're not sure which sub-agent to call.

## When NOT to use it

- You know exactly which sub-agent you need — invoke it directly.
- You want a multi-step plan upfront — ask for Waterfall mode explicitly.

## What it asks you at intake (Diagnose phase)

At most **2 clarifying questions** before it proposes a first move. Examples: "Is this a redesign?" / "Who's the primary user?" / "Existing PRD or starting fresh?"

If it asks more than 2, that's a bug — the cap exists so Diagnose doesn't become waterfall planning by another name.

## What you get back

After Diagnose, a Propose message:

> *"Smallest next move: [agent-name] in Mode [A|B]. Goal: [tight one-line goal]. Why this move: [reasoning]."*

You type `y`, that agent runs, [Stop Gate](../concepts/stop-gate.html), orchestrator proposes next.

## Best practices

- **Give it goals, not plans.** "Design the checkout flow," not "first run discovery, then..."
- **Answer Diagnose concretely.** Vague answers produce vague proposals.
- **Override at the Stop Gate, not in chat.** Use `revise — <delta>`.

## Common mistakes

- Treating it like plan-then-execute. It's not — each move responds to the previous one.
- Trying to circumvent gate refusals in chat. Pick one of the gate's options instead.
- Invoking the orchestrator multiple times in one session — once is enough.

## Costs and time

Orchestrator uses Opus model (most expensive routing decision per call). Per turn: ~$0.05-0.15. Across a full feature session: ~$0.20-0.40.

## What runs before / after

```
You: "design the checkout flow"
  → Orchestrator (Diagnose, Propose)
    → sub-agent A → Stop Gate
      → Orchestrator (Propose next)
        → sub-agent B → Stop Gate
          → ...
```

## Related

- [Alignment Loop](../concepts/alignment-loop.html)
- [Stop Gate](../concepts/stop-gate.html)
- [Research-First Gate](../concepts/research-first-gate.html), [Success-Metrics Gate](../concepts/success-metrics-gate.html) — gates it enforces

---

_Current as of v4.0._
