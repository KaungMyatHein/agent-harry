---
title: Usability Tester
parent: Agents
nav_order: 13
description: "Test plans, task analysis, finding synthesis."
---

# Usability Tester

> The agent that plans usability studies (Mode A) or synthesizes findings from completed sessions (Mode B). Bridges design and validation.

## What it does

In Mode A: designs the test (tasks, segments, success criteria, screener) for a feature you're about to ship or just shipped. In Mode B: takes session notes / recordings / transcripts and produces a synthesized findings report with severity-ranked issues.

## When to use it

- After a prototype exists and before broad rollout.
- After moderated sessions, when you have raw notes to synthesize.
- For pre-launch validation of high-risk flows.

## When NOT to use it

- You haven't built anything to test yet.
- You want pure user research → use `discovery-researcher` instead.

## What it asks you at intake

- Mode A or Mode B?
- Mode A: feature scope, success criteria, participant segment.
- Mode B: session notes / transcripts (paste or path).

## What you get back

Mode A: test plan with tasks, success criteria, segment, script. Mode B: findings report with severity-ranked issues + recommended fixes.

## Best practices

- **5 participants per segment.** Industry standard.
- **Tasks, not features.** "Buy a product" is a task. "Use the checkout button" is a feature touch.
- **Severity-rank findings.** Not all friction is equal.

## Common mistakes

- Treating Mode B output as immutable. Findings are interpretations; double-check with raw data.
- Skipping screeners → wrong participants → useless data.

## Costs and time

~$0.40-0.80

## What runs before / after

```
design-engineer (or figma-designer) → usability-tester → revise based on findings
```

## Related

- [`design-engineer`](design-engineer.html), [`figma-designer`](figma-designer.html) — what gets tested
- [`pm-metrics-architect`](pm-metrics-architect.html) — quantitative complement

---

_Current as of v4.0._
