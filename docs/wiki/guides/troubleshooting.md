---
title: Troubleshooting
parent: Guides
nav_order: 3
description: "Common errors and their fixes."
---

# Troubleshooting

Common issues you might hit, and how to fix them. Grows over time as new issues are reported — file a GitHub issue if you hit one not listed here.

## "Fingerprint missing" refusal but I just want to test something

You're hitting the v4.0 [Product Fingerprint](../concepts/product-fingerprint.html) pre-intake check. Three options:

- Run [`/agent-harry-fingerprint`](../commands/agent-harry-fingerprint.html) to set it up properly (~5 min, reusable forever).
- Type `skip fingerprint` to bypass for this run (logged in audit ledger; output flags `visual_drift_risk: true`).
- Cancel and reconsider.

## "Research-First Gate blocked" but I have research

You have research, but Agent Harry doesn't see Discovery/Define artifacts in `./design-workspace/<project>/`. Three options:

- Run `discovery-researcher` in Mode B on your existing PRD (cheap, ~$0.30).
- Run `discovery-researcher` in Mode A from scratch (slower, ~$1.00).
- Type the explicit opt-out: "I have audited research already, proceed to Deliver."

See [Research-First Gate](../concepts/research-first-gate.html) for details.

## "Success-Metrics Gate blocked" — but I have metrics

Same shape as Research-First. Either run [`pm-metrics-architect`](../agents/pm-metrics-architect.html) or use the explicit opt-out: "I have metrics already, skip the confirmation."

## Figma agents fail with "MCP not connected"

[`figma-designer`](../agents/figma-designer.html), [`product-fingerprint-curator`](../agents/product-fingerprint-curator.html), and parts of [`lo-fi-designer`](../agents/lo-fi-designer.html) need Figma MCP. Set it up via Figma's MCP guide, restart Claude Code, retry.

## Agent stops mid-way without a Stop Gate

The agent errored before completing. Check chat for the last message — usually it's a permission denial, a tool error, or a hook block. The audit ledger may show the last successful event:

```
/agent-harry-audit --days 1
```

## I want to undo the last agent's work

The agent's MD handoff file is at `./design-workspace/<project>/`. Delete or `git checkout` it. The audit ledger entry stays as historical record. For code/Figma changes, you'll need to manually undo.

## The orchestrator keeps asking the same Diagnose questions

You're skipping intake answers or the orchestrator can't pin you down. Be concrete: "Yes, redesign," "B2C," "Existing PRD in Notion at <link>."

## I'm getting unexpected refusals

Run [`/audit-pipeline`](../commands/audit-pipeline.html) to see what gates are blocking. The output names the cheapest unblock.

## A revise loop won't converge

After 3 consecutive revise rounds, the agent suggests pivoting. Either pivot back to an earlier step (`pivot — re-do layout`) or accept the current output with `y` and refine manually.

## Cumulative cost is climbing past the $3 soft ceiling

Check by running [`/agent-harry-cost`](../commands/agent-harry-cost.html) — it aggregates measured cost from the audit ledger. Common causes when the number is high:

- Multiple Mode A runs when Mode B would do.
- Many revise rounds without converging.
- Running expensive Opus agents (orchestrator, critique-partner) when they're not needed.

Cancel, run [`/agent-harry-audit`](../commands/agent-harry-audit.html) to find the biggest spenders, and consider a different approach. (Pre-v5.0 had a colored cost meter on `dashboard.html` that warned at $1.50 / $2.50 — removed when the dashboard was ripped. Use `/agent-harry-cost` on demand instead.)

## Filed an issue, didn't get a response

Agent Harry is a personal project maintained by [@KaungMyatHein](https://github.com/KaungMyatHein). Response times vary. For urgent help: the issue tracker is the primary channel.

---

_Current as of v4.0. New issues get added here as they're reported._
