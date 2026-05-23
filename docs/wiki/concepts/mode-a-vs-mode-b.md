---
title: Mode A vs Mode B
parent: Concepts
nav_order: 3
description: "Generate-from-scratch vs audit-existing — most agents run in one of two modes."
---

# Mode A vs Mode B

> Most agents have two modes. Mode A makes something new from scratch. Mode B reviews and audits something that already exists. They're invoked the same way; the agent picks based on what inputs you give.

## What problem it solves

Real projects have a mix of greenfield work and existing artifacts. You might have:

- An existing PRD that needs audit, not rewrite
- An existing Figma file that needs a quality check, not a redesign
- An existing code prototype that needs a fingerprint-divergence review

Without Mode B, every interaction would be "generate from scratch" — even when generating from scratch is wasteful. Mode B lets you audit what's already there before committing to net-new work.

## How it works

When an agent runs, it inspects what you handed it:

- **No existing artifact named or pasted** → Mode A (generate from scratch)
- **Existing artifact URL, file path, or pasted content** → Mode B (audit that artifact)

Some agents accept this choice explicitly at intake; others infer it from your invocation. The Stop Gate output always says which mode ran (`Mode A` or `Mode B`).

## What each mode produces

### Mode A — generate from scratch

The agent produces a fresh artifact. Examples:

| Agent | Mode A output |
|---|---|
| [`discovery-researcher`](../agents/discovery-researcher.html) | A new research plan and synthesis of findings |
| [`lo-fi-designer`](../agents/lo-fi-designer.html) | A new userflow + 3 fresh ASCII layout variants |
| [`figma-designer`](../agents/figma-designer.html) | New Figma frames in a new (or named) file |
| [`design-engineer`](../agents/design-engineer.html) | New prototype code in `prototypes/<feature>/` |

### Mode B — audit existing

The agent reviews an existing artifact against the same standards Mode A would meet. Examples:

| Agent | Mode B output |
|---|---|
| [`discovery-researcher`](../agents/discovery-researcher.html) | A gap analysis of your existing PRD or research doc |
| [`lo-fi-designer`](../agents/lo-fi-designer.html) | Audit of existing wireframes/Figjam for flow integrity, DS adherence, fidelity match |
| [`figma-designer`](../agents/figma-designer.html) | Audit of existing Figma frames for DS divergence, state coverage, fingerprint compliance |
| [`design-engineer`](../agents/design-engineer.html) | Audit of existing prototype code for state coverage, DS adherence, mock realism |

Mode B output is always a **finding report**, not new content. It tells you what's missing, what diverges, and what to fix — without changing the artifact.

## How to interact

Two ways to trigger Mode B:

1. **Hand the agent an existing artifact** at intake. Paste a Figma URL, point to a code path, reference an existing PRD file. The agent recognizes the input and switches to Mode B.
2. **Ask explicitly** in your invocation: *"audit my existing checkout Figma file at https://figma.com/..."*

If you want net-new work, just describe the feature without handing over an existing artifact — the agent defaults to Mode A.

## When it fires

Per agent invocation. The mode is chosen at intake, not during the run. Once an agent is in Mode B, it stays in Mode B for that run.

## Example

You have a partial Figma file for the checkout flow. Engineering wants to know: does it actually meet quality standards?

**You:**

> Audit the existing checkout Figma file at https://figma.com/file/.../checkout-v1 against our standards.

**figma-designer (Mode B):**

```
| Agent           | figma-designer  |
| Mode            | B (audit)       |
| Inputs          | 1 Figma file (8 frames) |
| Coverage gaps   | 3 screens missing empty state |
| DS divergence   | 4 detached instances, 2 hardcoded hex codes |
| Fingerprint     | 1 anti-pattern violation (full-bleed in Settings) |
| Recommendation  | Fix 5 high-severity items before designer handoff |

TL;DR:
- 8 frames present, 4 states declared but only Default fully covered
- 4 DS instances detached → re-link to library
- Settings screen breaks fingerprint anti-pattern: no full-bleed
  outside marketing
```

You get a finding report. The Figma file is untouched. You decide whether to fix the issues yourself, run [`figma-designer`](../agents/figma-designer.html) in Mode A to regenerate problem screens, or accept the issues as known debt.

## Common questions

**Which agents have both modes?**
Most do. The notable exceptions: [`pm-metrics-architect`](../agents/pm-metrics-architect.html), [`pm-strategist`](../agents/pm-strategist.html), [`product-fingerprint-curator`](../agents/product-fingerprint-curator.html) — these have first-run vs refresh-run distinctions instead.

**Can Mode B fix things, or just report them?**
Mode B only reports. To fix, you either edit the artifact yourself, or invoke Mode A on the specific piece that needs regeneration. This separation is intentional — Mode B audits without mutating.

**What if I want Mode A but the agent picked Mode B?**
Usually that means you handed it an existing artifact at intake. Re-invoke without the artifact reference, or say explicitly *"generate a new <thing>, don't audit the existing one."*

**Does Mode B cost less than Mode A?**
Usually yes — Mode B doesn't generate as much content. Typical cost: $0.10–0.30 for Mode B vs $0.30–0.50 for Mode A.

**Why is Mode B so important for cost discipline?**
Running Mode B on your existing PRD before clearing the Research-First Gate often costs $0.30 and unlocks the whole pipeline. The alternative is running Mode A for `discovery-researcher` from scratch (~$1.00+). Mode B is the cheapest unblock for almost every gate.

## Related

- [Research-First Gate](research-first-gate.html) — almost always cleared with Mode B on existing materials
- [Stop Gate](stop-gate.html) — shows which mode just ran
- [Agents](../index.html#all-agents) — each agent page documents its Mode A and Mode B behavior

---

_Current as of v4.0._
