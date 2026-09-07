from __future__ import annotations

from collections import defaultdict
from typing import Iterable

from .models import MappingAssertion

VALID_RELATIONSHIPS = {"equal", "subset", "superset", "intersect", "not_related"}


def validate_mapping(mapping: MappingAssertion) -> None:
    if mapping.relationship not in VALID_RELATIONSHIPS:
        raise ValueError(f"unsupported mapping relationship: {mapping.relationship}")
    if not 0 <= mapping.strength <= 1:
        raise ValueError("mapping strength must be between 0 and 1")
    if not mapping.rationale.strip() or not mapping.provenance.strip():
        raise ValueError("mapping rationale and provenance are required")


def mapping_metrics(proposals: Iterable[MappingAssertion], expected_pairs: set[tuple[str, str]]) -> dict[str, float | int]:
    items = list(proposals)
    for item in items:
        validate_mapping(item)
    proposed_pairs = {(item.source, item.target) for item in items if item.relationship != "not_related"}
    correct = proposed_pairs & expected_pairs
    precision = len(correct) / len(proposed_pairs) if proposed_pairs else 0.0
    recall = len(correct) / len(expected_pairs) if expected_pairs else 1.0
    return {"proposed": len(proposed_pairs), "expected": len(expected_pairs), "correct": len(correct), "precision": round(precision, 4), "recall": round(recall, 4)}


def find_conflicts(mappings: Iterable[MappingAssertion]) -> list[dict[str, object]]:
    grouped: dict[tuple[str, str], list[MappingAssertion]] = defaultdict(list)
    for item in mappings:
        validate_mapping(item)
        grouped[(item.source, item.target)].append(item)
    conflicts = []
    for pair, items in grouped.items():
        relationships = sorted({item.relationship for item in items})
        if len(relationships) > 1:
            conflicts.append({"source": pair[0], "target": pair[1], "relationships": relationships})
    return conflicts
