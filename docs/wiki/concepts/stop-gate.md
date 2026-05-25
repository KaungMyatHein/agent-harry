---
title: Stop Gate
parent: Concepts
nav_order: 1
description: "What to type after each agent stops and waits."
---

# Stop Gate

> After every agent finishes, the system stops and asks "okay, what now?" and waits for you to type something. Nothing auto-proceeds.

## What problem it solves

Without this, the orchestrator would chain agents back-to-back, and by the time you noticed something was off, three agents had built on top of the wrong direction. Bad work compounds fast in pipelines.

The Stop Gate forces a beat between every step. You always see what just happened and you always choose what's next. Lost time on a wrong path drops dramatically.

## How it works

After every sub-agent finishes, you see:

1. A short **Executive Summary** — a small table of stats, a Decision Data block (insights / table / callout / metrics), three bullet points, one next-step suggestion
2. Four valid responses
3. The system stops and waits for your input

It doesn't auto-proceed. Even if you're in "skip permissions" or bypass-permissions mode. The Stop Gate is product discipline, not safety wiring. Bypassing it would be a regression, not a feature.

## What you'll see

A typical Stop Gate in chat looks like this:

```
| Agent          | lo-fi-designer                  |
| Confidence     | high                            |
| Recommendation | proceed to design-engineer      |

TL;DR:
- Picked Primary layout: sidebar+main, inherits from Cart page
- 3 DS components reused, 1 new component needed (PaymentMethodPicker)
- Open question: confirm tax display location

Next: Type `y` to proceed, `revise <delta>` to refine,
      `grill me` to stress-test, or `cancel`.
```

## How to interact

Four valid responses:

| Type | What happens |
|---|---|
| `y` / `yes` / `ok` / `proceed` / `ဆက်လုပ်` | Accept and continue to the next planned step |
| `revise <what>` | Re-run this agent with a tweak — e.g. `revise — drop the Risky variant` |
| `grill me` / `stress test` | Invoke the [critique-partner](../agents/critique-partner.html) to stress-test this output before deciding |
| `cancel` / `stop` / `ရပ်` | Halt the pipeline; the file the agent wrote stays as-is |

You can also type `pivot — <new direction>` to back up to an earlier step. This is a stronger move than `revise`. Use it when an iteration won't fix the underlying problem — usually after 2-3 revise rounds in a row.

## When it fires

After every sub-agent run. Always. The orchestrator can't bypass it. Sub-agents themselves invoke their own Stop Gate when invoked directly (without the orchestrator).

## Example

You ran [`figma-designer`](../agents/figma-designer.html). It produced 4 hi-fi screens across 12 state frames. The Stop Gate shows the Executive Summary. You scroll through the Figma file and notice the Settings screen used a layout that doesn't match the rest. You type:

> `revise — Settings should follow the same sidebar+main as the other screens`

`figma-designer` re-invokes with that delta in its goal. It redraws Settings. Then it presents a new Stop Gate. The system stops again, waiting.

## Common questions

**What if I just want it to keep going?**
Type `y`. You'll do this often. The gate is fast when the work is good.

**What if I forget to respond?**
The system waits. It doesn't time out. Come back tomorrow; the gate is still open. The agent's output file is already saved.

**Can I revise more than once?**
Yes — no hard cap. But after 3 consecutive `revise`s the agent suggests pivoting back to an earlier step instead of iterating in place. If the layout's the problem, no amount of figma-designer revisions will fix it; you need to go back to [`lo-fi-designer`](../agents/lo-fi-designer.html).

**What if the gate refuses to show up?**
The agent had an error before finishing. Check the audit ledger via [`/agent-harry-audit`](../commands/agent-harry-audit.html) to see the last event logged.

## Related

- [Alignment Loop](alignment-loop.html) — the orchestrator philosophy this gate enforces
- Every agent's "What you'll see" section under [Agents](../index.html#all-agents) shows a sample Stop Gate

---

_Current as of v4.0._
