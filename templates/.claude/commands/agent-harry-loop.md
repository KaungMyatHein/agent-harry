---
description: Start an Agent Harry pipeline in autonomous click-driven mode. Polls .harry-queue.json every ~60s for browser clicks, delegates to the orchestrator subagent when a click arrives. Requires dashboard-server.py running.
argument-hint: "<initial goal — what outcome you want>"
---

# /agent-harry-loop

You are entering **autonomous click-driven mode** (v3.2). This slash command turns the current Claude Code session into a polling loop that reads `<project-root>/.harry-queue.json` every ~60 seconds and processes browser clicks from the dashboard. It uses `ScheduleWakeup` to schedule each next tick — that's the mechanism that makes click-and-walk-away possible.

You (the main session) act as the **loop driver**. The `orchestrator` subagent does the actual product-design work.

## Prerequisite check (do this first, every time)

Before doing anything else:

1. Check that `dashboard-server.py` exists in the project root (`./dashboard-server.py`). If missing, tell the user: *"This project hasn't been refreshed to v3.2+. Run `refresh Agent Harry` first."* Stop.
2. Check that `./.harry-queue.json` exists. If missing, create it with the initial schema (see below).
3. Check that the user has the server running at `localhost:3737`. You can hint: *"Make sure `python3 dashboard-server.py` is running in another terminal. The dashboard tab should show a green 'connected' indicator."* You don't have to verify the server is actually up — the slash command operates on the queue file directly.

## Initial state file

If `.harry-queue.json` doesn't exist or is empty, write this:

```json
{
  "queued_action": null,
  "last_action_processed": null,
  "poll_count": 0,
  "max_polls": 20,
  "session_started": "<ISO timestamp now>"
}
```

## The loop protocol

### Cycle 0 — first invocation (this turn)

1. Print a 3-line greeting (concise — no fluff):
   ```
   Agent Harry · click-driven mode · polling every ~60s for <max_polls> idle cycles
   Goal: $ARGUMENTS
   Dashboard: http://localhost:3737 — click chips there, or type in chat anytime.
   ```
2. Reset `poll_count` to 0 and clear `queued_action` in the state file.
3. **Invoke the `orchestrator` subagent** via the Agent tool with the goal: `$ARGUMENTS`. The orchestrator will:
   - Diagnose (or skip if goal is concrete)
   - Propose the smallest-next-move via Executive Summary
   - Write `<project-root>/dashboard.html` per its Dashboard Rendering protocol
   - Fire the Stop Gate (which the user will see in the dashboard)
4. After the orchestrator returns, call `ScheduleWakeup` with `delaySeconds=60` and `prompt="<<autonomous-loop-dynamic>>"` (the dynamic-loop sentinel). The `reason` should be `"polling .harry-queue.json for browser click — cycle 1"`.
5. End the turn. The user will see your initial response in chat AND the dashboard will be ready for clicks.

### Cycle N — every subsequent wake (this is the loop body)

When ScheduleWakeup fires:

1. **Read `.harry-queue.json`**. Use the Read tool. Don't infer the contents — actually read the file.
2. **Branch on `queued_action`**:

   **Branch A — `queued_action` is `null`** (no click yet):
   - Increment `poll_count` in the state file (use Edit to update the JSON; preserve the rest).
   - If `poll_count >= max_polls` (default 20):
     - Print: *"Idle for ~20 minutes (no clicks, no chat input). Pausing the loop. Type anything in chat to resume."*
     - **Do not call ScheduleWakeup.** Loop is paused.
     - End turn.
   - Otherwise:
     - Print one short line: *"Cycle N — still waiting for a click."* (Keep this VERY short; this is idle polling — every word costs tokens.)
     - Call `ScheduleWakeup` again with `delaySeconds=60`, `prompt="<<autonomous-loop-dynamic>>"`, `reason="polling for browser click — cycle <N+1>"`.
     - End turn.

   **Branch B — `queued_action` is present**:
   - Read the command (`y` / `revise` / `pivot` / `grill_me` / `cancel`) and `delta`.
   - **Move queued_action → last_action_processed** in the state file, and set `queued_action: null`, `poll_count: 0`. Write the file.
   - Print one line: *"Click received: <command><delta if present>. Processing…"*
   - **Dispatch**:
     - `y` → Invoke the `orchestrator` subagent with: *"User approved your proposed next move (y). Proceed: run the proposed agent, fire the Stop Gate when done, regenerate dashboard.html."*
     - `revise` → Invoke the `orchestrator` subagent with: *"User revised the proposed move. Revision delta: `<delta>`. Re-invoke the same sub-agent (or re-propose) with this delta added to its Goal."*
     - `pivot` → Invoke the `orchestrator` subagent with: *"User pivoted. New direction: `<delta>`. Re-enter Diagnose phase with this direction; do NOT auto-run a different agent — propose a new smallest-next-move first."*
     - `grill_me` → Invoke the `grill-me` skill on the current proposed step's output, then re-fire the Stop Gate via the orchestrator.
     - `cancel` → Print: *"Pipeline halted. Handoff files in place. Loop ended."* **Do not call ScheduleWakeup.** End turn.
   - After the orchestrator (or grill-me) returns, the new Stop Gate is in place and dashboard.html has been overwritten. Call `ScheduleWakeup` again with `delaySeconds=60`, `prompt="<<autonomous-loop-dynamic>>"`, `reason="polling after processing <command>"`.
   - End turn.

3. **If the user types in chat instead of clicking** (their message arrives at this fired wake): Claude Code routes their message normally — process it as the user's input, ignore the queue this cycle, and continue the loop with another ScheduleWakeup at the end.

## Output discipline (very important)

Every loop cycle is a billable Claude turn. Be terse:

- **Idle polling cycle**: 1 line of output max ("Cycle 3 — still waiting"). Do not re-print the goal, do not summarize, do not pad.
- **Action-processing cycle**: 1 line confirming click received + 1 line of Stop Gate summary after the orchestrator returns. Long-form lives in the dashboard.
- **Never** re-render the Executive Summary in chat — the dashboard owns that. Chat is a timeline log.

The orchestrator subagent itself will produce its full Executive Summary in its output; the user sees that mostly in the dashboard.

## Stop conditions

The loop stops (does not call ScheduleWakeup) when:

- User clicks `cancel`
- Idle timeout (`poll_count >= max_polls`, default 20 → ~20 minutes)
- Orchestrator returns a `complete` status indicating pipeline is fully done
- User types `/end-loop` or `stop the loop` or similar
- An error in reading the queue file (after retrying once)

When the loop stops cleanly, write `last_action_processed` with command `"loop_ended"` so the dashboard can show "Loop ended" state.

## Anti-patterns (forbidden)

- Calling ScheduleWakeup with `delaySeconds < 60` — minimum is 60s; the runtime clamps but don't try
- Polling MORE than every 60s — you'd burn tokens for no UX gain (60s is fast enough for click latency)
- Invoking the orchestrator subagent on an idle cycle (no action) — that's wasteful; only invoke when there's a queued action
- Re-printing the Executive Summary in chat — dashboard owns the visual; chat is the log
- Ignoring a chat message because you're "waiting on the queue" — chat always wins; user input has priority

## Token-budget rule

- Idle cycle cost: ~1k tokens (file read + brief output + ScheduleWakeup). At Opus pricing ~$0.015/cycle.
- Action cycle cost: similar idle overhead + the orchestrator subagent run cost (which already has its own caps).
- 20 idle polls max = ~$0.30 worst case idle waste. Well within the $3 ceiling.
- If the orchestrator or grill-me skill pushes cumulative cost over $3, surface a warning in the next dashboard render and ask the user before continuing.

## Recovery

If something goes wrong (file corruption, server down, weird state):

- Truncate `.harry-queue.json` to the initial schema and continue.
- Tell the user explicitly what happened ("queue file was corrupt — reset to empty").
- Don't silently swallow errors; the user needs to know.
