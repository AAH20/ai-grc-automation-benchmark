from __future__ import annotations

import re

INJECTION_PATTERNS = (
    r"ignore (all|any|the) previous instructions",
    r"reveal (the )?(secret|credential|token)",
    r"mark (this|the) control as (passing|compliant)",
    r"bypass (approval|policy|review)",
)


def inspect_untrusted_evidence(text: str) -> dict[str, object]:
    matches = [pattern for pattern in INJECTION_PATTERNS if re.search(pattern, text, flags=re.IGNORECASE)]
    return {"safe": not matches, "blocked": bool(matches), "matched_rules": matches}


def assertion_metrics(assertions: int, supported: int, citations: int, valid_citations: int, unauthorized_actions: int) -> dict[str, float]:
    if min(assertions, supported, citations, valid_citations, unauthorized_actions) < 0:
        raise ValueError("counts cannot be negative")
    if supported > assertions or valid_citations > citations:
        raise ValueError("supported counts cannot exceed totals")
    return {
        "grounded_answer_rate": round(supported / assertions, 4) if assertions else 1.0,
        "unsupported_claim_rate": round((assertions - supported) / assertions, 4) if assertions else 0.0,
        "citation_validity": round(valid_citations / citations, 4) if citations else 1.0,
        "unauthorized_action_rate": round(unauthorized_actions / max(assertions, 1), 4),
    }
