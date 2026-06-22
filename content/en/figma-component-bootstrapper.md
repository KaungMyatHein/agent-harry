# Figma Component Bootstrapper

`figma-component-bootstrapper` · **Phase:** cross-cutting · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** No component library means your "design" is a pile of loose frames and groups — and every future screen pays the tax.
- **Hook B —** Get a real, instanceable Figma component library for your project without hand-building a single button.
- **Hook C —** What if the first thing a new project got wasn't a blank canvas, but ~25 components already speaking its visual language?

## TL;DR
The figma-component-bootstrapper gives a project a real Figma component library when it doesn't have one yet. Without it, `figma-designer` falls back to drawing frames and groups instead of instancing true components. It builds a baseline set of around 25 components — buttons, inputs, containers, feedback, navigation primitives — plus any feature-specific components the current lo-fi handoff names.

## What it does
When a project has no published Figma component library, this agent creates one so future design work is built from real, reusable components instead of disposable frames.

It produces two things:
- **A Figma file** containing a baseline component set (~25 components across buttons, inputs, containers, feedback, and navigation primitives), plus components specific to whatever the current lo-fi handoff calls for.
- **A `project-component-library.md` manifest** that `figma-designer` reads on every future feature, so it always knows what components already exist.

It sources visual signals from `product-fingerprint.md` (**mandatory**) so the components match the product's actual look, and enriches them with code tokens — Tailwind config, CSS variables, or JSON — when those are present.

It **auto-detects create vs extend mode**: if no library exists it creates one; if one already exists it extends it instead of duplicating work.

## When to reach for it
- The project has no published Figma component library yet.
- `figma-designer` keeps falling back to frames and groups because it has nothing to instance.
- A new lo-fi handoff names feature-specific components that don't exist in Figma yet.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| `product-fingerprint.md` (mandatory), the current lo-fi handoff, and code tokens (Tailwind / CSS variables / JSON) when available | A Figma file with ~25 baseline components plus feature-specific ones, and a `project-component-library.md` manifest |

## Where it sits in the pipeline
The bootstrapper runs cross-cutting, after a product fingerprint exists and a lo-fi handoff names what's needed, and before `figma-designer` builds high-fidelity screens. The manifest it writes becomes the library `figma-designer` reads on every future feature.

## Try it
```
"Use the figma-component-bootstrapper agent to create a baseline Figma component library for this project from our product-fingerprint."
```
