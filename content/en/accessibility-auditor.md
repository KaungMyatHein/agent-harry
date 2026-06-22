# Accessibility Auditor

`accessibility-auditor` · **Phase:** Deliver · **Model:** sonnet · **Decision authority:** autonomous

### Hooks
- **Hook A —** An accessibility "opinion" feels responsible right up until the lawsuit, the complaint, or the user who simply can't get in.
- **Hook B —** A real browser run with axe-core in the page — deterministic, measured WCAG 2.2 AA findings, not someone's best guess.
- **Hook C —** What does your screen look like to a keyboard, a screen reader, and a contrast checker — all at once, measured, not assumed?

## TL;DR
`accessibility-auditor` audits a built prototype or live URL for WCAG 2.2 AA conformance. It drives a real browser itself and runs axe-core in-page for deterministic, measured findings — color contrast, alt text, form labels, ARIA correctness, heading order, keyboard reachability. It measures; it does not guess.

## What it does
It's a compliance engineer: it measures, never guesses. An axe-core reading beats an opinion every time, so it gets the reading.

It drives a real browser itself (via Playwright MCP) and runs axe-core in-page, producing deterministic findings instead of vibes. The coverage spans WCAG 2.2 AA: color contrast, alt text, form labels, ARIA correctness, heading order, and keyboard reachability.

It has a Mode B for when there's no live page to drive: it can re-audit an existing accessibility report, or static markup and CSS, instead of a running prototype.

It runs autonomously — point it at a prototype or URL and it returns measured findings, no hand-holding.

## When to reach for it
- A built prototype or live URL needs a WCAG 2.2 AA accessibility audit grounded in real measurement.
- You need deterministic findings on contrast, alt text, labels, ARIA, heading order, or keyboard reachability.
- You only have an existing a11y report or static markup/CSS to re-audit (Mode B).

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A built prototype or live URL (via Playwright MCP); or, for Mode B, an existing a11y report or static markup/CSS | Deterministic, axe-core-measured WCAG 2.2 AA findings across contrast, alt text, labels, ARIA, heading order, and keyboard reachability |

## Where it sits in the pipeline
It runs in the Deliver phase, after design-engineer builds the prototype, and runs parallel to usability-tester — accessibility-auditor asks "can everyone reach it?" while usability-tester asks "can people use it?" Its findings feed refinement before handoff.

## Try it
```
"Use the accessibility-auditor agent to run axe-core against the prototype and report WCAG 2.2 AA findings."
```
