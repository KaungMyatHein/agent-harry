---
title: /agent-harry-cost
parent: Commands
nav_order: 6
description: "Report real Agent Harry costs from token_usage events in the audit ledger (v4.1)."
---

# /agent-harry-cost

> Reads `<project-root>/.harry-audit.jsonl` and aggregates real cost from `token_usage` events (measured from Claude Code transcripts) — falls back to self-estimated `cost_delta` for runs where measurement hasn't been captured yet.

## What it does

Before v4.1, the only cost signal in Agent Harry was each agent's *self-estimated* `cost_delta` — a guess. v4.1 introduced [`scripts/log-tokens.py`](https://github.com/KaungMyatHein/agent-harry/blob/main/templates/scripts/log-tokens.py) which parses Claude Code session transcripts and appends authoritative `token_usage` events with real input/output/cache token counts and computed USD cost. This command aggregates those measured events into a readable report — by model, by Claude Code session window, and (with `--by-agent`) by agent.

## When to use it

- "How much did I actually spend this month?" — real numbers, not estimates.
- "Which model is eating my budget?" — opus vs sonnet breakdown.
- "Is the cache_read tax bigger than I thought?" — yes; long sessions on opus accumulate huge `cache_read` totals.
- Before raising a cost concern with the team — get real numbers to back it up.

## How to invoke

```
/agent-harry-cost                  # last 30 days, current project, by-model breakdown (default)
/agent-harry-cost --all            # everything in the ledger
/agent-harry-cost --days 7         # last 7 days only
/agent-harry-cost --by-agent       # adds an agent-level breakdown table
/agent-harry-cost --json           # raw aggregate as JSON (for spreadsheets)
```

## Capturing real numbers first

If your ledger has `stop_gate` events but no `token_usage` events, the command will tell you to run the logger:

```
python3 scripts/log-tokens.py                # auto-discovers transcripts for cwd
python3 scripts/log-tokens.py --since 2026-05-22   # only recent sessions
python3 scripts/log-tokens.py --force        # re-log already-logged sessions
```

The logger is idempotent — each Claude Code session UUID is recorded in the appended event, so re-running on the same transcript is skipped unless you pass `--force`.

## What you get

Markdown report with:

- **Combined total** — measured + estimated, with coverage % (drops a warning if < 80% measured)
- **By model** — runs / input / cache_read / cache_write / output / cost per model
- **By Claude Code session** — UUID + window + cost per session
- **Estimated-only entries** — agents whose runs haven't been measured yet (self-reported `cost_delta`)
- **With `--by-agent`** — extra section showing measured + estimated cost per agent name

## Example output (sketch)

```
# Agent Harry Cost Report
**Scope:** Last 30 days · project: saas-ecommerce
**Combined total:** $48.32  ($46.79 measured · $1.53 estimated fallback)
**Coverage:** 8 runs measured · 3 runs estimated-only · 73% measured

> Coverage < 80% — run `python3 scripts/log-tokens.py` to capture real numbers for past sessions.

## By model (measured)

| Model | Runs | Input | Cache read | Cache write | Output | Cost |
|---|---:|---:|---:|---:|---:|---:|
| claude-opus-4-7 | 6 | 1.5k | 11.2M | 968K | 172K | $45.79 |
| claude-sonnet-4-6 | 2 | 30k | 1.4M | 65K | 24K | $1.00 |
```

## Why cache_read dominates Opus cost

On long sessions, every assistant message re-reads its cached context. After ~1,500 messages on Opus, that's 200M+ cache_read tokens — at $1.50/M that alone is $300. The script surfaces this clearly so you can see where the money is going.

## Cost

~$0.05-0.10 — same shape as `/agent-harry-audit`. Reads the local ledger, computes aggregates, renders markdown.

## Related

- [Audit Ledger](../concepts/audit-ledger.html) — the file this command reads
- [Audit Ledger Events](../reference/audit-ledger-events.html) — `token_usage` event schema
- [`/agent-harry-audit`](agent-harry-audit.html) — full event timeline (this command is the cost slice)

---

_Current as of v4.1._
