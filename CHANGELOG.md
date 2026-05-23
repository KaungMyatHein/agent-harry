# Changelog

Most recent first. Format: `## YYYY-MM-DD — short summary`, then bullet list.

---

## 2026-05-23 — v3.9: `figma-designer` agent (hi-fi Figma side of the Deliver fork)

Adds a 16th agent: `figma-designer`, the Figma-side counterpart to `design-engineer`. Same pipeline slot (after `low-fi-designer`), same hi-fi expectation, different surface. Designers who live in Claude Code can now generate hi-fi Figma frames for an approved lo-fi flow without manually redrawing every screen.

Motivated by: Agent Harry had a code-side Deliver path (`design-engineer`) but no Figma-side equivalent. Designer-developers (the maintainer's actual workflow) wanted "the design-engineer experience, but for Figma" — same intake discipline, same scope cap, same Stop Gate, output to Figma frames instead of code files.

- **New agent `figma-designer`** — `templates/.claude/agents/figma-designer.md`. Tools: `Read, Write, Glob, Grep, mcp__figma`. Model: sonnet. Decision authority: `propose`. Phase: deliver. Consumes `lo-fi-<feature-slug>.md` + `prds/<feature-slug>.md`, resolves a user-specified Design System, invokes `use_figma` (per `/figma-use` skill) to generate frames with real DS component instances, real PRD content, applied tokens, and the declared state set per screen.
- **Scope discipline** — 1 flow per invocation, ALL screens in the flow (no artificial cap; batches into multiple `use_figma` calls for >10 screens). Max 3 states per screen by default (default + empty + error); user can opt into a 4th (loading) at intake. Mirrors `design-engineer`'s 1-flow rule but removes its screen subset shortcut — designer cannot ship a half-flow.
- **DS-or-refuse gate** — Question 3 of the intake (Design System source) is REQUIRED. Without a DS answer, agent refuses with *"Hi-fi Figma without a DS produces meaningless visuals."* User can override with explicit phrase `"proceed with generic Material defaults"` — agent falls back to Material 3 and flags `ds_status: defaulted` in the handoff.
- **Pipeline slot** — registered in `orchestrator.md` agent table between `low-fi-designer` and `design-engineer`. Both Research-First Gate (line ~50) and Success-Metrics Gate (line ~63) extended to include `figma-designer` in their Deliver-agent lists. Post-metrics routing now offers `design-engineer` OR `figma-designer` off a lo-fi handoff — user picks the surface they want first. If a `figma-hifi` artifact exists with no code prototype, orchestrator proposes `design-engineer` next (code the approved Figma).
- **Mode B — Existing Figma File Audit** — agent accepts a Figma file URL and audits hi-fi frames against the lo-fi handoff: flow coverage gap matrix, DS divergence (detached instances, hardcoded tokens, bespoke duplicates), content gaps, component sprawl. Mirrors `design-engineer`'s Mode B shape.
- **Iteration budget** — 3-revise soft cap derived from `.harry-audit.jsonl` per `SUBAGENT_AUDIT_PROTOCOL.md` Step 3, same as `design-engineer`. Cost estimates: ~$0.10 per single-screen tweak, ~$0.30 per multi-screen content refresh, ~$1.00+ for a full re-render (warned).
- **`SHARED_CONTEXT.md` updates** — Research-First Gate and Success-Metrics Gate Deliver-agent lists extended. New "Per-feature Deliver artifact paths" table under File Conventions documents the four stable slug-derived paths (`lo-fi-`, `prototype-`, `figma-hifi-`, `spec-`) and the per-agent frontmatter keys.
- **`templates/README.md` updates** — agent count 15 → 16; new row in agent table; `figma-designer` added to Mode B coverage table and `.claude/agents/` file map.
- **Root `README.md` updates** — agent count 10 → 16 across install/refresh copy; file map under "What's inside" corrected to the actual current agent set.
- **Spike deferred** — Phase 0 plan called for a live `use_figma` capability spike. The `/figma-use` skill resource was not directly loadable in the build session, so the spike was deferred to first-run validation. The agent's Anti-Patterns include the canonical warning ("Calling `use_figma` without loading the `/figma-use` skill (or `skill://figma/figma-use/SKILL.md` resource) first — common, hard-to-debug failures result"). First user-session invocation is the live capability test; if `use_figma` does not produce DS-instanced hi-fi frames at the requested fidelity, file a v3.9.1 patch updating the agent's "What You Do" with the actual capability surface (e.g. fall back to structured Figma import spec output).
- **No model routing change** — `figma-designer` is sonnet, same as every phase agent. Opus reserved for orchestrator + critique-partner (per RATIONALE.md cost discipline).
- **No SKILL.md change needed** — install + refresh both copy all `templates/.claude/agents/*.md` (no allowlist).

Agents total: 15 → **16**. Opus model agents unchanged (orchestrator + critique-partner only). Slash commands unchanged. Token-cost per pipeline: figma-designer single invocation adds ~$0.30–1.00 depending on flow size; the Deliver path is now a user-choice fork (figma-designer XOR design-engineer XOR both sequentially) rather than a mandatory code-only path.

---

## 2026-05-22 — v3.8: Passive audit ledger + `/agent-harry-audit` render command

Chat compacts. `dashboard.html` overwrites every Stop Gate. Handoff frontmatter is scattered across files. There was no cross-session audit trail answering *"ဘယ်နေ့မှာ ဘယ် agent ဘာလုပ်တယ်, ဘယ်ဖိုင်တွေ touch လုပ်တယ်, ဘယ်လောက်ကုန်တယ်."* v3.8 adds a passive append-only JSONL ledger written by the orchestrator at every Stop Gate, plus a slash command to render it as a human-readable timeline.

No new agent. Logging is mechanical — no LLM judgment needed. The orchestrator is already at the Stop Gate moment writing `dashboard.html`; appending one JSONL line costs ~50 tokens. See `RATIONALE.md` § "Why a passive ledger over a logging agent" for the design call.

- **New file `<project-root>/.harry-audit.jsonl`** — append-only JSONL ledger created on first Stop Gate after install/refresh. One JSON object per line, 10 core fields (`ts`, `session_id`, `agent`, `mode`, `phase`, `event`, `decision`, `cost_delta`, `cumulative_cost`, `files_impacted`, `handoff_ref`) plus event-specific optional fields (`gate`, `reason`, `delta_text`, `cap_hit`). Gitignored by default — contains raw paths, Figma URLs, decision deltas. Per-project scope (no workspace-wide aggregation).
- **New slash command `/agent-harry-audit`** — `templates/.claude/commands/agent-harry-audit.md`. Reads the ledger and renders a markdown timeline grouped by date → session → event table. Default scope: last 7 days, current project, all events. Flags: `--all`, `--days N`, `--agent <name>`, `--event <type>`, `--session <s_id>`. Multiple filters AND together. Output to chat only (no file write — render is ephemeral). Read-only; never mutates the ledger.
- **New file `templates/.gitignore`** — single shipped `.gitignore` for fresh projects. Ignores `.harry-audit.jsonl` and `.harry-queue.json`. Install copies directly to project if no `.gitignore` exists; if one exists, appends missing entries under a `# Agent Harry` header (idempotent).
- **Events captured** — `stop_gate` (every gate firing), `gate_block` / `gate_clear` (Research-First + Success-Metrics transitions), `pivot`, `cancel`, `scope_refused` (e.g. `design-engineer` 1-flow cap), `iteration_cap_hit` (e.g. `design-engineer` 3rd revise). Not captured: agent start, mode switch, file write — those are derivable from `stop_gate` entries and would noise the ledger.
- **`orchestrator.md` — new "Audit Ledger Write" section** — under Dashboard Rendering. Same Stop Gate moment that overwrites `dashboard.html` also appends to `.harry-audit.jsonl`. Includes `session_id` generation rule (`s_YYYYMMDD_NNNN`, counter resets daily), cumulative-cost tracking discipline, `files_impacted` extraction from sub-agent handoff frontmatter (max 10 paths per entry), and graceful-degrade rule (ledger write failure does NOT block the Stop Gate — it's observability, not load-bearing).
- **Subagent-fallback rule** — added to `SHARED_CONTEXT.md` § Audit Ledger. When a subagent is invoked **directly** (not via the orchestrator), the subagent self-appends its own completion entry as part of its Output Format. Detects orchestrator-routing by inspecting the invocation prompt; skips the append to prevent duplicates. Most agents don't need explicit changes — the rule is documented once in SHARED_CONTEXT and applies via the Output Format requirement already in every agent file.
- **`SHARED_CONTEXT.md` — new "Audit Ledger" section** — full schema spec, file path, event types, who-writes-when rules, privacy + retention policy, anti-patterns. Single source of truth for the ledger format.
- **`SKILL.md` install + refresh extended** — Mode 1 step 12 (gitignore management), Mode 2 step 9.5 (preserve `.harry-audit.jsonl`) + 9.6 (gitignore append-warn). Both modes idempotent — re-install/refresh doesn't duplicate gitignore entries or overwrite existing ledger.
- **No dashboard change** — clean separation. `dashboard.html` keeps single-focus current-step centerpiece (v3.1 design); the ledger surfaces via the slash command. No top-bar cumulative cost across sessions, no last-N-sessions strip.
- **Retention** — never rotate. JSONL appends forever. Real-world projects (~5–10 sessions/week) stay under 5MB even after years. User can manually rotate (`mv .harry-audit.jsonl .harry-audit-archive.jsonl`) if file grows uncomfortably large.
- **`templates/README.md` slash commands table** — `/agent-harry-audit` row added.

Token cost: orchestrator's per-Stop-Gate write grows by ~50 tokens (one JSONL line). Across a 5–8 step pipeline that's ~$0.01 extra. The render command itself is user-triggered and costs ~$0.02 per run for a 7-day default scope. A full Discovery → Define → Deliver pipeline still lands in the $1.50–3.50 range, same as v3.7.

Slash commands total: 3 → **4**. Agents total: unchanged (still 15). Opus model agents unchanged (orchestrator + critique-partner only).

### v3.8 — post-grill amendments (bundled before ship)

A `/grill-me` pass on the v3.7 + v3.8 work surfaced 9 correctness/design gaps. Rather than ship v3.8 then patch v3.8.1, fixes are bundled into v3.8 itself (uncommitted state):

- **`files_written` field added to handoff schema** (Q1) — `SHARED_CONTEXT.md` handoff frontmatter now requires `files_written: [<paths>]`. The audit ledger's per-event `files_written` field is populated from this. Without this field, the ledger's primary user-facing question (*"which files were impacted?"*) could not be answered.
- **`cumulative_cost` removed from per-entry schema** (Q2) — orchestrator and subagents are stateless across invocations; storing per-entry running totals would drift. Render command (`/agent-harry-audit`) sums `cost_delta` at read time and displays per-session totals + grand cumulative in the footer.
- **Ledger ownership by event type, not by routing detection** (Q3) — replaces the fragile string-match detection of orchestrator-vs-direct invocation. Subagents own `stop_gate` / `scope_refused` / `iteration_cap_hit` events (they have the data, no orchestrator round-trip needed). Orchestrator owns `gate_block` / `gate_clear` / `pivot` / `cancel` (routing-level events). Single writer per event type = no race condition, no duplicates.
- **Slug establishment** (Q4) — `<project-slug>` and `<feature-slug>` were referenced across multiple agents without a source-of-truth rule. v3.8 establishes orchestrator-side derivation at session start (Diagnose phase): `project_slug` from cwd basename, `feature_slug` from goal kebab-case (filler-word-stripped), surfaced in first Executive Summary so user can `revise — feature_slug: <s>` if wrong. Embedded in every subagent invocation prompt; persisted in artifact frontmatter.
- **Iteration cap derived from ledger** (Q5) — `design-engineer`'s 3-revise soft cap had no storage location (subagent stateless). Now derived at intake by reading `.harry-audit.jsonl`, filtering by `session_id + agent + feature_slug`, walking backward counting consecutive `revise` decisions until hitting `y` / `pivot` / `cancel`. Per-session, per-feature isolated budgets.
- **DECISION_DATA_SHAPES field-to-shape mapping documented** (Q6-A1) — the richer v3.7 schema fields (`chosen_layout`, `iteration_count`, `figjam_url`, etc.) fold into existing `insights` / `table` shape slots rather than introducing a 5th shape type (which would need dashboard.html render changes). Encoding documented inline in `DECISION_DATA_SHAPES.md`.
- **Stack-based form factor inference** (Q6-B4) — `low-fi-designer`'s ASCII layout example was desktop-biased (sidebar/main/command bar). v3.8 adds a Form Factor Inference table — SwiftUI / Flutter / React Native → mobile schematic (single-column, bottom tab bar); Next.js / Vue / Vanilla → web schematic (sidebar OR top-nav). Stack-detected at intake.
- **`project` → `project_slug` rename in handoff frontmatter** (Q6-C1) — existing field's value was always a kebab-case slug; rename clarifies intent. Plus new `feature_slug` and `session_id` frontmatter fields per Q4.
- **New `SUBAGENT_AUDIT_PROTOCOL.md` lazy-loaded appendix** (Q6-D2) — centralizes the 5-step subagent protocol (session_id derivation, ledger append, slug derivation, iteration-count derivation, required frontmatter fields). Each subagent's Output Format references it in 1 line instead of duplicating ~75 lines of boilerplate across 14 agents. Same pattern as `PM_SKILLS_MAP.md` (v3.6) and `DECISION_DATA_SHAPES.md` (v3.6 / v3.3).

Files touched by grill amendments: new `templates/SUBAGENT_AUDIT_PROTOCOL.md`; updated `templates/SHARED_CONTEXT.md` (schema + ledger writer + session_id sections), `templates/DECISION_DATA_SHAPES.md` (field mapping appendix), `templates/.claude/agents/orchestrator.md` (narrowed Audit Ledger Write to routing events; new Slug Establishment section), `templates/.claude/agents/low-fi-designer.md` (Form Factor Inference; protocol reference; slug propagation), `templates/.claude/agents/design-engineer.md` (iteration count from ledger; protocol reference; slug propagation), 12 secondary agent files (1-line protocol reference), `templates/.claude/commands/agent-harry-audit.md` (cumulative-cost-on-read clarification), `SKILL.md` (copy step for SUBAGENT_AUDIT_PROTOCOL.md), `RATIONALE.md` (why centralized protocol).

## 2026-05-22 — v3.7: Split interaction-designer → low-fi-designer + design-engineer

The bundled `interaction-designer` agent was overloaded — one file covered low-fi wireframing, hi-fi Figma mockups, code prototypes, AND Mode B audits. v3.7 splits it into two role-specific agents at the natural seam between *"what's the layout?"* (Define-phase) and *"build it in real code"* (Deliver-phase). Sequence: `low-fi-designer` (define) → `pm-metrics-architect` (gate) → `design-engineer` (deliver) → `handoff-engineer` (formal spec from prototype).

- **New agent `low-fi-designer` (sonnet, define)** — `templates/.claude/agents/low-fi-designer.md`. Asks for a Userflow Figjam (or generates one via `mcp__figma` `use_figma`; falls back to Mermaid flowchart if Figma MCP unavailable). Produces 3 ASCII layout alternatives — primary (structured), alternative (schematic), risky (schematic + "what could break"). Per-layout component table: DS-existing vs. NEW (name + 1-line purpose only — full spec deferred to `handoff-engineer`). Mode B audits existing userflow/wireframe artifacts.
  - Decision Data shape: `insights` — 3 rows (one per layout) with DS-vs-new component counts as evidence.
  - Tools: `Read, Write, Glob, Grep, Bash, mcp__figma, mcp__mobbin, WebSearch`.
- **New agent `design-engineer` (sonnet, deliver)** — `templates/.claude/agents/design-engineer.md`. Reads `lo-fi-<feature>.md` handoff. Builds production-ready frontend prototype in the project's actual stack with dummy data. Hard scope cap: **1 primary flow per invocation, 3–5 screens max**. All 5 states mandatory (empty/loading/populated/error/edge) as toggle-able routes. Mock API layer with realistic 800ms delay. Stack-detected file location: in-stack for Next.js/Flutter/SwiftUI, `prototypes/<slug>/` for vanilla. Polish bar: D2 (production-visual default) or D3 (full polish — animations, skeletons, toasts — opt-in). Iteration soft cap: 3 revise iterations before suggesting `pivot — re-do layout`. Cumulative cost estimate surfaced every revise. Mode B audits existing prototype code.
  - Decision Data shape: `table` — screen · states covered · DS components · new components · polish level.
  - Tools: `Read, Write, Edit, Glob, Grep, Bash, mcp__figma, mcp__mobbin`.
- **`interaction-designer` retired** — `templates/.claude/agents/interaction-designer.md` deleted. Refresh mode (Mode 2) now detects orphan agent files and prompts the user.
- **Refresh mode — orphan-check step added** — `SKILL.md` Mode 2 step 3.5: lists agent files in `<project>/.claude/agents/` that don't exist in `templates/.claude/agents/`, prompts *"These agent files exist locally but are no longer shipped — delete them?"*. Safe-by-default — no destructive auto-delete; `git rm` only on user `y`. Same check applies to `.claude/commands/`.
- **Stack auto-detection (shared between the two new agents)** — 3-tier: (1) `<project-root>/SHARED_CONTEXT.md` Project Context `Stack:` line, (2) repo scan (`package.json` / `pubspec.yaml` / `Package.swift` / `Cargo.toml`), (3) intake question if ambiguous. Cross-checked between `low-fi-designer` (for DS component recommendations) and `design-engineer` (for actual code stack).
- **`SHARED_CONTEXT.md` — new Project Context section** — top-of-file table with `Product type`, `Stack`, `Design system`, `Notion workspace`, `Figma file` fields. Generator-mode install fills it; Bundled-mode install ships placeholders. `Stack:` is the tier-1 source for stack detection.
- **`orchestrator.md` — routing table updated** — `interaction-designer` row replaced by `low-fi-designer` (define) + `design-engineer` (deliver). Data-First Routing Rule split: existing userflow Figjam → `low-fi-designer`; existing prototype code → `design-engineer`. Post-Success-Metrics-Gate routing: PRDs done → `low-fi-designer` → `design-engineer` → `handoff-engineer`. Gates list (Research-First + Success-Metrics) updated.
- **`DECISION_DATA_SHAPES.md` — Per-Agent Shape Map updated** — `interaction-designer` row removed; `low-fi-designer` (insights, max 3) and `design-engineer` (table, max 6) rows added.
- **`SKILL.md` — Generator-mode scoping extended** — new Q2 *"Stack"* scoping question added to fill the SHARED_CONTEXT `Stack:` line; Q6 *"Prototype medium default"* updated to reflect lo-fi-designer / design-engineer / both choice.
- **`README.md` updated** — agents table 14 → 15, new rows for both agents, Mode B input table split, File Map updated.
- **No PM skills assigned** — neither new agent is in `PM_SKILLS_MAP.md` ownership. They're design/build agents, not PM. Existing PM skill ownership unchanged.
- **prd-author optional consumption** — `prd-author` reads `design-engineer`'s `prototype-<feature>.md` artifact if it exists, for the "What this looks like" PRD section. Soft dependency — `prd-author` runs fine without it.

Why this split (also in `RATIONALE.md`): one agent doing low-fi schematic + hi-fi visual + production code is three different crafts, three different fidelity disciplines, and three different output contracts. The compound role muddied the orchestrator routing ("when do I use it for low-fi vs code?") and the user's mental model. Splitting cleans the routing logic and lets each agent be sharper at its actual job.

Agents total: 14 → **15**. Opus model agents unchanged (still orchestrator + critique-partner only). Token cost per `design-engineer` run estimated ~$0.30–0.80 depending on polish bar and screen count; `low-fi-designer` ~$0.10–0.20. A full Discovery → Define → Deliver pipeline with the new split still lands in the $1.50–3.50 range — slightly higher ceiling than v3.6 because real code costs real tokens, but iteration cap + scope cap keep it bounded.

## 2026-05-20 — v3.6: Token-budget refactor — quality-safe ~35% cut

The system was loading ~33k tokens per full pipeline run, mostly from duplicate rules and verbose rationale paragraphs being re-read on every agent invocation. v3.6 splits load-bearing rules from explanatory prose, extracts two appendix tables into lazy-loaded files, and dedups orchestrator.md against SHARED_CONTEXT.md. Behavior, gates, and decisionData shapes are **unchanged** — only the file layout shifts so agents read less per run.

- **New `templates/PM_SKILLS_MAP.md`** — the per-agent skill ownership table moved out of `SHARED_CONTEXT.md`. Every agent used to load the whole 13-row table on every run; now only the agents that actually invoke PM skills (`pm-strategist`, `pm-launch-architect`, `pm-metrics-architect`) reference it. SHARED keeps a 4-line pointer.
- **New `templates/DECISION_DATA_SHAPES.md`** — the 4 decisionData shape specs + per-agent shape map moved out of `SHARED_CONTEXT.md`. Only the orchestrator (at dashboard-render time) and agents producing decisionData need the full spec. SHARED keeps a 3-line pointer.
- **New `RATIONALE.md` (repo root, NOT in `templates/`)** — verbose "Reason for this rule:" / "Reasoning:" paragraphs that explained WHY each rule exists moved out of runtime files. Agents follow rules; they don't need to be persuaded of them. The file is dev-facing only; agents never load it.
- **`orchestrator.md` dedup against `SHARED_CONTEXT.md`** — Research-First Gate and Success-Metrics Gate sections in orchestrator no longer restate the rule verbatim from SHARED. They keep orchestrator-specific routing logic + dashboard framing + post-gate routing; they delegate the canonical rule text and refusal copy to SHARED. The full refusal-message templates (which appeared twice — once in SHARED, once in orchestrator) now live only in SHARED.
- **Agent references updated** — `pm-strategist.md`, `pm-launch-architect.md`, `pm-metrics-architect.md` now point to `PM_SKILLS_MAP.md` directly instead of `SHARED_CONTEXT.md PM Skills Map`.
- **`SKILL.md` install/refresh steps** — copy `PM_SKILLS_MAP.md` and `DECISION_DATA_SHAPES.md` alongside `SHARED_CONTEXT.md` on install; on refresh, only seed them if missing (pre-v3.6 projects) — never overwrite user customizations.

Quality preservation: every rule, gate, opt-out phrase, refusal option, and routing decision stays identical. The only thing that changed is **where the text lives** — load-bearing rules in SHARED, lazy-loadable appendices in dedicated files, dev rationale in `RATIONALE.md` outside the runtime path.

Token impact (measured on file line counts):

| File | Lines before | Lines after | Delta |
|---|---|---|---|
| `SHARED_CONTEXT.md` | 509 | ~370 | -139 lines / ~1,800 tokens per agent that loads it |
| `orchestrator.md` | 493 | ~454 | -39 lines / ~500 tokens per orchestrator invocation |
| `PM_SKILLS_MAP.md` | — | 34 | new, lazy-loaded |
| `DECISION_DATA_SHAPES.md` | — | 114 | new, lazy-loaded by orchestrator only |
| `RATIONALE.md` | — | 91 | new, **never loaded at runtime** |

Per full pipeline (orchestrator + 5–8 sub-agents): estimated ~30–40% reduction in input tokens.

## 2026-05-19 — v3.5: PRD-per-sub-feature + Notion sync

After v3.4's Success-Metrics Gate clears, two new capabilities ship to make the confirmed artifacts actionable for the rest of the team: per-feature PRDs (so engineering has something concrete to build against), and a one-shot Notion publish (so non-Claude-Code teammates can read what was decided).

- **New agent `prd-author` (sonnet)** — `templates/.claude/agents/prd-author.md`. Routes after the Success-Metrics Gate clears. Reads the confirmed `feature-prioritizer` handoff, extracts items tagged `in` for MVP, generates one PRD per item using the `pm-execution:create-prd` skill. Writes each to `./design-workspace/<project-slug>/prds/<feature-slug>.md`. Batch capped at 8 PRDs per run for token discipline; if the user has 10+ "in" items, proposes splitting into 2 batches.
  - Decision Data shape: `table` — manifest with slug · word count · source RICE · status pill (`new` / `updated` / `open` for PRDs with unresolved Open Questions).
  - Idempotent: re-running on a project updates existing PRD files; doesn't blindly overwrite. Per-PRD revision via `revise — <slug>: <delta>` regenerates one without rebatching all.
  - PRD template: Problem · Users · Success criteria (must reference confirmed metrics) · Scope in/out · User stories · Acceptance criteria · Tradeoffs · Open questions · Links. The "Scope: out" section is mandatory — explicit non-goals kill scope creep.
- **New slash command `/agent-harry-notion-sync`** — `templates/.claude/commands/agent-harry-notion-sync.md`. Pushes confirmed artifacts to Notion via the Notion MCP. First run prompts for parent page (search-based picker), saves config to `<project-root>/.notion-config.json`. Subsequent runs are incremental and idempotent — same artifact path always maps to the same Notion page ID.
  - Builds a structured tree: Project root → Overview (TOC) → Discovery → Define → Success Metrics (with ✓ Confirmed badge if Gate cleared) → PRDs (one page each) → Deliver.
  - `--dry-run` previews changes without writing. `--re-init` resets the config.
  - Page content = Executive Summary + 3-bullet TL;DR + Decision Data (rendered with Notion's matching block types). Long-form MD body stays on disk as audit trail; Notion gets the decision-grade summary.
- **Orchestrator routing extended** — after the Success-Metrics Gate clears, the orchestrator's smallest-next-move logic checks: if prioritization has "in" items AND no PRDs exist yet, propose `prd-author`. Otherwise propose `interaction-designer` Mode A (design-led) or `handoff-engineer` (spec-led). `/agent-harry-notion-sync` is surfaced as a sidebar option in the Stop Gate's next-move-suggestion text, not auto-invoked.
- **SHARED_CONTEXT.md** — `prd-author` row added to PM Skills Map (`pm-execution:create-prd`, `:write-prd`, `:user-stories`, `:job-stories`, `:wwas`, `:test-scenarios`). New "Notion Sync (v3.5)" section spelling out what does/doesn't sync, the config schema, idempotency rules, and anti-patterns.
- **`templates/dashboard.html`** — no template change; v3.3's existing Decision Data `table` shape renders the PRD manifest natively. The orchestrator just populates `decisionData` per the spec.
- **Demo state added** — state 11 "PRD Batch (v3.5)" in `docs/dashboard-demo.html` shows `prd-author`'s manifest table after generating 5 PRDs for the POS Checkout MVP scenario. One PRD has status `open` (unresolved Open Questions) demonstrating the partial-readiness flavor. Total state count grows 11 → 12.

Agents total: 13 → **14**. Slash commands total: 2 → **3**. Opus model agents unchanged (still orchestrator + critique-partner only).

Token cost: `prd-author` ~$0.10–0.20 per PRD × N items (max 8) = ~$0.80–1.60 worst case. Notion sync ~$0.05–0.10 per run. A full v2/v3/v3.5 pipeline still lands in the $1.50–3.00 range, inside the $3 ceiling.

## 2026-05-18 — v3.4: Success-Metrics Gate — force metrics + confirmation before Deliver

After Define is done, you should never just glide into Deliver without naming what success looks like. v3.4 codifies that as a second hard gate, mirroring the Research-First Gate but firing at the Define → Deliver boundary instead of nothing → Discovery.

- **Success-Metrics Gate (Hard Block)** — once any Define-phase artifact exists in `./design-workspace/<project-slug>/` (handoff from `product-positioner`, `feature-prioritizer`, `ideation-facilitator`, or `pm-strategist`), the Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`, `pm-launch-architect`) are **blocked** until `pm-metrics-architect` has run AND the user has explicitly confirmed the metrics with `y`. Same Hybrid pattern as Research-First Gate — strict default plus an explicit opt-out phrase.
- **Auto-routing in the Alignment Loop** — when Define artifacts exist and `pm-metrics-architect` hasn't run, the orchestrator's smallest-next-move MUST be `pm-metrics-architect` Mode A. Not a Deliver agent. The TL;DR explicitly frames this as the gate-clearer: *"Define is complete. Before we move to Deliver, let's lock in success metrics so we know what we're optimizing for."*
- **Opt-out exists** — for users who have metrics outside Agent Harry, the phrases *"I have metrics already, skip the confirmation"* / *"skip metrics"* / *"Success metrics မလိုဘူး"* (and equivalents) clear the gate without running `pm-metrics-architect`. Same shape as the Research-First Gate opt-out.
- **Confirmation framing in `pm-metrics-architect`** — when invoked as the gate-clearer (the orchestrator's invocation prompt says so), the agent switches its output framing: Decision Data panel label becomes `Success metrics · pending your confirmation`, the TL;DR's open-question bullet becomes an explicit *"Confirm these metrics so Deliver can proceed?"* prompt, and the dashboard's `y` chip hint becomes `confirm success metrics` instead of generic `proceed`. The suggested-next strip names the first Deliver agent that will unblock on confirmation.
- **`/audit-pipeline` extended** — reports the Success-Metrics Gate status alongside the Research-First Gate. (Slash command file unchanged; the rule lives in the orchestrator's check, which `/audit-pipeline` already routes to.)
- **Demo state updated** — state 10 (PM Metrics Architect) in `docs/dashboard-demo.html` now shows the v3.4 confirmation framing. Click the state to preview: notice the new TL;DR confirmation copy, the changed chip hint, and the annotation explaining the gate's role.

Why this rule: without confirmed success metrics, Deliver artifacts optimize for nothing in particular — or worse, for the designer's implicit metrics, not the team's actual ones. The hidden-assumption problem surfaces post-launch when someone asks "is this working?" and the answer depends on who you ask. Forcing the metrics step + explicit confirmation makes the optimization target a deliberate decision instead of an inherited default.

Token-cost impact: zero. The gate routes an agent that was already in the lineup (`pm-metrics-architect`); it just changes WHEN it runs (always before Deliver, instead of opportunistically). The agent's own run cost (~$0.12 sonnet) is unchanged.

## 2026-05-18 — v3.3: Decision Data panel — surface critical data inline

v3.1/v3.2 made the dashboard interactive but kept the actual decision-critical data (research evidence, scoring tables, the bet, named accounts, measurement plan) hidden in MD handoff files. To make a `y / revise / pivot` call you'd often still open the MD file — which defeated the v3.1 intent of "the dashboard is where you read." v3.3 adds a **Decision Data panel** between the stat cells and the TL;DR so the headline data is visible inline.

- **New `.now-decision` panel in `templates/dashboard.html`** — renders between `.now-stats` and `.now-tldr` in the NOW card. Four shape variants for different agent types:
  - **`insights`** — numbered list, each row text + verbatim evidence + high/medium/low confidence chip. Used by `discovery-researcher`, `ideation-facilitator`, `usability-tester`, `critique-partner`.
  - **`table`** — scoring/comparison table with deltas (green ↑ / red ↓) and in/out/open pills. Used by `feature-prioritizer`, `competitive-analyst`, `interaction-designer`, `handoff-engineer`.
  - **`callout`** — single highlighted quote (the bet, beachhead) + supporting meta block. Used by `product-positioner`, `pm-strategist`, `pm-launch-architect` (with `flavor: launch` orange palette).
  - **`metrics`** — stacked rows for measurement-plan layers (north-star · input · health · counter). Used by `pm-metrics-architect`.
- **`SHARED_CONTEXT.md` gets a Decision Data Shapes appendix** — full spec of the 4 shape types, the per-agent shape map (which agent uses which shape), and length discipline (caps stay aligned with v2 token-budget rules).
- **`orchestrator.md` Dashboard Rendering updated** — orchestrator now reads the just-completed sub-agent's `decisionData` and embeds it in `dashboard.html` at every Stop Gate. If decisionData is missing, the panel is omitted; the dashboard degrades gracefully.
- **TL;DR vs Decision Data — clear split** — the TL;DR (3 bullets) now *references* the panel ("Top 2 insights are high-confidence" / "Guest checkout jumped to #2") rather than duplicating it. The panel owns the data; the TL;DR owns the framing.
- **Demo updated (`docs/dashboard-demo.html`)** — 5 states now showcase the Decision Data panel: a new "02. After Discovery" state with the insight list + evidence, "03. Mid-pipeline" with the scoring table, "08. PM Strategist" with the bet callout, "09. PM Launch Architect" with the beachhead callout (orange flavor), "10. PM Metrics Architect" with the 4-layer measurement plan. State count grows 10 → 11.

Token-cost impact: +1–2k output per Stop Gate (dashboard write goes ~2–3k from ~1–2k). Across a 5–8 step pipeline, +$0.05–0.15. Still well within the v2 $3 ceiling.

What stays in MD files (not on dashboard): full methodology, sample bias audit, dropped ideas, interview transcripts, full event taxonomy, edge-case state diagrams. The dashboard is the decision surface; the MD is the audit trail.

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
