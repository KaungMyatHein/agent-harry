# Agent Harry

Kaung Myat Hein's personal multi-agent product design skill for [Claude Code](https://claude.com/claude-code).

Installs a 16-subagent UX pipeline (Discovery → Define → Deliver, plus embedded PM capabilities) into any project, then keeps it in sync with this repo.

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

Drops 16 agent files into `<project>/.claude/agents/` plus a `SHARED_CONTEXT.md` and `README.md` describing the system. Two sub-modes:

- **Bundled** — default templates, no questions asked
- **Generator** — answers a few scoping questions (design system, MCPs, PM scope) and patches the templates to fit the project

### Refresh a project's agents after the skill is updated

```
"refresh Agent Harry"
"refresh design agents in this project"
"Agent Harry ပြန် refresh"
```

Overwrites the 16 agent files with the latest templates. **Preserves `SHARED_CONTEXT.md` and `README.md`** — those are yours to customize per-project. Warns first if any agent file has uncommitted local edits.

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
├── CHANGELOG.md              ← dated entries — what changed and when
└── templates/                ← the payload that gets copied into projects
    ├── README.md             ← full agent system docs (read this for the deep dive)
    ├── SHARED_CONTEXT.md     ← cross-agent context + handoff schema
    └── .claude/agents/
        ├── orchestrator.md
        ├── critique-partner.md
        ├── discovery-researcher.md
        ├── competitive-analyst.md
        ├── product-positioner.md
        ├── feature-prioritizer.md
        ├── ideation-facilitator.md
        ├── pm-strategist.md
        ├── low-fi-designer.md
        ├── figma-designer.md
        ├── design-engineer.md
        ├── usability-tester.md
        ├── handoff-engineer.md
        ├── pm-launch-architect.md
        ├── pm-metrics-architect.md
        └── prd-author.md
```

For the full breakdown of what each agent does, voices, decision authority, anti-patterns, and usage patterns — see [`templates/README.md`](templates/README.md).

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
