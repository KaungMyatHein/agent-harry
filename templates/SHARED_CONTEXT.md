# SHARED_CONTEXT.md

Every agent in this system reads this file as part of its working context. It defines the handoff schema, file conventions, shared vocabulary, and **token budget rules**.

---

## Handoff Schema

Each agent produces a **handoff artifact** at the end of its run. Format is the agent's choice (markdown narrative, structured JSON, or both) — but every handoff MUST start with the human-readable Executive Summary block, followed by frontmatter, then long-form detail.

### Layer 0 — Executive Summary (Human-First, Always First)

The first thing the user sees. Designed for a human skim in under 30 seconds. **This block is mandatory** — no exceptions.

```markdown
## Executive Summary

| Metric | Value |
|---|---|
| Agent | <agent-name> |
| Phase | discovery / define / deliver |
| Confidence | high / medium / low |
| Inputs analyzed | <count + 1-line type breakdown> |
| Key outputs | <count of insights / gaps / decisions> |
| Recommendation | <one phrase — "proceed to define", "run new study", "blocked: X"> |

**TL;DR (3 bullets max):**
- <single most important finding/decision — one line>
- <second most important — one line>
- <single open question or blocker — one line>

**Next step:** <one sentence, concrete, names the next agent or user action>
```

After this block, the agent may produce long-form detail for downstream agents. Long-form is for AI handoff — the Executive Summary is for the human.

### Frontmatter (machine-readable)

```yaml
---
agent: <agent-name>
phase: discovery | define | deliver | cross-cutting
project: <project-slug>
started: <ISO timestamp>
completed: <ISO timestamp>
inputs_used:
  - <file or context source>
confidence: high | medium | low
open_questions:
  - <question that blocks next phase>
recommended_next_agent: <agent-name or "user-decision">
tokens_estimated: <rough number — see Token Budget section below>
---
```

### Long-form Body (for AI handoff, not for human review)

Free-form, follows this skeleton when applicable:

1. **Key findings / decisions** — bulleted, evidence-linked
2. **Tradeoffs surfaced** — what we gave up
3. **Risks & unknowns** — with severity
4. **Recommended next moves** — concrete, not abstract

---

## Token Budget Rules (Critical — Read Before Every Run)

Each Agent Harry pipeline run can cost real money. Default behavior must be **lean**, not exhaustive. The user pays for every token.

### Output Caps (Hard Limits)

| Section | Max length |
|---|---|
| Executive Summary | 1 stat-card table + 3 TL;DR bullets + 1 next-step line — **never longer** |
| Layer 1 / Synthesis (insights) | **Max 6 insights** per run, each one ≤ 5 lines |
| Layer 2 / Gaps | **Max 4 gaps**, each ≤ 3 lines |
| Layer 3 / Critique | **Max 4 concerns**, each ≤ 3 lines |
| Decision table / prioritization | **Max 10 rows** in any scoring table |
| Open questions | **Max 5** — pick the ones that actually block next step |

If the work warrants more, surface that as a follow-up run, not as bloat in the current one.

### Model Routing

| Agent | Model | Why |
|---|---|---|
| `orchestrator` | opus | Plans pipeline, weighs tradeoffs across phases |
| `critique-partner` | opus | Adversarial reasoning is the highest-leverage Opus use |
| Everything else (8 agents) | sonnet | Cheaper, fast enough, plenty smart for phase work |

If an individual agent run obviously needs Opus-grade reasoning (rare), the orchestrator may override per-call — but log the reason in the handoff.

### Synthesis Across Agents

When the orchestrator synthesizes multiple agent outputs, it reads **only the Executive Summary section** of each prior handoff by default, not the long-form body. Long-form is loaded only when a specific decision requires it.

This is the single biggest token saving in the pipeline.

### Anti-Patterns That Burn Tokens

- Re-running an agent because you forgot what it produced (read its handoff file instead)
- Asking an agent to "be thorough" (it already is — that's the prompt's job)
- Pasting full prior outputs into a new prompt (use file references)
- Running Mode A (new from scratch) when Mode B (audit existing) was available
- Calling Opus for synthesis of already-distilled summaries

---

## Always-On Stop Gate (Per-Step Approval, Mandatory)

**This is the most important rule in this document — read it twice.**

After every sub-agent run, the orchestrator (and any agent invoked directly) MUST:

1. Present the **Executive Summary block** of the just-completed work to the user (stat-card table + 3-bullet TL;DR + next-step line). Nothing more — long-form stays in the handoff file.
2. **Stop**. Do not invoke the next agent.
3. Wait for explicit user input. Four valid responses:
   - `y` / `yes` / `ok` / `proceed` / `ဆက်လုပ်` — proceed to the next planned step
   - `revise <what>` — re-invoke the same agent with the revision delta (e.g. "revise — focus on enterprise users only", "revise — drop the Mobbin patterns, use only competitive teardowns")
   - `cancel` / `stop` / `ရပ်` — halt the pipeline, leave the handoff file as-is
   - `grill me` / `stress test` — invoke the `grill-me` skill on the current step's output before deciding; resume the gate after grilling

**This gate fires even when bypass-permissions mode is on.** Permission mode controls *tool authorization*, not *user-in-the-loop checkpoints*. The Stop Gate is a product-design discipline, not a sandbox restriction. Bypassing it is not a feature — it's a regression.

If the user has been silent for the whole session (no message in the current chat turn), do not assume `y`. Re-present the TL;DR and ask explicitly.

### When to suggest `grill me`

Offer `grill me` proactively in the next-step line when:

- The output is the *foundation* for several downstream agents (e.g. discovery synthesis, positioning statement, prioritization decision)
- Confidence is `low` or `medium` on any key claim
- The output makes a non-obvious tradeoff that should be stress-tested before locking in
- The user has been moving fast and skipped earlier critique gates

The phrasing in the next-step line: *"Type `y` to proceed, `revise <delta>` to refine, or `grill me` to stress-test before locking in."*

### Revision loop

On `revise <delta>`:

1. Re-invoke the same sub-agent with the revision delta added to its Goal
2. Pass the prior handoff file as input so the agent extends rather than re-does
3. The revised run is itself subject to the Stop Gate — present new TL;DR, wait for `y` again

There is no implicit cap on revision rounds. The user decides when an output is good enough.

### Anti-patterns at the Stop Gate

- Auto-proceeding because "the user clearly wants this done quickly" — they don't, they want it done right
- Concatenating multiple agent outputs in one response without gates between them
- Asking only "approve?" without showing the TL;DR — the user shouldn't have to open the handoff file to decide
- Treating `revise` as `cancel` — revise means iterate on this step, not skip it

### Dashboard companion (v3.1, enriched in v3.3)

In addition to the chat TL;DR, the orchestrator writes `<project-root>/dashboard.html` at every Stop Gate. This is a static, self-contained HTML file that renders the same Executive Summary visually — designed to be viewed in the Claude Preview MCP panel.

**v3.3 adds a Decision Data panel** between the stat cells and the TL;DR. This is where the actual decision-critical content lives — scoring tables, research insights with evidence, the bet, beachhead + named accounts, measurement plan layers. Before v3.3 this content lived only in the MD handoff files in `./design-workspace/`. Now it surfaces inline so the user can make a `y / revise / pivot` decision without opening the MD.

Architecture:

- **Read-only** — command chips show the literal text the user types in chat (`y / revise <delta> / pivot — <X> / grill me / cancel`). Clicks do nothing; chat is still where the user inputs decisions. Silence is still not consent.
- **Regenerated at every Stop Gate** — no JavaScript, no polling, no server. Each Stop Gate, orchestrator overwrites the file with current state baked in as inline HTML. Auto-refreshes in the preview panel.
- **Layout** — top bar with project + cost meter (load-bearing — turns yellow at $1.50, red at $2.50) · compressed history breadcrumb · BIG NOW card (status, agent, mode, phase pill, 4 stat cells, 3-bullet TL;DR, next-move suggestion, 5 command chips) · suggested-next strip · footer.
- **Single-focus per turn** — matches the Alignment Loop philosophy. One thing is happening NOW; past is compressed context; future is a non-binding preview.
- **Graceful degrade** — if the file doesn't exist (e.g. pre-v3.1 install that hasn't been refreshed), orchestrator skips the render silently and prints the TL;DR in chat as before.

The dashboard does NOT replace chat. Chat is the source of truth, the audit trail, and the input surface. The dashboard is a visual surface to *read* the TL;DR more easily.

### Queue Mode (v3.2 — autonomous click-driven loop)

In v3.2 the dashboard goes from passive (read-only) to **interactive**. The chips are real buttons. Clicking one POSTs to a local HTTP server (`dashboard-server.py`, Python stdlib, no deps) which writes the click intent to `<project-root>/.harry-queue.json`. A new `/agent-harry-loop` slash command runs the polling loop via `ScheduleWakeup` — it reads the queue file every ~60s, and when a click arrives it dispatches to the orchestrator subagent. This delivers click-and-walk-away UX without breaking the chat-as-source-of-truth invariant (the user can still type in chat anytime; chat input takes priority).

Architecture summary:

| Piece | Role |
|---|---|
| `dashboard-server.py` | Tiny HTTP server on :3737. Serves dashboard.html. Accepts button POSTs at `/api/action`. Writes to `.harry-queue.json`. No deps; Python 3.8+ stdlib. |
| `dashboard.html` | Now interactive: chips are `<button>` elements that POST to the server. Inline text inputs appear for `revise` and `pivot`. Connection-status indicator + toast notifications. Polls `/api/queue` every 3s to reflect queued state. |
| `.harry-queue.json` | Queue state file. Schema: `{queued_action, last_action_processed, poll_count, max_polls, session_started}`. Source of truth for the click→orchestrator handoff. |
| `/agent-harry-loop <goal>` | Slash command that drives the polling loop. Uses `ScheduleWakeup` (only available in main-session dynamic-loop mode). Idle cycles cost ~$0.015 each, capped at 20 polls. |

Setup steps for queue mode:

1. `cd <project>` and start the server: `python3 dashboard-server.py`
2. Open browser to `http://localhost:3737`
3. Start Claude Code in the project: `claude`
4. Invoke the loop: `/agent-harry-loop <your goal>`
5. Click chips in the browser; chat goes mostly silent while the dashboard owns input + visual.

Queue Mode is opt-in. If you don't run the server or use the slash command, Agent Harry works in chat-only mode exactly as in v3.1 — Stop Gates fire in chat, the dashboard is read-only.

Stop conditions for the loop: user clicks `cancel`, idle timeout (20 polls ≈ 20 min), orchestrator returns `complete`, user types `/end-loop` in chat, or queue corruption (after one retry).

---

## Research-First Gate (Hard Block)

The Deliver phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`) are **blocked from running** unless one of these conditions is met:

1. A Discovery-phase handoff artifact exists in this project (any of: `discovery-researcher`, `competitive-analyst` Mode A or B output)
2. A Define-phase handoff exists (any of: `product-positioner`, `feature-prioritizer`, `ideation-facilitator`)
3. The user has **explicitly** said: "I have research already, skip Discovery" or equivalent opt-out

The orchestrator enforces this gate. If a user requests Deliver work without Discovery/Define artifacts:

> Orchestrator response: "I can't route to Deliver yet — no Discovery or Define artifacts exist in this project. Options: (a) run discovery-researcher in Mode B on any existing PRD/research you have, (b) run discovery-researcher in Mode A to design new research, or (c) explicitly opt out: tell me 'I have audited research already, proceed to Deliver.'"

`/audit-pipeline` runs this check on demand. See `RATIONALE.md` for the why behind the gate.

---

## Success-Metrics Gate (Hard Block — v3.4)

A second hard block, fires at the Define → Deliver boundary.

The Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`, `pm-launch-architect`) are **blocked from running** once Define artifacts exist UNLESS one of these is true:

1. A `pm-metrics-architect` handoff artifact exists in `./design-workspace/<project-slug>/` AND the user has explicitly confirmed it with `y` on the Stop Gate that followed the metrics run.
2. The user has explicitly opted out with: *"I have metrics already, skip the confirmation"* / *"skip metrics"* / *"Success metrics မလိုဘူး"* / equivalent phrasing.

When Define artifacts exist but `pm-metrics-architect` hasn't run yet, the orchestrator's smallest-next-move MUST be `pm-metrics-architect` Mode A — not a Deliver agent. The Stop Gate after that run frames itself as a **confirmation** of success metrics (chip hint becomes `confirm success metrics`, TL;DR ends with *"Confirm these metrics so Deliver can proceed?"*).

`/audit-pipeline` reports this gate's status alongside the Research-First Gate. See `RATIONALE.md` for the why.

---

## PM Skills Map

Agents are skill-aware. When the user has PM skill packs installed (`pm-execution`, `pm-market-research`, `pm-marketing-growth`, `pm-product-strategy`, `pm-go-to-market`, `pm-product-discovery`, `pm-toolkit`, `product-management`, `product-tracking-skills`), agents invoke specific skills via the Skill tool instead of re-deriving artifacts.

**Per-agent skill ownership lives in `PM_SKILLS_MAP.md`** (same project root). Each agent loads only its own row when it needs to confirm what it owns. Anti-pattern: invoking a PM skill without naming it in the Executive Summary's `inputs_used` field.

---

## File Conventions

- All outputs land in `./design-workspace/<project-slug>/<phase>/`
- File naming: `YYYY-MM-DD_<agent>_<short-topic>.md`
- Figma node IDs, Notion page IDs, and Mobbin URLs are recorded as **clickable links**, never naked IDs
- Screenshots/exports go in `./design-workspace/<project-slug>/assets/`

## Shared Vocabulary

To prevent buzzword drift, agents use these specific terms:

| Use | Don't use |
|---|---|
| "user problem" | "pain point" |
| "tradeoff" | "challenge" |
| "evidence shows…" | "research suggests…" |
| "we don't know yet" | "needs further exploration" |
| "this fails when…" | "edge case" |
| "I disagree because…" | "alternative perspective" |

## Confidence Calibration

Every claim an agent makes must carry implicit or explicit confidence. Use this scale:

- **High** — Direct evidence (user quote, analytics, A/B result, established pattern with 3+ references)
- **Medium** — Indirect evidence (analogous product, expert heuristic, single source)
- **Low** — Designer intuition or theoretical reasoning only

Low-confidence claims must be flagged as such. Never present low-confidence claims as high-confidence ones.

## Anti-Pattern Self-Check

Before finalizing any output, every agent runs this internal check:

- [ ] Did I include the Executive Summary block at the top?
- [ ] Am I within the output caps (6 insights, 4 gaps, 4 concerns, etc.)?
- [ ] Did I say "it depends" without naming the dependencies?
- [ ] Did I critique without explaining why and what to do next?
- [ ] Did I use a buzzword instead of a specific term?
- [ ] Did I propose a solution before the problem was named with evidence?

If yes to any → rewrite that section.

## Orchestrator Handoff Protocol

When the orchestrator delegates to a sub-agent, it passes:

1. **Goal** — the specific question this agent must answer
2. **Boundary** — what's out of scope for this run
3. **Inputs** — file paths or prior agent outputs to consume
4. **Success criteria** — how we'll know the output is useful
5. **Approval gate** — does this agent's output need user review before next step?
6. **Token budget** — soft cap on output length for this run

Sub-agents return:

1. **Output artifact** (Executive Summary first, then frontmatter, then long-form)
2. **Status**: `complete` | `blocked` | `needs-user-input`
3. **Suggested next step**

## Context Source Hierarchy

When agents need context, they pull in this order:

1. **Current session** — what the user has just said
2. **Prior agent handoffs** — files in `./design-workspace/<project-slug>/` (read Executive Summary only by default)
3. **Notion workspace** — research docs, specs
4. **Figma files** — design source of truth
5. **Mobbin** — pattern reference (Deliver phase)
6. **Web search** — last resort for external context

Agents NEVER fabricate context. If something isn't available in the hierarchy above, they say so and ask.

---

## Decision Data Shapes (v3.3)

Every agent's handoff includes a `decisionData` structured object that the orchestrator embeds in the dashboard's Decision Data panel. **Full spec, all 4 shape types, and the per-agent shape map live in `DECISION_DATA_SHAPES.md`** (same project root). Load that file only when you're producing or embedding decisionData.

Length discipline: each agent's decisionData stays within the output caps above (max 6 insights / 4 gaps / 10 scoring rows / etc.). The panel is for headline data only; full methodology stays in the MD handoff.

---

## Notion Sync (v3.5)

After confirmed artifacts exist, you can publish them to Notion via the `/agent-harry-notion-sync` slash command. This is opt-in — the pipeline runs the same whether you sync to Notion or not. Use it when teammates need to read decisions outside Claude Code.

### What gets synced

- **Discovery** insights (from `discovery-researcher`) + competitive teardown (from `competitive-analyst`)
- **Define** artifacts — positioning, prioritization scoring, concepts, the strategic bet
- **Success Metrics** (from `pm-metrics-architect`) — carries a `✓ Confirmed` badge if the Success-Metrics Gate cleared
- **PRDs** (from `prd-author`) — one Notion page per PRD file
- **Deliver** artifacts — design spec, usability test plan, launch plan

### What does NOT get synced

- Full long-form bodies of MD handoffs (they're archival; the MD files own them)
- `.harry-queue.json` runtime state (not relevant to teammates)
- The `dashboard.html` file (rendered visual; doesn't fit Notion's block model cleanly)
- Critique-partner stress-test responses inline — they're folded into the artifact they critiqued, not separate pages

### Config file

`<project-root>/.notion-config.json` (created by first run of the slash command). Schema:

```json
{
  "parent_page_id": "<notion-page-id-user-picked>",
  "project_root_page_id": "<notion-page-id-of-Agent-Harry-project-root>",
  "synced_pages": {
    "<relative-artifact-path>": "<notion-page-id>"
  },
  "last_sync": "<ISO-8601 UTC>",
  "version": "v3.5"
}
```

Idempotent — re-running the slash command updates pages in place, doesn't duplicate.

### When to invoke

- After the Success-Metrics Gate clears, before kicking off design (so teammates can review metrics + prioritization in Notion)
- After `prd-author` produces PRDs (so engineering can read them in Notion)
- After the pipeline marks complete (final publish)
- Any other time you want Notion to reflect the current state — the command is cheap (~$0.05–0.10 per run)

### Anti-patterns

- Auto-syncing on every Stop Gate without user opt-in (wastes Notion API quota; some artifacts shouldn't be public yet)
- Syncing un-confirmed drafts (only artifacts the user has approved with `y` should land in Notion — that's the team's read-once source of truth)
- Duplicating data Notion can compute (use Notion's TOC block for the overview, not a hardcoded page list)
