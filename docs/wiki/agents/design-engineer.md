---
title: Design Engineer
parent: Agents
nav_order: 12
description: "Runnable code prototype in your stack with all 5 states wired up."
---

# Design Engineer

> Takes the lo-fi handoff and builds a production-quality frontend prototype in your project's actual stack, with dummy data, all 5 states (empty/loading/populated/error/edge), and a mock API layer.

## What it does

Generates real code in your stack — Next.js, SwiftUI, Flutter, etc. Routes accessible via toggle parameters (`?state=empty` etc). DS-tokens applied, no magic hex. Mock API with realistic 800ms delays. The result is demoable to stakeholders and usable as the visual reference engineering builds against.

In v4.0+, it auto-discovers existing code paths in the feature area from the PRD and lo-fi handoff (e.g., `app/cart/page.tsx` for a checkout flow). Surfaces them at intake transparently; you can override.

In v4.3+, when the lo-fi handoff carries v4.3 journey fields, routes are organized **per journey**: `/<feature-slug>` for the primary journey, `/<feature-slug>/<nested-journey-id>` per nested journey. Mock data demonstrates **every failure-recovery path** from the PRD (not just the happy path) so a reviewer can click through and see how the persona's failures get handled. UI copy reflects the persona's task language alongside fingerprint's `copy_tone`. The prototype README gains a **Persona & Journey** section with the user-story intent and routes-by-journey table.

## When to use it

- After lo-fi is approved, when you want runnable code (not just Figma).
- For stakeholder demos where running > visuals.
- When engineering wants a reference implementation before estimating.

## When NOT to use it

- You want Figma frames first → use `figma-designer`.
- You want production code → this is prototype-grade. Engineering still implements the real thing.

## What it asks you at intake

Pre-intake fingerprint check fires first. After that:

1. Lo-fi artifact (or skip with single-layout fallback)?
2. Polish bar — D2 (production-visual, default) or D3 (full polish, +30% time)?
3. Stack confirmation (auto-detected, you confirm).
4. (v4.0) Auto-discovered code paths surfaced for review — accept or override.

## What you get back

Code in `<project>/prototypes/<feature>/` plus a handoff pointer at `./design-workspace/<project>/prototype-<feature>.md` with:

- File manifest (every file written)
- Routes (how to view each state — **(v4.3) organized by journey**)
- Mock API path
- Components used (DS-existing vs new)
- Fingerprint anchors applied + discovered code paths studied
- **(v4.3) Persona & Journey** section (user-story intent + per-journey route table + failure-recovery toggle list)
- **(v4.3) Persona-aware copy decisions table** — notable label/CTA/empty/error copy + rationale
- **(v4.3) `routes_by_journey` frontmatter** with `failure_recovery_toggles[]` so a reviewer knows which `?state=` params demonstrate each PRD `failure_exit`

## Best practices

- **Default to D2 polish.** D3 only when stakeholder polish matters.
- **One flow per invocation.** 3-5 screens.
- **Run it locally before approving.** Click through all 5 states.

## Common mistakes

- Building outside the `prototypes/` namespace — pollutes the main app.
- Skipping the loading state — must be real, not instant data.
- Asking for hi-fi visual mockups in code — that's `figma-designer`'s job.

## Costs and time

- D2 single-screen tweak: ~$0.20
- D2 multi-screen restructure: ~$0.50
- D3 polish pass: ~$0.30

## What runs before / after

```
lo-fi-designer → design-engineer → handoff-engineer (or usability-tester)
```

## Related

- [`figma-designer`](figma-designer.html) — parallel agent for Figma frames
- [`lo-fi-designer`](lo-fi-designer.html) — upstream
- [Product Fingerprint](../concepts/product-fingerprint.html) — pre-intake gate
- [Mode A vs Mode B](../concepts/mode-a-vs-mode-b.html)

---

_Current as of v4.3._
