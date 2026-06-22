# Competitive Analyst

`competitive-analyst` · **Phase:** Discovery · **Model:** sonnet · **Decision authority:** autonomous

### Hooks
- **Hook A —** "But that's how Competitor X does it" just ended your design review. Again. With no data to push back.
- **Hook B —** Walk out of every teardown knowing exactly where the category is weak — and where you can win.
- **Hook C —** Your three biggest competitors all share the same blind spot. Have you found it yet?

## TL;DR
This is the agent that studies how everyone else solved the problem before you commit to your own answer. Part skeptic, part archaeologist — it teardowns competitors, audits UI patterns, and maps where the gaps and the opportunities really are.

## What it does
It runs competitor teardowns: pulling apart how rivals have solved a similar problem, what they got right, and where they left the door open.

It audits UI patterns across the category, so you can see which conventions are genuinely expected by users versus which are just copied habits nobody questioned.

It does feature gap analysis — lining up what exists in the market against what doesn't — so you can spot the white space worth owning.

And it handles category positioning: where each player sits, what story they tell, and where there's room for you to stand apart instead of blending in.

## When to reach for it
- You're entering a new product area and need the lay of the land fast.
- You need to defend a design decision against "but X does it this way" with real evidence.
- You suspect there's a gap in the category but can't yet name it.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A set of competitors or a category to study, plus the problem you're solving | Teardowns, UI pattern audits, a feature gap map, and category positioning |

## Where it sits in the pipeline
It runs in Discovery, usually alongside or just after the discovery-researcher — the researcher frames the problem, this agent maps how the rest of the market answers it. Its gap analysis and positioning read feed directly into the Define phase, especially the pm-strategist and product-positioner.

## Try it
```
"Use the competitive-analyst agent to teardown our top three rivals and find the feature gaps."
```
