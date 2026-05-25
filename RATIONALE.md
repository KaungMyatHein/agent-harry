# RATIONALE.md

The "why" behind Agent Harry's load-bearing rules. Agents do NOT read this file at runtime — they read the rules in `SHARED_CONTEXT.md` and execute them. This file is for humans (the maintainer, contributors, future-Harry) who want to understand or revisit the design decisions.

If you're an agent and you ended up here, you went down the wrong path. Go back to `SHARED_CONTEXT.md`.

---

## Why the Product Fingerprint exists (v4.0)

DS tokens describe **vocabulary** but not **how it's composed**. Two products with the same DS can feel completely different — one dense and clinical, the other airy and playful. Without a project-level reference for composition idioms, copy tone, density, and anti-patterns, Agent Harry's Deliver agents produced DS-correct but product-foreign work. New screens looked technically right and visibly bolted on.

The fingerprint closes that gap with a small, curated, reusable artifact (`<project-root>/product-fingerprint.md`) extracted from 3–7 designer-picked "exciting" Figma frames. Visual language signals + composition patterns + mandatory anti-patterns. Read by `lo-fi-designer`, `figma-designer`, and `design-engineer` at intake.

### Why user-curated Figma references (not auto-detected)

"Exciting" is a judgment call. Auto-detection by last-modified time, component density, or page name picks the wrong frames — last-edited ≠ most-representative, most-components ≠ most-polished. The designer knows which screens define the product; the agents don't. The cost of a wrong reference set is invisible drift: every new screen anchors to mediocre examples. Worse than no reference at all.

### Why code paths are auto-discovered (not curated)

Composition idioms in code don't need curation — any non-trivial existing screen in the feature area reveals them. The PRD names the feature scope (`checkout`); the codebase has structure (`app/checkout/*`); auto-discovery surfaces the relevant files. Making the designer curate code paths is friction without payoff.

### Why mandatory anti-patterns (3–5 per fingerprint)

Negative signal is half the value. "We don't use playful illustrations" prevents downstream agents from pattern-matching from generic best practices and injecting something that breaks the language. Without explicit negatives, the fingerprint guides what to *do* but not what to *avoid*. Anti-patterns made mandatory because they're the half designers forget to write down.

### Why one fingerprint per project (not per-feature)

The visual language of a product doesn't change between Tuesday and Thursday. Re-curating every session is waste. The whole point of the fingerprint is consistency across features — if it changed per-feature, every feature would have its own "exciting screens," defeating the goal. Refresh happens on real product evolution (rebrand, redesign, DS major version), not on routine work.

### Why refuse-with-explicit-opt-out (not hard-refuse, not silent-skip)

Hard-refuse-no-opt-out is wrong because some teams legitimately don't have curatable references yet (greenfield product, pre-launch). Silent-skip is wrong because drift-by-omission is the failure mode this exists to prevent. The middle path — refuse by default, override only with an explicit phrase (`skip fingerprint` or `proceed with stale fingerprint`) — matches the Research-First Gate and Success-Metrics Gate patterns and forces conscious choice. The audit ledger captures the opt-out so quality drift becomes traceable.

### Why Primary anchors entry-point over fingerprint when they disagree

Continuity beats consistency. If the user just clicked a Checkout button on a sidebar+main Cart page, the next screen should also be sidebar+main even if the fingerprint's hero work is full-bleed. The user's mental model is "I'm still in the same flow," not "now I'm in the brand voice." Entry-point continuity is local; fingerprint consistency is global. Local wins for the first screen of a new flow.

### Why `low-fi → lo-fi` rename was bundled

The artifact files were already `lo-fi-<feature_slug>.md`. The agent identifier was `low-fi-designer`. The user-facing capitalization was "Lo-Fi" in headings. The inconsistency was small but real, and v4.0 touched all three Deliver agents anyway — a clean moment to align naming.

### What's deferred (v4.1+)

- **`critique-partner` using fingerprint anti-patterns as critique criteria** — high value, but adds another integration point. Defer until the v4.0 enforcement has run in real projects and the anti-pattern format has stabilized.
- **Quality-bar gating purpose** — purpose B from the grilling session ("new screens must be at least as polished as existing hero screens"). Adding a quality gate risks making the pipeline so strict nothing ships. Defer until v4.0 consistency mechanisms are proven; revisit when it's clear the gate is needed.
- **Screenshots / live URLs as alternative reference inputs** — would help teams with sparse Figma. But screenshots are flat (no structural data) and live URLs add Playwright complexity. Defer until the Figma-only constraint causes real friction.
- **Auto-staleness detection beyond `lastModified`** — visual hashing would catch silent edits the timestamp misses, but it's effectively re-running the curator on every intake. Cost-prohibitive for marginal value.

---

## Why the Research-First Gate exists

A "comprehensive-looking" PRD is still an artifact that needs Mode B audit before downstream work. Skipping straight to Deliver makes the design throwaway-risky if Discovery later surfaces an unvalidated assumption that breaks the foundation. This rule exists because the user (Kaung Myat Hein) has explicitly burned cycles re-doing Deliver work after assumptions failed audit.

The gate trades a small upfront cost (one Discovery / audit run) for a large downstream save (avoiding redesign loops).

---

## Why the Success-Metrics Gate exists

Without confirmed success metrics, Deliver artifacts (screens, specs, GTM plans) optimize for nothing in particular. Worse, they optimize for the designer's *implicit* metrics, not the team's *actual* ones — a hidden assumption that only surfaces post-launch when "is this working?" gets asked and nobody can agree on what "working" means.

Forcing a `pm-metrics-architect` step + explicit user confirmation (the Stop Gate after metrics) makes the optimization target a deliberate decision, not a default. The cost is one sonnet run (~$0.10) up front; the save is alignment downstream.

---

## Why Opus only on orchestrator + critique-partner

Opus pricing is ~5× sonnet. A full Discovery → Define → Deliver pipeline runs 8–12 agents. If every agent ran on opus, a single feature could cost $8–15. By restricting opus to:

- **Orchestrator** — needs to plan, weigh tradeoffs across phases, route correctly; this is the highest-leverage Opus use.
- **Critique-partner** — adversarial reasoning is where Opus's depth pays off most.

…the same pipeline costs $1–3. This is the **single biggest token lever** in the system. Don't override per-agent without a logged reason in the handoff.

---

## Why Mode B (audit) is preferred over Mode A (generate)

Every Agent Harry agent has both modes:
- Mode A — generate fresh artifact from scratch
- Mode B — audit / extend / critique an existing artifact

A positioning, prioritization, or design decision built on un-analyzed prior work is a decision that ignores work already paid for (research the team already did, decks already written, designs already shipped). Squeeze existing artifacts dry **before** commissioning anything new or downstream.

The Data-First Routing Rule (in orchestrator.md) enforces this: when the user provides files, links, or references to existing work, the orchestrator routes to the phase-appropriate agent in Mode B first.

---

## Why the Always-On Stop Gate fires even with bypass-permissions

Permission bypass authorizes *tools* (the user has decided they trust Claude to write files, run commands, etc. without per-call approval). It does NOT waive product-design *checkpoints* — the Stop Gate is a discipline rule, not a sandbox rule. It exists because the user, even in fast mode, needs to confirm direction at each phase boundary to prevent compounding the wrong assumption across 5 agent runs.

Treating bypass-permissions as "skip the gates too" is a regression, not a feature.

---

## Why the orchestrator reads only Executive Summary of prior handoffs

The single biggest token saving in the pipeline. Full long-form bodies of 8 agent handoffs = ~40–60k tokens. Executive Summaries = ~3–5k tokens total. The orchestrator's job is to *route and synthesize*, not to absorb every detail — details live in the MD files for downstream agents or future-self reads.

Long-form is loaded **only when a specific decision requires it** (e.g. the user asks "why did you drop the wishlist feature?" — orchestrator can then read the feature-prioritizer's long-form to surface the tradeoff).

---

## Why $3 is the soft ceiling per pipeline

The user has explicitly called out $8/feature as unacceptable. $3 is a deliberately tight ceiling to keep Agent Harry usable for the user's actual workflow (running multiple pipelines per week on personal projects). When a plan looks like it will exceed $3:
- Scope down (fewer agents, tighter goal)
- Use Mode B over Mode A where possible
- Cap each agent's output per the Token Budget Rules
- Surface the cost upfront and ask the user to approve

The cost meter is surfaced on demand via `/agent-harry-cost` — turns yellow at $1.50 and red at $2.50 thresholds in the rendered output. (Pre-v5.0, this was an always-on banner on `dashboard.html`'s top bar — removed in v5.0 alongside the dashboard.)

---

## Why Notion sync is opt-in, never auto

Auto-syncing on every Stop Gate would:
1. Waste Notion API quota
2. Publish un-confirmed drafts (only artifacts the user has approved with `y` should land in Notion — that's the team's read-once source of truth)
3. Couple a local design pipeline to an external system the user may not even use

Notion sync is a `/agent-harry-notion-sync` slash command — the user invokes it deliberately, when there's something worth publishing.

---

## Why a centralized Subagent Audit Protocol (v3.8 post-grill)

The Q3 + Q5 grilling decisions (subagent writes its own `stop_gate` ledger entry; subagent derives iteration count from the ledger) created an implementation gap: every one of 14 subagents needs ~5 lines of identical boilerplate explaining session_id derivation, ledger append format, slug propagation, and iteration-count algorithm. 14 × 5 = 70 lines of duplication, with predictable drift over time as one agent's copy diverges from another's.

The fix is the same pattern Agent Harry already uses for two other appendix-style specs:

- `PM_SKILLS_MAP.md` (v3.6) — per-agent PM skill ownership extracted from inline duplication in each agent file
- `DECISION_DATA_SHAPES.md` (v3.6 / v3.3 / v5.0) — decision-data shapes extracted from inline schemas; v5.0 retargeted rendering from dashboard HTML to chat markdown

`SUBAGENT_AUDIT_PROTOCOL.md` is the third extracted appendix: single source of truth for the audit protocol; lazy-loaded by subagents only when they need to perform a protocol step; never loaded by the orchestrator (which has its own audit rules in `orchestrator.md` directly).

Each subagent's Output Format adds ONE line — *"Follow `SUBAGENT_AUDIT_PROTOCOL.md` for session_id derivation, ledger append, and slug propagation"* — replacing the 5-line per-agent boilerplate. When the protocol evolves (say, a new event type is added), it changes in one file instead of fourteen.

Anti-pattern this avoids: agent prompts that *describe* mechanical procedures instead of *referencing* them. Long agent files dilute the agent's voice and load-bearing instructions with logistics. Extract the logistics; let the agent file stay about the agent's job.

---

## Why a passive ledger over a dedicated logging agent (v3.8)

The intuitive answer to *"we need a cross-session audit trail"* is *"add a `logging-agent` that runs after every Stop Gate."* The intuitive answer was wrong here. Logging is mechanical — no judgment, no synthesis, no tradeoff-weighing. An LLM agent for it is paying $0.02–0.05 per Stop Gate to do what a 2-line file append does for free.

The bundled philosophy in `RATIONALE.md` § "Why Opus only on orchestrator + critique-partner" applies broadly: **agents exist where judgment is needed.** Mechanical work — token counting, file appending, schema validation — belongs in deterministic code paths (here, the orchestrator's existing Stop Gate write moment), not in new agents.

What the orchestrator already does at every Stop Gate (v5.0):
1. Reads sub-agent handoff Executive Summary
2. Estimates cost, updates running total
3. Renders the Decision Data block as chat markdown
4. Presents Stop Gate prompt to user

(Pre-v5.0 also wrote `dashboard.html` here — removed; chat is the only surface.)

Adding *"append one JSONL line to `.harry-audit.jsonl`"* as step 3.5 is structurally trivial — all the data is already in the orchestrator's hand. A logging agent would have to be re-invoked, re-loaded, re-paid for the same data the orchestrator has in context.

What got dropped by NOT making it an agent: extensibility. A real agent could (hypothetically) summarize patterns ("you tend to pivot on Tuesdays"), spot anomalies ("this session's cost is 3× your average"), or escalate ("you've cancelled the same pipeline 4 times — is the goal wrong?"). The passive ledger captures the raw data those analyses would need; the analyses themselves can be future skills/commands that read the ledger when invoked, not always-on agent runs.

The render command (`/agent-harry-audit`) is the right shape for those analyses anyway — user-triggered, on-demand, parameterized. Always-on logging agent would compound token cost every Stop Gate; on-demand render pays only when the user actually wants to read.

Cost comparison:
- **Logging agent:** ~$0.02 × ~8 Stop Gates/pipeline = $0.16/pipeline × ~10 pipelines/week = ~$1.60/week of pure overhead
- **Passive ledger:** ~$0.01/pipeline (50 extra orchestrator tokens) + ~$0.02 per audit render (maybe twice a week) = ~$0.14/week

The savings (~$1.46/week) goes to the actual agents doing actual work.

---

## Why interaction-designer was split into lo-fi-designer + design-engineer (v3.7)

The bundled `interaction-designer.md` was a 187-line file trying to be three different agents at once:

1. A lo-fi wireframer answering *"does the screen architecture make sense?"*
2. A hi-fi visual designer producing Figma mockups
3. A code-prototyper writing real HTML/React with state coverage

Three distinct fidelity disciplines, three distinct output contracts, three distinct conversation partners (PM for flow, design system for visual, engineering for code). One agent could technically do all three, but in practice the user kept asking *"which mode do I invoke it in?"* and the orchestrator's routing had to embed compound conditionals (*"if user has Figjam → start at hi-fi; if user has prototype → audit; otherwise → start at lo-fi"*).

The split at v3.7 picks the two seams where the crafts diverge most:

- **`lo-fi-designer` (Define phase)** owns flow + ASCII wireframes + DS component identification. Output is decision-shaping, not visual.
- **`design-engineer` (Deliver phase)** owns production-ready frontend code with real state coverage. Output is buildable, demoable, and engineering-handoff-grade.

What got dropped: explicit hi-fi-Figma-only workflow. That craft is now either upstream of `design-engineer` (DS / Figma library exists, agent uses tokens directly) or downstream (`handoff-engineer` audits a Figma file against the built prototype). The user can re-install the retired `interaction-designer.md` from a v3.6 backup if pure Figma hi-fi is the workflow they want.

Cost: agent count grew 14 → 15 (one new file net). But routing logic in the orchestrator got simpler (no more "which mode of interaction-designer?"), and each new agent's intake questions / output format / anti-patterns are sharper because each agent has one job. The Stop Gate UX also gets cleaner — `lo-fi-designer`'s gate asks *"pick a layout"*, `design-engineer`'s gate asks *"run the prototype locally and decide"*. Different decisions, different prompts.

The orphan-check step in Refresh mode exists because pre-v3.7 installs have `interaction-designer.md` in `.claude/agents/` that's no longer in templates. Without the check, that file sits as a confusing orphan — orchestrator routing won't reference it but the user can still invoke it directly with stale guidance.

---

## Why dashboard was removed (v5.0)

v3.1 introduced `dashboard.html` as a visual companion to chat — a static HTML file the orchestrator overwrote after every Stop Gate, designed to be viewed in the Claude Preview MCP panel. v3.2 layered Queue Mode on top: clickable chips, Python HTTP server (`dashboard-server.py`), queue state file (`.harry-queue.json`), polling slash command (`/agent-harry-loop`). v3.3 added the Decision Data panel inside the NOW card so the user could decide without opening the MD handoff.

Across the entire lifetime of those features (~7 versions, ~6 months), the user (Harry) never actually looked at the dashboard in practice. The decision was always made in chat. The Preview MCP refresh wasn't seamless enough to be worth glancing at; Queue Mode's 60s polling latency felt clunky vs typing in chat; the per-Stop-Gate HTML write was 1–2k tokens of overhead for a surface that was being ignored.

v5.0 ripped the whole stack:

- Deleted: `templates/dashboard.html`, `templates/dashboard-server.py`, `templates/.harry-queue.json`, `templates/.claude/commands/agent-harry-loop.md`, `docs/wiki/concepts/dashboard.md`, `docs/wiki/commands/agent-harry-loop.md`, `docs/dashboard-demo.html`.
- Rewrote: `orchestrator.md` — stripped the Dashboard Rendering protocol section and the Queue Mode section; added a new Decision Data Rendering section that maps each shape (insights / table / callout / metrics) to chat markdown.
- Retargeted: `DECISION_DATA_SHAPES.md` — same 4 shapes, rendering target shifted from inline HTML strings (designed for `innerHTML` injection) to chat markdown (with a minimal HTML→markdown back-compat shim).
- Cleaned: SHARED_CONTEXT.md, SKILL.md, README.md, CHANGELOG.md, all wiki pages, all sub-agent files that referenced dashboard chip-hints or "rendered in the dashboard's panel" framing.

What survived the rip: the *forcing-function value* of structured `decisionData`. Agents still produce top insights with evidence + per-item confidence, scored tables with explicit columns, etc. That discipline existed before dashboard and survives after — the rendering target changed, the data shape didn't.

What didn't get rebuilt: any visual companion at all. Chat is the only decision surface in v5.0. The cost meter (formerly a top-bar banner with color thresholds) moved to on-demand via `/agent-harry-cost`. No replacement preview panel, no terminal TUI, no browser extension — chat is the canonical mental model for one user (Harry) working in Claude Code.

Anti-pattern this retracts: building secondary surfaces "in case" the user wants them. Build the surface the user actually uses, see whether they actually use it, then retire it cleanly if they don't. The v5.0 rip is the clean-retirement step — sunk cost of 7 versions of work is irrelevant once the data is in: never used, can't earn its keep, gone.

---

## Why this file exists (meta)

Original SHARED_CONTEXT.md and orchestrator.md had multi-paragraph "Reason for this rule:" justification blocks embedded inline. Those paragraphs persuaded the maintainer; they did not change agent behavior at runtime. Every agent that loaded SHARED_CONTEXT paid the token cost to re-read the persuasion every invocation.

By extracting these to a developer-facing file the agents don't load, runtime tokens drop ~500–700 per agent invocation × N agents per pipeline, without changing any rule the agents follow.
