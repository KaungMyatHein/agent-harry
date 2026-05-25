---
title: Audit Ledger Events
parent: Reference
nav_order: 2
description: "Every audit-ledger event type, when it fires, owner, optional fields."
---

# Audit Ledger Events

Reference for every event type in `<project-root>/.harry-audit.jsonl`. The ledger is JSON-lines — one event per line. The full concept explainer is on the [Audit Ledger](../concepts/audit-ledger.html) page.

## Core schema (every event)

```json
{
  "ts": "2026-05-24T12:30:00Z",
  "session_id": "s_20260524_0001",
  "project_slug": "saas-ecommerce",
  "feature_slug": "checkout",
  "agent": "design-engineer",
  "mode": "A",
  "phase": "deliver",
  "event": "stop_gate",
  "decision": null,
  "cost_delta": 0.45,
  "files_written": ["prototypes/checkout/page.tsx"],
  "handoff_ref": "design-workspace/saas-ecommerce/prototype-checkout.md"
}
```

| Field | Type | Notes |
|---|---|---|
| `ts` | ISO 8601 UTC string | Event timestamp |
| `session_id` | string | `s_YYYYMMDD_NNNN`, counter resets daily UTC |
| `project_slug` | string | Kebab-case |
| `feature_slug` | string / null | Kebab-case, null for cross-feature work |
| `agent` | string | Subagent name or `"orchestrator"` |
| `mode` | `"A"` / `"B"` / null | null for orchestrator events |
| `phase` | string | `discovery` / `define` / `deliver` / `cross-cutting` / `meta` |
| `event` | string | See event types below |
| `decision` | string / null | `y` / `revise` / `pivot` / `cancel` / null |
| `cost_delta` | number | This event's estimated USD cost |
| `files_written` | string[] | Relative paths, max 10 per entry |
| `handoff_ref` | string / null | Handoff artifact path |

## Event types

| Event | When fires | Owner |
|---|---|---|
| `stop_gate` | Every Stop Gate (most common) | Subagent that just ran |
| `gate_block` | Research-First or Success-Metrics Gate refuses | Orchestrator |
| `gate_clear` | A blocking gate transitions to passed | Orchestrator |
| `pivot` | User responds `pivot — <new direction>` | Orchestrator |
| `cancel` | User responds `cancel` / `stop` / `ရပ်` | Orchestrator |
| `scope_refused` | Subagent refuses due to scope cap | Subagent |
| `iteration_cap_hit` | Iteration soft cap reached | Subagent |
| `fingerprint_skipped` (v4.0) | User typed `skip fingerprint` | Subagent that checked |
| `fingerprint_stale_detected` (v4.0) | Pre-intake check found stale ref(s) | Subagent that checked |
| `fingerprint_stale_proceeded` (v4.0) | User typed `proceed with stale fingerprint` | Subagent |
| `fingerprint_refreshed` (v4.0) | `product-fingerprint-curator` ran in refresh mode | Curator |
| `token_usage` (v4.1) | Real token measurement appended post-hoc from Claude Code transcript | `scripts/log-tokens.py` |
| `bootstrap_created` (v4.2) | `figma-component-bootstrapper` Create Mode — library written for the first time | Bootstrapper |
| `bootstrap_extended` (v4.2) | `figma-component-bootstrapper` Extend Mode — components added to existing library | Bootstrapper |
| `bootstrap_recreated` (v4.2) | `figma-component-bootstrapper` Recreate Mode — old library archived, new one created (user typed `recreate from scratch`) | Bootstrapper |
| `bootstrap_skipped` (v4.2) | User typed `proceed without library` at `figma-designer`'s Pre-Intake Check #2 | `figma-designer` |
| `bootstrap_with_defaults` (v4.2) | Bootstrapper ran with Material defaults because no fingerprint existed | Bootstrapper |
| `journey_structure_inferred` (v4.3) | Consumer agent read an old-format PRD (no `schema_version: v4.3`); journey was inferred from loose user-stories section | Consumer agent (`lo-fi-designer` / `figma-designer` / `design-engineer`) |
| `journey_structure_skipped` (v4.3) | User typed `proceed without journey spec` at `lo-fi-designer`'s Pre-Intake Check #2 | `lo-fi-designer` |

## Event-specific optional fields

| Event type | Extra fields |
|---|---|
| `gate_block` / `gate_clear` | `gate` (`"research_first"` / `"success_metrics"` / `"fingerprint"`), `reason` (one-line string) |
| `pivot` / `revise` | `delta_text` (the text user typed after `pivot —` / `revise —`) |
| `scope_refused` / `iteration_cap_hit` | `cap_hit` (string — which cap fired) |
| `fingerprint_stale_detected` | `stale_count` (int), `stale_refs` (string[]), `stale_reasons` |
| `fingerprint_refreshed` | `entries_kept` (string[]), `entries_replaced` (string[]), `entries_removed` (string[]) |
| `token_usage` (v4.1) | `tokens_in` (int), `tokens_cache_read` (int), `tokens_cache_write` (int), `tokens_out` (int), `model` (string), `cost_usd` (number), `cc_session_id` (string), `cc_window_start`/`cc_window_end` (ISO 8601), `source` (`"transcript"` / `"estimate"`) |
| `bootstrap_created` (v4.2) | `figma_file_url` (string), `component_count` (int), `feature_specific_added` (string[]), `tokens_source` (string or `null`), `fingerprint_status` (`fresh` / `stale_proceeded` / `defaulted`) |
| `bootstrap_extended` (v4.2) | `components_added` (string[]), `component_count_after` (int), `source_scanned` (string) |
| `bootstrap_recreated` (v4.2) | `previous_file_url` (string), `archived_manifest_path` (string), `component_count` (int) |
| `bootstrap_skipped` (v4.2) | `reason` (string — usually `"user-opted-out"`) |
| `bootstrap_with_defaults` (v4.2) | `reason` (string — usually `"fingerprint-missing"`) |
| `journey_structure_inferred` (v4.3) | `prd_path` (string), `prd_schema_version` (string — usually `null` or pre-v4.3) |
| `journey_structure_skipped` (v4.3) | `prd_present` (bool), `reason` (string — usually `"user-opted-out"`) |

## Session ID format

`s_YYYYMMDD_NNNN` — example: `s_20260524_0001`. Counter resets at midnight UTC. Whoever fires the FIRST event of a session generates it; all downstream entries reuse it. Sessions crossing midnight keep the original session_id.

## Privacy + retention

- No rotation. File grows append-only. Real-world projects stay under 5MB even after years.
- Raw paths logged. No hashing, no redaction.
- File is gitignored by default.

## Reading the ledger

Use [`/agent-harry-audit`](../commands/agent-harry-audit.html) — the only intended user-facing read surface. Direct JSONL inspection is supported but not required.

## Source

Authoritative schema lives in `templates/SHARED_CONTEXT.md` § Audit Ledger.

---

_Current as of v4.3._
