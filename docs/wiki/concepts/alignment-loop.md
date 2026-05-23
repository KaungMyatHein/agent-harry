---
title: Alignment Loop
parent: Concepts
nav_order: 2
description: "The orchestrator's 'one step at a time' philosophy — not waterfall."
---

# Alignment Loop

> The orchestrator never plans 5 agents ahead. It proposes ONE smallest-next-move, runs it, stops, and asks you what's next.

## What problem it solves

The intuitive way to use AI agents is to ask for a big plan upfront: "design my whole product, here are 12 steps, go execute them." It feels efficient. It almost always fails.

Three things go wrong with waterfall planning:

1. **Plans go stale immediately.** Step 3 changes what step 6 should be. The plan is wrong by the time you reach step 6.
2. **You lose the ability to redirect.** Once the system is 3 agents deep into a plan, telling it to change direction means undoing work.
3. **Bad assumptions compound.** If step 1 had a wrong premise, every subsequent step builds on the wrong foundation.

The Alignment Loop avoids all three by never planning more than one step ahead.

## How it works

Four steps, repeated:

```
1. Diagnose   → orchestrator asks at most 2 questions to understand what you need
2. Propose    → orchestrator names ONE specific agent for ONE specific goal
3. Run        → that agent runs, produces output
4. Stop Gate  → you decide what's next (y / revise / pivot / cancel)
              → loop back to step 2 for the next move
```

The orchestrator never proposes "next we'll do A, then B, then C." It proposes A. After A runs and you accept, it proposes B based on what A actually produced. After B runs and you accept, it proposes C based on what B actually produced.

This is the opposite of a waterfall plan. There's no upfront plan to read or approve. There's just the next move.

## What you'll see

The first turn of a typical session:

```
You:    Design the checkout flow.

Orchestrator (Diagnose):
        Two quick questions:
        1. Is this a redesign of an existing flow, or net-new?
        2. Who's the primary user — B2C, B2B, or both?

You:    Redesign. B2C shoppers.

Orchestrator (Propose):
        Smallest next move: `discovery-researcher` Mode B.
        Goal: audit your existing PRD before any design work.
        Why this move: Research-First Gate is up; cheapest unblock
        is auditing what you have.

        Type `y` to proceed, `revise — <delta>` to refine.
```

You type `y`. The agent runs. The [Stop Gate](stop-gate.html) appears. You see another Executive Summary. You type `y` again. The orchestrator proposes the next move based on what just happened.

## How to interact

You don't interact with the Alignment Loop directly — you interact with the [Stop Gate](stop-gate.html) at the end of each step. The orchestrator handles loop control.

The Diagnose phase (step 1) is special: the orchestrator asks **at most 2 questions** before proposing a first move. If it asks more than 2, that's a bug. The cap exists because asking 6 questions upfront IS waterfall planning by another name.

## When it fires

Every Agent Harry session starts in Alignment Loop mode. It runs until:

- You type `cancel` at a Stop Gate (loop halts)
- The orchestrator returns `complete` (no further moves to propose)
- A gate refuses and you opt out (loop pauses on the refusal)
- You hit a hard limit (rare — e.g., a sub-agent's iteration cap)

## Example

A real loop sequence on a feature redesign:

| Turn | Action | Move |
|---|---|---|
| 1 | Diagnose | Orchestrator asks 2 questions |
| 2 | Propose + Run | `discovery-researcher` Mode B audits PRD |
| 3 | Stop Gate → `y` | Orchestrator proposes next |
| 4 | Propose + Run | `pm-metrics-architect` locks in metrics |
| 5 | Stop Gate → `y, confirm metrics` | Success-Metrics Gate clears |
| 6 | Propose | Orchestrator proposes `lo-fi-designer` |
| 7 | Run | `lo-fi-designer` halts on fingerprint pre-intake check |
| 8 | User opts to run curator | `product-fingerprint-curator` runs |
| 9 | Stop Gate → `y` | Fingerprint locked in |
| 10 | Re-propose | Orchestrator re-routes to `lo-fi-designer` |
| 11 | Run | lo-fi produces 3 layouts |
| 12 | Stop Gate → `revise — drop Risky` | Lo-fi re-runs with 2 layouts |
| 13 | Stop Gate → `y` | Move on to figma-designer |
| ... | ... | ... |

No upfront plan. No "we'll do steps 1-12 in this order." Each move proposed in response to what just happened.

## How this differs from waterfall mode

Agent Harry has an optional **Waterfall mode** for cases where you explicitly want a multi-step plan upfront (e.g., aligning with a stakeholder who needs to see the whole roadmap before approval). You ask for it explicitly:

> "Plan a full Discovery → Define → Deliver cycle for the checkout redesign, then we'll go execute it."

Waterfall is the fallback. Alignment Loop is the default. Most sessions never need waterfall.

## Common questions

**Why not just plan ahead? It would be faster.**
Plans almost always need re-planning once you have actual output. The "fast" feeling is illusory; you spend the saved time re-planning.

**What if I want a list of what's coming next?**
The Stop Gate's "next move" line tells you the immediate next step. You don't get a 5-step preview — but you don't usually need one. If you really want one, ask the orchestrator in chat: "what would the next 3 moves look like roughly?" It will give a non-binding preview.

**Can the orchestrator be wrong about the smallest-next-move?**
Yes. That's what `revise — <delta>` is for at the Stop Gate. You override the proposal anytime.

**Does this make sessions longer?**
Wall-clock time, no — each step is small and fast. Total runtime is comparable to a waterfall plan. The benefit is fewer re-runs because you catch wrong moves before they compound.

## Related

- [Stop Gate](stop-gate.html) — what fires after every loop iteration
- [Orchestrator](../agents/orchestrator.html) — the agent that drives the loop
- [Research-First Gate](research-first-gate.html) and [Success-Metrics Gate](success-metrics-gate.html) — what can interrupt the loop with a refusal

---

_Current as of v4.0._
