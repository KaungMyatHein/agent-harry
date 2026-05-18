# Changelog

Most recent first. Format: `## YYYY-MM-DD — short summary`, then bullet list.

---

## 2026-05-18 — v3.2: Click-driven mode — local server + polling loop

v3.1 made the Stop Gate visual but the chips were read-only — you still had to type in chat. v3.2 makes the dashboard genuinely interactive: clickable chips POST to a local HTTP server, a new slash command runs a polling loop that drives the orchestrator on browser clicks. Click-and-walk-away UX without breaking the chat-as-source-of-truth invariant.

- **New file `templates/dashboard-server.py`** — tiny Python stdlib HTTP server on `localhost:3737`. No external deps. Serves `dashboard.html`, accepts button POSTs at `/api/action`, exposes queue state at `/api/queue`, supports `/api/reset` and `/api/health`. Writes click intent to `<project-root>/.harry-queue.json`.
- **`templates/dashboard.html` upgraded to interactive** — chips are now real `<button>` elements with `fetch()`-based handlers. `revise` and `pivot` reveal an inline text input below the chip row so you can type just the delta and submit. Connection-status pill (top-right) shows server reachability. Toast notifications confirm successful clicks. Polls `/api/queue` every 3 seconds to reflect queued state in the UI.
- **New slash command `templates/.claude/commands/agent-harry-loop.md`** — drives the polling loop. Uses `ScheduleWakeup` to schedule next ticks. Reads `.harry-queue.json` each cycle; when a click is queued, dispatches to the `orchestrator` subagent with the click's intent baked into the invocation prompt. Idle cycles cost ~$0.015 each (one cheap turn that just reads the file + schedules), capped at 20 polls (~20 min) before auto-pause.
- **New file `templates/.harry-queue.json`** — queue state schema. Fields: `queued_action` (the pending click or null), `last_action_processed` (audit trail), `poll_count`, `max_polls`, `session_started`. Single source of truth for the click→orchestrator handoff.
- **Orchestrator gets a Queue Mode note** — when invoked by `/agent-harry-loop`, the orchestrator does NOT call `ScheduleWakeup` itself (the slash command owns scheduling). Otherwise unchanged — same Executive Summary, same Stop Gate, same `dashboard.html` write at every turn.
- **SHARED_CONTEXT.md gets a "Queue Mode (v3.2)" subsection** — architecture summary, setup steps, stop conditions. Queue Mode is opt-in; chat-only mode (v3.1 behavior) still works exactly as before.
- **Install + Refresh modes updated** — copy `dashboard-server.py` + `.harry-queue.json` + `agent-harry-loop.md` slash command. Refresh preserves an existing `.harry-queue.json` (it may have in-flight state) but always overwrites the server, slash command, and HTML files.

Architecture decision (worth calling out):

> The `/agent-harry-loop` slash command runs in the **main Claude Code session**, not as a subagent. This is necessary because `ScheduleWakeup` is only available in the main session's dynamic-loop mode, not in subagent tool lists. The orchestrator subagent stays focused on product-design work; the loop driver handles the click polling.

Setup steps for click-driven mode:

```bash
# Terminal 1 — start the server (no deps, just Python stdlib)
cd <project> && python3 dashboard-server.py

# Browser — open the dashboard
open http://localhost:3737

# Terminal 2 — start Claude Code
cd <project> && claude
# Then: /agent-harry-loop <your goal>
```

Stop conditions for the loop: user clicks `cancel`, idle timeout (20 polls), orchestrator returns `complete`, user types `/end-loop` in chat, or queue corruption (after one retry).

## 2026-05-18 — v3.1: Visual Stop Gate companion — `dashboard.html`

After v3 shipped, reading text TL;DR cards step-by-step still felt tiring. v3.1 adds a self-contained visual dashboard that renders alongside the chat — the human reads the Exec Summary visually, types decisions in chat. Spec was grilled across 7 design branches before any code was written.

- **New file `templates/dashboard.html`** — a self-contained static HTML page (no JavaScript, no external assets) showing the current pipeline state in a single-focus layout: top bar (project + cost meter) · history breadcrumb (compressed) · BIG NOW card (status, agent, mode, phase pill, 4 stat cells, 3-bullet TL;DR, next-move suggestion, 5 command chips) · suggested-next strip · footer.
- **Orchestrator rewrites `dashboard.html` at every Stop Gate** — new "Dashboard Rendering" section in `orchestrator.md` instructs the orchestrator to overwrite `<project-root>/dashboard.html` with current pipeline state inlined as HTML. Auto-refreshes in the Claude Preview MCP panel. ~1–2k extra output tokens per Stop Gate, well within the $3 ceiling.
- **Cost meter is load-bearing** — top-bar cost value uses a color class: `budget-ok` (green, ≤$1.50) / `budget-warn` (yellow, $1.50–$2.50) / `budget-over` (red, >$2.50). Surfaces the v2 token-budget rule visually.
- **Read-only by design** — command chips in the dashboard display the literal text the user types in chat (`y / revise <delta> / pivot — <X> / grill me / cancel`). Clicks do nothing. Chat remains the source of truth, audit trail, and input surface. Silence is still not consent.
- **Single-focus layout matches Alignment Loop** — past steps are compressed crumbs, current step is the visual centerpiece, future is a non-binding "suggested" strip. No Kanban "Pending" column because there's no pre-committed plan.
- **Graceful degrade** — if `dashboard.html` doesn't exist (e.g. pre-v3.1 install that hasn't been refreshed), orchestrator skips the render silently and prints TL;DR in chat as before. Same for explicit "no dashboard" opt-out.
- **Install + Refresh modes updated** — both now copy `templates/dashboard.html` to project root. Refresh checks `SHARED_CONTEXT.md` for "Dashboard companion" marker and warns if the project is pre-v3.1.
- **SHARED_CONTEXT.md gets a "Dashboard companion (v3.1)" subsection** under the Always-On Stop Gate section — single source of truth for the architecture.

Resolved by pre-implementation grilling:
- Whole-experience problem (text volume + sequence + progress + input) → visual surface helps
- Chat behavior → truncated supplement (chat = timeline log, dashboard = TL;DR detail)
- Location → Claude Preview MCP panel (already in user's workflow)
- Interaction → read-only chips (clicks don't save typing for the common `y` path)
- Layout → single-focus with breadcrumb + suggested-next (Alignment-Loop friendly)
- Live-ness → Stop-Gate only (no mid-step "running…" animation in v1)
- Scope → static mockup first, then orchestrator integration

## 2026-05-18 — v3: PM Skills Integration + Alignment Loop (anti-waterfall orchestration)

Two structural shifts: Agent Harry now covers PM as well as design, and the orchestrator works *with* the user via an Alignment Loop instead of running a fixed Discovery → Define → Deliver waterfall.

- **3 new PM agents added** (all sonnet — fits the v2 token budget):
  - `pm-strategist` — vision, business model, market scan (SWOT/PESTLE/Porter/Ansoff), value proposition, pricing, north-star metric, market sizing
  - `pm-launch-architect` — GTM strategy, beachhead segment, ICP, sales/marketing motions, battlecards, growth loops, launch sequencing, pre-mortems, stakeholder maps
  - `pm-metrics-architect` — north-star + input + health + counter-metric design, OKR planning, tracking plans, instrumentation
- **PM Skills Map** added to `SHARED_CONTEXT.md` — every agent now knows which `pm-*` and `product-management:*` skills it owns and can invoke via the Skill tool instead of producing artifacts from scratch. Covers the full PM toolkit: strategy, market research, marketing/growth, GTM, product discovery, execution, tracking, plus general toolkit utilities.
- **Total agents now 13** (10 design + 3 PM). Opus still only on `orchestrator` + `critique-partner`; the other 11 stay on sonnet.
- **Orchestrator default mode shifted from Waterfall → Alignment Loop** — the orchestrator no longer produces a 5-phase pipeline upfront. Instead it:
  1. **Diagnoses** with at most 2 questions (or skips if the goal is concrete)
  2. **Proposes the smallest-next-move** — one agent, one mode, one tight goal
  3. **Runs** that single move
  4. **Realigns** — presents what was learned, proposes the next move, loops back to step 2
- **New `pivot — <new direction>` command** at every Stop Gate — lets the user steer the loop somewhere else without cancelling. Documented in orchestrator's Stop Gate response table.
- **Waterfall mode preserved as fallback** — when the user explicitly asks for a fixed plan ("plan the full pipeline", "lay out all phases"), orchestrator drops into the old Waterfall mode. Same Stop Gates between every step. User can break out with `pivot` at any gate.

The Alignment Loop is the answer to feedback that linear waterfall feels rigid even with Stop Gates — the orchestrator should *align with* the user, not present plans for approval.

## 2026-05-18 — v2.1: Always-On Stop Gate (per-step approval, even in bypass-permission mode)

- **Always-On Stop Gate added** — `SHARED_CONTEXT.md` and `orchestrator.md` now define a mandatory per-step approval gate. After every sub-agent run, the orchestrator MUST present the Executive Summary + TL;DR, then stop and wait for explicit user input. No auto-proceeding.
- **Bypass-permission mode does NOT waive this gate** — permission bypass authorizes *tools*, not *user-in-the-loop checkpoints*. The Stop Gate is a product-design discipline, not a sandbox restriction. Codified explicitly to prevent the regression.
- **Four-option prompt** — every Stop Gate ends with: `y` (proceed) / `revise <delta>` (iterate the same step) / `grill me` (invoke `grill-me` skill to stress-test) / `cancel` (halt). Silence is not consent.
- **Revision loop spec'd** — on `revise <delta>`, re-invoke the same sub-agent with the delta added to its Goal and the prior handoff as Input. The revised output re-fires the Stop Gate.
- **`grill-me` integration** — orchestrator proactively suggests `grill me` when output is foundational, confidence is low/medium, the output makes non-obvious tradeoffs, or the user has been moving fast.
- **Phase agents updated** — every one of the 9 phase + cross-cutting agents now ends its Output Format with the Stop Gate prompt requirement, so they self-stop even when invoked directly (not via orchestrator).

## 2026-05-18 — v2: Research-First Gate, Executive Summary, Token Budget

Three problems addressed after a real-world Agent Harry feature run cost ~$8 USD and produced AI-friendly-but-human-hostile long-form outputs without any research-first enforcement.

- **Research-First Gate (Hard Block)** — `SHARED_CONTEXT.md` and `orchestrator.md` now define a hard gate: Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`) cannot be invoked unless a Discovery/Define handoff artifact exists or the user has explicitly opted out. Codifies the "don't shortcut Agent Harry pipeline" feedback from 2026-05-18.
- **New `/audit-pipeline` slash command** — `templates/.claude/commands/audit-pipeline.md`. Reports pipeline state (Discovery/Define/Deliver artifact counts), enforces the gate, and surfaces the cheapest unblock path. Designed to be cheap — reads only Executive Summary blocks, not long-form bodies.
- **Executive Summary block (Human-First, Always First)** — Every agent handoff now starts with a stat-card table + 3-bullet TL;DR + one-line next step. The long-form body lives below for AI handoff. Human-readable summary surfaces in <30 seconds; AI-readable detail still available downstream.
- **Token Budget rules** — `SHARED_CONTEXT.md` defines hard output caps (max 6 insights / 4 gaps / 4 concerns / 10 scoring rows / 5 open questions). Orchestrator estimates token cost upfront and refuses plans that exceed $3 USD without explicit user approval.
- **Model routing changed** — 8 phase agents (`discovery-researcher`, `competitive-analyst`, `product-positioner`, `feature-prioritizer`, `ideation-facilitator`, `interaction-designer`, `usability-tester`, `handoff-engineer`) switched from `opus` to `sonnet`. Opus reserved for `orchestrator` and `critique-partner`. Single biggest token cost reduction.
- **Synthesis discipline** — Orchestrator now reads only Executive Summary blocks from prior handoffs by default, not full long-form bodies. Long-form loaded only when a specific decision requires it.
- **Install + Refresh modes updated** — Both now copy `templates/.claude/commands/` alongside `.claude/agents/`. Refresh additionally checks whether the project's `SHARED_CONTEXT.md` is pre-v2 and warns the user to merge the new sections.

## 2026-05-18 — Initial release as `agent-harry`

- Renamed skill from `product-designer-os` to `agent-harry` (personal brand).
- `SKILL.md` description now carries equal-weight brand + semantic + Burmese triggers, so the skill routes whether the user says "install Agent Harry", "set up product designer agents", or "design agent တွေ install လုပ်ပေး".
- Added **Mode 2 — Refresh**: re-copies the 10 agent template files into an already-installed project while preserving `SHARED_CONTEXT.md` and `README.md`. Warns on uncommitted local edits.
- Added **Mode 3 — Update**: runs `git pull --ff-only` on `~/.claude/skills/agent-harry/` and shows the top of this CHANGELOG. Stops if the working tree is dirty (no auto-stash).
- Existing **Mode 1 — Install** (Bundled + Generator) preserved unchanged from the source bundle.
- Templates (`templates/SHARED_CONTEXT.md`, `templates/README.md`, `templates/.claude/agents/*.md`) carried over verbatim from the source bundle — 10 agents covering orchestrator, discovery-researcher, competitive-analyst, product-positioner, feature-prioritizer, ideation-facilitator, interaction-designer, usability-tester, handoff-engineer, critique-partner.
- Repo: `KaungMyatHein/agent-harry` (public, MIT license).
