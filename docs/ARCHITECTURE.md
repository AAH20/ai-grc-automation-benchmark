# Architecture

```text
AWS · Kubernetes · log backends · workflow tools · GRC APIs
                         │
                  authorized adapters
                         │
               canonical evidence envelope
                         │
        provenance / integrity / time / scope / relevance
                         │
       control graph · OLIR mapping · OSCAL-aligned export
                         │
        chaos runner · agent evaluator · replay verifier
                         │
 control-to-cash · scorecard · economics · board decision pack
                         │
        observed outcomes · overrides · cost · acceptance
                         │
      champion/challenger replay · canary · promote/rollback
```

## Components

- `grcbench.adapters`: reference normalization for infrastructure and framework data.
- `grcbench.qualification`: mandatory evidence gates and receipts.
- `grcbench.mapping`: relationship validation, precision/recall, and contradiction detection.
- `grcbench.resilience`: delivery completeness, deduplication, and fault recovery.
- `grcbench.safety`: evidence prompt-injection checks and assertion metrics.
- `grcbench.scorecard`: transparent weighted aggregation with ranking eligibility.
- `grcbench.economics`: verified value, unit cost, ROI, and break-even calculations.
- `grcbench.autonomy`: probability-adjusted contract acceleration and hard-gated champion/challenger promotion.
- `catalog`: synthetic inputs and expected failure behavior.
- `schemas`: portable JSON contracts.
- `public/api/v1`: generated reference results used by the decision surface.

## Trust boundaries

Collectors use least-privilege, read-only credentials where possible. Raw secrets never enter evidence envelopes. Untrusted evidence content is data and cannot issue instructions. Agent write actions require explicit authorization, idempotency keys, bounded scope, audit logging, and a rollback design.

## Framework portability

GRCBench stores stable external identifiers and typed directional mappings. It is integration-ready for the framework libraries published by CISO Assistant and for OSCAL-aligned catalogs, without copying licensed standard text. Framework revision and mapping version are part of every run.

## Hosted-plane separation

The open-source runner executes locally or in CI. A future A2Z SOC hosted plane can add tenant isolation, secrets management, scheduled runs, signed attestations, and private board outputs. Hosted capability must be demonstrated before it is described as operational.

## Operating-plane boundaries

The public benchmark uses synthetic scenarios and vendor-neutral adapters. Private organizations can connect authorized infrastructure, GRC, work-management, audit, customer and Finance records without placing their raw evidence in a public scorecard. Connectors are transport; qualification and consumer acceptance determine whether an outcome counts.

Agent actions are read-only by default. State-changing actions require a policy decision, bounded target, idempotency key, named approval class, event receipt and rollback or compensating action. A higher aggregate score can never override a failed authorization, provenance, critical-safety or financial-attribution gate.
