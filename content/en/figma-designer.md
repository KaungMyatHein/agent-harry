# Figma Designer

`figma-designer` · **Phase:** Deliver · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Your lo-fi got approved, and now you're staring at a blank Figma file at 11pm, rebuilding boxes by hand. Stop.
- **Hook B —** Approved layout in, real hi-fi Figma frames out — built from your actual Design System, with real PRD content, not lorem ipsum.
- **Hook C —** What if the gap between "the team likes the lo-fi" and "here are the hi-fi screens" was one sentence?

## TL;DR
`figma-designer` turns an approved lo-fi layout into real hi-fi Figma frames. It reads the lo-fi-designer handoff and the PRD, plugs in your Design System's actual components, fills in real content, applies your color and type tokens, and lays out the key states — so you get shippable-looking screens, not a mockup of a mockup.

## What it does
It reads two things you already have: the lo-fi-designer handoff (the approved layout) and the PRD (what the screen is actually for). Then it resolves the Design System you point it at, so every frame is built from real component instances — not redrawn rectangles.

From there it generates Figma frames where the colors and typography come from your design tokens, the copy comes from the PRD instead of placeholder text, and the important states are present (not just the happy path).

It produces Figma designs — not code. That's the deliberate split: `figma-designer` works the Figma side, `design-engineer` works the code side, and they run in parallel from the same approved lo-fi.

It proposes. You review the frames, push back, and refine — it doesn't merge anything into your source of truth on its own.

## When to reach for it
- A lo-fi layout has been approved and you want hi-fi Figma screens (not code) for the chosen flow.
- You have a real Design System you want every frame built from, instance by instance.
- You want the screens populated with real PRD content and token-driven styling, not placeholders.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| Approved lo-fi-designer handoff + PRD + a Design System source (via Figma MCP) | Hi-fi Figma frames with real DS component instances, real content, token-applied colors/type, and key states |

## Where it sits in the pipeline
It runs in the Deliver phase, after lo-fi-designer and only after the Success-Metrics Gate has cleared. It runs parallel to design-engineer — same approved lo-fi, two surfaces (Figma vs code). It requires Figma MCP and a Design System source to point at.

## Try it
```
"Use the figma-designer agent to turn the approved lo-fi into hi-fi Figma frames using our Design System."
```
