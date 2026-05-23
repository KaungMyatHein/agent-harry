---
title: Handoff Engineer
parent: Agents
nav_order: 14
description: "Dev specs, design tokens, component contracts for engineering handoff."
---

# Handoff Engineer

> The agent that turns design output into engineering-ready specs — component contracts, design tokens, prop signatures, state diagrams. Bridges the design-to-build gap.

## What it does

Takes the design output (figma-designer hi-fi or design-engineer prototype) and produces structured specs engineers can implement against. Component-level contracts. Token exports. State machines. Accessibility annotations. Edge case documentation.

## When to use it

- Before engineering implementation, when you want explicit contracts.
- For component library extraction — new components flagged by lo-fi-designer get full specs here.
- When the team needs a spec doc to estimate or review against.

## When NOT to use it

- Engineering has their own spec format and prefers to write specs themselves.
- The design is still in flux → finalize first, then spec.

## What it asks you at intake

- Source: figma-designer handoff, design-engineer prototype, or both?
- Spec format: Markdown, structured JSON, Storybook stories?
- Scope: full flow, specific components, or just new components?

## What you get back

Handoff at `./design-workspace/<project>/spec-<feature>.md`:

- Per-component spec (props, states, variants, contracts)
- Design tokens used + token export path
- State machines for stateful components
- Accessibility notes
- Edge cases documented

## Best practices

- **Spec new components fully.** Existing DS components only need a reference; new ones need props, states, variants.
- **Match your team's format.** Markdown is universal; Storybook is great if you're already using it.

## Common mistakes

- Specing every component when most are DS-standard.
- Spec drift — handoff specs that don't match the final design.

## Costs and time

~$0.40-0.80

## What runs before / after

```
figma-designer (or design-engineer) → handoff-engineer → engineering implementation
```

## Related

- [`figma-designer`](figma-designer.html), [`design-engineer`](design-engineer.html) — upstream sources
- [`lo-fi-designer`](lo-fi-designer.html) — names the new components handoff-engineer specs

---

_Current as of v4.0._
