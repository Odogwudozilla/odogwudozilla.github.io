# Story backlog

<!-- Generated from design/backlog.json by npm run outlook:update. Edit the JSON, not this file. -->

Last reconciled: **2026-10-22**. Baseline: `5504bbf`.

The static site is shipped. Dynamic planning has reopened at the owner’s request; application implementation remains gated. These stories describe intended work, not approval of proposed mechanisms.

First useful milestone: **Proposed: owner sign-in → edit one project → private preview → explicit publish → verify live**.

| State | Stories | Meaning |
| --- | ---: | --- |
| done | 7 | Delivered with recorded evidence; grouped baseline items are not equal-sized units. |
| ready | 2 | Planning work can begin; no application install or provisioning is authorised. |
| waiting_owner | 1 | A specific owner decision is needed. |
| blocked | 2 | Direct dependencies or decisions prevent starting. |
| planned | 20 | Sequenced future work; requires dependencies and the relevant gate to open. |
| deferred | 2 | Optional or unaccepted; excluded from committed delivery. |

Counts are inventory, not percentage complete or effort estimates. Baseline stories and optional umbrellas differ in size. No dynamic implementation story is done.

## Immediate outlook

- **DEC-01 — Choose a feasible backend direction** (waiting_owner). Resolve dedicated CMS capacity without disrupting separate projects.
- **DEC-02 — Confirm the first release boundary** (ready). Agree what the first dynamic milestone delivers.
- **DEC-03 — Accept hosting, API and session design** (blocked). Use one coherent runtime and owner-authentication boundary.
- **DEC-04 — Draft version and independence plan** (ready). Prepare a reproducible Angular foundation without company dependencies.
- **DEC-05 — Accept content and release contracts** (blocked). Make draft, publication and operating rules implementable.

Backend evidence last checked **2026-10-20**: Authenticated Supabase new-project page blocked at the two-active-free-project limit. Owner direction remains unanswered; no service was changed.

## Stories

### Shipped static baseline

#### BASE-01 — Verified static delivery

**done · P0** | Depends on: none

Keep a working public site and required merge checks.

- Static build and verification are repeatable.
- Required PR checks protect master; recovery rehearsal and limits are documented.

Evidence: [design/static-verification.md](../design/static-verification.md), [design/static-recovery.md](../design/static-recovery.md)

#### BASE-02 — Portfolio content and case studies

**done · P1** | Depends on: none

Present current professional work and personal projects clearly.

- Four project overviews link to full case studies.
- Product Watch leads; retired puzzle-project references are absent.

Evidence: [docs/partials/portfolio-section.html](../docs/partials/portfolio-section.html), [docs/partials/project-case-studies.html](../docs/partials/project-case-studies.html)

#### BASE-03 — Interactive Engineering Lab

**done · P1** | Depends on: none

Let visitors explore requests, API compatibility, access and search.

- Lab starts collapsed and opens manually.
- Demo help uses information icons, functional descriptions and keyboard/tap access.

Evidence: [docs/js/lab.js](../docs/js/lab.js), [docs/js/demo-help.js](../docs/js/demo-help.js), [docs/partials/access-section.html](../docs/partials/access-section.html)

#### BASE-04 — Readable mobile site and themes

**done · P1** | Depends on: none

Support useful reading and navigation on small screens.

- Navy and Teal, mobile navigation, focus and contrast received bounded checks.
- Mobile case-study, return, CV-download and contact journeys were reviewed; this is not full WCAG certification.

Evidence: [docs/css/responsive.css](../docs/css/responsive.css), [tests/navigation-focus.test.mjs](../tests/navigation-focus.test.mjs)

#### BASE-05 — Public CV

**done · P1** | Depends on: none

Provide a polished CV consistent with the portfolio.

- Two-page PDF layout was rendered and visually reviewed.
- Public download matches the reviewed PDF; wording release merged in PR 62.

Evidence: [docs/assets/cv/chidozie-nnachor-cv.pdf](../docs/assets/cv/chidozie-nnachor-cv.pdf), [https://github.com/Odogwudozilla/odogwudozilla.github.io/pull/62](https://github.com/Odogwudozilla/odogwudozilla.github.io/pull/62)

#### BASE-06 — Discovery and asset delivery

**done · P1** | Depends on: none

Provide canonical pages, sharing metadata and compact images.

- Canonical metadata, sitemap, icons and case sharing images are present.
- Responsive image variants and the static asset checks pass.

Evidence: [tests/static-site.test.mjs](../tests/static-site.test.mjs), [tests/responsive-images.test.mjs](../tests/responsive-images.test.mjs)

### Planning and decisions

#### PLAN-01 — Reconciled roadmap and story outlook

**done · P0** | Depends on: none

See current work without relying on the 2025 migration plan.

- Historical roadmap is preserved and current milestones replace its dates.
- Story IDs, acceptance criteria, dependencies and a repeatable outlook are available.

Evidence: [docs/roadmap.md](../docs/roadmap.md), [design/backlog.json](../design/backlog.json), [scripts/backlog-outlook.mjs](../scripts/backlog-outlook.mjs)

#### DEC-01 — Choose a feasible backend direction

**waiting_owner · P0** | Depends on: none

Resolve dedicated CMS capacity without disrupting separate projects.

- Owner chooses free-backend comparison, available Supabase capacity or paid-option assessment.
- Fresh account/provider evidence and any cost approval are recorded before provisioning.

#### DEC-02 — Confirm the first release boundary

**ready · P0** | Depends on: none

Agree what the first dynamic milestone delivers.

- Review the proposed project-only sign-in, draft, preview and publish workflow.
- Record which existing content remains repository-owned, and place blog, contact form and media management in explicit later milestones.

#### DEC-03 — Accept hosting, API and session design

**blocked · P0** | Depends on: DEC-01

Use one coherent runtime and owner-authentication boundary.

- Review host/runtime, EU processing, quotas, auth/session transport and private/public cache rules.
- Record owner acceptance of the concrete decision revision, rollback and tests; choosing Angular alone is insufficient.

#### DEC-04 — Draft version and independence plan

**ready · P0** | Depends on: none

Prepare a reproducible Angular foundation without company dependencies.

- Revalidate exact public Angular, Node, npm, TypeScript, RxJS and tooling versions together.
- Document clean task-local registry/auth/cache isolation and lifecycle-script review; this story does not authorise installation.

#### DEC-05 — Accept content and release contracts

**blocked · P0** | Depends on: DEC-02, DEC-03, DEC-04

Make draft, publication and operating rules implementable.

- Accept project schema, revision/concurrency model, allowed content, asset references and publication jobs.
- Accept CSP/media strategy, provider limits, backup/restore goals, browser baseline and dependency allowlist; retain the closed gate until acceptance is evidenced.

### Foundation and visual parity

#### FND-01 — Create the isolated Angular workspace

**planned · P0** | Depends on: DEC-05

Build an original Angular application alongside the working static product.

- Fresh public CLI workspace uses accepted exact versions and isolated npm configuration.
- Static build remains usable; preserve dormant Next files until their migration/removal is separately authorised.

#### FND-02 — Enforce build and architecture checks

**planned · P0** | Depends on: FND-01

Catch boundary and dependency violations before merge.

- Clean checkout install, lint, formatting, type checks, tests and production build pass.
- CI rejects forbidden registry/import/token/content-execution examples and requires no production secrets; planned checks are labelled until proven active.

#### PUB-01 — Port the approved public experience

**planned · P1** | Depends on: FND-02

Keep the current visual identity and useful content when Angular replaces the public renderer.

- Port the reviewed homepage, Lab, experience, case studies and CV links through typed fixtures.
- Preserve Navy/Teal preference, keyboard behaviour and reading without JavaScript; compare 320/390/768/1024/1280px layouts.

#### PUB-02 — Preserve public URLs and discovery

**planned · P1** | Depends on: PUB-01

Keep shared links and search identities valid.

- Prerender declared public routes; unknown or unpublished entries return genuine 404 responses.
- Preserve legacy HTML URLs/fragments and approved redirects; metadata and sitemap agree with rendered content.

### Owner access and private content

#### DATA-01 — Implement content storage and policies

**planned · P0** | Depends on: FND-02, DEC-05

Store drafts and immutable approved revisions safely.

- Versioned migrations enforce constraints and authorised operations with isolated test data.
- Direct database/data-API tests deny drafts and mutations to anonymous, non-owner and owner-before-MFA actors; immutable history cannot be edited.

#### AUTH-01 — Implement owner sign-in and MFA

**planned · P0** | Depends on: DATA-01

Allow only the owner to manage content.

- Password plus authenticator MFA, no public signup, logout and expiry work.
- Every private operation verifies identity/MFA; invalid, revoked and pre-MFA sessions fail and private responses are no-store.

#### AUTH-02 — Rehearse owner recovery

**planned · P1** | Depends on: AUTH-01

Recover access without bypassing MFA.

- Document and test lost-authenticator/session-revocation recovery in an isolated account/environment.
- Recovery restores MFA before granting content access; no credentials are committed.

### First project editing workflow

#### EDIT-01 — Edit project metadata and summaries

**planned · P1** | Depends on: AUTH-01, PUB-02

Update project information without editing repository HTML.

- Edit approved project fields, technology labels, status, display order and public-safe links.
- Validate all input server-side; private repository links and unknown fields cannot enter public actions.

#### EDIT-02 — Save drafts and handle conflicts

**planned · P1** | Depends on: EDIT-01

Keep edits safe without silently changing the live site.

- Saving, saved, failed, unsaved and conflict states are visible; failed saves retain the in-memory buffer.
- Expected-version checks reject stale writes from another tab; saving alone does not publish.

#### EDIT-03 — Preview the exact draft privately

**planned · P1** | Depends on: EDIT-02, PUB-01

Review a draft as it will appear publicly.

- Owner/MFA-only preview uses the public renderer and the exact draft version.
- Draft URLs, media and payloads remain private/no-store and absent from search, feeds and public builds.

#### REL-01 — Publish an immutable release

**planned · P0** | Depends on: EDIT-03, DATA-01

Publish exactly the reviewed content through a reliable build job.

- Explicit owner/MFA publish commits an immutable revision, asset references, release manifest and durable job atomically.
- Trusted builds use the approved code/content snapshot; serial promotion, retries and failures work without an open browser or in-memory queue.

#### REL-02 — Verify live state and withdrawal

**planned · P0** | Depends on: REL-01

Know which revision is actually public.

- Mark live only after deployed release identity, pages, assets and metadata are verified; failed or superseded jobs cannot overwrite newer releases.
- Test unpublish, redirects, historical deployment exposure and withdrawal during outages; measure the proposed healthy five-minute target.

### Release readiness

#### OPS-01 — Export and restore content

**planned · P0** | Depends on: REL-02, AUTH-02

Recover both content and assets when a provider fails.

- Versioned exports include drafts, revisions, assets and references in private encrypted storage.
- Clean-environment restore and provider pause/outage exercises meet the accepted recovery/retention goals; static fallback is rehearsed.

#### QA-01 — Validate the first dynamic release

**planned · P0** | Depends on: REL-02, OPS-01, PUB-02

Prove the first editing workflow works safely end to end.

- Production-build public/editor/error journeys and direct policy tests pass, including draft exclusion, concurrent saves, XSS/URL rejection and rollback.
- Review both palettes, keyboard/contrast, supported browsers, headers, bundle/performance budgets and regional/quota evidence; field metrics require sufficient traffic.

#### CUT-01 — Approve and perform production cutover

**planned · P0** | Depends on: QA-01

Move the public domain only after the owner accepts release evidence.

- Owner explicitly authorises production/domain cutover and any affected provider settings.
- Verify canonical URLs, redirects, release identity and monitoring after cutover; preserve the tested static rollback.

### Later dynamic capabilities

#### BLOG-01 — Author blog posts with safe structured content

**planned · P2** | Depends on: CUT-01

Write technical articles without executable CMS markup.

- Accepted versioned document format supports approved text, headings, lists, code, quotes and links with bounded validation.
- Unknown nodes, hostile URLs and unsupported schemas fail safely; no CMS HTML/MDX/JavaScript execution.

#### BLOG-02 — Publish and browse the blog

**planned · P2** | Depends on: BLOG-01

Read only verified published articles.

- Listing, article routes, tags, pagination, code rendering and accessible reading work with prerendered HTML.
- Drafts remain excluded; sitemap, RSS, canonical/social metadata and redirects use the same deployed release.

#### MEDIA-01 — Upload and manage private media

**planned · P2** | Depends on: CUT-01

Add images with controlled processing and publication references.

- Validate decoded type, size and dimensions; re-encode and strip metadata within accepted runtime bounds.
- Draft delivery is owner-only; published delivery requires a live reference, alt/decorative intent and accepted cache/withdrawal rules.

#### CONTACT-01 — Accept contact messages safely

**planned · P2** | Depends on: CUT-01

Let visitors contact the owner with clear submission feedback.

- Accessible validation, fixed recipient/verified sender, server validation and origin/CSRF rules match the accepted API design; keep mailto fallback.
- Atomic shared quotas and duplicate-safe provider requests handle concurrent submissions, uncertain outcomes and outages; previews cannot send real mail.

#### OPS-02 — Maintain the dynamic service

**planned · P2** | Depends on: CUT-01

Keep dependencies, quotas and recovery evidence current.

- Define maintenance ownership and review cadence for patches, provider terms, quotas and logs without unnecessary visitor tracking.
- Repeat restore and access reviews after relevant changes; record actionable failures and owners in the outlook.

### Optional or deferred

#### OPT-01 — Optional AI writing suggestions

**deferred · P3** | Depends on: BLOG-02

Consider bounded draft assistance after core editing is reliable.

- Separate owner acceptance covers provider, terms, quota and activation.
- Suggestions require human review, affect drafts only and have timeout/kill-switch behaviour; exhausted quotas never block editing.

#### OPT-02 — Unaccepted expansion ideas

**deferred · P3** | Depends on: none

Keep the old wish list out of committed delivery scope.

- Newsletter, comments, visitor accounts, payments, chatbot, analytics, dark mode and live GitHub integration remain deferred/unaccepted.
- Any re-entry needs an explicit owner request and affected design acceptance; the old roadmap is not authority.

## Keep this outlook current

After each completed bundle, update status, evidence and dependencies in design/backlog.json. Update reviewedOn only after reconciling shipped work, decisions and blockers; a generated report alone is not a review.

Run `npm run outlook:update` to regenerate this page, `npm run outlook:check` to validate it, and `npm run outlook` for a concise status report. These local commands are available; they are not yet a required CI check or a scheduled automation.

For a periodic review, ask: “Reconcile the roadmap and backlog against merged work and report what shipped, what is next, what is blocked, which decisions I owe, and what changed since the previous review.” Recheck provider/version evidence when its decision story is taken up. This request does not create a recurring schedule.

A story is done only when its acceptance criteria pass and evidence is linked. Move reopened/changed stories back to an appropriate state. Never mark technical decisions accepted solely by changing this file. Preserve the ADR history and keep credentials/private account identifiers out of evidence.
