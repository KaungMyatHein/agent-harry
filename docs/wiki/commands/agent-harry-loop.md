---
title: /agent-harry-loop
parent: Commands
nav_order: 2
description: "Click-driven polling loop with the dashboard server (advanced)."
---

# /agent-harry-loop

> Starts a click-driven polling loop that lets you walk away from chat and drive Agent Harry from the dashboard's clickable buttons. Optional — advanced workflow.

## What it does

You give it a goal. It enters a polling loop using `ScheduleWakeup` to check `<project>/.harry-queue.json` every ~60 seconds for click intents from the dashboard. When a click arrives (you pressed `y` / `revise` / `pivot` / `cancel` in the browser), it dispatches to the orchestrator. While idle, the loop costs ~$0.015 per poll cycle, capped at 20 cycles (~20 minutes of idle).

## When to use it

- You're running a long pipeline and want to step away from your screen.
- You prefer clicking buttons over typing in chat.
- You're demoing to stakeholders who'd rather watch than type.

## When NOT to use it

- You're doing rapid revisions — chat is faster.
- You don't want the dashboard server running.
- This is your first session — get familiar with chat mode first.

## Setup (first time)

1. **Start the dashboard server** (Python stdlib, no deps):
   ```bash
   cd <project>
   python3 dashboard-server.py
   ```
2. **Open browser** to `http://localhost:3737`
3. **In Claude Code**:
   ```
   /agent-harry-loop design the checkout flow
   ```

## How to invoke

```
/agent-harry-loop <your goal>
```

## What you get

- The orchestrator's first proposal appears in chat AND in the dashboard.
- The dashboard's chip buttons are now real — clicking POSTs to the server.
- Chat input still works (priority over queue clicks).
- Loop runs until: cancel click, 20-poll idle timeout, orchestrator returns `complete`, you type `/end-loop`, or queue corruption.

## Stop conditions

- User clicks `cancel`
- Idle timeout (20 polls ≈ 20 minutes)
- Orchestrator returns `complete`
- You type `/end-loop` in chat
- Queue file corrupted (after one retry)

## Cost

Idle cycles: ~$0.015 each, capped at 20 (~$0.30 max idle cost). Active turns: same as chat-mode equivalent.

## Related

- [Dashboard](../concepts/dashboard.html) — visual surface this command activates
- [Stop Gate](../concepts/stop-gate.html) — the chip buttons map to Stop Gate responses

---

_Current as of v4.0._
