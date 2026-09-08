# Unit economics

## Required boundaries

Financial outputs have three separate ledgers:

- **Confirmed contract value unblocked:** value of a real opportunity whose documented blocker was resolved.
- **Modeled influence:** probability-weighted value associated with GRC participation. It is directional and excluded from ROI.
- **Finance-approved attributable margin:** the portion approved by Finance for contribution or ROI reporting.

The benchmark rejects Finance-approved attribution greater than confirmed contract value. It never converts pipeline into recognized revenue.

## Cost model

```text
Operating cost
= collectors + storage + orchestration + model inference
  + human review + automation rework

Total cost
= operating cost + implementation cost

Cost per qualified evidence
= operating cost / auditor-accepted evidence items
```

Costs use the same measurement window as benefits. Loaded labor rates include salary or contract cost, benefits, management overhead, and realistic productive hours.

## Verified benefit

```text
Verified benefit
= manual labor avoided
  + audit rework avoided
  + expected-loss reduction
  + Finance-approved attributable margin

Net verified value = verified benefit - total cost
ROI = net verified value / total cost
```

Avoided labor must be based on measured before/after cycle time and actual volume. Expected-loss reduction must identify probability, consequence, control effect, and uncertainty. Double counting the same benefit in labor, risk, and revenue is prohibited.

## Decision metrics

- Cost per accepted evidence item
- Cost per maintained control-day
- Human review minutes per accepted artifact
- Automation rework cost
- Break-even transaction volume
- Verified net value
- Finance-approved revenue-enablement efficiency
- False-acceptance exposure
- Sensitivity to model price, reviewer rate, volume, and failure rate

Every published calculation retains its assumptions and reports a range when inputs are uncertain.

## Control-to-cash velocity

Contract value is context, not automatically an automation benefit. The acceleration model discounts the value for causality, success probability, time and actual contribution margin:

```text
Modeled acceleration value
= contract value in scope
  × probability GRC is on the critical path
  × probability of successful completion
  × days accelerated / 365
  × contribution margin rate
```

The runner separately reports confirmed contract value unblocked, modeled acceleration value, and Finance-approved attributable margin. Only the final category can enter verified ROI. Finance-approved attribution cannot exceed the confirmed value.

## Capacity economics

```text
Annual capacity value
= monthly accepted outcomes × 12
  × minutes saved per outcome / 60
  × fully loaded labor rate

Annual contribution
= modeled acceleration value + annual capacity value
  - annual recurring run cost
```

Capacity is not a headcount-reduction claim. Report how the returned capacity is actually redeployed, such as higher review volume, deeper assurance, faster customer responses, or avoided external spend.

## Evolution economics

Evaluate every challenger on the same workload and measurement window as the champion. Promotion requires a minimum weighted improvement plus zero critical safety escapes, complete decision-grade provenance, and zero Finance-attribution exceptions. Retain latency, model, storage, reviewer and rework costs for both versions so a quality gain with an unacceptable marginal cost remains visible.
