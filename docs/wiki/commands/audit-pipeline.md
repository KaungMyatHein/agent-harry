---
title: /audit-pipeline
parent: Commands
nav_order: 1
description: "Check whether the Research-First + Success-Metrics gates are clear before Deliver work."
---

# /audit-pipeline

> Inspects your project's `design-workspace/` for Discovery and Define artifacts, reports which gates are clear or blocked, and tells you the cheapest unblock.

## What it does

Globs `./design-workspace/` for handoff files. Groups them by phase (Discovery, Define, Deliver, Meta). Reports whether the [Research-First Gate](../concepts/research-first-gate.html) and [Success-Metrics Gate](../concepts/success-metrics-gate.html) are PASS / BLOCK / OPTED-OUT. If BLOCK, names the cheapest unblock.

## When to use it

- Before starting any Deliver work — "am I ready?"
- After installing Agent Harry into a project — "is this set up right?"
- When work has gone sideways — "where am I actually?"
- Whenever someone says "let's start designing" — confirm gates first.

## How to invoke

```
/audit-pipeline
/audit-pipeline <project-slug>     # if multiple projects under design-workspace/
```

## What you get

A short report:

- Project name + artifact counts per phase
- Gate status (PASS / BLOCK / OPTED-OUT) for both gates
- Recommended next action if BLOCKED
- Reads only Executive Summary blocks of existing artifacts (cheap)

## Hard rules

- Never auto-passes a gate based on "the user seems to know what they're doing" — only the explicit opt-out phrases count.
- Never loads long-form artifact bodies — Executive Summaries only.
- If `./design-workspace/` doesn't exist, treats as BLOCK with zero artifacts.

## Cost

~$0.05-0.10 — very cheap. Just a structured directory inspection.

## Related

- [Research-First Gate](../concepts/research-first-gate.html)
- [Success-Metrics Gate](../concepts/success-metrics-gate.html)
- [Mode A vs Mode B](../concepts/mode-a-vs-mode-b.html) — Mode B is usually the cheapest unblock

---

_Current as of v4.0._
