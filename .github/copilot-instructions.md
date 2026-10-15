# Portfolio repository guidance

Read and follow [AGENTS.md](../AGENTS.md) before making changes.
It is the canonical, tool-neutral instruction source for this repository.

Angular, company independence and public prerendering with a dynamic editor
are accepted; hosting/API and concrete design remain pending. The implementation
gate stays closed. Review
[design/README.md](../design/README.md), the decision register and contract.
Do not begin dynamic implementation or silently substitute frameworks,
providers, authentication, content formats, scope or visual choices.

Accepted decisions override historical examples in the 2025 planning docs.
Changes follow [design/governance.md](../design/governance.md). Never
self-approve an ADR, weaken a required check or claim planned safeguards
are active. Keep this bridge short rather than duplicating canonical rules.

Use available tools to inspect actual results; do not assume a particular
terminal API exists. Follow root instructions for validation, database
safety, Git authorisation and public-safe content. The previous instructions
remain recoverable in Git history at commit 21c2a69.
