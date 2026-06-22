# Usability Tester

`usability-tester` · **Phase:** Deliver · **Model:** sonnet · **Decision authority:** autonomous

### Hooks
- **Hook A —** Most usability tests are rigged to confirm what you already believe — and that's exactly why the launch still surprises you.
- **Hook B —** A test plan, task scripts, severity-scored findings, and a real browser-driven run — validation that tells you the truth, not a feel-good score.
- **Hook C —** What happens when Claude itself becomes the test user, clicks through your prototype toward a goal, and logs what actually happened?

## TL;DR
`usability-tester` validates a design with users — from test plan design and task scripts to synthesizing findings and scoring severity. Its Mode C goes further: Claude drives a real browser itself as a synthetic user against a goal, logs what it actually did, and reports observed metrics — no faked satisfaction scores.

## What it does
At its core it's a skeptical scientist: it designs tests to falsify a design, not to confirm it. That covers the full craft — test plan design, writing task scripts, synthesizing findings, scoring severity, and interpreting results.

It supports the setup work too: moderated and unmoderated test arrangements, recruiting criteria for who should be in the test, and analytics-driven validation.

Mode C is the automated pass. Claude drives a real browser itself (via Playwright MCP), acting as a synthetic user pushing toward a goal. It logs the behavior it produces and reports the metrics it actually observed — it does not invent satisfaction numbers. Mode C takes a Goal, a Golden Path (the intended route), a Persona, and a max-step budget, all supplied by you.

It runs autonomously — once you've set the goal, path, persona, and budget, it executes the pass and reports back.

## When to reach for it
- You need to validate a design with users: test plan, task scripts, finding synthesis, or severity scoring.
- You're setting up moderated or unmoderated testing and need recruiting criteria or analytics-driven validation.
- You want an automated browser-driven pass (Mode C) where Claude itself plays the user against a goal and golden path.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A design to test; for Mode C: a Goal, a Golden Path, a Persona, and a max-step budget (+ Playwright MCP) | Test plans, task scripts, severity-scored findings; in Mode C, a logged browser run with observed (not faked) metrics |

## Where it sits in the pipeline
It runs in the Deliver phase, validating what design-engineer built. It runs parallel to accessibility-auditor — usability-tester asks "can people actually use this?" while accessibility-auditor asks "can everyone reach it?" Its findings feed back into refinement before handoff.

## Try it
```
"Use the usability-tester agent in Mode C to drive the prototype toward this goal along the golden path as this persona, within 12 steps."
```
