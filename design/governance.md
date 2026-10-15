# Design consistency and change control

Status: The owner accepted the change-control process on 13 October 2026.
Concrete enforcement remains proposed. Instructions and bridges are present;
dynamic CI and remote repository protections are not active yet.

## Authority and discovery

Explicit human instructions and accepted ADRs govern choices. The matching
accepted `design/contract.json` records machine-readable intent. Architecture
and security documents explain that contract; root `AGENTS.md` and thin
harness bridges make it discoverable. Historical plans do not override it.
Resolve conflicts explicitly rather than choosing the easier interpretation.

Proposed decisions are not permission to implement. Other harnesses must
load `AGENTS.md` explicitly if they do not discover it automatically. An
instruction file guides an assistant; independent CI/merge gates check its
output. Neither instructions nor an AI review alone can guarantee compliance.

## Deliberate changes

1. Propose an ADR identifying the problem and affected decision IDs.
2. Compare alternatives and record security, privacy, cost, compatibility,
   accessibility and operational consequences.
3. Describe migration, rollback and changed checks.
4. Obtain explicit owner acceptance of the concrete decision/revision.
5. Record the human reference and update the contract/docs before merging
   implementation that depends on the change.
6. Include decision IDs and verification evidence in the implementation review.

Prefer accepting the ADR in a separate change first. If decision and code
are presented together, neither implementation nor altered policy may merge
until the owner accepts the exact decision and reviewed revision. Assistants
cannot self-approve or impersonate a human approval.

Patch/minor updates within accepted lines require reviewed lockfiles and
checks. New majors, providers, auth models, content formats, visual themes
or recurring charges require an ADR. Exceptions name the rule, rationale,
scope, owner reference, expiry and removal work; broad suppressions do not
count as design changes.

## Planned required checks

| Check | Evidence | Detects |
| --- | --- | --- |
| `architecture-policy` | Dependency lines/allowlist, public registry lockfile origins, import graph, routes and tokens | Stack substitutions, company dependencies and boundary drift |
| `design-change-approval` | Protected files compared with trusted base; owner acceptance bound to revision | Self-approved policy changes |
| `content-contract` | Schemas, format version, visibility, approved links and publication projections | Invalid records and private-link/draft leaks |
| `db-policy` | Direct anonymous/non-owner/aal1/aal2 tests; grants and transaction conflicts | RLS bypass and lost updates |
| `quality` | Separate lint, formatting, types, meaningful tests and production build | Broken types/behaviour and nonexistent tooling |
| `public-and-admin-e2e` | Navigation, saved themes, MFA, editor, preview, publish, withdrawal and errors | Broken critical journeys |
| `accessibility-and-visual` | Both palettes, keyboard/focus, contrast and reviewed snapshots | Product and accessibility drift |
| `security-and-budget` | Secret/dependency checks, bundle inspection, deployed headers, quotas and assets | Secret exposure and security/cost regressions |

Import/token checks must understand syntax and transitive imports, including
barrel re-exports. Grep assists review but is not the sole enforcer. Allow
reviewed SVG/media literals and generated output through narrow exceptions;
do not reject non-colour layout utilities. Coverage is an indicator, not a
substitute for negative security tests and full publishing journeys.

## Trusted enforcement

Validate using policy/checker code from the trusted target branch, not its
PR replacements. An accepted policy change activates through a separate
protected path. Required checks must remain required when a PR edits or
deletes its own workflow. Test this property during foundation setup.

Run untrusted PR builds with read-only credentials, synthetic local data and
no production/email/AI secrets. A privileged metadata approval checker must
never install or execute PR code. Do not run PR code under a privileged
`pull_request_target` workflow. Pin reusable workflows/actions and restrict
permissions. If the available GitHub plan cannot enforce the intended trust
boundary, document it and use an independent checker or protected manual gate.

Configure PR-based changes and required checks on `master`, no routine direct
or force pushes, and narrowly controlled bypass. Verify available rules for
the repository's visibility/account plan. CODEOWNERS identifies reviewers;
it does not restrict merges without the corresponding rule.
[GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).

A sole maintainer cannot approve their own PR through the usual reviewer
mechanism. Use documented owner acceptance through a trusted channel tied to
the exact revision, plus required checks; do not create an impossible gate.
An `approved_by` string committed in the PR is not proof of acceptance.

Administrators with bypass and compromised owner credentials can override
controls. The design prevents accidental/undocumented merge drift and makes
deliberate changes auditable; it cannot restrain an unrestricted administrator.
Repair/test the unavailable GPG workflow before requiring signed commits.

## Tests of the enforcer itself

Demonstrate that these violations fail before accepting the foundation:

- An unapproved dependency/framework major or raw component colour.
- A private registry origin, company package, inherited credential or external
  company workspace link; verify a clean build without company access.
- A client import of a server secret, including through re-exports.
- Draft data in public search, sitemap, feed or metadata output.
- Publishing without owner/MFA or with a stale working-copy version.
- Changing policy/checker/workflow without human acceptance.
- Changing a revision after it was approved or skipping a required check.
- A preview credential accessing production resources.

Also demonstrate a properly accepted ADR change passes. An enforcer that
rejects everything is not an adequate change-control system.

## Review evidence

Each change states affected decisions, resulting behaviour, tests, visual
evidence, migration/rollback, provider/cost effects and approved exceptions.
The reviewer must be able to assess it without reconstructing chat history.
