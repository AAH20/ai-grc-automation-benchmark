# AI GRC Automation Benchmark — GRCBench

[![CI](https://github.com/AAH20/ai-grc-automation-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/AAH20/ai-grc-automation-benchmark/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Evidence](https://img.shields.io/badge/vendor_scores-execution_required-22d3ee.svg)](docs/METHODOLOGY.md)

An independent, reproducible benchmark for **AI GRC automation**, **compliance automation**, **agentic AI governance**, **automated evidence collection**, **cyber risk quantification**, **continuous control monitoring**, **n8n GRC workflows**, **Zapier compliance automation**, and **open-source GRC**.

GRCBench answers a harder question than “did the automation run?”:

> Did it produce complete, current, relevant, reproducible evidence—and is the outcome safe and economically defensible enough for an auditor, priority customer, Finance team, or board?

## What makes this different

GRCBench is an evaluation layer, not another checklist product. It runs identical failure cases against deterministic code, LLM agents, workflow automations, open-source platforms, and authorized proprietary tenants. Raw measures, weights, inputs, evaluator versions, and receipts remain visible.

Named products never receive numeric scores from documentation or marketing claims. Only a reproduced `VERIFIED` run is ranking-eligible.

## Current release

- Executable Python benchmark and CLI
- Six-gate evidence qualification engine
- Typed OLIR-style mapping assertions and conflict detection
- Workflow duplication, missing-page, rate-limit, token-expiry, timeout, and schema-drift evaluation
- Prompt-injection and unsupported-claim safety checks
- Finance-gated unit economics
- Deterministic SHA-256 scorecard receipts
- 18 synthetic failure scenarios
- CISO Assistant-compatible framework import contract
- AWS, Kubernetes, and workflow reference adapters
- Interactive decision workspace

The included `GRCBench reference runner` is synthetic and exists to test the benchmark itself. It is not a product comparison result.

## The evidence decision path

```text
Authorized telemetry
      ↓
Collection receipt
      ↓
Provenance · Integrity · Freshness · Scope · Relevance · Time
      ↓
OSCAL / OLIR / framework mapping
      ↓
Risk and alternatives
      ↓
Human and Finance approval boundaries
      ↓
Board, audit, and priority-customer outputs
```

Successful transport does not imply qualified evidence. Failed qualification gates cannot be averaged away by unrelated passing checks.

## Failure laboratory

The credential-free catalog covers:

| ID | Failure | Required behavior |
|---|---|---|
| `SCOPE-001` | AWS account omitted from collection | Fail scope gate |
| `LOG-001` | Kubernetes audit log missing | Detect the gap |
| `TIME-001` | Evidence outside audit period | Fail temporal gate |
| `AUTH-001` | Connector credential expires | Recover or escalate |
| `RATE-001` | API throttling | Bounded retry |
| `PAGE-001` | Partial pagination | Detect incomplete population |
| `DUP-001` | Duplicate webhook | Idempotent write |
| `SCHEMA-001` | Upstream schema drift | Fail closed |
| `MAP-001` | Conflicting framework mapping | Escalate conflict |
| `MAP-002` | Partial mapping promoted to full | Block inherited evidence |
| `INJECT-001` | Evidence contains prompt injection | Block instruction |
| `CITE-001` | Citation does not support answer | Reject claim |
| `ACTION-001` | Agent attempts unapproved write | Deny action |
| `REPLAY-001` | Same inputs produce different result | Fail replay gate |
| `REV-001` | Framework revision invalidates mapping | Mark mapping stale |
| `FIN-001` | ROI claims full contract value | Reject attribution |

The complete 18-case catalog is in [`catalog/failure-scenarios.json`](catalog/failure-scenarios.json).

## Scorecard

| Dimension | Weight | Primary measures |
|---|---:|---|
| Evidence reliability | 22% | acceptance, freshness, scope recall, stale escape |
| Mapping correctness | 14% | precision, recall, contradiction detection |
| Automation resilience | 14% | delivery, idempotency, recovery, replay |
| Agent safety | 16% | groundedness, authorization, injection resistance |
| Auditability | 12% | provenance, immutable receipt, actor/action completeness |
| Business velocity | 10% | qualified-evidence and questionnaire turnaround |
| Unit economics | 12% | cost per accepted outcome, verified net value |

The overall score is published only when `evidence_level` is `VERIFIED`. Buyers can replace the weights and recompute a result for their own risk appetite.

## Evidence levels

| Level | Meaning | Numeric ranking |
|---|---|---:|
| `VERIFIED` | Reproduced with retained, redacted artifacts | Yes |
| `OBSERVED` | Witnessed in an authorized environment | No |
| `DOCUMENTED` | Supported by a dated primary source | No |
| `UNVERIFIED` | Marketing or unavailable behavior | No |

## KPI release gates

| KPI | Target |
|---|---:|
| Evidence precision | ≥98% |
| Evidence-scope recall | ≥95% |
| Unsupported-claim rate | ≤0.5% |
| Provenance completeness | 100% |
| Stale-evidence escape rate | ≤1% |
| Deterministic replay agreement | ≥99% |
| Framework-mapping precision | ≥95% |
| Critical contradiction detection | 100% |
| Recoverable integration-failure success | ≥95% |
| Finance attribution exceptions | 0 |

Targets are release gates for a benchmark run, not promises about untested production environments.

## Finance-safe unit economics

```text
Cost per qualified evidence
= (collector + storage + orchestration + model + review + rework)
  / auditor-accepted evidence

Net verified value
= avoided labor + avoided audit rework + expected-loss reduction
  + Finance-approved attributable margin
  - total operating and implementation cost
```

GRCBench always separates:

1. confirmed contract value unblocked;
2. modeled or influenced pipeline; and
3. Finance-approved attributable margin eligible for ROI.

Neither contract value nor modeled influence enters ROI automatically. See [`docs/UNIT_ECONOMICS.md`](docs/UNIT_ECONOMICS.md).

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -e .
python -m unittest discover -s tests -v

grcbench qualify catalog/evidence-valid.json \
  --as-of 2026-09-07T12:00:00Z \
  --output outputs/evidence-qualified.json

grcbench score catalog/reference-scorecard.json \
  --output outputs/scorecard.json

grcbench economics catalog/economics.json \
  --output outputs/economics.json

# Optional local HTTP runner for n8n, Zapier, or custom clients
grcbench serve --host 127.0.0.1 --port 8787
```

Run the web decision surface:

```bash
npm install
npm run dev
```

## Integration surface

The runner contract is tool-neutral. Adapters normalize authorized records from:

- AWS Config, CloudTrail, Security Hub, IAM, and Organizations
- Kubernetes audit logs, admission policy, and workload configuration
- Elastic, OpenSearch, VictoriaLogs, and Wazuh-derived evidence
- n8n and Zapier execution records
- ticket, policy, audit-request, and questionnaire workflows
- OSCAL-aligned catalogs and assessment results
- CISO Assistant-compatible framework libraries

The sample framework file proves the import contract with four fixtures. The broader 150+ framework catalog remains owned and versioned by the upstream CISO Assistant project; GRCBench does not copy or misrepresent that catalog.

The repository also includes an importable [n8n evidence-qualification workflow](integrations/n8n/evidence-qualification-workflow.json), a [Zapier blueprint](integrations/zapier/README.md), and an [OpenAPI runner contract](contracts/runner-api.openapi.yaml).

## Hosted evaluation plane

The architecture is ready for an **A2Z SOC hosted evaluation plane** where an organization supplies authorized test credentials, receives an isolated benchmark execution, and downloads signed scorecards and board packs. This repository does not claim that the hosted enterprise service or any proprietary tenant integration is already operational.

## Responsible product comparisons

- Use only authorized accounts and documented interfaces.
- Never scrape customer tenants or bypass paywalls.
- Do not copy proprietary test logic or licensed framework text.
- Retain redacted artifacts sufficient for independent reproduction.
- Publish vendor corrections with primary evidence and benchmark version.
- Mark unavailable behavior as unavailable, not failed.

GRCBench is not affiliated with any compared vendor. Product names may be used only for factual identification and authorized comparative testing.

## Documentation

- [Methodology](docs/METHODOLOGY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Unit economics](docs/UNIT_ECONOMICS.md)
- [Platform evaluation boundaries](docs/PLATFORM_PROFILES.md)
- [Security and responsible testing](SECURITY.md)

## License

Apache-2.0. Framework texts, vendor documentation, trademarks, and product screenshots remain the property of their respective owners.
