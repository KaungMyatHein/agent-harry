---
title: Research-First Gate
parent: Concepts
nav_order: 4
description: "Why Agent Harry refuses to start design work until Discovery or Define artifacts exist."
---

# Research-First Gate

> Design work can't start until you have at least one Discovery or Define artifact in your project. The orchestrator refuses to skip ahead, and tells you the cheapest way to clear the gate.

## What problem it solves

Designing a feature without any research foundation produces beautiful work that misses what users actually need. The maintainer's experience: shipping Deliver work that had to be re-done after an assumption was later found to be wrong — at significant cost.

This gate trades a small upfront cost (one Discovery or Define run, often Mode B audit on existing materials) for avoiding redesign loops later.

## How it works

When the orchestrator considers routing to a Deliver-phase agent — [`lo-fi-designer`](../agents/lo-fi-designer.html), [`figma-designer`](../agents/figma-designer.html), [`design-engineer`](../agents/design-engineer.html), [`usability-tester`](../agents/usability-tester.html), [`handoff-engineer`](../agents/handoff-engineer.html) — it first checks for the existence of any of these artifact types in `./design-workspace/<project>/`:

| Phase | Acceptable artifact |
|---|---|
| Discovery | `discovery-researcher` Mode A or Mode B output |
| Discovery | `competitive-analyst` Mode A or Mode B output |
| Define | `product-positioner` output |
| Define | `feature-prioritizer` output |
| Define | `ideation-facilitator` output |

If none exist, the orchestrator refuses to route to Deliver and surfaces the three options below.

## What you'll see

The gate's refusal message:

```
I can't route to Deliver yet — no Discovery or Define artifacts
exist in this project.

Options:
(a) Run `discovery-researcher` in Mode B on any existing PRD/
    research you have — cheapest unblock, usually $0.20-0.40
(b) Run `discovery-researcher` in Mode A to design new research
    from scratch — $1.00+, takes longer
(c) Explicitly opt out — only valid if you've genuinely audited
    research outside Agent Harry. Say:
    "I have audited research already, proceed to Deliver."

What's the move?
```

## How to interact

Three valid responses:

| Type | What happens |
|---|---|
| `(a)` or describe your existing PRD/research location | Orchestrator routes to `discovery-researcher` Mode B |
| `(b)` or "run discovery from scratch" | Orchestrator routes to `discovery-researcher` Mode A |
| "I have audited research already, proceed to Deliver." | Gate clears via explicit opt-out; logged in audit ledger |

The opt-out phrase must be explicit. Saying "yeah I have research" without the exact phrase doesn't count — too easy to bypass accidentally otherwise.

## When it fires

Every time the orchestrator considers a Deliver-phase move and the project has no Discovery/Define artifacts yet. Once the gate clears (one artifact exists), it doesn't fire again for that project.

## Example

You're 2 weeks into a project. You jump in and say:

> Design the checkout flow.

**Orchestrator:**

> I can't route to design yet — no Discovery or Define artifacts in this project's `design-workspace/`. Cheapest unblock: do you have a PRD or any research notes I can audit in Mode B? If yes, I'll run `discovery-researcher` Mode B on it (~$0.30). If no, I can design new research (~$1.00+) or you can opt out with the explicit phrase.

**You:**

> There's a PRD draft in our Notion workspace under "Checkout V2 — Plan".

**Orchestrator:** *(routes to `discovery-researcher` Mode B, which reads the PRD via the Notion MCP and produces an audit)*

After Mode B finishes, the gate is clear. The orchestrator's next proposal is the natural next step ([`pm-metrics-architect`](../agents/pm-metrics-architect.html) if Define exists but metrics don't; otherwise [`lo-fi-designer`](../agents/lo-fi-designer.html)).

## Common questions

**Why is research mandatory? My PRD has it all.**
The gate doesn't doubt your PRD — it doubts whether the PRD has been audited against research-quality standards. Mode B does that in ~$0.30 and 5 minutes. Almost always worth it.

**What if I really don't have anything?**
That's Mode A territory — [`discovery-researcher`](../agents/discovery-researcher.html) will help you design new research (interview script, questions, segments). Slower, more expensive, but the right call when truly greenfield.

**Can I opt out without consequences?**
The opt-out is logged in the [audit ledger](audit-ledger.html) as a `gate_block` → `gate_clear` event with `decision: opt-out`. No consequences in the system — but a month later when someone asks "why does this feature feel off?", the audit ledger tells you the opt-out happened.

**Does this gate fire for non-Deliver work?**
No. You can run any Discovery, Define, or cross-cutting agent without clearing the gate. The gate only blocks the **Deliver-phase agents**.

**Why is `lo-fi-designer` included if it's Define-phase?**
Late-Define. It produces layouts based on the chosen concept and needs that concept to exist. Without Discovery/Define artifacts, there's no concept to base layouts on.

**Can I run `/audit-pipeline` to check gate status anytime?**
Yes — that's its primary purpose. [`/audit-pipeline`](../commands/audit-pipeline.html) inspects the gate state and tells you exactly what's blocked and the cheapest unblock.

## Related

- [Success-Metrics Gate](success-metrics-gate.html) — fires after this one clears
- [Mode A vs Mode B](mode-a-vs-mode-b.html) — Mode B is almost always the cheapest unblock
- [`/audit-pipeline`](../commands/audit-pipeline.html) — checks gate status on demand
- [`discovery-researcher`](../agents/discovery-researcher.html) — the agent that clears this gate

---

_Current as of v4.0._
