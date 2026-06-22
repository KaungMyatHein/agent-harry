# Information Architect

`information-architect` · **Phase:** Define · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Every screen looks fine on its own, and the whole product still feels like a mess. That gap is the bones.
- **Hook B —** Map the product's skeleton once — objects, navigation, every screen — before anyone sketches a single layout.
- **Hook C —** Who actually owns how all your features fit together? Right now, probably no one.

## TL;DR
The information-architect maps the whole product's structure before anyone designs a screen. It builds the object model, navigation hierarchy, screen inventory, and a product-wide action-priority system across all features in a release. It runs once per product or release to keep the product from feeling messy even when each screen is fine.

## What it does
It thinks in structure, not screens. Before any per-screen layout begins, it maps the bones of the whole product so the features fit together as one thing.

It defines the **object model** — the core things your product is about and how they relate. It lays out the **navigation hierarchy** — how people move through the product and where everything lives. It builds a **screen inventory** — the full list of screens the release needs, seen all at once. And it sets a **product-wide action-priority system** — which actions matter most, consistently, across every feature.

It exists to fill a real gap. The lo-fi-designer designs one feature at a time, and nobody else owns how all the features fit together. That missing owner is exactly why a product can feel "messy" even when each individual screen is fine. This agent is that owner.

It proposes the structure for you to review; it does not lock anything down on its own.

## When to reach for it
- PRDs exist for a release and you need cross-feature structure before per-screen layout.
- The product feels disjointed even though individual screens look okay.
- You need one shared object model, navigation, screen inventory, and action priority across all features.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| The PRDs for a release | An object model and navigation hierarchy |
| The set of features that ship together | A screen inventory and a product-wide action-priority system |

## Where it sits in the pipeline
It runs once per product or release, between the prd-author and the first lo-fi-designer run. The prd-author defines features one at a time; this agent stitches them into a single structure; then the lo-fi-designer takes that structure into per-feature layout. It is the connective layer that makes the parts add up to a coherent whole.

## Try it
```
"Use the information-architect agent to map the object model, navigation, and screen inventory for this release before we start wireframing."
```
