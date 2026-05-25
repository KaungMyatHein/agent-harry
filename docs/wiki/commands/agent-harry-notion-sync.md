---
title: /agent-harry-notion-sync
parent: Commands
nav_order: 3
description: "Push confirmed artifacts to your Notion workspace."
---

# /agent-harry-notion-sync

> Publishes confirmed Agent Harry artifacts (Discovery insights, Define decisions, PRDs, metrics) to your Notion workspace so teammates can read them outside Claude Code.

## What it does

Reads `./design-workspace/<project>/` for artifacts marked confirmed (you typed `y` at their Stop Gates), pushes them to your Notion workspace as structured pages. Idempotent — re-running updates pages in place, doesn't duplicate.

## When to use it

- After Success-Metrics Gate clears, before kicking off design — teammates can review metrics + prioritization in Notion.
- After `prd-author` produces PRDs — engineering reads them in Notion.
- When the pipeline finishes — final publish for the team.

## When NOT to use it

- You're solo on the project — overhead without benefit.
- Notion MCP isn't connected.
- You haven't confirmed artifacts yet — only confirmed ones sync.

## Setup (first run)

The first run prompts you for a parent Notion page (where Agent Harry creates its root page). Writes config to `<project>/.notion-config.json` with the parent page ID + a map of synced pages.

## How to invoke

```
/agent-harry-notion-sync
```

No arguments needed. It reads `.notion-config.json` for the parent page.

## What you get

- Notion pages created or updated for each confirmed artifact.
- A Notion root page that links all of them.
- `.notion-config.json` updated with the latest sync map.

## What gets synced

- Discovery insights + competitive teardowns
- Define artifacts — positioning, prioritization scoring, concepts, the strategic bet
- Success Metrics (with `✓ Confirmed` badge if the gate cleared)
- PRDs (one Notion page per PRD)
- Deliver artifacts — design spec, usability test plan, launch plan

## What does NOT get synced

- Full long-form MD bodies (archival only)
- Critique-partner stress-tests inline (folded into the artifact they critiqued)

## Cost

~$0.05-0.10 per sync (cheap).

## Anti-patterns

- Auto-syncing on every Stop Gate — wastes Notion API quota; some artifacts shouldn't be public yet.
- Syncing un-confirmed drafts — only `y`-approved artifacts sync.

## Related

- [Stop Gate](../concepts/stop-gate.html) — only `y` confirmations get synced
- [Audit Ledger](../concepts/audit-ledger.html) — the source of truth (Notion sync is for teammates)

---

_Current as of v4.0._
