---
title: Getting Started
nav_order: 2
description: "Install Agent Harry and run your first feature. 5-minute read."
---

# Getting Started

Read this if you've just installed Agent Harry (or are about to) and want to know what to type first.

**Time to read:** about 5 minutes.
**Time to do everything below:** about 15 minutes.

---

## Prerequisites

Before you start, you need:

- **Claude Code installed.** The CLI, the desktop app, the VS Code extension — any flavor works. If you don't have it yet, follow the [Claude Code install guide](https://docs.claude.com/en/docs/claude-code/overview).
- **A project directory.** Any project you want to design features for. New or existing both work.
- **Git on your machine.** You'll use it once to clone the skill.

Optional but recommended:

- **Figma MCP connected.** Needed for [`figma-designer`](agents/figma-designer.html), [`product-fingerprint-curator`](agents/product-fingerprint-curator.html), and parts of [`lo-fi-designer`](agents/lo-fi-designer.html). Without it, several agents fall back to text-only modes. See the [Figma MCP guide](https://help.figma.com/hc/en-us/articles/32132100833559) to set it up.
- **Mobbin MCP connected.** Used by [`competitive-analyst`](agents/competitive-analyst.html) for pattern references. Skip if you don't have a Mobbin subscription.
- **Notion MCP connected.** Used by [`/agent-harry-notion-sync`](commands/agent-harry-notion-sync.html) if you want to publish artifacts to a Notion workspace. Optional.

---

## Step 1: Install the skill (once per machine)

Open a terminal and run:

```bash
git clone https://github.com/KaungMyatHein/agent-harry.git ~/.claude/skills/agent-harry
```

This puts the skill in the standard Claude Code skills location. It's available to every project on this machine from now on.

To update later (when a new version ships):

```bash
cd ~/.claude/skills/agent-harry
git pull
```

---

## Step 2: Install Agent Harry into your project (once per project)

In Claude Code, open the project you want to work in. Type one of these:

> "install Agent Harry"

> "set up Agent Harry agents"

> *Agent Harry ထည့်ပေး* (Burmese works too)

What happens:

- 18 agent files land in `<project>/.claude/agents/`
- 5 slash commands land in `<project>/.claude/commands/`
- A `SHARED_CONTEXT.md` template lands at the project root
- A `.gitignore` entry is added for the audit ledger file

The whole thing takes about 30 seconds. You'll see a list of what got created.

---

## Step 3: Fill in `SHARED_CONTEXT.md` (2 minutes)

Open `<project>/SHARED_CONTEXT.md` and find the **Project Context** table near the top. Fill in these five fields:

| Field | Example |
|---|---|
| Product type | `web SaaS` / `mobile app` / `internal tool` |
| Stack | `Next.js + Tailwind + shadcn/ui` / `SwiftUI` / `Flutter` |
| Design system | `https://figma.com/file/.../design-system` or `Material 3` or a local path |
| Notion workspace | URL or `none` |
| Figma file | main project file URL or `none` |

These get read by every agent at intake. Skipping this step means agents will ask you these same questions every single time. Save yourself the friction.

---

## Step 4: (Recommended) Set up the product fingerprint (5 minutes)

If you have an existing product with screens worth referencing, type:

> "/agent-harry-fingerprint"

The [`product-fingerprint-curator`](agents/product-fingerprint-curator.html) agent will ask you for 3–7 of your best Figma frames. It pulls them, extracts the visual language (density, color stance, copy tone, anti-patterns), and writes a `product-fingerprint.md` at the project root. Every future feature inherits this vocabulary.

Skip this step if:

- You're greenfield with no existing product yet, **or**
- You haven't set up Figma MCP

If you skip, the design agents ([`lo-fi-designer`](agents/lo-fi-designer.html), [`figma-designer`](agents/figma-designer.html), [`design-engineer`](agents/design-engineer.html)) will refuse to run when you invoke them. You can override that refusal by typing `skip fingerprint` at the intake — your design will work, but it won't match your existing product as tightly. See the [Product Fingerprint](concepts/product-fingerprint.html) page for details.

---

## Step 5: Your first feature

Now you're ready. Tell the orchestrator what you want:

> "design the checkout flow"

> "build the empty state for the search page"

> "audit my existing PRD and propose the smallest next move"

What happens next:

1. The orchestrator asks at most 2 clarifying questions (the "Diagnose" phase).
2. It proposes a "smallest next move" — one specific agent, with a tight goal.
3. You type `y` to proceed, `revise <delta>` to refine the proposal, or `cancel` to stop.
4. That agent runs. It produces output. You see a [Stop Gate](concepts/stop-gate.html).
5. You type `y` again (or revise again). The orchestrator proposes the next agent.
6. Repeat until done.

This is the [Alignment Loop](concepts/alignment-loop.html). One step at a time. You always know what's about to happen and you always have the option to redirect.

---

## What to read next

In rough order of value:

1. [First Feature Walkthrough](guides/first-feature-walkthrough.html) — see what a full session actually looks like, with realistic dialogue and costs
2. [Stop Gate](concepts/stop-gate.html) — what to type after each agent
3. [Agents](index.html#all-agents) — what each of the 18 agents does
4. [Commands](index.html#all-commands) — what each slash command does
5. [Troubleshooting](guides/troubleshooting.html) — when something goes wrong

---

_Current as of v4.0._
