# RATIONALE.md

The "why" behind Agent Harry's load-bearing rules. Agents do NOT read this file at runtime — they read the rules in `SHARED_CONTEXT.md` and execute them. This file is for humans (the maintainer, contributors, future-Harry) who want to understand or revisit the design decisions.

If you're an agent and you ended up here, you went down the wrong path. Go back to `SHARED_CONTEXT.md`.

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

The cost meter on the dashboard turns yellow at $1.50 and red at $2.50 — a visual warning the user can react to before the ceiling.

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
- `DECISION_DATA_SHAPES.md` (v3.6 / v3.3) — dashboard decision-data shapes extracted from inline schemas

`SUBAGENT_AUDIT_PROTOCOL.md` is the third extracted appendix: single source of truth for the audit protocol; lazy-loaded by subagents only when they need to perform a protocol step; never loaded by the orchestrator (which has its own audit rules in `orchestrator.md` directly).

Each subagent's Output Format adds ONE line — *"Follow `SUBAGENT_AUDIT_PROTOCOL.md` for session_id derivation, ledger append, and slug propagation"* — replacing the 5-line per-agent boilerplate. When the protocol evolves (say, a new event type is added), it changes in one file instead of fourteen.

Anti-pattern this avoids: agent prompts that *describe* mechanical procedures instead of *referencing* them. Long agent files dilute the agent's voice and load-bearing instructions with logistics. Extract the logistics; let the agent file stay about the agent's job.

---

## Why a passive ledger over a dedicated logging agent (v3.8)

The intuitive answer to *"we need a cross-session audit trail"* is *"add a `logging-agent` that runs after every Stop Gate."* The intuitive answer was wrong here. Logging is mechanical — no judgment, no synthesis, no tradeoff-weighing. An LLM agent for it is paying $0.02–0.05 per Stop Gate to do what a 2-line file append does for free.

The bundled philosophy in `RATIONALE.md` § "Why Opus only on orchestrator + critique-partner" applies broadly: **agents exist where judgment is needed.** Mechanical work — token counting, file appending, schema validation — belongs in deterministic code paths (here, the orchestrator's existing Stop Gate write moment), not in new agents.

What the orchestrator already does at every Stop Gate:
1. Reads sub-agent handoff Executive Summary
2. Estimates cost, updates running total
3. Writes `dashboard.html` with current state
4. Presents Stop Gate prompt to user

Adding *"append one JSONL line to `.harry-audit.jsonl`"* as step 3.5 is structurally trivial — all the data is already in the orchestrator's hand. A logging agent would have to be re-invoked, re-loaded, re-paid for the same data the orchestrator has in context.

What got dropped by NOT making it an agent: extensibility. A real agent could (hypothetically) summarize patterns ("you tend to pivot on Tuesdays"), spot anomalies ("this session's cost is 3× your average"), or escalate ("you've cancelled the same pipeline 4 times — is the goal wrong?"). The passive ledger captures the raw data those analyses would need; the analyses themselves can be future skills/commands that read the ledger when invoked, not always-on agent runs.

The render command (`/agent-harry-audit`) is the right shape for those analyses anyway — user-triggered, on-demand, parameterized. Always-on logging agent would compound token cost every Stop Gate; on-demand render pays only when the user actually wants to read.

Cost comparison:
- **Logging agent:** ~$0.02 × ~8 Stop Gates/pipeline = $0.16/pipeline × ~10 pipelines/week = ~$1.60/week of pure overhead
- **Passive ledger:** ~$0.01/pipeline (50 extra orchestrator tokens) + ~$0.02 per audit render (maybe twice a week) = ~$0.14/week

The savings (~$1.46/week) goes to the actual agents doing actual work.

---

## Why interaction-designer was split into low-fi-designer + design-engineer (v3.7)

The bundled `interaction-designer.md` was a 187-line file trying to be three different agents at once:

1. A low-fi wireframer answering *"does the screen architecture make sense?"*
2. A hi-fi visual designer producing Figma mockups
3. A code-prototyper writing real HTML/React with state coverage

Three distinct fidelity disciplines, three distinct output contracts, three distinct conversation partners (PM for flow, design system for visual, engineering for code). One agent could technically do all three, but in practice the user kept asking *"which mode do I invoke it in?"* and the orchestrator's routing had to embed compound conditionals (*"if user has Figjam → start at hi-fi; if user has prototype → audit; otherwise → start at lo-fi"*).

The split at v3.7 picks the two seams where the crafts diverge most:

- **`low-fi-designer` (Define phase)** owns flow + ASCII wireframes + DS component identification. Output is decision-shaping, not visual.
- **`design-engineer` (Deliver phase)** owns production-ready frontend code with real state coverage. Output is buildable, demoable, and engineering-handoff-grade.

What got dropped: explicit hi-fi-Figma-only workflow. That craft is now either upstream of `design-engineer` (DS / Figma library exists, agent uses tokens directly) or downstream (`handoff-engineer` audits a Figma file against the built prototype). The user can re-install the retired `interaction-designer.md` from a v3.6 backup if pure Figma hi-fi is the workflow they want.

Cost: agent count grew 14 → 15 (one new file net). But routing logic in the orchestrator got simpler (no more "which mode of interaction-designer?"), and each new agent's intake questions / output format / anti-patterns are sharper because each agent has one job. The Stop Gate UX also gets cleaner — `low-fi-designer`'s gate asks *"pick a layout"*, `design-engineer`'s gate asks *"run the prototype locally and decide"*. Different decisions, different prompts.

The orphan-check step in Refresh mode exists because pre-v3.7 installs have `interaction-designer.md` in `.claude/agents/` that's no longer in templates. Without the check, that file sits as a confusing orphan — orchestrator routing won't reference it but the user can still invoke it directly with stale guidance.

---

## Why this file exists (meta)

Original SHARED_CONTEXT.md and orchestrator.md had multi-paragraph "Reason for this rule:" justification blocks embedded inline. Those paragraphs persuaded the maintainer; they did not change agent behavior at runtime. Every agent that loaded SHARED_CONTEXT paid the token cost to re-read the persuasion every invocation.

By extracting these to a developer-facing file the agents don't load, runtime tokens drop ~500–700 per agent invocation × N agents per pipeline, without changing any rule the agents follow.
