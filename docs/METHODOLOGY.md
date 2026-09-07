# GRCBench methodology

## Objective

GRCBench measures whether an automation can convert authorized system state into evidence and decisions that are correct, complete, reproducible, safe, and economically defensible.

The unit of evaluation is a versioned benchmark run, not a vendor subscription. A run identifies the runner, adapters, test catalog, evaluator version, configuration, time window, model and tool versions, redaction policy, and resulting receipt.

## Measurement principles

1. **Execution before ranking.** Documentation creates a capability profile but never a numeric vendor score.
2. **Fail closed.** Missing scope, provenance, authorization, or temporal validity cannot be offset by unrelated passing checks.
3. **Raw measures before composites.** Every composite retains its dimensions, weights, and raw counts.
4. **No universal winner.** Buyers may apply their own weights and constraints.
5. **Unavailable is not failed.** A capability inaccessible to the authorized test account is recorded separately.
6. **Reproducibility is a feature.** Identical canonical inputs must create the same receipt and equivalent deterministic outputs.
7. **Business claims require business owners.** Finance owns financial attribution; GRC does not manufacture revenue.

## Evidence qualification

An artifact is qualified only when every mandatory gate passes:

- Provenance: collector, source, resource, and collection identity are present.
- Integrity: payload digest matches the retained artifact receipt.
- Freshness: the evaluation time is inside the validity window.
- Scope: every expected resource or population is represented.
- Relevance: the evidence supports an evaluated control claim.
- Temporal validity: collection occurred inside the declared validity window.

Qualification results include the reason and score for each gate plus a deterministic SHA-256 receipt.

## Mapping evaluation

Mapping assertions use directional OLIR-style relationships: `equal`, `subset`, `superset`, `intersect`, and `not_related`. Each assertion requires rationale, provenance, and normalized strength.

Precision measures correct proposed pairs divided by all proposed pairs. Recall measures correct proposed pairs divided by all expected pairs. Conflicting relationship assertions for the same source and target are surfaced for review rather than silently resolved.

## Agent evaluation

Agent claims are decomposed into material assertions. The harness measures supported assertions, valid citations, unauthorized actions, injection resistance, approval enforcement, and rollback behavior. A fluent response receives no credit for an unsupported claim.

## Repeated runs

Deterministic components must reproduce exactly. Probabilistic agents are evaluated over repeated trials with fixed fixtures; report median, dispersion, worst-case critical failures, and confidence interval. Averages never conceal a critical authorization or tenant-isolation failure.

## Publication rule

A public result must contain the benchmark version, run ID, evidence level, complete dimensions, raw measurements or artifact references, limitations, and receipt. Vendor-provided results must be labeled as such until independently reproduced.
