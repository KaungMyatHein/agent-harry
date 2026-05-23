---
title: SHARED_CONTEXT Schema
parent: Reference
nav_order: 1
description: "Handoff format + per-agent frontmatter keys."
---

# SHARED_CONTEXT Schema

Reference for the handoff format every agent produces and the per-agent frontmatter keys.

## Handoff structure

Every agent's output starts with this 3-layer structure:

1. **Layer 0** — Executive Summary (human-readable, always first)
2. **Frontmatter** — machine-readable YAML
3. **Long-form body** — for AI handoff, not human review

## Executive Summary (mandatory)

```markdown
## Executive Summary

| Metric | Value |
|---|---|
| Agent | <agent-name> |
| Phase | discovery / define / deliver / cross-cutting |
| Confidence | high / medium / low |
| Inputs analyzed | <count + 1-line type breakdown> |
| Key outputs | <count of insights / gaps / decisions> |
| Recommendation | <one phrase> |

**TL;DR (3 bullets max):**
- <single most important finding>
- <second most important>
- <single open question or blocker>

**Next step:** <one sentence, names the next agent or user action>
```

## Frontmatter

```yaml
---
agent: <agent-name>
phase: discovery | define | deliver | cross-cutting
project_slug: <kebab-case identifier>
feature_slug: <kebab-case identifier or null>
session_id: s_YYYYMMDD_NNNN
started: <ISO 8601 UTC>
completed: <ISO 8601 UTC>
inputs_used:
  - <file or context source>
files_written:
  - <relative path>
confidence: high | medium | low
open_questions:
  - <question that blocks next phase>
recommended_next_agent: <agent-name or "user-decision">
tokens_estimated: <rough number>
---
```

## Per-agent extra frontmatter keys

| Agent | Extra keys |
|---|---|
| `lo-fi-designer` (v4.0) | `entry_point` (object), `fingerprint_compliance` (per-variant), `fingerprint_status` (`fresh`/`stale_proceeded`/`skipped`) |
| `design-engineer` (v4.0) | `polish_bar`, `routes`, `mock_api_path`, `fingerprint_status`, `fingerprint_anchors_applied`, `discovered_code_paths` |
| `figma-designer` (v4.0) | `figma_file_url`, `figma_screens`, `ds_source`, `ds_status`, `fingerprint_status`, `fingerprint_anchors_applied` |
| `handoff-engineer` | `design_tokens_path`, `component_specs` |
| `product-fingerprint-curator` (v4.0) | `last_validated` (ISO 8601 UTC), `curator_session` |

## Output caps (token budget)

- Executive Summary: 1 stat-card + 3 TL;DR bullets + 1 next-step line, never longer
- Insights: max 6 per run
- Gaps: max 4
- Critique concerns: max 4
- Decision table rows: max 10
- Open questions: max 5

## Date format

All timestamps use **ISO 8601 UTC** — `2026-05-24T12:30:00Z`.

## Slugs

`project_slug` and `feature_slug` are **kebab-case** (lowercase, hyphens). Derived from the project name and feature description. The slug rules are documented in `templates/SUBAGENT_AUDIT_PROTOCOL.md` Step 1.

## Source

Authoritative schema lives in `templates/SHARED_CONTEXT.md` in the main repo.

---

_Current as of v4.0._
