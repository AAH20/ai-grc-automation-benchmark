from __future__ import annotations

from typing import Any


NONNEGATIVE = (
    "collector_cost", "storage_cost", "orchestration_cost", "model_cost", "human_review_cost", "rework_cost",
    "implementation_cost", "manual_labor_avoided", "audit_rework_avoided", "expected_loss_reduction",
    "contract_value_unblocked", "modeled_influence", "finance_approved_attributable_margin", "accepted_evidence_items",
    "contribution_margin_per_transaction",
)


def calculate_economics(data: dict[str, Any]) -> dict[str, float | None]:
    values = {key: float(data.get(key, 0)) for key in NONNEGATIVE}
    if any(value < 0 for value in values.values()):
        raise ValueError("economic inputs cannot be negative")
    if values["finance_approved_attributable_margin"] > values["contract_value_unblocked"]:
        raise ValueError("Finance-approved attributable margin cannot exceed confirmed contract value unblocked")

    operating_cost = sum(values[key] for key in ("collector_cost", "storage_cost", "orchestration_cost", "model_cost", "human_review_cost", "rework_cost"))
    total_cost = operating_cost + values["implementation_cost"]
    verified_benefit = values["manual_labor_avoided"] + values["audit_rework_avoided"] + values["expected_loss_reduction"] + values["finance_approved_attributable_margin"]
    net_value = verified_benefit - total_cost
    accepted = values["accepted_evidence_items"]
    contribution = values["contribution_margin_per_transaction"]
    return {
        "operating_cost": round(operating_cost, 2), "total_cost": round(total_cost, 2),
        "cost_per_qualified_evidence": round(operating_cost / accepted, 2) if accepted else None,
        "contract_value_unblocked": round(values["contract_value_unblocked"], 2),
        "modeled_influence": round(values["modeled_influence"], 2),
        "finance_approved_attributable_margin": round(values["finance_approved_attributable_margin"], 2),
        "verified_benefit": round(verified_benefit, 2), "net_verified_value": round(net_value, 2),
        "roi": round(net_value / total_cost, 4) if total_cost else None,
        "break_even_transactions": round(values["implementation_cost"] / contribution, 2) if contribution else None,
        "revenue_enablement_efficiency": round(values["finance_approved_attributable_margin"] / total_cost, 4) if total_cost else None,
    }
