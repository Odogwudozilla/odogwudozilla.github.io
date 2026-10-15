# Dynamic implementation gates

Status: Proposed. Begin application work only after the owner accepts the
relevant technical decisions. Use coherent increments with testable outcomes.

## Gate 0 Design acceptance and feasibility

Respect accepted requirements in ADR 001/005/009/011/012/013/014. AI stays optional.
SSG public pages and the dynamic private editor are chosen. Resolve dedicated
Supabase capacity: authenticated new-project rechecking still blocks creation
in the selected organisation after paused-project deletion. Paused projects
do not count. Do not retire any active application from review alone.
Choose host/API runtime/session handling, verify regional processing and shared
quotas, then accept the concrete schema, media/CSP and recovery mechanisms.
Resolve supported package patches, peers, runtime and package-manager versions.

Exit: no unresolved choice changing stack, cost, identity, region or content
execution. If feasibility fails, revise the provider ADR before building.
Design review does not create cloud services, enable billing or alter DNS.

## Gate 1 Foundation and enforcement

Create a fresh public Angular CLI workspace under the independence contract;
retire the legacy Next scaffold through a reviewed migration, preserving static
build scripts and fallback. Isolate npm configuration before installing packages.
Add Angular TestBed/Vitest and the chosen API test tooling; implement checks
for public package origins, provenance, contract/import/token rules and their
violation fixtures; configure synthetic environments and real CI. Configure
remote merge protections only within the owner's authorised scope.

Exit: clean-checkout `npm ci`, independent lint/format/types, relevant tests
and production build pass. Policy violations fail as designed. CI needs no
production secrets and existing static checks still pass. Static deployment
is the rollback, not an unreviewed framework downgrade.

## Gate 2 Visual parity and public routes

Create semantic navy/teal tokens, reviewed primitives and shared site shell.
Port approved content through typed fixtures; implement the declared routes,
metadata and error states; preserve colour preference, native disclosures,
mobile navigation and bookmarked anchors.

Exit: reviewed appearance at 320, 390, 768, 1024 and 1280px in both palettes;
keyboard/focus and public reading/navigation without JavaScript; no dead
links/placeholders; no editor or database SDK in public client bundles.

## Gate 3 Database policies and owner access

Implement versioned migrations, constraints, grants, RLS and scoped RPCs.
Add owner sessions, MFA, logout/recovery and private media policies. Run
direct SQL/data-API tests before importing actual content.

Exit: anonymous/non-owner/aal1 users cannot read drafts or write content;
aal2 owner access works. Immutable history and concurrent-save protections
hold. Private responses are no-store; public bundles contain no secrets;
recovery restores MFA before granting content access.

## Gate 4 Editor and publication

Implement restricted editor/renderer, metadata and visible save/conflict
states. Add private previews, processed media, transactional publication,
publication status/retries, redirects, sitemap/RSS and portable export/import.
Add pinned release manifests, durable build jobs, ordering, deployed
snapshot consistency, protected historical deployments and verified-live state.
Do not substitute SSR or a browser-only public blog without an accepted change.

Exit: edits leave the live revision unchanged until explicit publishing;
stale writes conflict. Drafts/media stay private through direct URLs and
caches. Malformed documents and hostile URLs are rejected or render safely.
Measure the accepted rendering-specific propagation/withdrawal windows; include
outage/build/invalidation failures and rollback of withdrawn content.

## Gate 5 Contact and recovery

Implement validated accessible contact form, atomic quotas and duplicate-safe
provider requests. Verify sender domain and test adapters; add privacy-safe
logging, quota monitoring, encrypted backups and operational recovery.

Exit: parallel requests cannot exceed quotas; repeated requests do not send
twice; changed payloads cannot reuse an ID. Failures are honest and retain a
mailto fallback. Preview builds cannot send real email. A clean test restore
recovers entries, history, assets and references; code rollback alone is insufficient.

Proposed recovery goals: export content/media after publication and maintain
daily backups while the CMS is in use; <=24h data loss and recovery within
one working day after owner response. These depend on a working backup
process and are not Free-plan guarantees. Store encrypted backups outside
the public repository, retain 7 daily/4 weekly copies, and test restoration
before cutover and after schema changes. Backup automation is part of this
milestone, not an assumed service feature.

## Gate 6 Release and authorised cutover

- Production-build public/owner/error journeys and direct policy tests pass.
- Both palettes/editor pass manual keyboard/contrast and WCAG 2.2 AA review.
- Public initial JS target <=250KiB gzip, measured across actual loaded chunks.
- Repeatable lab performance/layout budgets established; field LCP <=2.5s,
  INP <=200ms and CLS <=0.1 assessed at p75 when sufficient traffic exists.
- Deployed headers, secret checks, cache isolation, production-only indexing,
  canonical domain, redirects, sitemap and RSS verified.
- Database pause, email outage, restore and owner-lockout procedures rehearsed.
- Provider limits/regions, maintenance ownership and accepted contract recorded.
- No unresolved release exceptions or unapproved paid features.

Retain a versioned static fallback, previous deployment, content/media
exports and schema compatibility notes. Apply additive migrations first;
destructive cleanup needs a later reviewed migration and backup. Cut over
production/DNS only after a separate explicit owner instruction.

## Optional AI gate

Evaluate a free-eligible Cloudflare model with synthetic/public-safe samples.
Review terms, quality and quotas; add an owner-authorised adapter with text
selection review, bounded calls, timeout and kill switch. Suggestions alter
drafts only. Activation requires deliberate approval. Disabling AI or
exhausting its quota must leave editing, saving and publishing usable.

## Maintenance

Review dependency/security updates and quotas regularly; apply urgent
supported patches promptly. Verify backups/restores, provider terms and
public links. Plan framework upgrades before support expires. Estimate
effort after Gate 0 instead of repeating the old roadmap's nine-week promise.
