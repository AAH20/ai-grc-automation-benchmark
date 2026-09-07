from __future__ import annotations

import json
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from .adapters import import_ciso_assistant_frameworks
from .economics import calculate_economics
from .qualification import artifact_from_dict, qualify_evidence
from .scorecard import build_scorecard


def dispatch(method: str, path: str, body: dict[str, Any] | None = None) -> tuple[int, dict[str, Any]]:
    if method == "GET" and path == "/health":
        return 200, {"status": "ok", "service": "grcbench", "version": "0.1.0"}
    if method != "POST":
        return 405, {"error": "method_not_allowed"}
    payload = body or {}
    try:
        if path == "/v1/evidence/qualify":
            relevant = set(payload.get("relevant_controls", [])) or None
            result = qualify_evidence(artifact_from_dict(payload["artifact"]), payload["as_of"], relevant)
            return 200, asdict(result)
        if path == "/v1/scorecards":
            return 200, build_scorecard(payload)
        if path == "/v1/economics":
            return 200, calculate_economics(payload)
        if path == "/v1/frameworks/import":
            return 200, import_ciso_assistant_frameworks(payload)
        return 404, {"error": "not_found"}
    except (KeyError, TypeError, ValueError) as exc:
        return 422, {"error": "invalid_input", "message": str(exc)}


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        status, payload = dispatch("GET", self.path)
        self._send(status, payload)

    def do_POST(self) -> None:  # noqa: N802
        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._send(400, {"error": "invalid_json"})
            return
        status, payload = dispatch("POST", self.path, body)
        self._send(status, payload)

    def log_message(self, format: str, *args: object) -> None:
        return


def serve(host: str = "127.0.0.1", port: int = 8787) -> None:
    ThreadingHTTPServer((host, port), Handler).serve_forever()
