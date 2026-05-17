# Product Designer Multi-Agent System

A Claude Code subagent system optimized for **Senior IC Product Designers** working across the full discovery → handoff lifecycle, with embedded Product Management capabilities (prioritization, positioning, competitive analysis).

Built around an **Orchestrator + specialized sub-agents** pattern with per-agent approval gates.

---

## System Architecture

```
                        ┌─────────────────────┐
                        │    orchestrator     │
                        │  (routing + plan)   │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   ┌────▼─────┐              ┌─────▼──────┐             ┌─────▼─────┐
   │ DISCOVERY│              │  DEFINE    │             │  DELIVER  │
   ├──────────┤              ├────────────┤             ├───────────┤
   │ research │              │ positioning│             │ prototype │
   │ competitive│            │ prioritization│          │ usability │
   └──────────┘              │ ideation   │             │ handoff   │
                             └────────────┘             └───────────┘
```

## Agents (10 total)

| Agent | Phase | Voice | Primary MCPs |
|---|---|---|---|
| `orchestrator` | Meta | Calm strategist | All |
| `discovery-researcher` | Discovery | Curious, evidence-first | Notion, Web |
| `competitive-analyst` | Discovery | Pattern detective | Mobbin, Web, Figma |
| `product-positioner` | Define | Sharp, opinionated | Notion, Web |
| `feature-prioritizer` | Define | Tradeoff-honest PM | Notion |
| `ideation-facilitator` | Define | Generative, divergent | Mobbin, Notion |
| `interaction-designer` | Deliver | Craft-obsessed senior | Figma, Mobbin |
| `usability-tester` | Deliver | Skeptical scientist | Notion |
| `handoff-engineer` | Deliver | Systems-thinker | Figma, Notion |
| `critique-partner` | Cross-cutting | Devil's advocate | All |

## Two Modes per Agent

Most agents now operate in two modes:

- **Mode A — Generate from scratch** (default when no existing artifacts provided)
- **Mode B — Audit / extend existing artifacts** (default when user provides files, links, or prior work)

The orchestrator routes to Mode B first when artifacts are present. Reasoning: don't pay twice for work already done. Existing artifacts get audited, critiqued, and extended before new work is commissioned.

Mode B coverage:

| Agent | Mode B input |
|---|---|
| `discovery-researcher` | Interview transcripts, surveys, GA4/Clarity, PDFs, Notion pages |
| `competitive-analyst` | Prior competitor research, market reports, analyst decks |
| `product-positioner` | Existing positioning docs, value props, pitch decks |
| `feature-prioritizer` | Existing roadmaps, backlogs, scoring tables |
| `ideation-facilitator` | Existing concept docs, brainstorm outputs |
| `interaction-designer` | Existing Figma files, design system audits |
| `usability-tester` | Existing test results, session recordings |
| `handoff-engineer` | Existing specs, design system docs |
| `critique-partner` | Already Mode B by design — operates on existing outputs |

## Required MCP Servers

- **Figma MCP** — read/write design files
- **Notion MCP** — research docs, specs, prioritization tables
- **Mobbin MCP** — UI pattern reference
- **Web Search** — competitive intel, framework lookups

## Installation

1. Copy `.claude/agents/` into your project root
2. Copy `SHARED_CONTEXT.md` into project root
3. Ensure required MCPs are connected in Claude Code
4. Start a session and invoke: *"Use the orchestrator agent to plan a discovery sprint for [feature]"*

## Usage Patterns

### Single-agent invocation
```
Use the competitive-analyst agent to map onboarding patterns
for fintech apps in Southeast Asia.
```

### Orchestrated workflow
```
Use the orchestrator to run a full define→deliver cycle for
the new merchant payout flow. Pause for my approval between phases.
```

### Critique pass
```
Have the critique-partner stress-test the prioritization rationale
from the last feature-prioritizer output.
```

## Decision Authority Model

Every agent operates under **per-agent approval gates**. Each agent declares its `DECISION_AUTHORITY` in frontmatter as one of:

- `autonomous` — Acts without approval (research, analysis, draft work)
- `propose` — Drafts → waits for explicit user approval before continuing
- `escalate` — Stops and asks user before making the call

The orchestrator respects these and inserts approval pauses accordingly.

## Anti-Patterns Enforced

Every agent's system prompt explicitly forbids:

1. **Generic AI advice** — No "it depends", "consider exploring", "various factors"
2. **Surface-level critique** — Every observation must include the *why* and a *what next*
3. **Buzzword salad** — No "leverage synergies", "holistic frameworks", "best-in-class"
4. **Premature solutions** — No jumping to fixes before the problem is named with evidence

If an agent catches itself drifting into these, it self-corrects in the next sentence.

## Methodology Stance

Agents are **framework-agnostic but context-aware**. They will draw from Double Diamond, JTBD, Lean UX, RICE, ICE, Kano, Atomic Design, etc. — but only when the context warrants it. They name the framework when they use one, and they justify the choice.

## File Map

```
product-designer-agents/
├── README.md                          ← you are here
├── SHARED_CONTEXT.md                  ← handoff schema + conventions
└── .claude/agents/
    ├── orchestrator.md
    ├── discovery-researcher.md
    ├── competitive-analyst.md
    ├── product-positioner.md
    ├── feature-prioritizer.md
    ├── ideation-facilitator.md
    ├── interaction-designer.md
    ├── usability-tester.md
    ├── handoff-engineer.md
    └── critique-partner.md
```
