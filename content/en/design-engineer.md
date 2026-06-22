# Design Engineer

`design-engineer` · **Phase:** Deliver · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** A pretty mockup that can't be clicked has fooled every stakeholder you've ever had — and then died in handoff.
- **Hook B —** Approved lo-fi in, a runnable prototype in your real stack out — all 5 states wired as routes you can click through.
- **Hook C —** What does your design feel like when it's empty, loading, broken, and at the edge — not just full and perfect?

## TL;DR
`design-engineer` builds a production-ready frontend prototype from an approved lo-fi layout. It writes real, runnable code in your project's actual stack with dummy data, and wires up all five states — empty, loading, populated, error, and edge — as toggle-able routes you can actually click through.

## What it does
It reads the lo-fi-designer handoff (the approved layout) and turns it into real frontend code — not a throwaway mockup. The code runs in your project's actual stack, so the prototype behaves like the real thing.

It treats prototype code like real code. That means all five states are built, not just the happy path: empty, loading, populated, error, and edge. Each one is wired as a toggle-able route, so you and your team can click straight to "what does this look like while loading?" or "what does the error state say?" without faking it.

It fills the screens with dummy data so the prototype is alive and explorable, while staying honest that the data isn't real.

It proposes. You run it, click through it, and refine — it's a prototype for validating the design in motion, not an auto-merge into production.

## When to reach for it
- A lo-fi layout has been approved and you want a clickable prototype in your real stack — not a static image.
- You need to pressure-test all five states (empty, loading, populated, error, edge), not just the happy path.
- You want something the team can actually interact with before committing to build.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| Approved lo-fi-designer handoff + the project's actual frontend stack | Real, runnable frontend code with all 5 states wired as toggle-able routes, populated with dummy data |

## Where it sits in the pipeline
It runs in the Deliver phase, after lo-fi-designer and only after the Success-Metrics Gate has cleared. It runs parallel to figma-designer — same approved lo-fi, two surfaces (code vs Figma). Its prototype is what accessibility-auditor and usability-tester later test against.

## Try it
```
"Use the design-engineer agent to build a runnable prototype of the approved lo-fi in our stack, with all 5 states as routes."
```
