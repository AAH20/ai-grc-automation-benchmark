from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any


class EvidenceLevel(str, Enum):
    VERIFIED = "VERIFIED"
    OBSERVED = "OBSERVED"
    DOCUMENTED = "DOCUMENTED"
    UNVERIFIED = "UNVERIFIED"


class GateStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    REVIEW = "REVIEW"


@dataclass(frozen=True)
class EvidenceArtifact:
    artifact_id: str
    source: str
    resource: str
    collected_at: str
    valid_from: str
    valid_until: str
    payload: dict[str, Any]
    expected_scope: tuple[str, ...]
    observed_scope: tuple[str, ...]
    control_ids: tuple[str, ...]
    collector: str
    content_sha256: str | None = None


@dataclass(frozen=True)
class GateResult:
    gate: str
    status: GateStatus
    score: float
    reason: str


@dataclass(frozen=True)
class QualificationResult:
    artifact_id: str
    qualified: bool
    score: float
    gates: tuple[GateResult, ...]
    receipt_sha256: str


@dataclass(frozen=True)
class MappingAssertion:
    source: str
    target: str
    relationship: str
    strength: float
    rationale: str
    provenance: str


@dataclass(frozen=True)
class ScenarioResult:
    scenario_id: str
    category: str
    passed: bool
    severity: str
    duration_ms: int
    cost_usd: float
    assertions: int = 0
    supported_assertions: int = 0
    expected_failures: int = 0
    detected_failures: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)


def to_dict(value: Any) -> dict[str, Any]:
    return asdict(value)
