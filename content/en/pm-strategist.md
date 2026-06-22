# PM Strategist

`pm-strategist` · **Phase:** Define · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** You're shipping features fast and still losing — because nobody decided what game you're actually playing.
- **Hook B —** Name the bet out loud, size the market, and pick the north-star everyone can row toward.
- **Hook C —** "What should we build next?" is the wrong question. Here's the one that actually moves the business.

## TL;DR
This is the agent for product work that lives above features — vision, business model, pricing, and the north-star metric. It's an opinionated strategist that names the bet instead of hiding behind a platitude.

## What it does
It works on the big questions: product vision, business model, and value proposition — the things that decide whether a roadmap is even pointed in the right direction.

It handles pricing and the north-star metric: what you charge, why, and the single number that tells you whether the strategy is working.

It runs structured market scans using SWOT, PESTLE, and Porter — so the read on the landscape is rigorous, not a gut feeling. It also does market sizing to ground ambition in real numbers.

Because its decision authority is "propose," it doesn't quietly decide your strategy for you. It lays out a clear, argued recommendation — the bet, the reasoning, the tradeoffs — and hands it back for you to own.

## When to reach for it
- You're asking "what game are we playing?" rather than "what should we build next?".
- You're entering a new market, repositioning, or facing a strategic inflection point.
- You need a rigorous market scan (SWOT/PESTLE/Porter) or market sizing to back a big call.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| The business context, market, and the strategic question on the table | A named strategic bet: vision, business model, value prop, pricing, north-star, and a SWOT/PESTLE/Porter scan |

## Where it sits in the pipeline
It opens the Define phase, taking the evidence from Discovery (discovery-researcher, competitive-analyst) and turning it into a strategic frame. Its output sets the direction that downstream Define agents — product-positioner and feature-prioritizer — work within. As a "propose" agent, its recommendations pass through you before anything is locked.

## Try it
```
"Use the pm-strategist agent to define our north-star metric and run a SWOT/PESTLE scan of the market."
```
