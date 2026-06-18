---
name: agent-harry
description: Agent Harry — Kaung Myat Hein's personal multi-agent product design system for Claude Code. Installs, refreshes, or updates a 20-subagent UX pipeline (orchestrator + critique-partner + 15 phase agents + 3 cross-cutting setup agents (product-fingerprint-curator v4.0, figma-component-bootstrapper v4.2, brand-decoder v5.2) — including lo-fi-designer, figma-designer, design-engineer, prd-author, information-architect) covering the Discovery → Define → Deliver lifecycle plus embedded PM capabilities (positioning, prioritization, competitive analysis, GTM, metrics). Trigger on any of these intents — brand, semantic, or Burmese. Install in a new project ("install Agent Harry", "set up Agent Harry agents", "install product designer agents", "install design subagents", "bootstrap UX multi-agent system", "Agent Harry ထည့်ပေး", "design agent တွေ install လုပ်ပေး", "product designer workflow ဆောက်ပေး"). Refresh an existing project's agents after the skill is updated ("refresh Agent Harry", "refresh design agents", "update agents in this project", "Agent Harry ပြန် refresh"). Pull the latest skill from GitHub ("update Agent Harry skill", "pull latest Agent Harry", "Agent Harry skill update လုပ်ပေး", "Git ကနေ ဆွဲ").
---

# Agent Harry — Multi-Agent Product Design Skill

A personal Claude Code skill that bootstraps a 20-agent product design subagent system into any project, then keeps it in sync with the upstream GitHub repo.

When invoked, decide which of three modes to run based on user intent:

| Intent signal | Mode |
|---|---|
| "install", "set up", "bootstrap", "add to this project" | **Install** (A = Bundled, or B = Generator) |
| "refresh", "update agents", "pull latest into this project" | **Refresh** |
| "update the skill", "pull latest from GitHub", "Git ကနေ ဆွဲ" | **Update** |

If ambiguous, ask one short question: *"Install fresh, refresh this project's agents, or pull the latest skill from GitHub?"*

---

## Mode 1 — Install

Picks one of two sub-modes based on whether the user wants customization.

| User signal | Sub-mode | Action |
|---|---|---|
| "default", "standard", "as-is", "Harry's setup", no customization mentioned | **Bundled** | Copy `templates/` directly into project |
| "for my X project", "customize for", "we use Y design system", mentions specific stack/MCPs | **Generator** | Ask scoping questions → copy templates → patch with project context |
| Mixed signal or ambiguous | **Ask** | Quick yes/no: "Use defaults or customize for this project?" |

Default to Bundled when uncertain — it's reversible (user can ask to customize specific agents after).

### 1A — Bundled Installation

Use when the user wants the standard system without project-specific tuning.

Steps:
1. Confirm the project root directory with the user (or use cwd if obvious)
2. Check if `.claude/agents/`, `.claude/commands/`, or `SHARED_CONTEXT.md` already exist — if yes, ask before overwriting
3. Copy `templates/.claude/agents/*.md` → `<project>/.claude/agents/`
4. Copy `templates/.claude/commands/*.md` → `<project>/.claude/commands/`
5. Copy `templates/SHARED_CONTEXT.md` → `<project>/SHARED_CONTEXT.md`
6. Copy `templates/PM_SKILLS_MAP.md` → `<project>/PM_SKILLS_MAP.md` (v3.6: lazy-loaded skill ownership map)
7. Copy `templates/DECISION_DATA_SHAPES.md` → `<project>/DECISION_DATA_SHAPES.md` (v3.6 / v5.0: decisionData chat-render spec)
7.5. Copy `templates/SUBAGENT_AUDIT_PROTOCOL.md` → `<project>/SUBAGENT_AUDIT_PROTOCOL.md` (v3.8: lazy-loaded session identity + ledger append + slug derivation protocol)
7.6. Copy `templates/widgets/` → `<project>/widgets/` (v5.3: inline-widget templates for decisionData rendering — one per shape: `insights`, `table`, `callout`, `metrics`; plus the agent-specific supplementals `ia-tree` (information-architect sitemap), `wireframe` (v5.4–v5.5 — lo-fi grayscale layouts, with a section detail loop drilling the chosen layout down to its component composition), and `flow` (v5.6 — lo-fi Journey Map + Userflow as native vertical-spine diagrams); the orchestrator reads these only when an inline-widget tool like `show_widget` is available, else markdown render)
8. Copy `templates/README.md` → `<project>/README.md` (or skip if README already exists)
9. **`.gitignore` management (v3.8 / v5.0)** — if `<project>/.gitignore` doesn't exist, copy `templates/.gitignore` directly. If it DOES exist, read it and check for the line `.harry-audit.jsonl`. If missing, append it under a `# Agent Harry` section header (only one header per project, idempotent). Report what was added in the install confirmation.
10. Confirm completion with file list and a quick "try this next" prompt

Expected output:

```
Installed 20 Agent Harry subagents + 6 slash commands + SHARED_CONTEXT.md + PM_SKILLS_MAP.md + DECISION_DATA_SHAPES.md + SUBAGENT_AUDIT_PROTOCOL.md + .gitignore (audit-ledger entry) into <project>/

Try this:
1. "/audit-pipeline" — confirm the project is set up correctly.
2. "Use the orchestrator agent — I want to <outcome>." Stop Gates fire in chat; type y/revise/pivot/grill me/cancel to drive.

Quick reference:
- Discovery: discovery-researcher, competitive-analyst
- Define: product-positioner, feature-prioritizer, ideation-facilitator, pm-strategist, prd-author, information-architect (v5.2), lo-fi-designer (v3.7)
- Deliver: design-engineer (v3.7), usability-tester, handoff-engineer, pm-launch-architect (all gated by Research-First + Success-Metrics checks)
- Cross-cutting: pm-metrics-architect, product-fingerprint-curator (v4.0), brand-decoder (v5.2), figma-component-bootstrapper (v4.2)
- Meta: orchestrator (opus), critique-partner (opus)
- Commands: /audit-pipeline · /agent-harry-notion-sync · /agent-harry-audit · /agent-harry-fingerprint · /agent-harry-cost
- Decision surface: chat (v5.0 — was dashboard.html pre-v5.0; ripped because never used)
```

Done. Don't over-explain.

### 1B — Generator (Customized) Installation

Use when the user wants the system tuned to their specific project, design system, or workflow.

Scoping questions (ask only what isn't already known, keep under 6):

1. **Project context** — What kind of product? (Mobile app / web SaaS / internal tool / hardware / other)
2. **Stack (v3.7)** — Which frontend stack? (Next.js / React Router / Vue Nuxt / SwiftUI / Flutter / Vanilla HTML / other) — answers fill `SHARED_CONTEXT.md` Project Context `Stack:` line; consumed by `lo-fi-designer` + `design-engineer`
3. **Design system** — What's the source? (Figma library URL / code repo / external system like Material/Carbon/shadcn / none yet)
4. **MCPs connected** — Which of these are available? (Figma, Notion, Mobbin, Supabase, Web Search, other)
5. **PM capability needed?** — Yes (full set including positioner/prioritizer) / No (drop PM agents, keep design-only)
6. **Prototype medium default (v3.7)** — Lo-fi only (ASCII wireframes from `lo-fi-designer`) / Code prototype (`design-engineer` builds in the chosen stack) / Both (default — lo-fi-designer first, then design-engineer when ready)

Customization patches:

- **Per-agent tool list** — Update `tools:` frontmatter to match the user's MCP availability. Example: if Mobbin MCP isn't connected, remove from `competitive-analyst`, `ideation-facilitator`, `lo-fi-designer`, and `design-engineer`, replace with a note that pattern research will use Web Search instead. If Figma MCP isn't connected, also remove `figma-designer.md` (it hard-refuses without Figma MCP) or drop it entirely from the install — surface the choice to the user.
- **Design system context** — Inject the user's design system source into `lo-fi-designer.md` (Intake Question Q2), `design-engineer.md` (token files reference), `handoff-engineer.md` (Token usage audit), and `SHARED_CONTEXT.md` (top-of-file Project Context section, including the `Stack:` line).
- **PM capability scope** — If user says "no PM agents", delete `product-positioner.md`, `feature-prioritizer.md`, `competitive-analyst.md`, and update `orchestrator.md` agent list + README.md.
- **Project-specific routing rules** — Optionally add a Project Conventions section to `SHARED_CONTEXT.md` (file naming, Notion workspace, Figma file structure).

Patch method: use `view` + `str_replace` for targeted edits. Don't regenerate templates — they're tested.

Expected output:

```
Installed 20 Agent Harry subagents + SHARED_CONTEXT.md into <project>/

Customizations applied:
- Removed Mobbin MCP from <agents> — using Web Search fallback
- Design system set to: <user's system>
- Project context: <type>
- PM agents: <kept/dropped>

Try this:
"Use the orchestrator agent to plan a discovery cycle for <feature>."
```

---

## Mode 2 — Refresh

Use when the user has already installed Agent Harry into a project, then later pulled an updated version of the skill from GitHub, and now wants the project's local agents updated to the new templates.

**Refresh policy: overwrite only the agent files and the `.claude/commands/` folder; never touch SHARED_CONTEXT.md or README.md.** SHARED_CONTEXT is project-customized by design — users edit it. README may have project-specific additions. Agent + command files are canonical and rarely edited locally.

**Important — SHARED_CONTEXT.md note:** v2 introduced the Executive Summary requirement, Token Budget rules, and Research-First Gate into `SHARED_CONTEXT.md`. If the user has an old (pre-v2) SHARED_CONTEXT.md, refresh does NOT overwrite it — but warn them so they can manually merge the new sections, or opt in to a SHARED_CONTEXT.md refresh.

Steps:

1. Confirm the project root with the user (or use cwd).
2. Check that `<project>/.claude/agents/` exists. If not, this isn't an installed Agent Harry project — suggest running Install instead.
3. **Dirty-check**: if the project is a git repo, run `git -C <project> status --porcelain .claude/agents/ .claude/commands/` to see if any agent or command files have uncommitted local modifications. If yes, list them and ask: *"These files have local edits — overwrite anyway?"* Don't proceed without confirmation.
3.5. **Orphan-check (v3.7)**: list files in `<project>/.claude/agents/` that don't exist in `templates/.claude/agents/`. These are agents the user installed previously that have since been retired from the templates (e.g. pre-v3.7 installs have `interaction-designer.md`, retired in v3.7 in favor of `lo-fi-designer.md` + `design-engineer.md`). If orphans found, list them and ask: *"These agent files exist locally but are no longer shipped with Agent Harry — delete them? (y / n / show me what each one was for)"*. If `y`, `git rm` them (or `rm` if not git-tracked); if `n`, leave them in place (warn that orchestrator routing won't reference them but they remain invokable directly). Apply the same check to `<project>/.claude/commands/`.
3.6. **Dashboard orphan notice (v5.0)**: if any of `<project>/dashboard.html`, `<project>/dashboard-server.py`, `<project>/.harry-queue.json`, or `<project>/.claude/commands/agent-harry-loop.md` exist, list them and print this notice (do NOT auto-delete):
   ```
   ⚠ v5.0 ripped the dashboard surface (never used in practice). These files are now orphaned:
     - dashboard.html
     - dashboard-server.py
     - .harry-queue.json
     - .claude/commands/agent-harry-loop.md
   To clean up, run:
     rm dashboard.html dashboard-server.py .harry-queue.json .claude/commands/agent-harry-loop.md
   They will not affect the pipeline if left in place, but the orchestrator no longer writes to dashboard.html or reads .harry-queue.json. See CHANGELOG v5.0 for the full rationale.
   ```
4. Copy `templates/.claude/agents/*.md` → `<project>/.claude/agents/` (overwriting).
5. Copy `templates/.claude/commands/*.md` → `<project>/.claude/commands/` (overwriting; create folder if missing).
6. If `<project>/PM_SKILLS_MAP.md`, `<project>/DECISION_DATA_SHAPES.md`, or `<project>/SUBAGENT_AUDIT_PROTOCOL.md` don't exist (pre-v3.6 / pre-v3.8 install), copy them from `templates/`. If they exist, overwrite `DECISION_DATA_SHAPES.md` (v5.0 changed shape rendering target from HTML to chat markdown — must propagate); leave `PM_SKILLS_MAP.md` and `SUBAGENT_AUDIT_PROTOCOL.md` alone unless the user opts in (they're reference appendices users may have lightly customized).
6.4. Copy `templates/widgets/*` → `<project>/widgets/` (overwriting; create folder if missing) — v5.3 inline-widget templates (one per decisionData shape: insights/table/callout/metrics) + the agent-specific supplementals `ia-tree`, `wireframe` (v5.4–v5.5 — lo-fi grayscale layouts + section detail loop to component composition), and `flow` (v5.6 — lo-fi Journey Map + Userflow spines). Canonical and rarely edited locally, so overwrite like the agent files. If a pre-v5.3 install has no `widgets/` folder, this creates it; the wildcard copy picks up `wireframe.widget.html` and `flow.widget.html` automatically on any refresh.
6.5. **Audit ledger preservation (v3.8)** — if `<project>/.harry-audit.jsonl` exists, **do not overwrite or touch it** — it's the project's append-only audit history. Don't even read it during refresh. If it doesn't exist, do nothing (the orchestrator creates it on the first Stop Gate after refresh).
6.6. **`.gitignore` append-warn (v3.8 / v5.0)** — read `<project>/.gitignore` (if it exists). If `.harry-audit.jsonl` is not already listed, append under an `# Agent Harry` header (idempotent — only one header per file). If `<project>/.gitignore` doesn't exist at all, copy `templates/.gitignore`. The pre-v5.0 `.harry-queue.json` entry is stale (queue file gone in v5.0) — leave existing entries alone (harmless), but do not append `.harry-queue.json` to new `.gitignore` files. Report what was added/created in the refresh output.
7. Check `<project>/SHARED_CONTEXT.md`: if it lacks the v2/v3 markers ("Executive Summary", "Token Budget", "Research-First Gate"), tell the user the sections are missing and offer two options: (a) review the diff and merge manually, or (b) explicitly opt in to a full SHARED_CONTEXT.md replace (destroys any local customizations there). Note: pre-v5.0 SHARED_CONTEXT.md sections "Dashboard companion" and "Queue Mode" are stale in v5.0 — refresh does not require their presence.
8. Do **not** touch `README.md`.
9. Report which files were replaced + a one-line pointer to the CHANGELOG: *"See `~/.claude/skills/agent-harry/CHANGELOG.md` for what changed in the templates."*

Expected output:

```
Refreshed <N> agent files + <M> slash commands + DECISION_DATA_SHAPES.md (v5.0 chat-render spec) in <project>/
Preserved: SHARED_CONTEXT.md, README.md, .harry-audit.jsonl (if existed), PM_SKILLS_MAP.md, SUBAGENT_AUDIT_PROTOCOL.md
.gitignore: <created | appended N entries | already up to date>
Orphan check: <none | deleted N orphan files | left N orphans in place>
Dashboard orphan notice (v5.0): <not present | listed N files for manual cleanup>
SHARED_CONTEXT.md v2/v3 sections check: <present | MISSING — see below>

Templates source: ~/.claude/skills/agent-harry/
Latest changes: <one-line from CHANGELOG.md top entry>
```

---

## Mode 3 — Update

Use when the user wants the *skill itself* updated with the latest from GitHub. This pulls new template versions into `~/.claude/skills/agent-harry/` so that subsequent Installs and Refreshes use the new content.

Steps:

1. Run `git -C ~/.claude/skills/agent-harry status` first. If the working tree isn't clean (uncommitted local changes to the skill), stop and tell the user — don't auto-stash. They should commit or discard those changes manually.
2. Run `git -C ~/.claude/skills/agent-harry pull --ff-only origin main`.
3. If the pull brought in new commits, show the user the last few CHANGELOG.md entries: `head -40 ~/.claude/skills/agent-harry/CHANGELOG.md`.
4. Remind the user: *"To apply these template updates to an already-installed project, run Refresh mode in that project."*

If `git pull` reports "Already up to date", just say so — don't dump the CHANGELOG.

Expected output (when there are updates):

```
Pulled latest Agent Harry from GitHub.

What's new:
<top CHANGELOG entries>

To apply to an installed project: open that project and say
"refresh Agent Harry agents" — I'll re-copy the templates while
preserving your SHARED_CONTEXT.md.
```

---

## Decision Tree

```
User triggers skill
├─ "install / set up / bootstrap" → Mode 1 (Install)
│   ├─ defaults / no customization → 1A Bundled
│   ├─ customization signals → 1B Generator
│   └─ ambiguous → ask "defaults or customize?"
├─ "refresh / update agents in this project" → Mode 2 (Refresh)
└─ "update the skill / pull from GitHub" → Mode 3 (Update)
```

---

## Templates Folder Structure

All bundled templates live in `templates/` next to this SKILL.md:

```
templates/
├── README.md
├── SHARED_CONTEXT.md           ← v2: Executive Summary, Token Budget, Research-First Gate
│                                 v2.1: Always-On Stop Gate
│                                 v3: PM Skills Map (extracted in v3.6)
│                                 v3.3: Decision Data Shapes appendix (extracted in v3.6)
│                                 v3.4: Success-Metrics Gate
│                                 v3.5: Notion Sync section
│                                 v3.6: dedup'd against orchestrator; verbose rationale moved to RATIONALE.md
│                                 v5.0: Dashboard companion + Queue Mode sections removed
├── PM_SKILLS_MAP.md            ← v3.6: per-agent skill ownership (lazy-loaded)
├── DECISION_DATA_SHAPES.md     ← v3.6 spec, v5.0: chat-markdown rendering target (was dashboard HTML pre-v5.0)
├── SUBAGENT_AUDIT_PROTOCOL.md  ← v3.8: session identity + ledger append + slug derivation (lazy-loaded)
├── .gitignore                  ← v3.8 / v5.0: ignores .harry-audit.jsonl (pre-v5.0 also ignored .harry-queue.json — removed)
└── .claude/
    ├── agents/
    │   ├── orchestrator.md          (opus)   ← v3.4: enforces Research-First + Success-Metrics Gates; v5.0: chat-only Decision Data rendering
    │   ├── critique-partner.md      (opus)
    │   ├── discovery-researcher.md  (sonnet)
    │   ├── competitive-analyst.md   (sonnet)
    │   ├── product-positioner.md    (sonnet)
    │   ├── feature-prioritizer.md   (sonnet)
    │   ├── ideation-facilitator.md  (sonnet)
    │   ├── lo-fi-designer.md       (sonnet) ← v3.7: split out of interaction-designer (define-phase)
    │   ├── design-engineer.md       (sonnet) ← v3.7: split out of interaction-designer (deliver-phase code prototype)
    │   ├── usability-tester.md      (sonnet)
    │   ├── handoff-engineer.md      (sonnet)
    │   ├── pm-strategist.md         (sonnet) ← v3: strategy / business model / vision / pricing
    │   ├── pm-launch-architect.md   (sonnet) ← v3: GTM / beachhead / ICP / growth loops
    │   ├── pm-metrics-architect.md  (sonnet) ← v3.4: gate-clearer for Define→Deliver
    │   ├── prd-author.md            (sonnet) ← v3.5: one PRD per "in"-tagged sub-feature
    │   └── product-fingerprint-curator.md (sonnet) ← v4.0: project-level visual + composition fingerprint from 3–7 exciting Figma frames
    └── commands/
        ├── audit-pipeline.md              ← /audit-pipeline — Research-First + Success-Metrics gates
        ├── agent-harry-notion-sync.md     ← /agent-harry-notion-sync — v3.5 push artifacts to Notion
        ├── agent-harry-audit.md           ← /agent-harry-audit — v3.8 render audit ledger as timeline
        ├── agent-harry-features.md        ← /agent-harry-features — v5.1 derived feature list (read-only over ledger)
        ├── agent-harry-fingerprint.md     ← /agent-harry-fingerprint — v4.0 create/refresh; v5.1 adds --promote for cross-feature pattern
        └── agent-harry-cost.md            ← /agent-harry-cost — v4.1 measured cost report
```

These are the source of truth. Don't regenerate — copy then patch.

**v2 token-cost design:** Opus only on orchestrator + critique-partner. The other 11 agents run on Sonnet. This is the primary lever that brings a full pipeline run from ~$8 down to ~$1–3. Don't override per-agent without a logged reason in the handoff.

**v3 orchestration shift:** Default mode is the Alignment Loop (Diagnose → smallest-next-move → Run → Realign), not waterfall. Waterfall planning is the fallback for explicit "lay out the full pipeline" requests. User can `pivot — <new direction>` at any Stop Gate.

**v3.4 dual hard gates:** Research-First Gate blocks Deliver until Discovery/Define exist. Success-Metrics Gate blocks Deliver until pm-metrics-architect has run AND been confirmed. Same Hybrid pattern — strict by default, explicit opt-out phrase.

**v3.5 post-Deliver:** Once Success-Metrics confirmed, `prd-author` (new sonnet agent) generates one PRD per "in"-tagged sub-feature. `/agent-harry-notion-sync` (new slash command) publishes confirmed artifacts to Notion as a structured workspace.

**v5.0 chat-only decision surface:** Removed `dashboard.html`, `dashboard-server.py`, `.harry-queue.json`, `/agent-harry-loop`. Decision Data renders as markdown in chat at every Stop Gate. The dashboard surface was never used in practice; chat is canonical. See `RATIONALE.md` § "Why dashboard was removed (v5.0)" and `CHANGELOG.md`.

**v5.1 multi-feature scaling readiness:** Added `/agent-harry-features` (derived feature list over the audit ledger — no separate registry file), `/agent-harry-fingerprint --promote <pattern>` (cross-feature pattern promotion into the existing fingerprint — no separate pattern ledger), and `Roadmap link` field in SHARED_CONTEXT (external reference only — Agent Harry does not own roadmap content). Fully additive, non-breaking. Six related improvement ideas were considered and explicitly rejected to avoid drift-from-second-source-of-truth and scope creep — see `CHANGELOG.md` v5.1 entry for the rejection rationale.

**v5.2 structure + brand (Atria gap-closing):** Two new agents close gaps surfaced by a real design-test rejection (messy IA, inconsistent action priorities, brand-concept misalignment). `information-architect` (Define phase, runs once per release between `prd-author` and `lo-fi-designer`) owns the cross-feature structure — object model, navigation hierarchy, screen inventory, and a product-wide **action-priority system** — closing the "every screen is fine but the product feels messy" gap that no per-feature agent could own. `brand-decoder` (cross-cutting, recommended at Discovery start) **decodes an existing brand's concept** into `brand-concept.md` (worldview, mental model, vocabulary, on/off-brand tells) so design aligns with how a brand actually thinks — distinct from the fingerprint (how it *looks*) and the positioner (outward, *create*). Both are refuse-with-opt-out at their consuming agents (`ia_structure_skipped` / `brand_concept_skipped`); `critique-partner` gains an IA lens. See `CHANGELOG.md` v5.2 entry.

---

## What This Skill Does NOT Do

- Does not install MCPs (user does that separately in Claude Code settings)
- Does not modify Claude Code's own config (settings.json, etc.)
- Does not run the agents — that's the user's job after install
- Does not handle the Claude.ai (non-Claude-Code) environment — these are Claude Code subagents, terminal-only

---

## Anti-Patterns When Running This Skill

- Don't ask scoping questions in Mode 1A (Bundled)
- Don't skip the overwrite/dirty checks in Mode 1 or Mode 2
- Don't regenerate agent files from memory — copy then patch the templates
- Don't explain every agent in detail after install — user can read README.md
- Don't promise MCP connections — only the user can connect MCPs
- Don't auto-stash or auto-discard local changes in Mode 3 — stop and ask
