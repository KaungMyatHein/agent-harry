#!/usr/bin/env node
// Agent Harry — multi-host exporter
// Reads the Claude Code source-of-truth in templates/.claude/agents/*.md and
// emits host-native bundles for Antigravity, Cursor, Codex, and Trae.
//
// The agent prompt BODIES are the design expertise — we copy them verbatim and
// only adapt the orchestration layer (how delegation happens) per host, because
// none of these hosts have Claude Code's native subagent-spawning primitive.
//
// Usage:
//   node exporters/export.mjs <host|all> [--out <dir>]
//   host ∈ antigravity | cursor | codex | trae | all
//   default --out is ./dist
//
// This is the engine behind the skill's "Export" mode. Re-run it any time the
// source agents change — the host bundles are generated, never hand-edited.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const AGENTS_DIR = join(ROOT, 'templates', '.claude', 'agents');
const COMMANDS_DIR = join(ROOT, 'templates', '.claude', 'commands');

// ── Model recommendation per host ───────────────────────────────────────────
// Claude tier  →  host-native model. opus = heavy reasoning (orchestrator,
// critique-partner); sonnet = standard. Light/mechanical sonnet agents can be
// downgraded to the cheaper tier to save cost — noted in each bundle's README.
const MODEL_MAP = {
  antigravity: { opus: 'gemini-3-pro', sonnet: 'gemini-3-pro', light: 'gemini-3-flash' },
  codex:       { opus: 'gpt-5.5',      sonnet: 'gpt-5.5',      light: 'gpt-5.5-mini' },
  cursor:      { opus: 'Claude Opus (or GPT-5.5)', sonnet: 'Claude Sonnet (or GPT-5)', light: 'Claude Haiku' },
  trae:        { opus: 'strongest available (Claude Opus / GPT-5.5 / Gemini 3 Pro)', sonnet: 'balanced (Claude Sonnet / GPT-5)', light: 'fast tier' },
};

// MCP servers referenced across the roster, with the canonical package/command
// users plug into each host's MCP config. Commands are stubs — users fill keys.
const MCP_SERVERS = {
  notion:     { note: 'Notion workspace — docs, PRDs, decision sync' },
  figma:      { note: 'Figma — design context, components, screenshots' },
  mobbin:     { note: 'Mobbin — UI pattern reference library' },
  playwright: { note: 'Playwright — browser-driven usability + a11y testing' },
};

// ── Frontmatter parser (first --- block only; body kept verbatim) ────────────
function parseAgent(file) {
  const raw = readFileSync(join(AGENTS_DIR, file), 'utf8');
  const lines = raw.split('\n');
  if (lines[0].trim() !== '---') return { name: file.replace(/\.md$/, ''), meta: {}, body: raw };
  let i = 1;
  const metaLines = [];
  for (; i < lines.length; i++) {
    if (lines[i].trim() === '---') { i++; break; }
    metaLines.push(lines[i]);
  }
  const body = lines.slice(i).join('\n').replace(/^\n+/, '');
  const meta = {};
  for (const ml of metaLines) {
    const m = ml.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return { name: meta.name || file.replace(/\.md$/, ''), meta, body };
}

function loadAgents() {
  return readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parseAgent)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function loadCommands() {
  if (!existsSync(COMMANDS_DIR)) return [];
  return readdirSync(COMMANDS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ name: f.replace(/\.md$/, ''), body: readFileSync(join(COMMANDS_DIR, f), 'utf8') }));
}

// Agents whose work is light/mechanical → eligible for the cheaper model tier.
const LIGHT_AGENTS = new Set([
  'product-fingerprint-curator', 'handoff-engineer', 'figma-component-bootstrapper',
]);

function modelFor(agent, host) {
  const map = MODEL_MAP[host];
  if (LIGHT_AGENTS.has(agent.name)) return map.light;
  return map[agent.meta.model] || map.sonnet;
}

function mcpList(agent) {
  const tools = (agent.meta.tools || '').split(',').map((t) => t.trim());
  return tools.filter((t) => t.startsWith('mcp__')).map((t) => t.replace('mcp__', ''));
}

function write(out, rel, content) {
  const full = join(out, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

// Short one-line role pulled from the agent's `voice` (before the em-dash) or name.
function roleOf(agent) {
  const v = agent.meta.voice || '';
  return v || agent.name;
}

// First sentence of the description, capped on a word boundary (for rule frontmatter).
function shortDesc(agent, cap = 280) {
  const raw = (agent.meta.description || roleOf(agent)).replace(/\s+/g, ' ').trim();
  if (raw.length <= cap) return raw;
  const cut = raw.slice(0, cap);
  return cut.slice(0, cut.lastIndexOf(' ')).trim() + '…';
}

const DEGRADE_NOTE = (host, primitive) => `> **Portability note.** Agent Harry was built on Claude Code's native subagent
> delegation — the orchestrator spawns each agent in its own isolated context with
> its own model and tool allowlist, then synthesizes the results. ${host} does not
> have that exact primitive. Here the roster is ported as ${primitive}. The design
> expertise in each agent body is identical; what changes is *how* the orchestrator
> hands off. Treat the orchestrator as a playbook you (or the host's agent) follow
> turn-by-turn rather than a true parallel dispatcher.`;

// ─────────────────────────────────────────────────────────────────────────────
// ANTIGRAVITY  →  .agents/{agents.md, skills/*.md, workflows/*.md}
// Closest fit: native team (agents.md) + skills + workflows orchestration.
// ─────────────────────────────────────────────────────────────────────────────
function exportAntigravity(out, agents, commands) {
  const base = join(out, 'antigravity');
  if (existsSync(base)) rmSync(base, { recursive: true, force: true });

  // Each agent → a skill file (body verbatim, host header prepended).
  for (const a of agents) {
    const model = modelFor(a, 'antigravity');
    const header = `<!-- Generated by Agent Harry exporter — source: templates/.claude/agents/${a.name}.md -->
# ${a.name}

- **Role:** ${roleOf(a)}
- **Phase:** ${a.meta.phase || 'n/a'} · **Decision authority:** ${a.meta.decision_authority || 'n/a'}
- **Recommended model:** \`${model}\`
- **MCP tools:** ${mcpList(a).join(', ') || 'none'}

---

`;
    write(base, `.agents/skills/${a.name}.md`, header + a.body + '\n');
  }

  // Team roster (agents.md) — the index Antigravity reads natively.
  const roster = agents
    .map((a) => `### ${a.name}\n- Role: ${roleOf(a)}\n- Phase: ${a.meta.phase} · Authority: ${a.meta.decision_authority} · Model: \`${modelFor(a, 'antigravity')}\`\n- Skill: \`.agents/skills/${a.name}.md\``)
    .join('\n\n');

  const agentsMd = `# Agent Harry — AI Product Design Team

${DEGRADE_NOTE('Antigravity', 'native `.agents/` skills + a `run-design-cycle` workflow')}

This workspace runs a 22-member product design team covering the
**Discovery → Define → Deliver** lifecycle. The **orchestrator** is the entry
point: describe an outcome, and it sequences the right teammates, inserts
approval gates, and synthesizes their output.

## How to run
1. Type \`/run-design-cycle <your goal>\` (see \`.agents/workflows/\`), **or**
2. @-mention a specific teammate skill from \`.agents/skills/\`.

## Model recommendation (Gemini)
| Tier | Used by | Model |
|---|---|---|
| Heavy reasoning | orchestrator, critique-partner | \`gemini-3-pro\` |
| Standard | most agents | \`gemini-3-pro\` |
| Light / mechanical | ${[...LIGHT_AGENTS].join(', ')} | \`gemini-3-flash\` (cost saver) |

## MCP tools to connect
${Object.entries(MCP_SERVERS).map(([k, v]) => `- **${k}** — ${v.note}`).join('\n')}

## Team roster

${roster}
`;
  write(base, '.agents/agents.md', agentsMd);
  // Antigravity also reads a root AGENTS.md — point it at the team file.
  write(base, 'AGENTS.md', `# Agent Harry\n\nProduct design multi-agent team. Full roster and run instructions: [\`.agents/agents.md\`](.agents/agents.md).\n\nStart with \`/run-design-cycle <goal>\`.\n`);

  // Orchestrator → workflow. Body verbatim, framed as a workflow.
  const orch = agents.find((a) => a.name === 'orchestrator');
  if (orch) {
    const wf = `<!-- Generated by Agent Harry exporter — orchestrator as workflow -->
# /run-design-cycle

When the user types \`/run-design-cycle <goal>\`, act as the **orchestrator**:
decompose the goal, sequence the right teammates from \`.agents/skills/\`, insert
the approval gates ("Stop Gates") described below, and synthesize their output.
For each step, shift context to the named teammate's skill file and execute it,
then return to this workflow to decide the next step.

Recommended model for this workflow: \`${modelFor(orch, 'antigravity')}\`.

---

${orch.body}
`;
    write(base, '.agents/workflows/run-design-cycle.md', wf);
  }

  // Slash commands → workflows.
  for (const c of commands) {
    write(base, `.agents/workflows/${c.name}.md`, c.body);
  }

  write(base, '.agents/HARRY_README.md', readmeFor('antigravity', agents));
  return base;
}

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR  →  .cursor/rules/*.mdc  (+ AGENTS.md overview, .cursor/mcp.json)
// Rules are passive context, agent-requested via `description`. No per-agent
// model pin (model is chosen in Cursor's UI).
// ─────────────────────────────────────────────────────────────────────────────
function exportCursor(out, agents, commands) {
  const base = join(out, 'cursor');
  if (existsSync(base)) rmSync(base, { recursive: true, force: true });

  for (const a of agents) {
    // Cursor .mdc frontmatter: description (agent-requested), globs, alwaysApply.
    const fm = `---\ndescription: ${shortDesc(a)}\nglobs:\nalwaysApply: false\n---\n\n`;
    const header = `<!-- Generated by Agent Harry exporter — source: templates/.claude/agents/${a.name}.md -->
<!-- Recommended Cursor model: ${modelFor(a, 'cursor')} (set in the model picker — Cursor can't pin model per rule) -->
# ${a.name} — ${roleOf(a)}
Phase: ${a.meta.phase} · Authority: ${a.meta.decision_authority} · MCP: ${mcpList(a).join(', ') || 'none'}

`;
    write(base, `.cursor/rules/${a.name}.mdc`, fm + header + a.body + '\n');
  }

  const index = agents.map((a) => `- **${a.name}** (${a.meta.phase}) — ${roleOf(a)}`).join('\n');
  write(base, 'AGENTS.md', `# Agent Harry — Product Design Team

${DEGRADE_NOTE('Cursor', 'agent-requested `.cursor/rules/*.mdc` (passive personas)')}

To act as a teammate, @-mention its rule in chat (e.g. \`@orchestrator\`) or let
Cursor pull it in by relevance. Start with **orchestrator** to plan a cycle.

## Models
Cursor picks the model in the UI (it can't be pinned per rule). Recommended:
**${MODEL_MAP.cursor.opus}** for orchestrator & critique-partner; **${MODEL_MAP.cursor.sonnet}** for the rest.
For parallel exploration, Cursor's worktree-isolated agents are the closest thing
to Harry's real subagent fan-out.

## Roster
${index}

## MCP
Configure servers in \`.cursor/mcp.json\` (template included): ${Object.keys(MCP_SERVERS).join(', ')}.
`);

  write(base, '.cursor/mcp.json', mcpJsonStub());
  write(base, '.cursor/HARRY_README.md', readmeFor('cursor', agents));
  return base;
}

// ─────────────────────────────────────────────────────────────────────────────
// CODEX  →  AGENTS.md (lean, <32KiB) + .codex/agents/*.md (full bodies)
//          + .codex/config.toml (model + mcp)
// AGENTS.md has a 32 KiB default cap, so the root file is an index/router and
// full bodies live in .codex/agents/, loaded on demand by reference.
// ─────────────────────────────────────────────────────────────────────────────
function exportCodex(out, agents, commands) {
  const base = join(out, 'codex');
  if (existsSync(base)) rmSync(base, { recursive: true, force: true });

  for (const a of agents) {
    const header = `<!-- Generated by Agent Harry exporter — source: templates/.claude/agents/${a.name}.md -->
# ${a.name} — ${roleOf(a)}
Phase: ${a.meta.phase} · Authority: ${a.meta.decision_authority} · MCP: ${mcpList(a).join(', ') || 'none'}

`;
    write(base, `.codex/agents/${a.name}.md`, header + a.body + '\n');
  }

  const router = agents
    .map((a) => `| \`${a.name}\` | ${a.meta.phase} | ${roleOf(a).split('—')[0].trim()} |`)
    .join('\n');

  // Lean root AGENTS.md — index + routing only (keeps under the 32 KiB cap).
  write(base, 'AGENTS.md', `# Agent Harry — Product Design Team

${DEGRADE_NOTE('Codex', 'a lean router here + full agent bodies in `.codex/agents/`')}

**This file is the index.** To act as a teammate, read its full brief from
\`.codex/agents/<name>.md\` and adopt it for the task. Start with the
**orchestrator** to plan a Discovery → Define → Deliver cycle; it tells you which
teammate to load next and where the approval gates ("Stop Gates") fall.

> AGENTS.md has a 32 KiB cap, so bodies are NOT inlined here — that's why they
> live in \`.codex/agents/\`. Load only the briefs you need per turn.

## Roster (load from \`.codex/agents/<name>.md\`)
| Agent | Phase | Role |
|---|---|---|
${router}

## Model
Set in \`.codex/config.toml\`: \`model = "${MODEL_MAP.codex.opus}"\`, \`model_reasoning_effort = "high"\`.
Codex uses one default model per session (no per-agent pin) — use a high reasoning
effort for orchestrator/critique-partner turns, lower it for mechanical agents.

## MCP
Servers are configured in \`.codex/config.toml\` under \`[mcp_servers.*]\`: ${Object.keys(MCP_SERVERS).join(', ')}.
`);

  write(base, '.codex/config.toml', codexConfigToml());
  write(base, '.codex/HARRY_README.md', readmeFor('codex', agents));
  return base;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAE  →  .trae/rules/*.md (frontmatter) + .trae/mcp.json
// Same model as Cursor: frontmatter-gated markdown rules, four activation modes.
// ─────────────────────────────────────────────────────────────────────────────
function exportTrae(out, agents, commands) {
  const base = join(out, 'trae');
  if (existsSync(base)) rmSync(base, { recursive: true, force: true });

  for (const a of agents) {
    const fm = `---\ndescription: ${shortDesc(a)}\nalwaysApply: false\nglobs: []\n---\n\n`;
    const header = `<!-- Generated by Agent Harry exporter — source: templates/.claude/agents/${a.name}.md -->
<!-- Recommended model (set in Trae agent config): ${modelFor(a, 'trae')} -->
# ${a.name} — ${roleOf(a)}
Phase: ${a.meta.phase} · Authority: ${a.meta.decision_authority} · MCP: ${mcpList(a).join(', ') || 'none'}

`;
    write(base, `.trae/rules/${a.name}.md`, fm + header + a.body + '\n');
  }

  const index = agents.map((a) => `- **${a.name}** (${a.meta.phase}) — ${roleOf(a)}`).join('\n');
  write(base, '.trae/rules/00-agent-harry-overview.md', `---
description: Agent Harry team overview and how to run a product design cycle. Pull this in first.
alwaysApply: false
globs: []
---

# Agent Harry — Product Design Team

${DEGRADE_NOTE('Trae', 'agent-requested `.trae/rules/*.md` (passive personas)')}

To act as a teammate, @-mention its rule (e.g. \`@orchestrator\`) or let Trae's
agent pull it in by description relevance. Start with **orchestrator**.

## Models (set per agent in Trae's agent config)
- Heavy: ${MODEL_MAP.trae.opus} — orchestrator, critique-partner
- Standard: ${MODEL_MAP.trae.sonnet} — most agents

## Roster
${index}

## MCP — configure in \`.trae/mcp.json\`
${Object.keys(MCP_SERVERS).join(', ')}.
`);

  write(base, '.trae/mcp.json', mcpJsonStub());
  write(base, '.trae/HARRY_README.md', readmeFor('trae', agents));
  return base;
}

// ── Shared config stubs ──────────────────────────────────────────────────────
function mcpJsonStub() {
  const servers = {};
  for (const [k, v] of Object.entries(MCP_SERVERS)) {
    servers[k] = { command: `<command-for-${k}-mcp>`, args: [], env: {}, _note: v.note };
  }
  return JSON.stringify({ mcpServers: servers }, null, 2) + '\n';
}

function codexConfigToml() {
  let toml = `# Agent Harry — Codex config\nmodel = "${MODEL_MAP.codex.opus}"\nmodel_reasoning_effort = "high"\n\n`;
  toml += `# Raise the AGENTS.md byte cap so the router index loads fully (default 32 KiB).\nproject_doc_max_bytes = 65536\n\n`;
  for (const [k, v] of Object.entries(MCP_SERVERS)) {
    toml += `# ${v.note}\n[mcp_servers.${k}]\ncommand = "<command-for-${k}-mcp>"\nargs = []\n\n`;
  }
  return toml;
}

function readmeFor(host, agents) {
  const opusAgents = agents.filter((a) => a.meta.model === 'opus').map((a) => a.name);
  const Host = host[0].toUpperCase() + host.slice(1);
  return `# Agent Harry on ${Host}

Generated by the Agent Harry exporter from the Claude Code source-of-truth.
Do not hand-edit these files — re-run \`node exporters/export.mjs ${host}\` after
the source agents change.

## What ported cleanly
- All 22 agent prompt bodies (the design expertise) — verbatim.
- Phase, decision-authority, and MCP-tool metadata.
- Slash commands / workflows.
- A recommended model per agent for this host.

## What degraded (and why)
Claude Code spawns each agent as a real subagent with its own isolated context
and model. ${Host} has no identical primitive, so the **orchestrator runs as a
playbook** the host's single agent follows turn-by-turn, rather than a true
parallel dispatcher. Approval gates ("Stop Gates") become prose checkpoints you
confirm in chat.

## Heavy-reasoning agents (give these the strongest model)
${opusAgents.map((n) => `- ${n}`).join('\n')}

## Install
Copy this bundle's host folder(s) into your project root and connect the MCP
servers listed in the config stub.
`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const EXPORTERS = { antigravity: exportAntigravity, cursor: exportCursor, codex: exportCodex, trae: exportTrae };

function main() {
  const argv = process.argv.slice(2);
  const host = argv[0] || 'all';
  const outIdx = argv.indexOf('--out');
  const out = outIdx >= 0 ? resolve(argv[outIdx + 1]) : join(ROOT, 'dist');

  const agents = loadAgents();
  const commands = loadCommands();
  console.log(`Loaded ${agents.length} agents, ${commands.length} commands from source.`);

  const targets = host === 'all' ? Object.keys(EXPORTERS) : [host];
  for (const t of targets) {
    if (!EXPORTERS[t]) { console.error(`Unknown host: ${t}. Use: ${Object.keys(EXPORTERS).join(' | ')} | all`); process.exit(1); }
    const dir = EXPORTERS[t](out, agents, commands);
    console.log(`✓ ${t.padEnd(12)} → ${dir}`);
  }
  console.log('\nDone. Inspect the bundle(s), then copy the host folder into your project root.');
}

main();
