# PM Metrics Architect

`pm-metrics-architect` · **Phase:** cross-cutting · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** "We don't actually know if this is working" is the most expensive sentence in product. It usually means nobody designed the measurement.
- **Hook B —** One number to chase, three to watch, one to fear — plus the tracking plan that makes them real.
- **Hook C —** What if the reason your dashboard lies to you is that no one ever decided what it should be measuring?

## TL;DR
The pm-metrics-architect designs how a product or feature gets measured — north-star refinement, full metrics dashboards (north-star plus input, health, and counter-metrics), OKR planning, and tracking plans with events, properties, and instrumentation. It's the agent that clears the Success-Metrics Gate before Define crosses into Deliver.

## What it does
This agent is a skeptical instrumentation lead. Its mantra: one number to chase, three to watch, and one to fear.

It covers four jobs:
- **North-star refinement** — pinning down the single metric that best captures real value delivered.
- **Metrics dashboards** — pairing the north-star with input metrics (the levers you can move), health metrics (the things that must not break), and counter-metrics (the number to fear if you over-optimize).
- **OKR planning** — turning the metric picture into objectives and measurable key results.
- **Tracking plans** — the events, properties, and instrumentation that make all of the above actually trackable.

Reach for it when a feature is being scoped, when "we don't know if this is working" gets said out loud, or when existing instrumentation is producing answers nobody trusts.

It is the **gate-clearer for the Success-Metrics Gate**: before Define→Deliver, this agent makes sure success has a definition and a way to be measured, so the team isn't building blind.

## When to reach for it
- A feature is being scoped and you need to decide how its success gets measured.
- Someone says "we don't know if this is working" and the data can't answer.
- Existing instrumentation is producing numbers no one trusts.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A feature or product being scoped, current instrumentation, and the goal it's meant to serve | Refined north-star, a metrics dashboard (north-star + input + health + counter-metrics), OKRs, and a tracking plan (events, properties, instrumentation) |

## Where it sits in the pipeline
The pm-metrics-architect sits at the Success-Metrics Gate between Define and Deliver. Define work names what's being built; this agent makes sure it's measurable before Deliver begins. The orchestrator enforces this gate, so Deliver work shouldn't proceed until it's cleared.

## Try it
```
"Use the pm-metrics-architect agent to design a north-star, dashboard, and tracking plan for our new activation flow."
```
