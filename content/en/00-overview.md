# Agent Harry — The 22-Agent Product Design Team

`overview` · **What it is:** a multi-agent product design system for Claude Code

### Hooks
- **Hook A —** One designer. One prompt. A 22-person product team that never sleeps.
- **Hook B —** Discovery → Define → Deliver, run end-to-end by specialist agents — with gates that stop you from shipping on a hunch.
- **Hook C —** What if your "design process" wasn't a doc nobody reads, but 22 agents that actually run it?

## TL;DR
Agent Harry is a personal multi-agent product design system that installs into any Claude Code project. Instead of one generalist AI doing everything shallow, it splits the work across 22 specialist agents — each with a sharp role, a defined phase, and a clear hand-off — coordinated by an orchestrator and stress-tested by a critique-partner. It covers the full product lifecycle (Discovery → Define → Deliver) plus embedded PM capabilities, and it refuses to let you skip research or skip metrics.

## The shape of the team
The system is organized into three lifecycle phases plus two supporting layers.

**Meta — the conductor**
- `orchestrator` (opus) — decomposes the goal, sequences the right agents, enforces the gates, synthesizes the outputs.

**Discovery — understand the problem**
- `discovery-researcher` — interviews, surveys, secondary research, JTBD, problem framing.
- `competitive-analyst` — competitor teardowns, UI pattern audits, feature-gap analysis.

**Define — decide what to build**
- `pm-strategist` — vision, business model, pricing, market scan, north-star.
- `product-positioner` — positioning, value props, differentiation, naming.
- `feature-prioritizer` — RICE/ICE/Kano scoring, MVP scope, what to cut.
- `ideation-facilitator` — divergent ideation, How Might We, concept generation.
- `prd-author` — one PRD per "in"-tagged sub-feature, after the Success-Metrics Gate.
- `information-architect` — cross-feature structure: object model, navigation, action-priority system.
- `lo-fi-designer` — userflows, ASCII wireframes, layout alternatives, DS component mapping.

**Deliver — make it real**
- `figma-designer` — hi-fi Figma screens from the lo-fi handoff + PRD.
- `design-engineer` — production-ready frontend prototype in your actual stack, all 5 states.
- `design-sync` — mirrors an existing Figma file into code 1:1, marks gaps, invents nothing.
- `usability-tester` — test plans + Mode C automated browser-driven usability runs.
- `accessibility-auditor` — WCAG 2.2 AA audit, axe-core in-page, measured not guessed.
- `handoff-engineer` — specs, design tokens, dev handoff docs, edge cases.
- `pm-launch-architect` — GTM, beachhead, ICP, growth loops, launch sequencing.

**Cross-cutting — run any time**
- `critique-partner` (opus) — stress-tests ANY agent's output.
- `pm-metrics-architect` — north-star + input + health + counter-metrics, OKRs, tracking plans.
- `brand-decoder` — decodes how an existing brand actually thinks about itself.
- `product-fingerprint-curator` — captures the product's real visual language from Figma references.
- `figma-component-bootstrapper` — builds the project's baseline Figma component library.

## The two gates that keep it honest
- **Research-First Gate** — no Deliver work until real Discovery/Define artifacts exist. No shipping on a hunch.
- **Success-Metrics Gate** — you can't cross from Define into Deliver until you've defined how success gets measured.

## Why split it into 22 agents?
A single generalist prompt produces shallow, average work in every direction. Specialist agents each carry one sharp point of view (a "voice"), one job, and one hand-off — so the research is actually evidence-first, the prioritization is actually tradeoff-honest, and the accessibility audit is actually measured. The orchestrator keeps them in sequence; the critique-partner keeps them honest; the gates keep the whole thing from racing ahead of its own evidence.

## Try it
```
"Use the orchestrator agent — I want to run a discovery-to-deliver cycle for <feature>."
```
