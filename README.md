# Agent Harry

Kaung Myat Hein's personal multi-agent product design skill for [Claude Code](https://claude.com/claude-code).

Installs a 20-subagent UX pipeline (Discovery → Define → Deliver, plus embedded PM capabilities, a cross-feature information-architecture pass, a decoded brand concept, a project-level visual + composition fingerprint, and a Figma component-library bootstrapper) into any project, then keeps it in sync with this repo.

---

## Install (once, on each machine)

Clone this repo into your global Claude Code skills directory:

```bash
git clone https://github.com/KaungMyatHein/agent-harry.git ~/.claude/skills/agent-harry
```

Restart Claude Code (or open a new terminal session) and the skill is auto-discovered.

---

## Daily use

Inside any Claude Code project, the skill exposes three modes. Trigger them in plain English (or Burmese):

### Install agents into a project

```
"install Agent Harry"
"set up product designer agents"
"design agent တွေ install လုပ်ပေး"
```

Drops 20 agent files into `<project>/.claude/agents/` plus 6 slash commands into `<project>/.claude/commands/`, plus `SHARED_CONTEXT.md`, `PM_SKILLS_MAP.md`, `DECISION_DATA_SHAPES.md`, `SUBAGENT_AUDIT_PROTOCOL.md`, `README.md`, and a `.gitignore` entry for the audit ledger. Two sub-modes:

- **Bundled** — default templates, no questions asked
- **Generator** — answers a few scoping questions (design system, MCPs, PM scope) and patches the templates to fit the project

### Refresh a project's agents after the skill is updated

```
"refresh Agent Harry"
"refresh design agents in this project"
"Agent Harry ပြန် refresh"
```

Overwrites the agent files and slash commands with the latest templates. **Preserves `SHARED_CONTEXT.md`, `README.md`, `PM_SKILLS_MAP.md`, `SUBAGENT_AUDIT_PROTOCOL.md`, and `.harry-audit.jsonl`** — those are yours to customize per-project. `DECISION_DATA_SHAPES.md` is overwritten so v5.0+ chat-markdown rendering propagates. Warns first if any agent file has uncommitted local edits. If refreshing from a pre-v5.0 install, prints an orphan-file notice for `dashboard.html`, `dashboard-server.py`, `.harry-queue.json`, `.claude/commands/agent-harry-loop.md` (does NOT auto-delete — see [CHANGELOG](CHANGELOG.md) v5.0 for the rationale).

### Pull the latest skill from GitHub

```
"update Agent Harry skill"
"pull latest Agent Harry"
"Git ကနေ ဆွဲ"
```

Runs `git pull` on `~/.claude/skills/agent-harry/` and shows you what changed (from `CHANGELOG.md`). To then apply those new templates to a project, open that project and run **Refresh**.

---

## What's inside

```
agent-harry/
├── SKILL.md                  ← skill manifest Claude Code reads; defines the 3 modes
├── README.md                 ← this file
├── LICENSE                   ← MIT
├── RATIONALE.md              ← developer-facing "why" for each design decision (not loaded by agents at runtime)
├── CHANGELOG.md              ← dated entries — what changed and when
└── templates/                ← the payload that gets copied into projects
    ├── README.md             ← full agent system docs (read this for the deep dive)
    ├── SHARED_CONTEXT.md     ← cross-agent context + handoff schema
    ├── PM_SKILLS_MAP.md      ← per-agent PM skill ownership (v3.6, lazy-loaded)
    ├── DECISION_DATA_SHAPES.md ← decisionData chat-render spec (v3.6 / v5.0)
    ├── SUBAGENT_AUDIT_PROTOCOL.md ← session identity + ledger append + slug derivation (v3.8, lazy-loaded)
    ├── .gitignore            ← ignores .harry-audit.jsonl
    └── .claude/
        ├── agents/
        │   ├── orchestrator.md                  (opus)
        │   ├── critique-partner.md              (opus)
        │   ├── discovery-researcher.md          (sonnet)
        │   ├── competitive-analyst.md           (sonnet)
        │   ├── product-positioner.md            (sonnet)
        │   ├── feature-prioritizer.md           (sonnet)
        │   ├── ideation-facilitator.md          (sonnet)
        │   ├── pm-strategist.md                 (sonnet)
        │   ├── lo-fi-designer.md                (sonnet) ← v3.7
        │   ├── figma-designer.md                (sonnet)
        │   ├── design-engineer.md               (sonnet) ← v3.7
        │   ├── usability-tester.md              (sonnet)
        │   ├── handoff-engineer.md              (sonnet)
        │   ├── pm-launch-architect.md           (sonnet)
        │   ├── pm-metrics-architect.md          (sonnet)
        │   ├── prd-author.md                    (sonnet) ← v3.5
        │   ├── product-fingerprint-curator.md   (sonnet) ← v4.0
        │   └── figma-component-bootstrapper.md  (sonnet) ← v4.2
        └── commands/
            ├── audit-pipeline.md
            ├── agent-harry-notion-sync.md       (v3.5)
            ├── agent-harry-audit.md             (v3.8)
            ├── agent-harry-fingerprint.md       (v4.0)
            └── agent-harry-cost.md              (v4.1)
```

For the full breakdown of what each agent does, voices, decision authority, anti-patterns, and usage patterns — see [`templates/README.md`](templates/README.md).

**v5.0 note:** the decision surface is chat-only. Pre-v5.0 shipped a `dashboard.html` visual companion and a click-driven Queue Mode (`dashboard-server.py`, `.harry-queue.json`, `/agent-harry-loop`); both ripped in v5.0 because they were never used in practice. Structured `decisionData` now renders as markdown in chat at every Stop Gate. See [CHANGELOG](CHANGELOG.md) v5.0 and [RATIONALE](RATIONALE.md) § "Why dashboard was removed (v5.0)" for the full story.

---

## Required MCPs (in the projects you install into)

The agents reference these MCPs by default. The skill's Generator mode can patch them out per-project if you don't have one connected:

- **Figma MCP** — read/write design files
- **Notion MCP** — research docs, specs, prioritization tables
- **Mobbin MCP** — UI pattern reference
- **Web Search** — competitive intel, framework lookups

---

## Updating the skill (as the maintainer)

1. Edit files in `~/.claude/skills/agent-harry/` (or in a clone elsewhere).
2. Add a dated entry to `CHANGELOG.md` describing what changed.
3. Commit and push to `main`.
4. On other machines, run **Update mode** from any Claude Code session.

---

## License

MIT — see [LICENSE](LICENSE).
