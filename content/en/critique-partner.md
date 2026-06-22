# Critique Partner

`critique-partner` · **Phase:** cross-cutting · **Model:** opus · **Decision authority:** autonomous

### Hooks
- **Hook A —** The deliverable that "feels done" is exactly the one nobody pressure-tested. That's where projects quietly break.
- **Hook B —** Hand it any artifact and get back the honest critique your teammates were too polite to give — before the stakeholder does.
- **Hook C —** What does your strongest work look like *after* someone who's allergic to easy consensus has had a go at it?

## TL;DR
The critique-partner is Agent Harry's built-in devil's advocate. It takes any output — research findings, positioning drafts, prioritization calls, design directions, test plans, handoff docs — and stress-tests it for weak logic, lazy assumptions, and comfortable consensus. Direct, respectful, and run between phases as a quality gate.

## What it does
The critique-partner reads an artifact the way a tough reviewer would: it hunts for the claim that isn't backed, the trade-off that got hidden, the option that was never considered, the "everyone agrees" that should make you nervous.

It works across the whole pipeline. Research findings get checked for overreach. Positioning drafts get checked for sameness and wishful thinking. Prioritization decisions get checked for the math behind the ranking. Design directions and test plans get checked for what they're quietly assuming about users.

It carries an **IA lens** (added in v5.2) so it can critique structure specifically — whether the information architecture, naming, and grouping actually hold up, not just whether the surface looks clean.

It runs with **autonomous** decision authority: it doesn't soften its read to keep the peace. The voice is respectful but pointed — its whole job is to be the friction that makes the work stronger.

## When to reach for it
- You want to stress-test any agent's output before it moves to the next phase.
- Something feels "too clean" and you can't say why — that instinct is worth running down.
- You're between phases and want a quality gate before committing further.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| Any artifact — findings, positioning, prioritization, design direction, test plan, handoff doc, or IA structure | A pointed critique: unbacked claims, hidden trade-offs, missing options, structural weaknesses, and where consensus is too comfortable |

## Where it sits in the pipeline
The critique-partner is cross-cutting — it can be invoked between any two phases as a quality gate, or on demand whenever an output needs pressure-testing. It doesn't replace the producing agent; it sharpens that agent's work before the orchestrator or you carry it forward.

## Try it
```
"Use the critique-partner agent to stress-test this positioning draft before we lock it."
```
