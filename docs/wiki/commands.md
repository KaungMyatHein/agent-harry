---
title: Commands
nav_order: 5
has_children: true
description: "Slash commands you can run directly from the Claude Code prompt."
---

# Commands

Five slash commands ship with Agent Harry. Each one is a direct invocation — you type the command, it runs, you see the result.

| Command | What it does |
|---|---|
| [`/audit-pipeline`](commands/audit-pipeline.html) | Check whether the Research-First + Success-Metrics gates are clear before starting design work |
| [`/agent-harry-loop`](commands/agent-harry-loop.html) | Run a click-driven polling loop with the dashboard server (optional, advanced) |
| [`/agent-harry-notion-sync`](commands/agent-harry-notion-sync.html) | Push confirmed artifacts to your Notion workspace |
| [`/agent-harry-audit`](commands/agent-harry-audit.html) | Render the audit ledger as a readable markdown timeline |
| [`/agent-harry-fingerprint`](commands/agent-harry-fingerprint.html) (v4.0) | Create or refresh the project's `product-fingerprint.md` |

## When to use commands vs agent names

You can always invoke an agent directly by typing its name in chat ("run lo-fi-designer for the checkout flow"). Slash commands are for *meta operations* that don't fit a single agent — checking pipeline state, syncing to Notion, rendering the audit ledger, curating the fingerprint.

---

_Current as of v4.0._
