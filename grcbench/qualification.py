from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Any

from .canonical import sha256
from .models import EvidenceArtifact, GateResult, GateStatus, QualificationResult


def _time(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


def _gate(name: str, passed: bool, score: float, reason: str) -> GateResult:
    return GateResult(name, GateStatus.PASS if passed else GateStatus.FAIL, score if passed else 0.0, reason)


def qualify_evidence(artifact: EvidenceArtifact, as_of: str, relevant_controls: set[str] | None = None) -> QualificationResult:
    as_of_dt = _time(as_of)
    payload_digest = hashlib.sha256(__import__("json").dumps(artifact.payload, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    expected = set(artifact.expected_scope)
    observed = set(artifact.observed_scope)
    controls = set(artifact.control_ids)
    relevant = relevant_controls if relevant_controls is not None else controls

    provenance_ok = bool(artifact.source and artifact.resource and artifact.collector)
    integrity_ok = artifact.content_sha256 in (None, payload_digest)
    freshness_ok = _time(artifact.valid_from) <= as_of_dt <= _time(artifact.valid_until)
    scope_ok = bool(expected) and expected.issubset(observed)
    relevance_ok = bool(controls & relevant)
    temporal_ok = _time(artifact.valid_from) <= _time(artifact.collected_at) <= _time(artifact.valid_until)

    gates = (
        _gate("provenance", provenance_ok, 1.0, "collector, source, and resource identified"),
        _gate("integrity", integrity_ok, 1.0, "payload digest matches the retained receipt"),
        _gate("freshness", freshness_ok, 1.0, "evidence is valid at the evaluation time"),
        _gate("scope", scope_ok, len(expected & observed) / len(expected) if expected else 0.0, "all expected resources are observed"),
        _gate("relevance", relevance_ok, 1.0, "artifact supports an evaluated control"),
        _gate("temporal_validity", temporal_ok, 1.0, "collection occurred within the evidence validity window"),
    )
    score = round(sum(g.score for g in gates) / len(gates) * 100, 2)
    qualified = all(g.status is GateStatus.PASS for g in gates)
    receipt = sha256({"artifact": artifact, "as_of": as_of, "gates": gates})
    return QualificationResult(artifact.artifact_id, qualified, score, gates, receipt)


def artifact_from_dict(data: dict[str, Any]) -> EvidenceArtifact:
    return EvidenceArtifact(
        artifact_id=data["artifact_id"], source=data["source"], resource=data["resource"],
        collected_at=data["collected_at"], valid_from=data["valid_from"], valid_until=data["valid_until"],
        payload=data["payload"], expected_scope=tuple(data["expected_scope"]), observed_scope=tuple(data["observed_scope"]),
        control_ids=tuple(data["control_ids"]), collector=data["collector"], content_sha256=data.get("content_sha256"),
    )
