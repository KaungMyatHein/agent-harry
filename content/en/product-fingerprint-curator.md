# Product Fingerprint Curator

`product-fingerprint-curator` · **Phase:** cross-cutting · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** New feature work that feels "bolted on" isn't a talent problem — it's a missing fingerprint. Nobody told the screen what the product looks like.
- **Hook B —** Turn 3–7 references you love into one fingerprint every downstream designer reads — so every new feature feels native from the first frame.
- **Hook C —** What if your product already had a visual language, and all it needed was someone to write it down?

## TL;DR
The product-fingerprint-curator captures a product's actual visual language so new feature work matches it instead of feeling bolted on. From 3–7 designer-picked "exciting" Figma references, it synthesizes a project-level `product-fingerprint.md` covering visual signals, composition patterns, and mandatory anti-patterns — read by the lo-fi-designer, figma-designer, and design-engineer at intake.

## What it does
This agent is a pattern-extractor. It looks at references a designer actually finds exciting and pulls out the signals that define how the product should look and feel, then records them so every downstream agent works from the same picture.

It synthesizes a project-level fingerprint covering:
- **Visual language signals** — density, color stance, typography, copy tone, motion, imagery, corner radius, shadow, and spacing.
- **Composition patterns** — page scaffolding, empty-state, form, data-display, CTA placement, and confirmation pattern.
- **Mandatory anti-patterns** — the things this product must *not* do, made explicit so they don't sneak back in.

It curates from **3–7 designer-picked Figma references** rather than averaging the whole internet, so the fingerprint reflects a real point of view.

Invoke it when no `product-fingerprint.md` exists at the project root, when the Define→Deliver boundary fires without one, or when the user runs `/agent-harry-fingerprint`.

## When to reach for it
- No `product-fingerprint.md` exists at the project root yet.
- The Define→Deliver boundary fires and there's no fingerprint to hand downstream agents.
- You run `/agent-harry-fingerprint` to set or refresh the product's visual language.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| 3–7 designer-picked "exciting" Figma references | `product-fingerprint.md` — visual language signals, composition patterns, and mandatory anti-patterns |

## Where it sits in the pipeline
The curator runs cross-cutting, typically at the Define→Deliver boundary, before high-fidelity work begins. The `product-fingerprint.md` it writes is read by `lo-fi-designer`, `figma-designer`, and `design-engineer` at intake, so every new feature matches the product's real visual language instead of drifting.

## Try it
```
"Use the product-fingerprint-curator agent to build a product-fingerprint.md from these 5 Figma references."
```
