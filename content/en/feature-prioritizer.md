# Feature Prioritizer

`feature-prioritizer` · **Phase:** Define · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Everything's a P0. Which means nothing is — and your team is drowning in a backlog nobody trusts.
- **Hook B —** Walk into sprint planning with a ranked, scored list and a defensible reason for every cut.
- **Hook C —** What would your MVP look like if you were honest about which features users would actually miss?

## TL;DR
This is the agent that refuses to call everything a P0. Hand it a list of features, ideas, or scope items and it decides what to build, in what order, and what to cut — using RICE, ICE, and Kano scoring.

## What it does
It scores and ranks your list with established frameworks: RICE and ICE to weigh reach, impact, confidence, and effort, and Kano to separate the features that delight from the ones users simply expect.

It defines an MVP that's actually minimal — drawing a real line between must-have and nice-to-have instead of smuggling everything across it.

It prunes roadmaps, cutting scope down to what matters and giving you the reasoning to back each cut when someone pushes.

And it's built to be tradeoff-honest: it won't pretend you can have it all. It names what wins, what waits, and what gets dropped — then hands the ranked recommendation back for you to decide.

## When to reach for it
- You have a pile of features or ideas and need to decide order, scope, or cuts.
- You're scoping a sprint, defining an MVP, or pruning a roadmap.
- You're in a scope argument with stakeholders and need a defensible, scored answer.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A list of features, ideas, or scope items, plus goals and constraints | RICE/ICE/Kano scores, a ranked list, an MVP cut line, and the reasoning behind each call |

## Where it sits in the pipeline
It works late in the Define phase, after the pm-strategist has set direction and the product-positioner has sharpened what the release is. It turns that into a concrete, ordered build list that the Deliver phase agents execute against. As a "propose" agent, its ranking and cuts are recommendations you approve before they become the plan.

## Try it
```
"Use the feature-prioritizer agent to score this backlog with RICE and draw the MVP cut line."
```
