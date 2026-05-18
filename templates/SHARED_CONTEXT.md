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

Reason for this rule: a "comprehensive-looking" PRD is still an artifact that needs Mode B audit before downstream work. Skipping to Deliver makes the downstream design throwaway-risky.

The slash command `/audit-pipeline` runs this check on demand and reports what's missing.

---

## Success-Metrics Gate (Hard Block — v3.4)

A second hard block, fires at the Define → Deliver boundary.

The Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`, `pm-launch-architect`) are **blocked from running** once Define artifacts exist UNLESS one of these is true:

1. A `pm-metrics-architect` handoff artifact exists in `./design-workspace/<project-slug>/` AND the user has explicitly confirmed it with `y` on the Stop Gate that followed the metrics run.
2. The user has explicitly opted out with: *"I have metrics already, skip the confirmation"* / *"skip metrics"* / *"Success metrics မလိုဘူး"* / equivalent phrasing.

When Define artifacts exist but `pm-metrics-architect` hasn't run yet, the orchestrator's smallest-next-move MUST be `pm-metrics-architect` Mode A — not a Deliver agent. The Stop Gate after that run frames itself as a **confirmation** of success metrics (chip hint becomes `confirm success metrics`, TL;DR ends with *"Confirm these metrics so Deliver can proceed?"*).

Reason for this rule: without confirmed success metrics, Deliver artifacts optimize for nothing in particular — or worse, for the designer's implicit metrics, not the team's actual ones. Forcing the metrics step + explicit confirmation makes the optimization target a deliberate decision instead of a default.

The slash command `/audit-pipeline` reports this gate's status alongside the Research-First Gate.

---

## PM Skills Map

Agent Harry agents are skill-aware. When the user has Claude Code's PM skill packs installed (`pm-execution`, `pm-market-research`, `pm-marketing-growth`, `pm-product-strategy`, `pm-go-to-market`, `pm-product-discovery`, `pm-toolkit`, `product-management`, `product-tracking-skills`), agents can invoke specific skills via the Skill tool rather than re-deriving PM artifacts from scratch.

The mapping below is the source of truth. Agents read this and decide when to invoke a skill vs. produce their own analysis.

| Agent | Owns PM skills |
|---|---|
| `discovery-researcher` | pm-market-research:analyze-feedback, pm-market-research:research-users, pm-market-research:user-segmentation, pm-product-discovery:interview, pm-product-discovery:summarize-interview |
| `competitive-analyst` | pm-market-research:competitive-analysis, pm-go-to-market:competitive-battlecard, product-management:competitive-brief |
| `product-positioner` | pm-product-strategy:value-proposition, pm-marketing-growth:value-prop-statements, pm-marketing-growth:positioning-ideas, pm-marketing-growth:product-name |
| `feature-prioritizer` | pm-product-discovery:prioritize-features, pm-execution:prioritization-frameworks, pm-product-discovery:analyze-feature-requests, pm-product-discovery:triage-requests |
| `ideation-facilitator` | pm-product-discovery:brainstorm, pm-product-discovery:brainstorm-ideas-new, pm-product-discovery:brainstorm-ideas-existing, pm-product-discovery:opportunity-solution-tree |
| `usability-tester` | pm-execution:test-scenarios, pm-product-discovery:identify-assumptions-existing, pm-product-discovery:prioritize-assumptions |
| `handoff-engineer` | pm-execution:user-stories, pm-execution:job-stories, pm-execution:wwas, pm-execution:create-prd, product-management:write-spec |
| `pm-strategist` *(v3)* | pm-product-strategy:strategy, pm-product-strategy:product-vision, pm-product-strategy:business-model, pm-product-strategy:lean-canvas, pm-product-strategy:startup-canvas, pm-product-strategy:swot-analysis, pm-product-strategy:porters-five-forces, pm-product-strategy:pestle-analysis, pm-product-strategy:ansoff-matrix, pm-product-strategy:pricing-strategy, pm-product-strategy:monetization-strategy, pm-marketing-growth:north-star-metric, pm-marketing-growth:marketing-ideas, pm-market-research:market-sizing |
| `pm-launch-architect` *(v3)* | pm-go-to-market:gtm-strategy, pm-go-to-market:beachhead-segment, pm-go-to-market:ideal-customer-profile, pm-go-to-market:gtm-motions, pm-go-to-market:growth-loops, pm-execution:pre-mortem, pm-execution:release-notes, pm-execution:stakeholder-map, product-management:stakeholder-update |
| `pm-metrics-architect` *(v3)* | pm-product-discovery:metrics-dashboard, pm-execution:plan-okrs, pm-execution:brainstorm-okrs, pm-marketing-growth:north-star, product-tracking-skills:product-tracking-design-tracking-plan, product-tracking-skills:product-tracking-instrument-new-feature, product-tracking-skills:product-tracking-model-product, product-management:metrics-review |
| `orchestrator` | product-management:product-brainstorming, pm-execution:sprint-plan, pm-execution:retro, pm-execution:summarize-meeting, pm-execution:meeting-notes, product-management:roadmap-update, pm-execution:outcome-roadmap |
| `critique-partner` | pm-execution:pre-mortem, grill-me (when user explicitly invokes) |

### How agents use the map

When an agent's Goal could be served by a specific skill:

1. Check if the skill is available in this session (system reminder lists installed skills)
2. If yes — invoke the skill via the Skill tool instead of producing the artifact long-form. This is faster, more standardized, and respects the user's skill investments.
3. If no — produce the artifact in the agent's own voice using the body sections.
4. Either way, the Executive Summary + Stop Gate still fire.

The skill's output is treated as the agent's draft. The agent may refine, critique, or merge skill output with its own analysis before producing the final handoff.

Anti-pattern: invoking a PM skill without telling the user. Always name the skill you invoked in the Executive Summary's `inputs_used` field.

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

## Decision Data Shapes (v3.3) — Appendix

Every agent's handoff includes a `decisionData` structured object that the orchestrator embeds in the dashboard's Decision Data panel. The shape depends on the agent. Four shape variants are defined:

### Type 1 — `insights` (used by: discovery-researcher, ideation-facilitator, critique-partner)

Numbered list of decision-critical findings with evidence and per-item confidence.

```yaml
decisionData:
  type: insights
  label: "Top 5 insights · with evidence + confidence"  # one-line section heading
  items:
    - text: "<strong>Cart abandonment peaks at the verify-phone step</strong>"
      evidence: "\"I gave up because the SMS never came\" — 6/12 interviews · GA4 funnel drop 41%"
      conf: high   # high | medium | low
    - text: "..."
      evidence: "..."
      conf: medium
    # Max 5 items per insights panel. Trim aggressively.
```

### Type 2 — `table` (used by: feature-prioritizer, competitive-analyst)

Structured comparison/scoring table. Use for any data where rows × columns is the natural shape.

```yaml
decisionData:
  type: table
  label: "Re-scored backlog · top 6 with deltas + MVP call"
  cols:
    - { label: "Feature" }
    - { label: "Reach",  num: true }   # num: true → right-aligned, monospace
    - { label: "Impact", num: true }
    - { label: "Effort", num: true }
    - { label: "RICE",   num: true }
    - { label: "MVP" }
  rows:
    - cells:
        - { html: "<strong>Guest checkout</strong>" }
        - { num: true, html: "9" }
        - { num: true, html: "8" }
        - { num: true, html: "3" }
        - { num: true, html: "76 <span class=\"delta-up\">↑</span>" }
        - { html: "<span class=\"pill-in\">in</span>" }
    - dropped: true                    # dropped: true → muted text + strikethrough label
      cells:
        - { html: "Wishlist sync", cls: "label" }
        - { num: true, html: "0.4 <span class=\"delta-down\">↓</span>" }
        # ...
```

Inline span classes available: `.delta-up` (green ↑), `.delta-down` (red ↓), `.pill-in` (green "in"), `.pill-out` (gray "out"), `.pill-open` (orange "open"). Max 10 rows per scoring panel.

### Type 3 — `callout` (used by: product-positioner, pm-strategist, pm-launch-architect)

Single highlighted quote with supporting context. Use for strategic decisions where ONE sentence carries the whole bet, plus elaborate underneath.

```yaml
decisionData:
  type: callout
  flavor: launch   # optional — "launch" uses orange palette instead of strategist cyan
  label: "The bet · one sentence + falsification + tradeoffs"
  quote: 'We win by being the <em>fastest</em> mobile checkout in Southeast Asia for cash-on-delivery merchants — not by feature breadth.'
  meta: '<strong>Falsifiable:</strong> if 3-tap doesn\'t lift conversion ≥18% by week 6, the bet fails.<br><br><strong>Tradeoffs we accept:</strong> ...'
```

The `<em>` in the quote gets accent color. The `meta` field is freeform HTML — usually 2–4 short paragraphs.

### Type 4 — `metrics` (used by: pm-metrics-architect)

Stacked rows of measurement-plan layers (north-star / input / health / counter).

```yaml
decisionData:
  type: metrics
  label: "4-layer measurement plan · north-star · input · health · counter"
  layers:
    - layer: "North-star"
      layerKey: "northstar"     # optional class for color emphasis
      title: "Completed checkouts per active merchant per day"
      small: "ONE number · falsifiable · tracks what users get, not what we ship"
    - layer: "Input × 3"
      title: "New activations / day · Sessions per merchant · Cart conversion %"
      small: "Variables the team can move weekly"
    - layer: "Counter × 1"
      layerKey: "counter"
      title: "Support tickets per merchant per week"
      small: "Catches winning the wrong way"
```

### Per-agent shape map

| Agent | decisionData.type | What goes in it |
|---|---|---|
| `discovery-researcher` | insights | Top 5 insights (text + evidence + confidence) |
| `competitive-analyst` | table | Pattern matrix: pattern · apps · convention · risk (max 7 rows) |
| `product-positioner` | callout | The positioning statement; meta has the value-prop options |
| `feature-prioritizer` | table | Scoring table (top 8) with deltas and MVP pills |
| `ideation-facilitator` | insights | 3–5 concept candidates with one-line tradeoff |
| `interaction-designer` | table | Flow list: flow · state count · key decisions · Figma node (max 6) |
| `usability-tester` | insights | Findings (max 5) with severity in the conf chip |
| `handoff-engineer` | table | Spec scope: screens · component states · tokens · open dev questions |
| `pm-strategist` | callout | The bet · falsification · tradeoffs |
| `pm-launch-architect` | callout (flavor: launch) | Beachhead + ICP · meta has named accounts + motion + kill-switch |
| `pm-metrics-architect` | metrics | 4 layers — north-star / input / health / counter |
| `critique-partner` | insights | Concerns (max 5); conf chip carries severity |
| `orchestrator` | (skip) | Orchestrator itself never produces decisionData — it embeds what the just-completed sub-agent produced |

### Length discipline

Each agent's decisionData stays within the v2 output caps (max 6 insights / 4 gaps / 10 scoring rows / etc.). The Decision Data panel is for the *headline* data the user needs to decide; full methodology, sample bias audit, dropped ideas, etc. still live in the MD handoff file. The dashboard's job is to make the `y / revise / pivot` choice possible without opening MD; the MD is the audit trail.
