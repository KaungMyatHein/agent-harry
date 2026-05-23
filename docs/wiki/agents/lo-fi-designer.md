---
title: Lo-Fi Designer
parent: Agents
nav_order: 10
description: "Userflows + three ASCII layout variants for a feature."
---

# Lo-Fi Designer

> Turns a chosen concept into a userflow plus three quick ASCII layout variants (Primary, Alternative, Risky) so you can pick a layout before any pixel-level work.

## What it does

Maps the userflow (Figjam or Mermaid), sketches 3 schematic layouts with rationale, lists DS components used and new components needed. Output is the handoff `figma-designer` or `design-engineer` reads to start hi-fi work.

In v4.0+, the Primary layout anchors on the **entry-point screen** (where the user is coming from) FIRST, then on fingerprint composition patterns. Risky may diverge from anti-patterns but must annotate the divergence.

## When to use it

- After a concept is chosen, before any hi-fi design or code.
- When you want to compare 2-3 layout directions before committing.
- To know which DS components to plan for.

## When NOT to use it

- You already know the layout and want to skip to hi-fi → go straight to `figma-designer` or `design-engineer`.
- You haven't picked a concept yet → use `ideation-facilitator` first.

## What it asks you at intake

The pre-intake [Product Fingerprint](../concepts/product-fingerprint.html) check fires first. After that, four questions:

1. **Userflow Figjam** — paste URL, or have the agent generate one, or fall back to ASCII Mermaid.
2. **Design system** — confirm from SHARED_CONTEXT or paste a new one.
3. **Stack** — auto-detected; confirm or override.
4. **Entry point** (v4.0) — Figma node URL (you paste) OR code path (auto-discovered from PRD scope) OR "new top-level entry."

## What you get back

Handoff at `./design-workspace/<project>/lo-fi-<feature>.md` containing:

- Userflow (Figjam URL or Mermaid)
- 3 ASCII layouts with rationale
- Per-layout component table (DS-existing vs new)
- Fingerprint compliance per variant
- Entry-point summary

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

_Current as of v4.0._
