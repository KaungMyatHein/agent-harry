#!/usr/bin/env python3
"""
Agent Harry dashboard server (v3.2).

Tiny stdlib-only HTTP server that:
  - Serves dashboard.html from the project root at /  and  /dashboard
  - Accepts button clicks at POST /api/action
  - Exposes queue state at GET /api/queue
  - Resets queue state at POST /api/reset

State persists to <cwd>/.harry-queue.json. The /agent-harry-loop slash
command (a Claude Code session) polls this file to detect clicks.

Usage:
  cd <your-agent-harry-project>
  python3 dashboard-server.py
  # then open http://localhost:3737 in a browser

No external dependencies. Python 3.8+ (stdlib only).
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

PORT = int(os.environ.get("AGENT_HARRY_PORT", "3737"))
PROJECT_ROOT = Path(os.getcwd()).resolve()
DASHBOARD_PATH = PROJECT_ROOT / "dashboard.html"
QUEUE_PATH = PROJECT_ROOT / ".harry-queue.json"

VALID_COMMANDS = {"y", "revise", "pivot", "grill_me", "cancel"}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def init_queue() -> dict[str, Any]:
    return {
        "queued_action": None,
        "last_action_processed": None,
        "poll_count": 0,
        "max_polls": 20,
        "session_started": now_iso(),
    }


def read_queue() -> dict[str, Any]:
    if not QUEUE_PATH.exists():
        state = init_queue()
        write_queue(state)
        return state
    try:
        with QUEUE_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        # Corrupt or unreadable — reinitialize.
        state = init_queue()
        write_queue(state)
        return state


def write_queue(state: dict[str, Any]) -> None:
    QUEUE_PATH.write_text(
        json.dumps(state, indent=2, sort_keys=False),
        encoding="utf-8",
    )


class DashboardHandler(BaseHTTPRequestHandler):
    """All routes live in this single handler — no framework needed."""

    # Silence default logging; keep our own concise format.
    def log_message(self, format: str, *args: Any) -> None:  # noqa: A002
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

    # ---------- helpers ----------

    def _send_json(self, status: int, body: dict[str, Any]) -> None:
        payload = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def _send_html(self, status: int, html_bytes: bytes) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(html_bytes)))
        # Aggressively prevent caching so dashboard reloads pick up orchestrator rewrites.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.end_headers()
        self.wfile.write(html_bytes)

    def _send_text(self, status: int, text: str) -> None:
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    # ---------- routing ----------

    def do_GET(self) -> None:  # noqa: N802 (BaseHTTPRequestHandler convention)
        if self.path in ("/", "/dashboard", "/dashboard.html"):
            return self._serve_dashboard()
        if self.path == "/api/queue":
            return self._serve_queue()
        if self.path == "/api/health":
            return self._send_json(200, {"ok": True, "version": "v3.2", "project": str(PROJECT_ROOT)})
        self._send_text(404, f"Not found: {self.path}\n")

    def do_POST(self) -> None:  # noqa: N802
        if self.path == "/api/action":
            return self._handle_action()
        if self.path == "/api/reset":
            return self._handle_reset()
        self._send_text(404, f"Not found: {self.path}\n")

    # ---------- handlers ----------

    def _serve_dashboard(self) -> None:
        if not DASHBOARD_PATH.exists():
            self._send_text(
                404,
                "dashboard.html not found in project root.\n"
                "Run `refresh Agent Harry` or start the orchestrator to generate it.\n",
            )
            return
        try:
            html_bytes = DASHBOARD_PATH.read_bytes()
        except OSError as exc:
            self._send_text(500, f"Failed to read dashboard.html: {exc}\n")
            return
        self._send_html(200, html_bytes)

    def _serve_queue(self) -> None:
        self._send_json(200, read_queue())

    def _handle_action(self) -> None:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0 or length > 8192:
            self._send_json(400, {"ok": False, "error": "missing or oversized body"})
            return
        try:
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._send_json(400, {"ok": False, "error": "invalid JSON"})
            return

        command = (data.get("command") or "").strip()
        if command not in VALID_COMMANDS:
            self._send_json(
                400,
                {"ok": False, "error": f"command must be one of {sorted(VALID_COMMANDS)}"},
            )
            return

        delta_raw = data.get("delta")
        delta: str | None = None
        if delta_raw is not None:
            delta = str(delta_raw).strip()[:1000]  # cap delta length
            if not delta:
                delta = None

        if command in {"revise", "pivot"} and not delta:
            self._send_json(
                400,
                {"ok": False, "error": f"{command} requires a non-empty 'delta' field"},
            )
            return

        state = read_queue()
        state["queued_action"] = {
            "command": command,
            "delta": delta,
            "timestamp": now_iso(),
        }
        # Don't reset poll_count here — the loop owns that field.
        write_queue(state)

        self._send_json(
            200,
            {"ok": True, "queued": state["queued_action"]},
        )

    def _handle_reset(self) -> None:
        state = init_queue()
        write_queue(state)
        self._send_json(200, {"ok": True, "state": state})


def main() -> None:
    print(f"Agent Harry dashboard server")
    print(f"  Project root: {PROJECT_ROOT}")
    print(f"  Dashboard:    {DASHBOARD_PATH}  {'(exists)' if DASHBOARD_PATH.exists() else '(MISSING)'}")
    print(f"  Queue state:  {QUEUE_PATH}")
    print(f"  Port:         {PORT}")
    print()
    print(f"  Open http://localhost:{PORT}  to view dashboard")
    print(f"  Then start Claude Code in this directory and run:")
    print(f"    /agent-harry-loop <your goal>")
    print(f"  Press Ctrl+C to stop the server.")
    print()

    # Make sure queue file exists from the start so the slash command finds it.
    read_queue()

    server = ThreadingHTTPServer(("127.0.0.1", PORT), DashboardHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
