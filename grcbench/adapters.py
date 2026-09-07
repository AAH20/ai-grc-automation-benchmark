from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from .models import EvidenceArtifact


def infrastructure_artifact(source: str, account: str, observed_resources: list[str], expected_resources: list[str], controls: list[str], payload: dict[str, Any], collected_at: datetime | None = None) -> EvidenceArtifact:
    now = collected_at or datetime.now(timezone.utc)
    collector_names = {"aws": "grcbench-aws-config@0.1.0", "kubernetes": "grcbench-k8s-audit@0.1.0", "workflow": "grcbench-workflow@0.1.0"}
    if source not in collector_names:
        raise ValueError("unsupported reference adapter")
    return EvidenceArtifact(
        artifact_id=f"{source}-{account}-{int(now.timestamp())}", source=source, resource=account,
        collected_at=now.isoformat(), valid_from=(now - timedelta(hours=1)).isoformat(), valid_until=(now + timedelta(hours=24)).isoformat(),
        payload=payload, expected_scope=tuple(expected_resources), observed_scope=tuple(observed_resources),
        control_ids=tuple(controls), collector=collector_names[source],
    )


def import_ciso_assistant_frameworks(document: dict[str, Any]) -> dict[str, Any]:
    frameworks = document.get("frameworks")
    if not isinstance(frameworks, list):
        raise ValueError("frameworks must be a list")
    normalized = []
    seen = set()
    for framework in frameworks:
        urn = framework.get("urn")
        if not urn or urn in seen:
            raise ValueError("framework URNs must be present and unique")
        seen.add(urn)
        normalized.append({"urn": urn, "name": framework["name"], "version": framework.get("version"), "requirements": int(framework.get("requirements", 0))})
    return {"source": "ciso-assistant-compatible", "framework_count": len(normalized), "frameworks": normalized}
