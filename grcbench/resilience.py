from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class WorkflowEvent:
    event_id: str
    sequence: int
    kind: str
    recoverable: bool = True


def evaluate_delivery(events: list[WorkflowEvent], expected_sequences: set[int]) -> dict[str, object]:
    seen_ids: set[str] = set()
    seen_sequences: set[int] = set()
    duplicates = 0
    detected_faults = 0
    recovered_faults = 0
    for event in events:
        if event.event_id in seen_ids:
            duplicates += 1
            continue
        seen_ids.add(event.event_id)
        seen_sequences.add(event.sequence)
        if event.kind in {"rate_limit", "expired_token", "timeout", "schema_drift"}:
            detected_faults += 1
            recovered_faults += int(event.recoverable)
    missing = sorted(expected_sequences - seen_sequences)
    return {
        "unique_events": len(seen_ids), "duplicates": duplicates, "missing_sequences": missing,
        "delivery_complete": not missing, "detected_faults": detected_faults, "recovered_faults": recovered_faults,
        "recovery_rate": round(recovered_faults / detected_faults, 4) if detected_faults else 1.0,
    }
