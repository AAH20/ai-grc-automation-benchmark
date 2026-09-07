# Zapier integration blueprint

Run the local GRCBench API with `grcbench serve`, then create a Zap with:

1. An authorized evidence-producing trigger.
2. A Formatter or Code step that creates the evidence envelope defined in `schemas/evidence.schema.json`.
3. A Webhooks POST action to `/v1/evidence/qualify`.
4. A Filter that continues only when `qualified` is `true`.
5. A human review or ticket step for failed gates.

Use an idempotency key derived from the source event ID and artifact digest. Treat held, throttled, replayed, and duplicate Zap runs as benchmark inputs rather than silently deleting them. Zapier task completion does not count as auditor acceptance.
