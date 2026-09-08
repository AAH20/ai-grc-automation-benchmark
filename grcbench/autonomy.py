from __future__ import annotations

from typing import Any

from .canonical import sha256


RATE_FIELDS = ("critical_path_probability", "completion_probability", "contribution_margin_rate")
HARD_GATES = ("critical_safety_escapes", "provenance_completeness", "finance_attribution_exceptions")


def evaluate_control_to_cash(data: dict[str, Any]) -> dict[str, Any]:
    """Calculate attributable velocity and capacity without treating pipeline as booked revenue."""
    contract_value = float(data["contract_value_in_scope"])
    days = float(data["days_accelerated"])
    volume = float(data["monthly_outcome_volume"])
    minutes_saved = float(data["minutes_saved_per_outcome"])
    labor_rate = float(data["loaded_labor_rate"])
    monthly_run_cost = float(data["monthly_run_cost"])
    implementation_cost = float(data["implementation_cost"])
    values = (contract_value, days, volume, minutes_saved, labor_rate, monthly_run_cost, implementation_cost)
    if any(value < 0 for value in values):
        raise ValueError("economic inputs cannot be negative")

    rates = {name: float(data[name]) for name in RATE_FIELDS}
    if any(not 0 <= value <= 1 for value in rates.values()):
        raise ValueError("probabilities and margin rate must be between 0 and 1")

    acceleration = contract_value * rates["critical_path_probability"] * rates["completion_probability"] * (days / 365) * rates["contribution_margin_rate"]
    annual_capacity = volume * 12 * (minutes_saved / 60) * labor_rate
    annual_run_cost = monthly_run_cost * 12
    annual_contribution = acceleration + annual_capacity - annual_run_cost
    payback_days = implementation_cost / (annual_contribution / 365) if annual_contribution > 0 else None
    result: dict[str, Any] = {
        "confirmed_contract_value_unblocked": float(data.get("confirmed_contract_value_unblocked", 0)),
        "modeled_acceleration_value": round(acceleration, 2),
        "annual_capacity_value": round(annual_capacity, 2),
        "annual_run_cost": round(annual_run_cost, 2),
        "annual_contribution": round(annual_contribution, 2),
        "payback_days": round(payback_days, 1) if payback_days is not None else None,
        "finance_approved_attributable_margin": float(data.get("finance_approved_attributable_margin", 0)),
        "assumptions": {name: rates[name] for name in RATE_FIELDS} | {"days_accelerated": days},
    }
    if result["finance_approved_attributable_margin"] > result["confirmed_contract_value_unblocked"]:
        raise ValueError("Finance-approved attribution cannot exceed confirmed contract value unblocked")
    result["receipt_sha256"] = sha256(result)
    return result


def evaluate_promotion(data: dict[str, Any]) -> dict[str, Any]:
    """Compare a challenger with a champion while enforcing non-averagable gates."""
    champion = {key: float(value) for key, value in data["champion"].items()}
    challenger = {key: float(value) for key, value in data["challenger"].items()}
    weights = {key: float(value) for key, value in data["weights"].items()}
    if set(champion) != set(challenger) or set(champion) != set(weights):
        raise ValueError("champion, challenger and weights must contain identical dimensions")
    if abs(sum(weights.values()) - 1) > 1e-9:
        raise ValueError("promotion weights must sum to 1")
    if any(not 0 <= score <= 100 for score in (*champion.values(), *challenger.values())):
        raise ValueError("dimension scores must be between 0 and 100")

    hard = data["hard_gates"]
    missing = set(HARD_GATES) - set(hard)
    if missing:
        raise ValueError(f"missing hard gates: {', '.join(sorted(missing))}")
    hard_pass = (
        int(hard["critical_safety_escapes"]) == 0
        and float(hard["provenance_completeness"]) == 1
        and int(hard["finance_attribution_exceptions"]) == 0
    )
    champion_score = sum(champion[key] * weights[key] for key in weights)
    challenger_score = sum(challenger[key] * weights[key] for key in weights)
    min_improvement = float(data.get("minimum_improvement", 0))
    promoted = hard_pass and challenger_score - champion_score >= min_improvement
    result = {
        "champion_score": round(champion_score, 2),
        "challenger_score": round(challenger_score, 2),
        "improvement": round(challenger_score - champion_score, 2),
        "hard_gates_passed": hard_pass,
        "decision": "PROMOTE" if promoted else "HOLD",
        "rollback_required": not hard_pass,
    }
    result["receipt_sha256"] = sha256(result)
    return result
