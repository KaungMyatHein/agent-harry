---
title: Refresh After Update
parent: Guides
nav_order: 2
description: "What to do when the Agent Harry skill ships a new version."
---

# Refresh After Update

When the Agent Harry skill ships a new version (e.g., v4.0 → v4.1), your installed agents in `<project>/.claude/agents/` are still the OLD versions. You need to refresh them.

**Time required:** about 1 minute.

## Step 1: Update the skill on your machine

```bash
cd ~/.claude/skills/agent-harry
git pull
```

This pulls the latest templates into the skill directory. It doesn't touch your projects yet.

## Step 2: Refresh agents in your project

In Claude Code, open your project. Type one of these:

> "refresh Agent Harry"

> "refresh design agents"

> "update agents in this project"

> *Agent Harry ပြန် refresh*

What happens:

- Overwrites the 17 agent files in `<project>/.claude/agents/` with the latest from `~/.claude/skills/agent-harry/templates/`.
- Overwrites the 5 slash commands.
- **Preserves your `SHARED_CONTEXT.md`** — your project-specific config stays.
- **Preserves your `product-fingerprint.md`** (v4.0+) — your curated visual vocabulary stays.
- **Preserves your `.harry-audit.jsonl`** — decision history stays.
- Warns first if any agent file has uncommitted local edits (so you don't lose customizations accidentally).

## Step 3: Check the changelog

After refresh, the agent will offer a one-line pointer to the CHANGELOG. Read it to see what changed.

## Step 4 (rare): Re-fill new SHARED_CONTEXT fields

If the new version added new `SHARED_CONTEXT.md` fields (rare), they'll be in the template but missing in your project copy. The agent flags this — fill the new fields manually.

## What does NOT need attention

- Your `design-workspace/` artifacts — untouched.
- Existing PRDs, lo-fi handoffs, prototype code — all preserved.
- Your `.harry-audit.jsonl` audit ledger — preserved (refresh never touches it).

## v5.0 dashboard cleanup (one-time, only if refreshing from a pre-v5.0 install)

v5.0 ripped the dashboard surface (never used in practice). If your project still has any of these files from a pre-v5.0 install, refresh will list them and ask you to clean up manually:

- `dashboard.html`
- `dashboard-server.py`
- `.harry-queue.json`
- `.claude/commands/agent-harry-loop.md`

They're harmless if left in place (the orchestrator no longer touches them), but they clutter the project root. Run `rm dashboard.html dashboard-server.py .harry-queue.json .claude/commands/agent-harry-loop.md` once and they're gone. See `CHANGELOG.md` v5.0 for the rationale.

## When to skip refresh

You can stay on an old version if it works for your project. There's no hard requirement to refresh. The trade-off: new features (e.g., v4.0's Product Fingerprint) don't apply until you refresh.

## Related

- [Getting Started](../getting-started.html) — first-time install
- [CHANGELOG](https://github.com/KaungMyatHein/agent-harry/blob/main/CHANGELOG.md) — what shipped in each version

---

_Current as of v4.0._
