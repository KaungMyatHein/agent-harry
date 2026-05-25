---
title: Success-Metrics Gate
parent: Concepts
nav_order: 5
description: "Second refusal point — fires after Define is done, before any Deliver work."
---

# Success-Metrics Gate

> Once Define-phase work exists in your project, the orchestrator refuses to start any Deliver work until you've confirmed a success metric for the feature.

## What problem it solves

It's possible to ship beautiful design work that doesn't move the needle on anything — because no one defined what "moving the needle" meant. The team designs to a vague goal ("reduce friction"), ships, and then can't tell if it worked.

This gate forces the question "what specifically are we optimizing for?" to be answered BEFORE the design phase. The cost is one extra agent run; the savings is avoiding shipped work that can't be evaluated.

## How it works

This is the second gate in the pipeline. It only fires after the [Research-First Gate](research-first-gate.html) is clear. The sequence:

```
1. Research-First Gate clears (you ran discovery-researcher or competitive-analyst)
2. You try to run a Deliver-phase agent
3. Success-Metrics Gate checks: has pm-metrics-architect run and been confirmed?
4. If no → refuse with options
5. If yes → Deliver-phase agents can run
```

The gate is satisfied by either:

- A `pm-metrics-architect` artifact in `./design-workspace/<project>/` AND your `y` confirmation at the Stop Gate that followed
- An explicit opt-out phrase

Note: `lo-fi-designer` is the only Deliver-adjacent agent NOT blocked by this gate — layout exploration can happen before metrics are locked (and may even help inform metric choice).

## What you'll see

The refusal message:

```
Define is complete. Before we move to Deliver work, the Success-
Metrics Gate fires.

I can't route to figma-designer / design-engineer / usability-
tester / handoff-engineer / pm-launch-architect until you've
locked in a success metric.

Options:
(a) Run `pm-metrics-architect` Mode A — recommended; takes ~5 min,
    produces a North Star + input metrics + target
(b) Opt out — only if you have metrics confirmed outside Agent
    Harry. Say:
    "I have metrics already, skip the confirmation" or
    "skip metrics"

What's the move?
```

## How to interact

Three valid responses:

| Type | What happens |
|---|---|
| `(a)` or `y` | Orchestrator routes to `pm-metrics-architect` Mode A |
| "I have metrics already, skip the confirmation" / "skip metrics" / "Success metrics မလိုဘူး" | Gate clears via opt-out |
| `cancel` | Halt |

After `pm-metrics-architect` runs, the Stop Gate text changes to ask for **confirmation** specifically — not a generic "proceed?" The signal that clears the gate is your explicit `y` (or "confirm metrics") on that Stop Gate.

## When it fires

Every time the orchestrator considers routing to one of these Deliver agents AND Define artifacts exist AND `pm-metrics-architect` hasn't been confirmed:

- [`figma-designer`](../agents/figma-designer.html)
- [`design-engineer`](../agents/design-engineer.html)
- [`usability-tester`](../agents/usability-tester.html)
- [`handoff-engineer`](../agents/handoff-engineer.html)
- [`pm-launch-architect`](../agents/pm-launch-architect.html)

Once metrics are confirmed, the gate doesn't fire again for that project.

## Example

You've cleared the Research-First Gate (you ran `discovery-researcher` Mode B). You want to jump to design:

**You:**

> Run figma-designer for the checkout flow.

**Orchestrator:**

> Hold on — Success-Metrics Gate is up. Define artifacts exist (the discovery audit you just ran), but `pm-metrics-architect` hasn't run yet. Cheapest path forward: run it now. It'll ask a few questions and produce a metric tree. Then I'll route to `figma-designer`.

**You:**

> y

`pm-metrics-architect` runs. It asks about your North Star, proposes input metrics, names a target. The Stop Gate at the end says:

> _"Confirm these metrics so Deliver can proceed?"_

**You:**

> y, confirm metrics

Gate clears. Orchestrator's next proposal is `figma-designer` (the Deliver agent you originally wanted).

## Common questions

**Why isn't `lo-fi-designer` blocked?**
Layout exploration can inform metric selection. You might pick a different metric after seeing the layout options. This gate exists to make sure metrics are confirmed BEFORE hi-fi design or code work — not before layout sketches.

**What about `prd-author`?**
`prd-author` is also blocked. PRDs are post-metrics in the v3.5+ pipeline — you write a PRD per prioritized sub-feature, with the confirmed metric attached.

**Can I run pm-metrics-architect later?**
Yes — but only if you opt out of the gate first. Opt-outs are logged in the [audit ledger](audit-ledger.html). The intent is to make the gate a forcing function, not a hard wall.

**What if my metrics are in Notion already?**
Use the opt-out phrase ("skip metrics" / "I have metrics already, skip the confirmation"). The gate clears.

**Does the Stop Gate after `pm-metrics-architect` look different?**
Yes — the orchestrator's next-step line and the TL;DR's open-question bullet reframe as confirmation: *"Confirm these metrics so Deliver can proceed? Type `y` to lock in; `revise — <delta>` to adjust before locking."* This makes the confirmation feel intentional, not routine.

## Related

- [Research-First Gate](research-first-gate.html) — the first gate; this one fires after it clears
- [`pm-metrics-architect`](../agents/pm-metrics-architect.html) — the agent that clears this gate
- [`/audit-pipeline`](../commands/audit-pipeline.html) — checks gate status on demand
- [Stop Gate](stop-gate.html) — the confirmation flow that clears this gate

---

_Current as of v4.0._
