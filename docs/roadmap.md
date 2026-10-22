# Portfolio roadmap

Last reconciled: **22 October 2026**. Reviewed baseline: `5504bbf` (PR 62).

## Where we are

The public static portfolio is shipped and remains the production reference and fallback.
The owner requested a return to dynamic-site work on 20 October, then requested
this reconciled roadmap and story backlog on 22 October. Dynamic planning has
reopened; provider, runtime/session and concrete design acceptance still block
application implementation. No Angular installation, cloud provisioning or domain
cutover is authorised by this planning update.

Use the [story backlog](story-backlog.md) for individual work items and current
statuses. Its source of truth is [design/backlog.json](../design/backlog.json).
The [implementation gates](../design/implementation-plan.md) define technical
exit criteria; [accepted decisions](../design/decisions.md) govern authority.

## Delivery outlook

| Milestone | Intended outcome | Stories | Current position |
| --- | --- | --- | --- |
| Static baseline | Professional portfolio, case studies, Lab, CV, mobile journey and delivery checks | BASE-01–06 | Shipped; maintenance as needed, no further cosmetic queue |
| Decisions and feasibility | Agree a feasible backend, first-release boundary, runtime/session and content/release contracts | DEC-01–05 | Planning; backend choice awaits owner input |
| Foundation and public parity | Independent Angular workspace, active checks and the reviewed public experience | FND-01–02, PUB-01–02 | Planned; implementation gate closed |
| First useful editor workflow | Owner signs in, edits one project, saves a draft, previews and explicitly publishes a verified release | DATA-01, AUTH-01–02, EDIT-01–03, REL-01–02 | Proposed first milestone; not yet owner-accepted as a release boundary |
| First dynamic production release | Restore rehearsal, security/accessibility/performance evidence and authorised cutover | OPS-01, QA-01, CUT-01 | Planned; static production stays in place until authorised cutover |
| Later capabilities | Structured blog authoring/reading, managed media, protected contact form and operations | BLOG-01–02, MEDIA-01, CONTACT-01, OPS-02 | Planned sequencing; subject to release-boundary acceptance |
| Optional expansion | AI assistance and unaccepted features from the old wish list | OPT-01–02 | Deferred; separate scope acceptance needed |

### Next work

1. **DEC-01:** resolve backend direction. The authenticated check on 20 October
   found the selected Supabase organisation unable to create a free project
   because the account's two active free slots were occupied. The owner has not
   yet answered the choice between comparing free alternatives, identifying
   capacity to free, or assessing a paid option. This is dated evidence, not a
   fresh account check on 22 October. No existing project should be changed from
   this backlog alone.
2. **DEC-02 and DEC-04:** review the first-release boundary and prepare current
   version/installation-isolation evidence. This planning can proceed without
   choosing a provider or installing packages.
3. **DEC-03 and DEC-05:** complete and obtain acceptance for the affected concrete
   designs. Reconcile the contract and gate state using actual owner evidence
   before FND-01 begins.

Do not read all later stories as prerequisites for a small first editor release.
DEC-02 decides that boundary. Blog, new media management and contact submission
are proposed follow-on capabilities; core draft privacy, publication consistency,
access, recovery and release checks remain required for the first release.

## What changed from the old roadmap

- Angular supersedes Next.js; the incomplete Next scaffold remains dormant until
  its migration/removal is authorised. Start original Angular code using public
  packages and isolated configuration.
- The current static visual/content baseline replaces the old Bootstrap-era
  description. Existing case studies, project focus, discovery metadata, sharing
  images, CV and Engineering Lab are shipped work to preserve, not new features
  still waiting to be built.
- Public pages remain prerendered; the private editor is dynamic. Saving a draft
  is separate from publishing and deployment.
- The old nine-week estimate, uptime/traffic/ranking promises and blanket coverage
  targets are not commitments. Estimate implementation after feasibility and
  release scope are accepted; story counts do not measure delivery percentage.
- Newsletter, visitor accounts, comments, payments, chatbot, dark mode, analytics
  and live GitHub data are not part of the first delivery plan. AI remains optional.
- Historical material is preserved in the [2025 roadmap archive](../design/history/roadmap-2025.md).
  This reconciliation does not accept any unapproved provider, cost, security or
  schema decision.

## Get a periodic outlook

Run `npm run outlook` for counts, actionable planning and owner decisions.
Run `npm run outlook:check` to validate story records, evidence paths, dependency
cycles and the generated backlog. After updating the JSON, run
`npm run outlook:update`. No package installation is required.

Ask: **“Give me the current roadmap outlook: what shipped, what is next, what is
blocked, which decisions I owe, and what changed since the last review.”**

After each completed bundle, reconcile the backlog with merged work, add evidence,
and update its review date. Record unverified or stale evidence explicitly.
A generated report does not refresh that review date or establish provider access.
These commands are local tooling, not a required CI check. No recurring schedule
or notification automation has been created.
