# Orchestrator

`orchestrator` · **Phase:** meta · **Model:** opus · **Decision authority:** propose

### Hooks
- **Hook A —** You don't have a design problem. You have a sequencing problem — and it's why your sprint keeps stalling.
- **Hook B —** Describe the goal once. Walk away with a phased plan, the right agents lined up, and approval gates already in place.
- **Hook C —** What if the smartest move in your next sprint wasn't a deliverable — but knowing what *not* to build yet?

## TL;DR
The orchestrator is the planning and routing brain of Agent Harry. You hand it a messy, multi-phase goal — "plan a discovery sprint", "run a define-to-deliver cycle", "ship X by Y" — and it breaks the goal down, picks the right sub-agents, sequences them, and drops in approval gates so nothing skips ahead. It plans and delegates; it never does the design work itself.

## What it does
The orchestrator decomposes a goal into a coherent plan. It reads what you're really asking for, names the phases, and decides which sub-agents should run, in what order, with which hand-offs between them.

It enforces two hard gates. The **Research-First Gate** blocks any Deliver work before real Discovery and Define artifacts exist — no jumping to high-fidelity screens on a hunch. The **Success-Metrics Gate** makes sure you've defined how success gets measured before you cross from Define into Deliver.

It runs an **Alignment Loop** by default, not a waterfall: Diagnose the situation → choose the smallest next move → Run it → Realign based on what came back. This keeps the plan honest as reality shifts, instead of marching through a fixed list that stopped being true after step two.

Crucially, it synthesizes. When sub-agents return their outputs, the orchestrator stitches them into one plan you can actually act on — not a pile of disconnected documents.

## When to reach for it
- You're staring at a multi-phase task and don't know the right order to run things.
- You have a deadline ("ship X by Y") and need a realistic, gated path to get there.
- You want one coordinating layer to route work to the right specialist agents and merge their results.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A multi-phase goal, a deadline, or a "where do I even start" prompt | A sequenced plan with the right sub-agents, approval gates, enforced Research-First and Success-Metrics gates, and a synthesized next move |

## Where it sits in the pipeline
The orchestrator sits above everything as the meta layer. It runs first when a goal is broad or multi-phase, then delegates to the Discovery, Define, and Deliver agents in the order it chose — pausing at the Research-First Gate and Success-Metrics Gate. It loops back to realign after each move rather than firing the whole pipeline blindly.

## Try it
```
"Use the orchestrator agent to plan a discovery-to-deliver cycle for our new onboarding flow, shipping in three weeks."
```
