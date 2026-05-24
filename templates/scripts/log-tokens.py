#!/usr/bin/env python3
"""
log-tokens.py — Append real `token_usage` events to .harry-audit.jsonl
from Claude Code session transcripts.

Reads a transcript (or auto-discovers all transcripts for the current
project's cwd), sums input/cache-read/cache-write/output tokens per
(model, isSidechain) group, computes USD cost via the PRICING table,
and appends one `token_usage` event per group to .harry-audit.jsonl.

Idempotent: each Claude Code session UUID (filename stem of the
transcript) is recorded in the event. Re-running on the same transcript
is skipped unless --force is passed.

Usage:
    log-tokens.py                        # auto-discover for cwd
    log-tokens.py --transcript PATH      # explicit transcript
    log-tokens.py --since 2026-05-22     # all transcripts after date
    log-tokens.py --dry-run              # show what would be appended
    log-tokens.py --force                # re-log already-logged sessions

Exit codes:
    0 = success (events appended or nothing to do)
    1 = bad arguments or unreadable transcript
    2 = .harry-audit.jsonl write failure
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from pathlib import Path
from typing import Iterable

# USD per 1M tokens. Approximate Anthropic public pricing as of 2026-05;
# verify before invoicing. Override per-model via env var if you want.
PRICING = {
    "claude-opus-4-7":    {"in": 15.0, "cache_read": 1.50, "cache_write": 18.75, "out": 75.0},
    "claude-opus-4-6":    {"in": 15.0, "cache_read": 1.50, "cache_write": 18.75, "out": 75.0},
    "claude-sonnet-4-6":  {"in": 3.0,  "cache_read": 0.30, "cache_write": 3.75,  "out": 15.0},
    "claude-sonnet-4-5":  {"in": 3.0,  "cache_read": 0.30, "cache_write": 3.75,  "out": 15.0},
    "claude-haiku-4-5":   {"in": 1.0,  "cache_read": 0.10, "cache_write": 1.25,  "out": 5.0},
}

# Unknown model → use Opus rates so cost is OVER-estimated, not silently undercounted.
UNKNOWN_MODEL_FALLBACK = PRICING["claude-opus-4-7"]


def cwd_to_claude_dir(cwd: Path) -> Path:
    """Convert /Users/foo/.bar/baz → ~/.claude/projects/-Users-foo--bar-baz.

    Claude Code encodes both `/` and `.` as `-` in its project dir names.
    So `/.claude` (slash + dotfile) becomes `--claude` (double dash).
    """
    encoded = str(cwd.resolve()).replace("/", "-").replace(".", "-")
    return Path.home() / ".claude" / "projects" / encoded


def find_transcripts(cwd: Path, since: dt.date | None = None) -> list[Path]:
    project_dir = cwd_to_claude_dir(cwd)
    if not project_dir.exists():
        return []
    transcripts = sorted(project_dir.glob("*.jsonl"))
    if since:
        cutoff = dt.datetime.combine(since, dt.time.min).timestamp()
        transcripts = [t for t in transcripts if t.stat().st_mtime >= cutoff]
    return transcripts


def parse_transcript(path: Path) -> dict:
    """Sum tokens per (model, isSidechain) for one transcript file."""
    groups: dict[tuple[str, bool], dict[str, int]] = {}
    cc_session_id = path.stem
    earliest_ts: str | None = None
    latest_ts: str | None = None

    with path.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("type") != "assistant":
                continue
            msg = rec.get("message") or {}
            usage = msg.get("usage") or {}
            if not usage:
                continue
            model = msg.get("model") or "unknown"
            sidechain = bool(rec.get("isSidechain", False))
            key = (model, sidechain)
            g = groups.setdefault(key, {
                "tokens_in": 0,
                "tokens_cache_read": 0,
                "tokens_cache_write": 0,
                "tokens_out": 0,
                "message_count": 0,
            })
            g["tokens_in"] += int(usage.get("input_tokens", 0) or 0)
            g["tokens_cache_read"] += int(usage.get("cache_read_input_tokens", 0) or 0)
            g["tokens_cache_write"] += int(usage.get("cache_creation_input_tokens", 0) or 0)
            g["tokens_out"] += int(usage.get("output_tokens", 0) or 0)
            g["message_count"] += 1

            ts = rec.get("timestamp")
            if ts:
                if earliest_ts is None or ts < earliest_ts:
                    earliest_ts = ts
                if latest_ts is None or ts > latest_ts:
                    latest_ts = ts

    return {
        "cc_session_id": cc_session_id,
        "earliest_ts": earliest_ts,
        "latest_ts": latest_ts,
        "groups": groups,
    }


def compute_cost(model: str, tokens: dict[str, int]) -> float:
    rates = PRICING.get(model, UNKNOWN_MODEL_FALLBACK)
    cost = (
        tokens["tokens_in"]          * rates["in"]
        + tokens["tokens_cache_read"]  * rates["cache_read"]
        + tokens["tokens_cache_write"] * rates["cache_write"]
        + tokens["tokens_out"]         * rates["out"]
    ) / 1_000_000.0
    return round(cost, 4)


def existing_cc_sessions(ledger: Path) -> set[str]:
    """Return set of cc_session_ids already logged (for idempotency)."""
    if not ledger.exists():
        return set()
    out: set[str] = set()
    with ledger.open() as f:
        for line in f:
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("event") == "token_usage" and "cc_session_id" in rec:
                out.add(rec["cc_session_id"])
    return out


def build_events(parsed: dict, project_slug: str) -> list[dict]:
    events = []
    ts = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    for (model, sidechain), tokens in parsed["groups"].items():
        if tokens["message_count"] == 0:
            continue
        cost = compute_cost(model, tokens)
        events.append({
            "ts": ts,
            "session_id": None,
            "project_slug": project_slug,
            "feature_slug": None,
            "agent": "subagent-aggregate" if sidechain else "main-thread",
            "mode": None,
            "phase": "meta",
            "event": "token_usage",
            "decision": None,
            "tokens_in": tokens["tokens_in"],
            "tokens_cache_read": tokens["tokens_cache_read"],
            "tokens_cache_write": tokens["tokens_cache_write"],
            "tokens_out": tokens["tokens_out"],
            "model": model,
            "cost_usd": cost,
            "linked_to_ts": None,
            "source": "transcript",
            "cc_session_id": parsed["cc_session_id"],
            "cc_message_count": tokens["message_count"],
            "cc_window_start": parsed["earliest_ts"],
            "cc_window_end": parsed["latest_ts"],
        })
    return events


def append_events(ledger: Path, events: Iterable[dict]) -> None:
    ledger.parent.mkdir(parents=True, exist_ok=True)
    with ledger.open("a") as f:
        for ev in events:
            f.write(json.dumps(ev, separators=(",", ":")) + "\n")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--transcript", type=Path, help="Explicit transcript .jsonl path")
    p.add_argument("--cwd", type=Path, default=Path.cwd(), help="Project root (defaults to cwd)")
    p.add_argument("--since", type=lambda s: dt.date.fromisoformat(s), help="Only transcripts modified since YYYY-MM-DD")
    p.add_argument("--dry-run", action="store_true", help="Print events, do not append")
    p.add_argument("--force", action="store_true", help="Re-log even if cc_session_id already present")
    p.add_argument("--project-slug", type=str, help="Override project slug (defaults to cwd basename)")
    args = p.parse_args()

    cwd = args.cwd.resolve()
    project_slug = args.project_slug or cwd.name
    ledger = cwd / ".harry-audit.jsonl"

    if args.transcript:
        transcripts = [args.transcript]
    else:
        transcripts = find_transcripts(cwd, since=args.since)

    if not transcripts:
        print(f"[log-tokens] no transcripts found for {cwd}", file=sys.stderr)
        return 0

    already = existing_cc_sessions(ledger) if not args.force else set()

    total_events = 0
    total_cost = 0.0
    for t in transcripts:
        if t.stem in already:
            print(f"[log-tokens] skip {t.name} (already logged; --force to override)")
            continue
        parsed = parse_transcript(t)
        if not parsed["groups"]:
            print(f"[log-tokens] skip {t.name} (no usage blocks found)")
            continue
        events = build_events(parsed, project_slug)
        sub_cost = sum(e["cost_usd"] for e in events)
        total_cost += sub_cost
        total_events += len(events)
        print(f"[log-tokens] {t.name}: {len(events)} event(s), ${sub_cost:.4f}")
        for e in events:
            kind = "sidechain" if e["agent"] == "subagent-aggregate" else "main"
            print(f"    {kind:9s} {e['model']:22s} "
                  f"in={e['tokens_in']:>7d} cache_r={e['tokens_cache_read']:>8d} "
                  f"cache_w={e['tokens_cache_write']:>7d} out={e['tokens_out']:>6d}  "
                  f"= ${e['cost_usd']:.4f}")
        if not args.dry_run:
            try:
                append_events(ledger, events)
            except OSError as ex:
                print(f"[log-tokens] FAILED to write {ledger}: {ex}", file=sys.stderr)
                return 2

    suffix = " (dry-run, not written)" if args.dry_run else f" -> {ledger}"
    print(f"[log-tokens] TOTAL: {total_events} event(s), ${total_cost:.4f}{suffix}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
