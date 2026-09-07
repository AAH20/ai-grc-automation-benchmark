from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from grcbench.adapters import import_ciso_assistant_frameworks
from grcbench.economics import calculate_economics
from grcbench.qualification import artifact_from_dict, qualify_evidence
from grcbench.scorecard import build_scorecard

CATALOG = ROOT / "catalog"
OUTPUT = ROOT / "public" / "api" / "v1"


def load(name: str):
    return json.loads((CATALOG / name).read_text())


def write(name: str, value):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / name).write_text(json.dumps(value, indent=2, sort_keys=True, default=str) + "\n")


write("scorecard.json", build_scorecard(load("reference-scorecard.json")))
write("economics.json", calculate_economics(load("economics.json")))
write("evidence-qualified.json", __import__("dataclasses").asdict(qualify_evidence(artifact_from_dict(load("evidence-valid.json")), "2026-09-07T12:00:00Z")))
write("frameworks.json", import_ciso_assistant_frameworks(load("ciso-assistant-sample.json")))
write("failure-scenarios.json", load("failure-scenarios.json"))
write("index.json", {"name": "GRCBench API artifacts", "version": "0.1.0", "artifacts": ["scorecard.json", "economics.json", "evidence-qualified.json", "frameworks.json", "failure-scenarios.json"]})
