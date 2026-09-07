from __future__ import annotations

import argparse
import json
from dataclasses import asdict
from pathlib import Path
from typing import Any, Callable

from .adapters import import_ciso_assistant_frameworks
from .economics import calculate_economics
from .qualification import artifact_from_dict, qualify_evidence
from .scorecard import build_scorecard


def _load(path: str) -> dict[str, Any]:
    with Path(path).open(encoding="utf-8") as handle:
        return json.load(handle)


def _write(result: Any, output: str | None) -> None:
    payload = json.dumps(result, indent=2, sort_keys=True, default=str) + "\n"
    if output:
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        Path(output).write_text(payload, encoding="utf-8")
    else:
        print(payload, end="")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="grcbench")
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("score", "economics", "import-frameworks"):
        command = sub.add_parser(name)
        command.add_argument("input")
        command.add_argument("--output")
    qualify = sub.add_parser("qualify")
    qualify.add_argument("input")
    qualify.add_argument("--as-of", required=True)
    qualify.add_argument("--output")
    serve_parser = sub.add_parser("serve")
    serve_parser.add_argument("--host", default="127.0.0.1")
    serve_parser.add_argument("--port", type=int, default=8787)
    args = parser.parse_args(argv)

    if args.command == "serve":
        from .server import serve

        serve(args.host, args.port)
        return 0

    handlers: dict[str, Callable[[dict[str, Any]], Any]] = {
        "score": build_scorecard, "economics": calculate_economics, "import-frameworks": import_ciso_assistant_frameworks,
    }
    if args.command == "qualify":
        result = asdict(qualify_evidence(artifact_from_dict(_load(args.input)), args.as_of))
    else:
        result = handlers[args.command](_load(args.input))
    _write(result, args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
