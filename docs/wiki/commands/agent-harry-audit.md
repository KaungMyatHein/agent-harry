---
title: /agent-harry-audit
parent: Commands
nav_order: 4
description: "Render the audit ledger as a readable markdown timeline."
---

# /agent-harry-audit

> Reads `<project-root>/.harry-audit.jsonl` and renders it as a human-readable markdown timeline grouped by session.

## What it does

The audit ledger is JSON-lines (one event per line) — useful for `jq`-style queries but not readable by humans. This command renders it as a markdown timeline with sessions, agents, decisions, costs, and file paths.

## When to use it

- "Why did we ship without a usability test?" — find the decision.
- "How much did the last feature cost?" — sum the costs per session.
- "Which agents got the most revise rounds?" — surface iteration patterns.
- Monthly review of pipeline state.

## How to invoke

```
/agent-harry-audit                       # last 7 days, current project, all events (default)
/agent-harry-audit --all                 # everything in the file
/agent-harry-audit --days 30             # last 30 days
/agent-harry-audit --agent figma-designer # only entries from one agent
/agent-harry-audit --event gate_block    # only one event type
/agent-harry-audit --session s_20260524_0001  # one specific session
```

## What you get

Markdown timeline grouped by session, with:

- Per-event line: timestamp, agent, mode, event, cost
- Decision text where present
- File paths (truncated to 9 + "+N more" if longer)
- Session cost totals at the end

## Example output

```
## 2026-05-24 — saas-ecommerce / checkout (session s_20260524_0001)

12:30 UTC  discovery-researcher (Mode B)  stop_gate  $0.30
           Decision: y

12:32 UTC  orchestrator                    gate_block
           Gate: success_metrics

12:33 UTC  pm-metrics-architect (Mode A)   stop_gate  $0.40
           Decision: y, confirm metrics

12:38 UTC  orchestrator                    gate_clear
           Gate: success_metrics

...

Session total: $2.60
```

## Cost

~$0.05-0.10 — just reads and formats a local file. Cheap.

## Multi-project queries

For queries across multiple projects, shell-merge:

```
find ~/projects -name ".harry-audit.jsonl" | xargs cat | jq '...'
```

## Related

- [Audit Ledger](../concepts/audit-ledger.html) — the file this command renders
- [Audit Ledger Events](../reference/audit-ledger-events.html) — full event reference

---

_Current as of v4.0._
