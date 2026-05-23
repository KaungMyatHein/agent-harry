---
title: /agent-harry-fingerprint
parent: Commands
nav_order: 5
description: "Create or refresh the project's product-fingerprint.md (v4.0)."
---

# /agent-harry-fingerprint

> Invokes the [`product-fingerprint-curator`](../agents/product-fingerprint-curator.html) to create the project's visual fingerprint (first run) or refresh it after the product evolves (with `--refresh`).

## What it does

1. Detects whether `<project-root>/product-fingerprint.md` already exists.
2. Routes to the curator in Mode A (no flag, file missing) or Mode B (`--refresh`, file exists).
3. The curator asks for 3-7 Figma frames, pulls them, extracts the visual + composition vocabulary, writes the file.

## When to use it

- **First feature in a new project** — run before any design work.
- **After a rebrand or redesign** — `--refresh` to re-curate.
- **A Deliver agent halted with "fingerprint stale"** — refresh first, then re-invoke.
- **Designer eyeballs the fingerprint and feels it no longer represents the product** — refresh.

## How to invoke

```
/agent-harry-fingerprint            # first curation (refuses if file exists)
/agent-harry-fingerprint --refresh  # re-curate existing fingerprint
```

| Invocation | Mode |
|---|---|
| no flag | Mode A — first curation; refuses if file exists |
| `--refresh` | Mode B — refresh; refuses if no file exists |

## What you get

A file at `<project-root>/product-fingerprint.md` containing:

- 3-7 curated Figma references with role + "why exciting"
- Visual language synthesis (density, color, typography, copy tone, etc.)
- Composition patterns table
- 3-5 anti-patterns
- Stop Gate confirmation flow

After your `y`, the file is locked in. Every future `lo-fi-designer` / `figma-designer` / `design-engineer` invocation reads it at intake.

## Hard rules

- Do NOT overwrite an existing fingerprint without `--refresh` + user confirmation.
- Curator refuses to run if Figma MCP is not connected.
- Curator preserves entries the user keeps in refresh mode — doesn't auto-delete.

## Cost

- First curation: ~$0.50
- Refresh with mostly-unchanged refs: ~$0.20
- Refresh with all refs replaced: ~$0.50

## Related

- [`product-fingerprint-curator`](../agents/product-fingerprint-curator.html) — the agent invoked
- [Product Fingerprint](../concepts/product-fingerprint.html) — the why

---

_Current as of v4.0._
