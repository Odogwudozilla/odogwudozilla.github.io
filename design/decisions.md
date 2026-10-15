# Dynamic portfolio decision register

Updated 13 October 2026. Human acceptance applies only to the exact requirement
or choice answered in this conversation. It does not accept future technical
details automatically. Full design acceptance remains absent.

## Human decisions and proposal history

| ID | Current decision/status | Alternatives and consequences |
| --- | --- | --- |
| ADR 001 | Accepted scope: personal portfolio/blog/contact, one-owner browser editor | Community, commerce and additional editors are deferred |
| ADR 002 | Superseded proposal: Next.js 16/React 19 | Replaced by explicit Angular choice in ADR 012; legacy scaffold remains until authorised migration |
| ADR 003 | Supabase destination selected; free capacity still blocked after authenticated recheck; host/API proposed | Deleting paused projects does not free active quota; no service changes by assistant |
| ADR 004 | Proposed: candidate Supabase SDK plus SQL migrations, no Prisma | Provider decision unresolved; another backend requires deliberate revision |
| ADR 005 | Accepted access requirements: password/TOTP, no signup, one owner, EU CMS database/Storage | Session transport/runtime and recovery implementation still proposed |
| ADR 006 | Accepted no executable HTML/MDX; proposed restricted JSON, separate drafts and immutable publications | Concrete schema and SSG release/deployment records await acceptance |
| ADR 007 | Accepted existing navy/teal product behaviour; proposed semantic tokens, Tailwind and selected Angular controls | React primitive proposal superseded; exact controls/browser baseline open |
| ADR 008 | Proposed: protected contact HTTP API, atomic quotas, Resend idempotency | Replaces proposed Server Action; host/runtime and sending allocation open |
| ADR 009 | Accepted cache/security tradeoff in principle | Angular CSP, API session mechanism and SSG/SSR caching require concrete review |
| ADR 010 | Optional AI wish; proposed disabled initially and manual draft changes | Provider/model/activation require deliberate acceptance; AI is not a release blocker |
| ADR 011 | Accepted change-control process | Shared instructions, decisions, required checks and owner acceptance; enforcement implementation not yet active |
| ADR 012 | Accepted Angular and independence from company infrastructure | Public Angular 22 and strict CLI conventions recommended, exact packages not accepted yet |
| ADR 013 | Accepted: prerendered public pages and dynamic private editor | Publishing/withdrawal waits for deployment; five-minute healthy target, not an outage guarantee |
| ADR 014 | Accepted free-tier interruptions with backup/restore/static fallback | Exact recovery goals/retention and automation remain proposed |

## Acceptance evidence

Trusted source: the human's question replies in this conversation on
13 October 2026, with the following exact answers:

- Framework: “I want to go with angular” and “make the angular independent
  of the company one (so no company artifactory stuff leaks into my private project)”.
- Purpose: “Personal portfolio and blog only”.
- Capacity: “Not sure—verify before choosing hosting”.
- Access/region: “Accept this access model and region (Recommended)”.
- Availability: “Accept these availability limits (Recommended)”.
- Cached public/strict private policy: “Accept this documented tradeoff (Recommended)”.
- Governance: “Accept this process (Recommended)”.
- Capacity follow-up: “Review whether an unused project could free a slot (Recommended)”.
- Rendering: “Compare both in more detail before choosing”.
- Rendering follow-up: “Prerender public pages with a dynamic private editor (Recommended)”.
- Backend follow-up: the owner reports deleting one paused project in each of
  two organisations and instructs use of the existing personal organisation.
  Its private identifier is intentionally omitted from public documentation.
  Authenticated new-project eligibility was rechecked after deletion: the
  dashboard still blocks a third active Free project. No project was created.

The associated questions specified one owner, password plus authenticator
second factor, public registration disabled and an EU CMS database/Storage;
backups/restoration/static fallback for free-tier failures; reviewed cached
public policy with stricter admin/contact and no executable HTML/MDX; and
owner approval before changing stack/providers/schemas/security/scope/paid services.

These answers do not authorise pausing/deleting/upgrading projects, provisioning
services or implementing unaccepted technical mechanisms. The selected
Supabase destination does not establish available active-project quota.
Earlier product scope
and approved static palette behaviour are retained from this conversation.

## Remaining acceptance

On 14 October 2026 the owner requested dependency-alert fixes and a static
redesign with clearer personal identity, smaller heading/body differences,
less template-like copy and stronger hover contrast while retaining colours.
This authorises that static revision and removal of its unused scaffold
dependencies; it does not approve dynamic implementation or cloud changes.

- Concrete publication pipeline and operating limits under accepted SSG (ADR 013).
- Dedicated CMS capacity, backend/runtime/host and session mechanism (003–005).
- Exact packages, controls/browser support and schema/release model (004/006/007/012).
- Concrete contact/media/CSP, quotas, recovery and processing terms (008/009/014).

Map decisions to the checks in [governance.md](governance.md). Company
independence includes public-registry lockfile and built-artifact checks.
Recommendations stay proposed until explicit acceptance. Never infer acceptance
from an assistant-edited status. Superseding decisions retain history and state
migration, rollback, changed tests and a human reference tied to the revision.
