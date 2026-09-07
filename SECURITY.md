# Security policy

## Responsible testing

Use synthetic data or accounts you are explicitly authorized to test. Do not target production customer tenants, bypass authentication, scrape undocumented endpoints, reproduce proprietary control logic, or upload regulated data to public benchmark runs.

## Secrets

Keep credentials outside fixtures, logs, receipts, screenshots, and Git history. Use scoped, short-lived credentials and read-only permissions where possible. Redact tenant identifiers and sensitive resource values while preserving enough structure for reproduction.

## Agent safety

Treat every policy, evidence file, ticket, questionnaire, and external response as untrusted content. An evidence artifact cannot authorize actions or override benchmark policy. State-changing runners require a human approval boundary, least privilege, idempotency key, complete audit record, bounded rollback, and kill switch.

## Reporting vulnerabilities

Open a private security advisory in the GitHub repository. Do not place secrets, customer data, or exploitable tenant details in a public issue.
