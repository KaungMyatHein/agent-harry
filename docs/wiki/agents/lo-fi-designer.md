---
title: Lo-Fi Designer
parent: Agents
nav_order: 10
description: "Userflows + three ASCII layout variants for a feature."
---

{% include agent-hero.html slug='lo-fi-designer' %}


# Lo-Fi Designer

> Turns a chosen concept into a userflow plus three quick ASCII layout variants (Primary, Alternative, Risky) so you can pick a layout before any pixel-level work.

## What it does

Maps the userflow (Figjam or Mermaid), sketches 3 schematic layouts with rationale, lists DS components used and new components needed. Output is the handoff `figma-designer` or `design-engineer` reads to start hi-fi work.

In v4.0+, the Primary layout anchors on the **entry-point screen** (where the user is coming from) FIRST, then on fingerprint composition patterns. Risky may diverge from anti-patterns but must annotate the divergence.

In v4.3+, when a structured PRD exists (with `schema_version: v4.3`, `personas[]`, and `sub_features[].primary_journey`), the agent reads the journey directly: persona is resolved from PRD (no need to ask "who's the user"), entry/exit points come from the PRD's `primary_journey`, and one canonical sub-flow design is produced per `nested_journey`. The handoff includes a **Journey Map** section that explicitly shows persona + intent + entry → primary → success/failure exits + nested-journey branch points.

## When to use it

- After a concept is chosen, before any hi-fi design or code.
- When you want to compare 2-3 layout directions before committing.
- To know which DS components to plan for.

## When NOT to use it

- You already know the layout and want to skip to hi-fi → go straight to `figma-designer` or `design-engineer`.
- You haven't picked a concept yet → use `ideation-facilitator` first.

## What it asks you at intake

Two pre-intake checks fire first:
- [Product Fingerprint](../concepts/product-fingerprint.html) — must exist + be fresh (or you opt out via `skip fingerprint`).
- **PRD journeys (v4.3)** — refuses if no PRD exists; opt-out via `proceed without journey spec`. Old-format PRDs degrade gracefully (warning + `journey_structure_inferred: true`), no refusal.

After both checks pass, four questions:

1. **Userflow Figjam** — paste URL, or have the agent generate one, or fall back to ASCII Mermaid.
2. **Design system** — confirm from SHARED_CONTEXT or paste a new one.
3. **Stack** — auto-detected; confirm or override.
4. **Entry point** (v4.0) — Figma node URL (you paste) OR code path (auto-discovered from PRD scope) OR "new top-level entry." **In v4.3, skipped when the PRD's `primary_journey.entry_points` is populated** — the PRD becomes canonical.

## What you get back

Handoff at `./design-workspace/<project>/lo-fi-<feature>.md` containing:

- Userflow (Figjam URL or Mermaid)
- 3 ASCII layouts with rationale (Primary, Alternative, Risky) — for the **primary journey**
- Per-layout component table (DS-existing vs new)
- Fingerprint compliance per variant
- Entry-point summary
- **(v4.3) Journey Map section** — persona + intent + entry → primary → success/failure exits + nested-journey branch points (Mermaid or ASCII)
- **(v4.3) Nested journey designs** — one canonical sub-flow design per `nested_journey` in the PRD (no competing alternatives — nested journeys are sub-flows within the chosen primary layout)
- **(v4.3) Frontmatter additions:** `journey_source`, `persona_resolved`, `sub_feature` (with primary_journey + nested_journey_designs)

## Best practices

- **Confirm the entry point.** Primary's whole point is continuity from the entry-point screen.
- **Don't pick Risky just to be bold.** It exists to flush out divergence questions; only pick if rationale is compelling.
- **Read the component table.** It reveals build cost differences between layouts.

## Common mistakes

- Treating ASCII layouts as visual drafts. They're structure, not pixels.
- Skipping lo-fi to "save time." You'll pay it back when the engineer picks the wrong layout.

## Costs and time

~$0.20-0.40 per invocation; ~$0.10 per revise round; cap at 3 revises before pivoting.

## What runs before / after

```
ideation-facilitator (or chosen concept) → lo-fi-designer → figma-designer (Figma path)
                                                         OR design-engineer (code path)
```

## Related

- [Product Fingerprint](../concepts/product-fingerprint.html) — pre-intake check requirement
- [`figma-designer`](figma-designer.html), [`design-engineer`](design-engineer.html) — Deliver consumers
- [First Feature Walkthrough](../guides/first-feature-walkthrough.html) — shows lo-fi-designer in action with a `revise` round

---

_Current as of v4.3._
