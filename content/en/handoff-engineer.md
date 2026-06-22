# Handoff Engineer

`handoff-engineer` · **Phase:** Deliver · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Every "quick question from dev" during build is a hole in your handoff doc — and you're the one answering them at 6pm.
- **Hook B —** A spec engineers can build straight from: design tokens documented, component contracts defined, edge cases enumerated, accessibility annotated.
- **Hook C —** What does your design look like to the developer who's never been in the Figma file and just wants to ship it correctly?

## TL;DR
`handoff-engineer` prepares your designs for engineering. It writes the spec, documents design tokens, defines component contracts, enumerates edge cases, and adds accessibility annotations — the dev handoff doc that answers the questions before they're asked. It's a designer who codes and knows what dev actually needs.

## What it does
It's a systems-thinker built for the moment designs leave design and enter engineering. It writes the dev handoff doc — the spec a developer can build from without a back-and-forth.

Concretely, it handles spec writing, design token documentation, and component contract definition — so the boundaries and props of each component are explicit, not implied.

It enumerates edge cases, because the gaps between the happy-path frames are where build time and bugs hide. And it adds accessibility annotations, so the accessibility decisions made in design survive into code.

It proposes the handoff package. You review it before it becomes the source dev builds from.

## When to reach for it
- You're about to hand designs to engineering and need a spec they can build from cold.
- You need design tokens documented and component contracts defined explicitly.
- You want edge cases enumerated and accessibility annotations written before tickets get cut.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| Finalized designs/prototype, design tokens, component set, and accessibility decisions | A dev handoff doc: spec, documented design tokens, component contracts, enumerated edge cases, and accessibility annotations |

## Where it sits in the pipeline
It runs at the end of the Deliver phase — after the designs are built and validated by usability-tester and accessibility-auditor — and before tickets are written. It's the bridge between "designed and validated" and "engineering can start."

## Try it
```
"Use the handoff-engineer agent to write the dev handoff doc: spec, tokens, component contracts, edge cases, and a11y annotations."
```
