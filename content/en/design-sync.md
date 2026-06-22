# Design Sync

`design-sync` · **Phase:** Deliver · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Your "design-to-code" tool guessed a component you don't have, and now the diff is a lie you have to unpick by hand.
- **Hook B —** A 1:1 mirror of your Figma file in code — every mapped node copied exactly, every unmapped one flagged as an honest GAP.
- **Hook C —** What if the tool that turns Figma into code refused, on principle, to invent anything it couldn't prove?

## TL;DR
`design-sync` mirrors an existing Figma file into code with 1:1 fidelity and zero hallucination. It looks every node up in a component bridge and emits only what's mapped — anything unmapped becomes an explicit GAP marker, never an invented component. It can also run a divergence report between an existing Figma file and existing code.

## What it does
It reads a Figma frame and, node by node, looks each one up in a component bridge — a map from Figma components to your real code components. If a node is mapped, it emits the real component. If it isn't, it does not guess: it drops an explicit GAP marker so you can see exactly what's missing and decide.

That "invents nothing" rule is the whole point. It copies what's mapped, marks what's not, and never papers over a gap with a plausible-looking component you don't actually have.

It also has a diff mode (`--mode diff`): point it at an existing Figma file and existing code, and it produces a divergence report showing where the two have drifted apart.

It is deliberately distinct from design-engineer and figma-designer, which *generate* new designs from a lo-fi handoff. `design-sync` doesn't synthesize — it mirrors. When Playwright is available, it uses screenshot verification to check the mirror against reality.

## When to reach for it
- You want to mirror an existing Figma file into code exactly, not generate a new design.
- You need an honest accounting of what's mapped vs. what's missing (GAP markers), with no invented components.
- You want a divergence report between a Figma file and the code that's supposed to match it.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| An existing Figma frame + a component bridge (via Figma MCP); Playwright for screenshot verification when available | Code emitting only mapped nodes, explicit GAP markers for the rest, or a Figma↔code divergence report (`--mode diff`) |

## Where it sits in the pipeline
It runs in the Deliver phase but is Gate-exempt — because it mirrors rather than synthesizes, it doesn't pass through the same generation gates as design-engineer and figma-designer. Requires Figma MCP; uses Playwright for screenshot verification when available.

## Try it
```
"Use the design-sync agent to mirror this Figma frame into code 1:1 and flag anything unmapped as a GAP."
```
