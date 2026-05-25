---
title: Audit Ledger
parent: Concepts
nav_order: 7
description: "Every decision in every session gets logged to a structured file so you can answer 'who decided what, when' months later."
---

# Audit Ledger

> A hidden file at your project root (`.harry-audit.jsonl`) where every Stop Gate, refusal, opt-out, and pivot gets logged with timestamps and costs. You read it via the [`/agent-harry-audit`](../commands/agent-harry-audit.html) command.

## What problem it solves

After a few features, you forget what happened. Why did this feature ship without a usability test? Why does the checkout flow use cards when settings uses two-pane? Did anyone audit the metrics before launch?

Chat history compacts. The MD handoff files survive but only show outputs, not decisions. The audit ledger fills the gap — it's the structured record of what was decided, by whom, when.

## How it works

Every agent in Agent Harry writes an entry to `<project-root>/.harry-audit.jsonl` (JSON-lines format — one JSON object per line) at key moments:

- After every [Stop Gate](stop-gate.html) — `event: stop_gate`
- When a refusal gate blocks — `event: gate_block`
- When a gate clears — `event: gate_clear`
- When you opt out of a gate — same event, different decision field
- When you pivot back to an earlier step — `event: pivot`
- When you cancel — `event: cancel`
- When an iteration cap fires — `event: iteration_cap_hit`
- When a scope cap fires — `event: scope_refused`

The file is **gitignored by default** — it contains raw file paths and decision text. Treat as private. Don't commit to public repos without redacting first.

## What you'll see

The raw file looks like this (one line per event):

```jsonl
{"ts":"2026-05-24T12:30:00Z","session_id":"s_20260524_0001","project_slug":"saas-ecommerce","feature_slug":"checkout","agent":"discovery-researcher","mode":"B","phase":"discovery","event":"stop_gate","decision":null,"cost_delta":0.30,"files_written":["design-workspace/saas-ecommerce/2026-05-24_discovery-researcher_checkout-audit.md"],"handoff_ref":"design-workspace/saas-ecommerce/2026-05-24_discovery-researcher_checkout-audit.md"}
```

You don't normally read the raw file. You read it via the [`/agent-harry-audit`](../commands/agent-harry-audit.html) command, which renders it as a markdown timeline:

```
## 2026-05-24 — saas-ecommerce / checkout

12:30 UTC  discovery-researcher (Mode B)  stop_gate  $0.30
           Decision: y
           Files: 2026-05-24_discovery-researcher_checkout-audit.md

12:32 UTC  orchestrator                    gate_block
           Gate: success_metrics
           Reason: pm-metrics-architect not run yet

12:33 UTC  pm-metrics-architect (Mode A)   stop_gate  $0.40
           Decision: y, confirm metrics
```

## How to interact

You don't write to the ledger directly — agents and the orchestrator do.

You **read** it via:

| Command | What it shows |
|---|---|
| `/agent-harry-audit` | Last 7 days, current project, all events (default) |
| `/agent-harry-audit --all` | Everything in the file |
| `/agent-harry-audit --days 30` | Last 30 days |
| `/agent-harry-audit --agent figma-designer` | Only entries from one agent |
| `/agent-harry-audit --event gate_block` | Only one event type |
| `/agent-harry-audit --session s_20260524_0001` | One specific session |

For multi-project queries, shell-merge: `find ~/projects -name ".harry-audit.jsonl" | xargs cat | jq '...'`.

## When it fires

Continuously, during every session. The orchestrator writes routing events (gate_block, gate_clear, pivot, cancel). Each subagent writes its own Stop Gate entries.

The file grows append-only. No rotation. Real-world projects (5-10 sessions/week) stay under 5MB even after years.

## Event types

| Event | When fires | Owner |
|---|---|---|
| `stop_gate` | Every Stop Gate (most common) | Subagent that just ran |
| `gate_block` | Research-First, Success-Metrics, or Fingerprint refusal | Orchestrator (or subagent for fingerprint) |
| `gate_clear` | A blocking gate transitions to passed | Orchestrator |
| `pivot` | User typed `pivot — <new direction>` | Orchestrator |
| `cancel` | User typed `cancel` | Orchestrator |
| `scope_refused` | Subagent refused due to scope cap | Subagent |
| `iteration_cap_hit` | Iteration soft cap reached (e.g. 3 consecutive revises) | Subagent |
| `fingerprint_skipped` (v4.0) | User typed `skip fingerprint` | Subagent that checked |
| `fingerprint_stale_detected` (v4.0) | Pre-intake check found ≥1 stale Figma reference | Subagent that checked |
| `fingerprint_stale_proceeded` (v4.0) | User typed `proceed with stale fingerprint` | Subagent |
| `fingerprint_refreshed` (v4.0) | `product-fingerprint-curator` ran in refresh mode | Curator |

Full event schema with required + optional fields lives in [`audit-ledger-events.md`](../reference/audit-ledger-events.html) (M4 reference page).

## Example

Three months after shipping the checkout redesign, your team manager asks: *"Why does the checkout use a two-pane Settings layout? Was that intentional?"*

You run:

```
/agent-harry-audit --feature checkout --event stop_gate
```

The output shows every Stop Gate from that feature, including the `lo-fi-designer` Stop Gate where the team chose "Alternative" over "Primary" with the decision text *"two-pane matches our Settings pattern; Primary's sidebar+main felt too dense for a one-time flow."*

You have the answer: it was intentional, decided in turn 9 of the original session, with a recorded rationale.

## Common questions

**Where is the file?**
`<project-root>/.harry-audit.jsonl` — hidden dotfile.

**Should I commit it?**
By default, no. It's gitignored. If you want to share decisions with your team, sync the artifacts (via `/agent-harry-notion-sync`) rather than the raw ledger.

**Can I edit it manually?**
You can — it's just JSON-lines. But don't. The orchestrator and agents write to it in real-time; manual edits race with their writes.

**What if it gets corrupted?**
JSON-lines is robust — one bad line doesn't break the rest. If `/agent-harry-audit` rendering errors, look at the problem line and remove it.

**Does the ledger track cost?**
Yes — every entry has a `cost_delta` field. The `/agent-harry-audit` render sums these per session and reports cumulative cost.

**Why JSON-lines and not JSON?**
Append-only writes don't need to rewrite the whole file. Multiple processes can append concurrently without locking. Easy to grep and process with `jq`.

**What about privacy?**
The ledger contains file paths, decision text, and project names. Treat as private. The `.gitignore` rule ships in v3.8+ install/refresh. Don't commit to public repos without redacting.

## Related

- [`/agent-harry-audit`](../commands/agent-harry-audit.html) — the slash command to read it
- [Stop Gate](stop-gate.html) — where most entries originate
- [Research-First Gate](research-first-gate.html) and [Success-Metrics Gate](success-metrics-gate.html) — gate events get logged here
- [Audit Ledger Events](../reference/audit-ledger-events.html) — full schema reference

---

_Current as of v4.0._
