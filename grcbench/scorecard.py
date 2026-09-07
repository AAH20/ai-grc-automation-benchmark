from __future__ import annotations

from typing import Any

from .canonical import sha256
from .models import EvidenceLevel

WEIGHTS = {"evidence_reliability": 0.22, "mapping_correctness": 0.14, "automation_resilience": 0.14, "agent_safety": 0.16, "auditability": 0.12, "business_velocity": 0.10, "unit_economics": 0.12}


def build_scorecard(data: dict[str, Any]) -> dict[str, Any]:
    level = EvidenceLevel(data["evidence_level"])
    dimensions = data.get("dimensions", {})
    missing = sorted(set(WEIGHTS) - set(dimensions))
    if missing:
        raise ValueError(f"missing score dimensions: {', '.join(missing)}")
    for name, score in dimensions.items():
        if name not in WEIGHTS:
            raise ValueError(f"unknown score dimension: {name}")
        if not 0 <= float(score) <= 100:
            raise ValueError(f"score out of range: {name}")

    eligible = level is EvidenceLevel.VERIFIED
    weighted = round(sum(float(dimensions[name]) * weight for name, weight in WEIGHTS.items()), 2) if eligible else None
    result = {"runner": data["runner"], "evidence_level": level.value, "ranking_eligible": eligible, "overall_score": weighted, "dimensions": dimensions, "weights": WEIGHTS, "run_id": data["run_id"]}
    result["receipt_sha256"] = sha256(result)
    return result
