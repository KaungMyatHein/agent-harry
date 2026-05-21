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

## Why this file exists (meta)

Original SHARED_CONTEXT.md and orchestrator.md had multi-paragraph "Reason for this rule:" justification blocks embedded inline. Those paragraphs persuaded the maintainer; they did not change agent behavior at runtime. Every agent that loaded SHARED_CONTEXT paid the token cost to re-read the persuasion every invocation.

By extracting these to a developer-facing file the agents don't load, runtime tokens drop ~500–700 per agent invocation × N agents per pipeline, without changing any rule the agents follow.
