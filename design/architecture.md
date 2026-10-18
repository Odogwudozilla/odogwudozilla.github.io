# Dynamic Angular application architecture

Deferred under ADR 015; this document retains the earlier dynamic design.
Current architecture is the existing static workflow described in
[static maintenance](static-maintenance.md). Reopening dynamic scope requires
a new explicit owner request and affected revalidation; no dynamic gate is opened.

Status: **Partially accepted requirements; technical design under review**.
The owner chose Angular and complete independence from company infrastructure.
Public prerendering and the dynamic private editor are accepted. API runtime,
hosting and dedicated CMS capacity remain open; see [decisions.md](decisions.md).

## Framework and dependency policy

Use a fresh public Angular CLI workspace after implementation is authorised.
Recommended: supported Angular 22, strict TypeScript and templates, Node 24
LTS, npm and a committed lockfile. The published Angular 22.0.x table requires
Node 24.15.0 or newer in the 24 line, TypeScript 6.0.x and compatible RxJS.
Resolve exact patches together and recheck the chosen minor's requirements.
[Angular compatibility](https://angular.dev/reference/versions),
[Angular support](https://angular.dev/reference/releases).

Use standalone components, OnPush change detection, inject(), signals for
local state, RxJS for asynchronous streams, typed reactive forms and Angular
Router. Lazy-load admin. Nx and a full NgRx store need a demonstrated
requirement and accepted decision. Company code/configuration is not a source
for implementation; follow [angular-isolation.md](angular-isolation.md).

Tailwind 4 and semantic tokens remain a proposal. Angular CDK/Material are
candidates for editor controls, with one reviewed primitive system. React,
Radix and shadcn are superseded. Wrap framework-neutral Tiptap core in an
Angular component; initialise in the browser and destroy on teardown.
[Tiptap core](https://tiptap.dev/docs/editor/getting-started/install/vanilla-javascript).

Use Angular CLI Vitest/TestBed, HTTP testing utilities, Playwright, accessibility
checks and direct database-policy tests. Resolve compatible Angular ESLint
and formatting versions before installation. No canary or floating latest policy.
[Angular testing](https://angular.dev/guide/testing).

## Accepted rendering and proposed runtime

[Rendering comparison](rendering-comparison.md) records the owner's SSG choice:
prerendered public HTML and a browser-rendered editor. Publishing/withdrawal
requires deployment. Use explicit route modes and static output; do not
substitute SSR or a browser-only public blog without a deliberate change.
[Angular rendering](https://angular.dev/guide/ssr).

Use typed HTTP endpoints, not Next.js Server Actions. Every handler validates
inputs and verifies required identity/MFA. Client route guards are navigation
helpers; database policies and authorised RPCs enforce permissions independently.

| Backend candidate | Strength | Proof needed before selection |
| --- | --- | --- |
| Node 24 API beside Angular static output | Common runtime and image-processing tooling | Compatible host, quotas, API output, request isolation and session handling |
| Supabase Edge Functions for SSG | Managed endpoints beside candidate CMS | Deno dependencies, JWT/MFA, CORS, jobs and bounded image processing |
| Cloudflare API for SSG | Static assets and bounded API work | CPU limits, database access, media processing and secrets |

Do not infer SSR support from a static Angular hosting guide. Do not assume
Node packages such as sharp run unchanged in Deno/Workers. Session mechanism
and exact backend dependencies remain unresolved. The concrete recommendation
is Node functions alongside Vercel static hosting, pending acceptance and
verification; see [hosting-and-api.md](hosting-and-api.md).

## Proposed boundaries

Public Angular views use an approved publication reader or a deployed release
snapshot. The lazy editor calls verified owner APIs. Contact calls a separate
quota/sending adapter. Private Storage and the optional AI adapter remain
behind authenticated operations; editor/AI libraries stay out of public bundles.

Proposed source layout: src/app/core, shared/ui, shared/layout and features
for content, admin, contact and theme; src/styles for tokens; contracts for
runtime schemas and HTTP models. Only the selected runtime gets server code:
server/ for Node or supabase/functions/ for Edge. Supabase SQL migrations and
direct policy tests apply only if that provider is selected.

Enforce browser/server import boundaries and inspect built artifacts for
secrets. Next-specific server-only imports are not an Angular isolation method.
Shared types contain no database clients or secrets. Keep modules below 500 lines.

## Route and cache contracts

| Route | Contract |
| --- | --- |
| / | Approved homepage and professional work, complete public HTML |
| /portfolio and /portfolio/:slug | Published projects; genuine 404 for unknown/unpublished slugs |
| /blog and /blog/:slug | Same publication projection as metadata, sitemap and RSS |
| /about and /privacy | Reviewed public profile and processing explanation |
| /contact | Protected API, no cached submissions, mailto fallback |
| /admin/login and /admin/mfa | No-store/noindex, rate-limited |
| /admin/posts, /admin/projects and /admin/media | Lazy browser UI; private data requires owner plus MFA |
| /admin/preview/:entryId | Owner-only draft preview; no public tokens/cache |
| /media/:assetId | Verify publication reference, bounded binary cache |
| /sitemap.xml and /rss.xml | Match the public release |

Preserve homepage anchors and legacy HTML redirects. Slug redirects must
avoid loops/collisions. Scope SPA fallback to admin; unknown public articles
must not return a generic 200 shell. Public requests never refresh owner sessions.

Private data must never enter Angular's HTTP transfer cache. Explicitly
exclude drafts, authenticated reads, contact and admin; do not opt credentialed
requests into transfer caching. Failed reads/builds cannot substitute drafts.
[Transfer cache](https://angular.dev/guide/ssr#caching-data-when-using-httpclient).

The accepted SSG direction has a five-minute healthy publish/withdrawal target,
subject to measurement; outage delays remain possible. There is no Next ISR
guarantee. See the comparison and API proposal for publishing/withdrawal details.

## Visual and accessibility contract

The owner requested a further static redesign on 14 October: explicit portfolio
identity, restrained typography, project rows and stronger action states replace
the bento layout. Use the current static revision as the visual review reference,
retain professional work first and semantic canvas/surface/text/action/border/focus tokens.
Navy retains #274263, #253756, #FF8000, #CBE7EC and #F4FAFB with dark text on
orange; teal retains the approved warm-paper/green palette. Dark mode is deferred.
Preserve portfolio-colour-theme with CSP-compatible before-paint restoration.
Avoid hydration mismatches. Start with system fonts and native mobile disclosure.

Target WCAG 2.2 AA, 44px primary touch controls and 320/390/768/1024/1280px
layouts. Browser support must satisfy the chosen Angular major's official
Baseline set and styling requirements; the previous Tailwind-only minimum
list is superseded. Exact browser acceptance remains open.
[Angular browser support](https://angular.dev/reference/versions#browser-support).

## Provider feasibility

The initial read-only dashboard review on 13 October found the account at the
two-active-Free-project limit. Both older projects were already paused.
The owner subsequently deleted both paused projects and selected the personal
organisation as the destination. An authenticated recheck of its new-project
page still explicitly blocks creation at the two-active-Free-project limit.
Local configurations map active projects to club and
energy applications. No clearly unused active project was identified;
configuration establishes dependency, not recent production usage.

No service was changed by the assistant. Deleting a
paused project would not create another active slot. Do not share unrelated
databases or evade account limits. A dedicated Supabase project needs a
deliberately retired active project or approved paid capacity; otherwise
compare another backend and revise the provider decision. The selected
organisation's private identifier is not written into public documentation.
[Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase).

Cloudflare documents Angular static deployment; this is a frontend candidate,
not a solution to CMS capacity or proof of SSR support.
[Angular on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-angular-site/).

The owner accepted free-tier interruptions with backups, tested restoration
and the static fallback. EU database/Storage placement does not guarantee all
CDN, email, auth or AI processing remains in the EU. Document actual processing.
Use disposable synthetic data in CI; previews cannot access production drafts
or real sending. Production/DNS/cutover require separate applicable authority.
