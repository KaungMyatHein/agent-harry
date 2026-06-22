# PRD Author

`prd-author` · **Phase:** Define · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Your prioritized backlog is a list of titles. Nobody can build a title.
- **Hook B —** One clean PRD per "in" feature, written straight from your priorities — a build-ready spec pack in one pass.
- **Hook C —** What if every feature you said "yes" to already had its requirements written down, waiting for you?

## TL;DR
The prd-author turns your prioritized backlog into real PRDs — one per feature you tagged "in." It writes each spec to your project workspace and hands back a manifest table you confirm before any Deliver work starts. It is JTBD-driven and ruthless about scope, so each PRD stays tight.

## What it does
It reads your prioritized backlog and walks the items tagged "in" — the sub-features that survived prioritization. For each one, it writes a focused PRD anchored in the job to be done (JTBD), not a wish list. Scope discipline is the point: every PRD says what is in and, just as importantly, leaves out what is not.

Under the hood it invokes the `pm-execution:create-prd` skill per item, so each document follows a consistent, complete structure rather than freehand prose.

It writes one PRD per item to `./design-workspace/<project>/prds/`, so your specs live in the project, versioned alongside everything else.

Then it returns a manifest table — every PRD it produced, in one view — so you can confirm the set before any downstream Deliver work kicks off. It proposes; you approve.

## When to reach for it
- The Success-Metrics Gate has cleared (feature-prioritizer and pm-metrics-architect confirmed) and you have a prioritized backlog.
- You need one PRD per "in"-tagged sub-feature, written consistently, not by hand.
- You want a single manifest to review and approve before Deliver work begins.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A prioritized backlog with "in"-tagged sub-features | One PRD per item in `./design-workspace/<project>/prds/` |
| The project context and JTBD framing | A manifest table of all PRDs for you to confirm |

## Where it sits in the pipeline
It runs in the Define phase, gated behind the Success-Metrics Gate — feature-prioritizer and pm-metrics-architect must confirm first. After it produces the PRD set and you approve the manifest, the information-architect maps cross-feature structure for the release, and downstream Deliver work proceeds from there.

## Try it
```
"Use the prd-author agent to generate one PRD per in-tagged feature from our prioritized backlog."
```
