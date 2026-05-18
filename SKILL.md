---
name: agent-harry
description: Agent Harry — Kaung Myat Hein's personal multi-agent product design system for Claude Code. Installs, refreshes, or updates a 10-subagent UX pipeline (orchestrator + 8 phase agents + critique-partner) covering the Discovery → Define → Deliver lifecycle plus embedded PM capabilities (positioning, prioritization, competitive analysis). Trigger on any of these intents — brand, semantic, or Burmese. Install in a new project ("install Agent Harry", "set up Agent Harry agents", "install product designer agents", "install design subagents", "bootstrap UX multi-agent system", "Agent Harry ထည့်ပေး", "design agent တွေ install လုပ်ပေး", "product designer workflow ဆောက်ပေး"). Refresh an existing project's agents after the skill is updated ("refresh Agent Harry", "refresh design agents", "update agents in this project", "Agent Harry ပြန် refresh"). Pull the latest skill from GitHub ("update Agent Harry skill", "pull latest Agent Harry", "Agent Harry skill update လုပ်ပေး", "Git ကနေ ဆွဲ").
---

# Agent Harry — Multi-Agent Product Design Skill

A personal Claude Code skill that bootstraps a 10-agent product design subagent system into any project, then keeps it in sync with the upstream GitHub repo.

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
6. Copy `templates/README.md` → `<project>/README.md` (or skip if README already exists)
7. Confirm completion with file list and a quick "try this next" prompt

Expected output:

```
Installed 13 Agent Harry subagents + /audit-pipeline command + SHARED_CONTEXT.md into <project>/

Try this:
"/audit-pipeline" — confirm the project is set up correctly, then
"Use the orchestrator agent — I want to <outcome>."
(Orchestrator defaults to Alignment Loop: it asks you 1-2 questions and proposes the smallest next move.)

Quick reference:
- Discovery: discovery-researcher, competitive-analyst
- Define: product-positioner, feature-prioritizer, ideation-facilitator, pm-strategist
- Deliver: interaction-designer, usability-tester, handoff-engineer, pm-launch-architect (gated by Research-First check)
- Cross-cutting: pm-metrics-architect
- Meta: orchestrator (opus), critique-partner (opus)
- Commands: /audit-pipeline
```

Done. Don't over-explain.

### 1B — Generator (Customized) Installation

Use when the user wants the system tuned to their specific project, design system, or workflow.

Scoping questions (ask only what isn't already known, keep under 5):

1. **Project context** — What kind of product? (Mobile app / web SaaS / internal tool / hardware / other)
2. **Design system** — What's the source? (Figma library URL / code repo / external system like Material/Carbon/shadcn / none yet)
3. **MCPs connected** — Which of these are available? (Figma, Notion, Mobbin, Supabase, Web Search, other)
4. **PM capability needed?** — Yes (full set including positioner/prioritizer) / No (drop PM agents, keep design-only)
5. **Prototype medium default** — Figma / Code / Both / Ask each time

Customization patches:

- **Per-agent tool list** — Update `tools:` frontmatter to match the user's MCP availability. Example: if Mobbin MCP isn't connected, remove from `competitive-analyst` and `ideation-facilitator`, replace with a note that pattern research will use Web Search instead.
- **Design system context** — Inject the user's design system source into `interaction-designer.md` (Intake Questions Q2), `handoff-engineer.md` (Token usage audit), and `SHARED_CONTEXT.md` (top-of-file Project Context section).
- **PM capability scope** — If user says "no PM agents", delete `product-positioner.md`, `feature-prioritizer.md`, `competitive-analyst.md`, and update `orchestrator.md` agent list + README.md.
- **Project-specific routing rules** — Optionally add a Project Conventions section to `SHARED_CONTEXT.md` (file naming, Notion workspace, Figma file structure).

Patch method: use `view` + `str_replace` for targeted edits. Don't regenerate templates — they're tested.

Expected output:

```
Installed 10 Agent Harry subagents + SHARED_CONTEXT.md into <project>/

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

**Refresh policy: overwrite only the 10 agent files and the `.claude/commands/` folder; never touch SHARED_CONTEXT.md or README.md.** SHARED_CONTEXT is project-customized by design — users edit it. README may have project-specific additions. Agent + command files are canonical and rarely edited locally.

**Important — SHARED_CONTEXT.md note:** v2 introduced the Executive Summary requirement, Token Budget rules, and Research-First Gate into `SHARED_CONTEXT.md`. If the user has an old (pre-v2) SHARED_CONTEXT.md, refresh does NOT overwrite it — but warn them so they can manually merge the new sections, or opt in to a SHARED_CONTEXT.md refresh.

Steps:

1. Confirm the project root with the user (or use cwd).
2. Check that `<project>/.claude/agents/` exists. If not, this isn't an installed Agent Harry project — suggest running Install instead.
3. **Dirty-check**: if the project is a git repo, run `git -C <project> status --porcelain .claude/agents/ .claude/commands/` to see if any agent or command files have uncommitted local modifications. If yes, list them and ask: *"These files have local edits — overwrite anyway?"* Don't proceed without confirmation.
4. Copy `templates/.claude/agents/*.md` → `<project>/.claude/agents/` (overwriting).
5. Copy `templates/.claude/commands/*.md` → `<project>/.claude/commands/` (overwriting; create folder if missing).
6. Check `<project>/SHARED_CONTEXT.md`: if it lacks the v2 markers ("Executive Summary", "Token Budget", "Research-First Gate"), tell the user the v2 sections are missing and offer two options: (a) review the diff and merge manually, or (b) explicitly opt in to a full SHARED_CONTEXT.md replace (destroys any local customizations there).
7. Do **not** touch `README.md`.
8. Report which files were replaced + a one-line pointer to the CHANGELOG: *"See `~/.claude/skills/agent-harry/CHANGELOG.md` for what changed in the templates."*

Expected output:

```
Refreshed 10 agent files + /audit-pipeline command in <project>/.claude/
Preserved: SHARED_CONTEXT.md, README.md
SHARED_CONTEXT.md v2 sections check: <present | MISSING — see below>

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
│                                 v3: PM Skills Map
└── .claude/
    ├── agents/
    │   ├── orchestrator.md          (opus)   ← v3: Alignment Loop default; Waterfall fallback
    │   ├── critique-partner.md      (opus)
    │   ├── discovery-researcher.md  (sonnet)
    │   ├── competitive-analyst.md   (sonnet)
    │   ├── product-positioner.md    (sonnet)
    │   ├── feature-prioritizer.md   (sonnet)
    │   ├── ideation-facilitator.md  (sonnet)
    │   ├── interaction-designer.md  (sonnet)
    │   ├── usability-tester.md      (sonnet)
    │   ├── handoff-engineer.md      (sonnet)
    │   ├── pm-strategist.md         (sonnet) ← v3: strategy / business model / vision / pricing
    │   ├── pm-launch-architect.md   (sonnet) ← v3: GTM / beachhead / ICP / growth loops
    │   └── pm-metrics-architect.md  (sonnet) ← v3: north-star / OKRs / tracking plans
    └── commands/
        └── audit-pipeline.md   ← /audit-pipeline — enforces Research-First Gate
```

These are the source of truth. Don't regenerate — copy then patch.

**v2 token-cost design:** Opus only on orchestrator + critique-partner. The other 11 agents run on Sonnet. This is the primary lever that brings a full pipeline run from ~$8 down to ~$1–3. Don't override per-agent without a logged reason in the handoff.

**v3 orchestration shift:** Default mode is the Alignment Loop (Diagnose → smallest-next-move → Run → Realign), not waterfall. Waterfall planning is the fallback for explicit "lay out the full pipeline" requests. User can `pivot — <new direction>` at any Stop Gate.

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
