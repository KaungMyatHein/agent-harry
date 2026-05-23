---
title: Figma Designer
parent: Agents
nav_order: 11
description: "Hi-fi Figma frames generated from the lo-fi handoff using your Design System."
---

# Figma Designer

> The Figma-side counterpart to design-engineer. Takes an approved lo-fi layout and produces hi-fi Figma frames with real DS component instances, real PRD content, and the declared state set per screen.

## What it does

In **Mode A**, generates fresh Figma frames for the full flow from the lo-fi handoff. All DS-instanced (not detached). Real content from PRD. Token-applied colors and typography. State coverage per screen. In **Mode B**, audits an existing Figma file against the lo-fi handoff: flow coverage, DS adherence, content realism, fingerprint divergence.

## When to use it

- After lo-fi is approved, when you want hi-fi Figma frames (not code).
- For designer handoff to a human designer who'll refine further.
- Parallel to or instead of `design-engineer` — pick whichever surface (Figma vs code) you need first.

## When NOT to use it

- Figma MCP isn't connected → can't run.
- You need shippable code → use `design-engineer` instead.
- The lo-fi handoff doesn't exist → run `lo-fi-designer` first.

## What it asks you at intake

Pre-intake fingerprint check fires first. After that, 6 questions:

1. Lo-fi artifact found?
2. PRD source for real content?
3. Design System — Figma library URL, code repo, tokens, or external system?
4. Figma destination — new file (in Drafts or a team) or existing file?
5. State coverage — default only, default+empty+error, or full 4-state?
6. MCP availability (hard refusal if missing).

## What you get back

Handoff at `./design-workspace/<project>/figma-hifi-<feature>.md` with:

- Figma file URL + per-screen node IDs + per-state node IDs
- DS source + status (resolved/defaulted/missing)
- Fingerprint anchors applied (density, corner_radius, copy_tone, composition patterns, anti-patterns respected)
- Mode B: fingerprint divergence section (max 4 findings, severity-ranked)

## Best practices

- **Always specify state coverage.** "Default + empty + error" is the default.
- **One flow per invocation.** 4-6 screens. Don't ask for "the whole onboarding."
- **Read the fingerprint anchors.** They explain why specific component variants were picked.

## Common mistakes

- Asking for prototype interactions (clickable transitions) — out of v1 scope.
- Detached instances → re-link them, don't accept the detachment.
- Skipping the lo-fi step.

## Costs and time

- Single-screen tweak: ~$0.10
- Multi-screen content refresh: ~$0.30
- Full re-render: ~$1.00+

## What runs before / after

```
lo-fi-designer → figma-designer → handoff-engineer (or design-engineer for code)
```

## Related

- [`design-engineer`](design-engineer.html) — parallel agent for code
- [`lo-fi-designer`](lo-fi-designer.html) — upstream
- [Product Fingerprint](../concepts/product-fingerprint.html) — pre-intake gate
- [Mode A vs Mode B](../concepts/mode-a-vs-mode-b.html)

---

_Current as of v4.0._
