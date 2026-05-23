---
title: Dashboard
parent: Concepts
nav_order: 8
description: "A visual surface alongside chat that renders the current Stop Gate as a card with clickable buttons."
---

# Dashboard

> A static HTML file at your project root (`dashboard.html`) that renders the current Stop Gate as a visual card. Refreshes itself in your browser every time a sub-agent finishes. Read-only by default; clickable buttons available if you start the optional dashboard server.

## What problem it solves

Chat output is linear and dense. By the time you've scrolled through an agent's full Executive Summary, the table headers are off-screen and the decision buttons are at the bottom. For frequent decisions, this gets tedious.

The dashboard fixes that. Same content, visual layout. A NOW card front-and-center with the current Stop Gate's stats, TL;DR, and decision options. You glance, decide, type (or click), back to chat.

## How it works

After every Stop Gate, the orchestrator writes a fresh `<project>/dashboard.html` with the current state baked in as inline HTML. No JavaScript polling, no server required, no auto-refresh — just static HTML. You preview it in Claude Code's Preview MCP panel or open it in a browser.

In **read-only mode** (default), the buttons show the literal text you'd type in chat. Clicks do nothing. Chat is the source of truth.

In **Queue Mode** (opt-in), buttons become real — they POST to a local Python server which writes click intent to `.harry-queue.json`. A separate `/agent-harry-loop` slash command polls the queue and dispatches to the orchestrator. This delivers click-and-walk-away UX without breaking the chat-as-source-of-truth invariant.

## What you'll see

The dashboard layout:

```
┌───────────────────────────────────────────────────┐
│ Agent Harry — saas-ecommerce         $1.20 / $5  │  ← top bar with cost meter
├───────────────────────────────────────────────────┤
│ History: discovery-researcher → pm-metrics → ...  │  ← compressed breadcrumb
├───────────────────────────────────────────────────┤
│                                                   │
│   ●  NOW  lo-fi-designer  Mode A  define          │
│                                                   │
│   ┌──────────┬──────────┬──────────┬──────────┐  │
│   │ Conf     │ Inputs   │ Outputs  │ Cost     │  │
│   │ high     │ 3 files  │ 3 layouts│ $0.40    │  │
│   └──────────┴──────────┴──────────┴──────────┘  │
│                                                   │
│   Decision data: <relevant scoring/insight panel> │
│                                                   │
│   TL;DR:                                          │
│   - Picked Primary: sidebar+main, inherits Cart   │
│   - 3 DS components reused, 1 NEW                 │
│   - Open question: confirm tax display location   │
│                                                   │
│   Next: proceed to figma-designer or design-eng?  │
│                                                   │
│   [ y ]  [ revise ]  [ grill me ]  [ pivot ]  [ cancel ]  │
│                                                   │
├───────────────────────────────────────────────────┤
│ Suggested next: figma-designer  ~$0.40            │  ← preview strip
├───────────────────────────────────────────────────┤
│ Footer                                            │
└───────────────────────────────────────────────────┘
```

The cost meter changes color: green under $1.50, yellow at $1.50-$2.50, red above $2.50.

## How to interact

### Read-only mode (default)

You read the dashboard. You type your decision in chat. The dashboard is a visual mirror, not an input surface.

### Queue Mode (opt-in)

Two extra setup steps:

1. **Start the dashboard server** (Python stdlib, no dependencies):
   ```bash
   cd <project>
   python3 dashboard-server.py
   ```
2. **Open the browser** to `http://localhost:3737`
3. **In Claude Code, invoke the loop**:
   ```
   /agent-harry-loop <your goal>
   ```

Now the buttons in the dashboard are real. Clicking `y` POSTs to the server, which writes to `.harry-queue.json`. The loop polls the queue every ~60s and dispatches to the orchestrator.

You can still type in chat at any time — chat input takes priority over queue clicks.

## When it fires

The dashboard regenerates after every Stop Gate. The orchestrator writes the new file before returning control to you. If you have it open in a browser tab, refreshing the tab shows the latest state.

Queue Mode polling fires every ~60 seconds while `/agent-harry-loop` is active. Idle cycles cost ~$0.015 each, capped at 20 polls (~20 minutes of idle).

## Example

You're working on the checkout flow. The dashboard is open in a Claude Preview panel beside chat.

`lo-fi-designer` finishes. The orchestrator updates `dashboard.html` with the latest state. The Preview panel auto-refreshes. You see the NOW card showing the Primary/Alternative/Risky layouts in the TL;DR. The cost meter is at $1.20 — still green.

You glance, decide to revise. You either:

- **Type** `revise — drop the Risky variant` in chat, OR
- **Click** the `[ revise ]` button (if Queue Mode is on), then fill in the inline text box that appears

Either way, the orchestrator processes the revise and the dashboard regenerates with the next state.

## Common questions

**Do I need the dashboard?**
No. Agent Harry works in chat-only mode. The dashboard is optional UX.

**Do I need Queue Mode?**
No. The dashboard is useful in read-only mode (visual mirror of chat). Queue Mode adds the click-driven UX on top.

**Is the dashboard live?**
Sort of. It's regenerated every Stop Gate (server-side), and you refresh the browser to see it. There's no WebSocket, no polling client. Refresh = latest.

**What if the dashboard breaks?**
The orchestrator's behavior is "graceful degrade." If the file doesn't exist (pre-v3.1 install) or fails to render, the orchestrator silently skips dashboard updates and prints the TL;DR in chat as normal. The pipeline never breaks because the dashboard had an issue.

**Does the dashboard work on mobile?**
Yes, but it's optimized for desktop. The NOW card is the most useful piece on any screen size.

**Can I customize the dashboard?**
You can edit the HTML directly. But it gets overwritten every Stop Gate. For lasting customization, edit the dashboard template in `templates/dashboard.html` (which feeds the orchestrator's regenerate function).

**What's the "decision data" panel?**
v3.3 addition. Where actual decision-critical content lives — scoring tables, research insights, the strategic bet, beachhead + named accounts, measurement plan layers. Before v3.3 this content was only in the MD handoff files; now it surfaces inline so you can decide without opening the MD.

## Related

- [Stop Gate](stop-gate.html) — what the dashboard renders
- [`/agent-harry-loop`](../commands/agent-harry-loop.html) — required for Queue Mode click-driven UX
- [Alignment Loop](alignment-loop.html) — the loop the dashboard visualizes
- [Audit Ledger](audit-ledger.html) — survives across sessions; dashboard overwrites every turn

---

_Current as of v4.0._
