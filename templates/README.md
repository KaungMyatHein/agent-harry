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

## Agents (15 total)

| Agent | Phase | Voice | Model | Primary MCPs |
|---|---|---|---|---|
| `orchestrator` | Meta | Calm strategist | opus | All |
| `critique-partner` | Cross-cutting | Devil's advocate | opus | All |
| `discovery-researcher` | Discovery | Curious, evidence-first | sonnet | Notion, Web |
| `competitive-analyst` | Discovery | Pattern detective | sonnet | Mobbin, Web, Figma |
| `product-positioner` | Define | Sharp, opinionated | sonnet | Notion, Web |
| `feature-prioritizer` | Define | Tradeoff-honest PM | sonnet | Notion |
| `ideation-facilitator` | Define | Generative, divergent | sonnet | Mobbin, Notion |
| `pm-strategist` | Define | Opinionated strategist | sonnet | Notion, Web |
| `low-fi-designer` | Define | Pragmatic systems-designer | sonnet | Figma, Mobbin, Web |
| `design-engineer` | Deliver | Shipping-craft engineer | sonnet | Figma, Mobbin |
| `usability-tester` | Deliver | Skeptical scientist | sonnet | Notion |
| `handoff-engineer` | Deliver | Systems-thinker | sonnet | Figma, Notion |
| `pm-launch-architect` | Deliver | Pragmatic GTM lead | sonnet | Notion, Web |
| `pm-metrics-architect` | Cross-cutting | Skeptical instrumentation lead | sonnet | Notion |
| `prd-author` | Deliver | Precise PRD writer | sonnet | — |

Model routing is deliberate: Opus is expensive, and it earns its keep only on orchestration and adversarial critique. The 13 phase + cross-cutting agents run on Sonnet to keep a full pipeline run in the $1–3 range, not $8+.

## Orchestration Style — Alignment Loop, not Waterfall

The orchestrator's default mode is the **Alignment Loop**:

1. **Diagnose** — opens with at most 2 questions to understand what you actually need
2. **Propose the smallest-next-move** — one agent, one mode, one tight goal
3. **Run** that move
4. **Realign** — present what we learned, propose the next move, you decide

You can `pivot — <new direction>` at any Stop Gate to steer the loop somewhere else. The orchestrator doesn't pre-commit to a 5-phase pipeline; it co-creates the path with you.

When you explicitly want a fixed plan upfront ("plan the full discovery sprint"), the orchestrator falls back to **Waterfall mode** — same Stop Gates between every step.

## Visual companion — `dashboard.html` (v3.1)

Reading text TL;DR cards step-by-step gets tiring. At every Stop Gate, the orchestrator also writes a self-contained `dashboard.html` to the project root, designed to be viewed in the Claude Preview MCP panel.

What's on it:

- **Top bar** — project name + step count + elapsed time + cumulative cost (turns yellow at $1.50, red at $2.50 — keeps the $3 ceiling visible)
- **History breadcrumb** — every completed sub-agent in this session, compressed
- **NOW card** — the visual centerpiece. Status dot + agent name + Mode tag + phase pill + 4 stat cells + **Decision Data panel** (v3.3) + 3-bullet TL;DR + next-move suggestion + 5 command chips
- **Decision Data panel** (v3.3) — surfaces the actual decision-critical content inline: scoring tables (feature-prioritizer), insight lists with evidence (discovery-researcher), "the bet" callouts (pm-strategist, pm-launch-architect), measurement-plan layers (pm-metrics-architect). 4 shape variants — see `SHARED_CONTEXT.md` Decision Data Shapes appendix
- **Suggested-next strip** — if `y` leads to a clear next agent, shown here with cost estimate

The dashboard is **read-only**. Command chips display the literal text you type in chat (`y / revise <delta> / pivot — <direction> / grill me / cancel`). Clicks do nothing — chat is still the source of truth and where input happens. Silence is still not consent.

If you don't have Claude Preview MCP connected, the dashboard file still renders fine in any browser. Open it manually if you want to glance at the visual TL;DR.

## Click-driven mode — Queue Mode (v3.2)

In v3.2 the dashboard goes from passive to **interactive**: the chips are real buttons that drive the orchestrator without needing you to type in chat. Click `y` and within ~60 seconds the orchestrator wakes up, processes it, and rewrites the dashboard with the next state.

How it works:

- **`dashboard-server.py`** — tiny Python stdlib HTTP server (no deps). Serves `dashboard.html` and accepts button POSTs at `/api/action`. Writes click intent to `.harry-queue.json`.
- **`/agent-harry-loop`** — slash command that runs in the Claude Code session. Uses `ScheduleWakeup` (a dynamic-loop mechanism only available in the main session, not in subagents) to poll the queue file every ~60s.
- **`.harry-queue.json`** — the queue state file. Owns the click → orchestrator handoff.

Setup steps:

```bash
# Terminal 1: start the dashboard server (project root)
cd <project>
python3 dashboard-server.py
# Output: server running on http://localhost:3737

# Browser: open the dashboard
open http://localhost:3737

# Terminal 2: start Claude Code in the project
cd <project>
claude

# In Claude Code, invoke the loop with your initial goal:
/agent-harry-loop audit my existing PRD and propose the smallest next move
```

The loop will:

1. Print a 3-line greeting + invoke the orchestrator with your goal
2. Orchestrator diagnoses, proposes smallest-next-move, writes `dashboard.html`, fires Stop Gate
3. Dashboard tab in browser auto-refreshes (or refresh manually) showing the proposed move
4. You click `y` (or revise/pivot/etc.)
5. Loop wakes within ~60s, sees the queue, dispatches to orchestrator
6. Repeat until you click `cancel` or hit the idle timeout (20 polls ≈ 20 min)

You can still type in chat anytime — chat input takes priority over the queue. Queue Mode is opt-in; if you don't run the server or the slash command, Agent Harry works exactly as in v3.1 (chat-only).

**Token-cost note:** idle polling costs ~$0.015 per cycle. 20-poll idle cap = ~$0.30 worst-case waste if you walk away. Still well within the $3 ceiling.

## PRDs + Notion sync (v3.5)

After Define is done and Success Metrics are confirmed (v3.4 Gate), two new capabilities are available:

### `prd-author` agent

Iterates the confirmed `feature-prioritizer` "in"-tagged items. Generates one PRD per sub-feature using the `pm-execution:create-prd` skill. Writes each PRD to `./design-workspace/<project-slug>/prds/<feature-slug>.md`.

- Token cost: ~$0.10–0.20 per PRD. Batch capped at 8 PRDs per run (scope down if you have more).
- Visible in the dashboard's Decision Data panel as a manifest table — slug · words · source RICE · status (new/updated).
- Idempotent: re-running on the same project updates existing PRD files; doesn't blindly overwrite.
- Routes naturally after the Success-Metrics Gate clears (orchestrator proposes it as the next move).

### `/agent-harry-notion-sync` slash command

Publishes confirmed Agent Harry artifacts to Notion as a structured workspace tree.

```bash
/agent-harry-notion-sync           # first run prompts for parent page
/agent-harry-notion-sync --dry-run # preview without writing
/agent-harry-notion-sync --re-init # reset .notion-config.json
```

The slash command requires Notion MCP to be connected. Builds this tree under your chosen parent page:

```
<Parent>/
└── <Project Name> — Agent Harry
    ├── 📍 Overview (auto-generated TOC)
    ├── 🔍 Discovery (research insights, competitive teardown)
    ├── 🎯 Define (positioning, prioritization, concepts, strategy)
    ├── 📊 Success Metrics (with ✓ Confirmed badge if Gate cleared)
    ├── 📄 PRDs (one page per generated PRD)
    └── 🚀 Deliver (design spec, usability test, launch plan)
```

Idempotent — re-run any time to push updates. MD files in `./design-workspace/` stay as the audit trail; Notion holds the decision-grade summary for your team. Token cost: ~$0.05–0.10 per sync.

## Slash Commands

| Command | Purpose |
|---|---|
| `/audit-pipeline` | Reports which phases have artifacts and whether the **Research-First Gate** + **Success-Metrics Gate** are PASS / BLOCK / OPTED-OUT. Run before any Deliver-phase work or whenever a session shifts toward "let's prototype / build / design". |
| `/agent-harry-loop` | v3.2 click-driven polling loop. Reads `.harry-queue.json` every ~60s; processes browser-clicked actions via the dashboard server. |
| `/agent-harry-notion-sync` | v3.5 push confirmed artifacts to Notion as a structured workspace. Idempotent; safe to re-run. `--dry-run` previews without writing. |
| `/agent-harry-audit` | v3.8 render the cross-session audit ledger (`.harry-audit.jsonl`) as a human-readable markdown timeline. Default: last 7 days, current project, all events. Flags: `--all`, `--days N`, `--agent <name>`, `--event <type>`, `--session <s_id>`. Read-only. |

## Always-On Stop Gate

Every sub-agent run ends with a mandatory user checkpoint. The orchestrator (and any directly-invoked agent) presents the Executive Summary, then stops and waits for one of:

- `y` — proceed to the next planned step
- `revise <delta>` — iterate the same step with the revision delta
- `grill me` — invoke the `grill-me` skill to stress-test before locking in
- `cancel` — halt the pipeline

**This gate fires even when bypass-permissions mode is enabled.** Permission mode controls tool authorization; the Stop Gate is a product-design discipline. Silence is not consent — if no reply comes, the orchestrator re-asks rather than assuming approval.

## Executive Summary & Token Budget

Every agent handoff starts with a **stat-card table + 3-bullet TL;DR + next-step line**. This is the human-readable summary. The long-form analysis below is for downstream AI handoff. You read the top; the next agent reads the bottom.

Hard output caps (per `SHARED_CONTEXT.md`):

| Section | Cap |
|---|---|
| Insights / synthesis | 6 |
| Gaps | 4 |
| Critique concerns | 4 |
| Scoring table rows | 10 |
| Open questions | 5 |

Orchestrator surfaces estimated token cost upfront and refuses any plan that exceeds $3 USD without explicit approval.

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
| `low-fi-designer` | Existing userflow Figjam, wireframes, low-fi sketches, design system files (DS inventory mode) |
| `design-engineer` | Existing prototype code (`prototypes/` folder, Storybook, Figma-to-code output) |
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
├── SHARED_CONTEXT.md                  ← handoff schema + Token Budget + Research-First Gate + Dashboard + Queue Mode
├── dashboard.html                     ← visual Stop Gate companion (overwritten by orchestrator each turn)
├── dashboard-server.py                ← v3.2 HTTP server for click-driven mode (Python stdlib)
├── .harry-queue.json                  ← v3.2 queue state file (click → orchestrator handoff)
├── .harry-audit.jsonl                 ← v3.8 append-only audit ledger (gitignored)
├── .gitignore                         ← v3.8 ignores audit-ledger + queue state
└── .claude/
    ├── agents/
    │   ├── orchestrator.md          (opus)
    │   ├── critique-partner.md      (opus)
    │   ├── discovery-researcher.md  (sonnet)
    │   ├── competitive-analyst.md   (sonnet)
    │   ├── product-positioner.md    (sonnet)
    │   ├── feature-prioritizer.md   (sonnet)
    │   ├── ideation-facilitator.md  (sonnet)
    │   ├── low-fi-designer.md       (sonnet) ← v3.7
    │   ├── design-engineer.md       (sonnet) ← v3.7
    │   ├── usability-tester.md      (sonnet)
    │   ├── handoff-engineer.md      (sonnet)
    │   ├── pm-strategist.md         (sonnet)
    │   ├── pm-launch-architect.md   (sonnet)
    │   ├── pm-metrics-architect.md  (sonnet)
    │   └── prd-author.md            (sonnet) ← v3.5
    └── commands/
        ├── audit-pipeline.md              ← /audit-pipeline
        ├── agent-harry-loop.md            ← /agent-harry-loop (v3.2)
        ├── agent-harry-notion-sync.md     ← /agent-harry-notion-sync (v3.5)
        └── agent-harry-audit.md           ← /agent-harry-audit (v3.8)
```
