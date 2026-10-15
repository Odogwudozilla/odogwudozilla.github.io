# Choosing Angular public rendering

Status: On 13 October 2026 the owner accepted **prerendered public pages with
a dynamic private editor**, following this comparison. SSG is the chosen
direction; the detailed publishing/runtime mechanisms remain proposals.
SSR is retained below as an alternative requiring a deliberate decision change.

This fits small, infrequently updated content, no visitor accounts, near-zero
budget and the existing static fallback. Both options still need a CMS,
authentication, protected media and a contact API.

## Practical differences

| Concern | Prerendered pages (SSG) | Server-rendered pages (SSR) |
| --- | --- | --- |
| Public HTML | Generated during a build, delivered from static hosting | Generated on request or served from public cache |
| Private editor | Live saves and private preview | Same live saves and preview |
| Publish | Reviewed revision, build, deploy, verify | Commit reviewed revision, refresh public caches, verify |
| Time until visible | Usually minutes; build queue/deployment dependent | Potentially seconds; cache/backend dependent |
| Failure | Previous deployed site survives a failed build | Cached pages may survive; uncached requests depend on runtime/database |
| Cost | Static delivery plus build/API quotas | Additional rendering CPU, requests and database reads |
| SEO/link previews | Content and metadata in initial HTML | Content and metadata in initial HTML |
| Security work | Editor/API protection plus trusted publishing pipeline | Same API protection plus request/cache isolation |
| Angular learning | Components, DI, signals, forms, router, hydration, prerendering | Those concepts plus request-time server integration |
| Best fit | Occasional updates and resilient public delivery | Frequent updates or request-time public data |

Angular supports Prerender, Server and Client modes per route. Static output
needs no Node rendering server; parameterised articles are enumerated at build.
[Angular rendering](https://angular.dev/guide/ssr).

Public hosting and CMS/backend capacity are separate decisions. The owner
selected a Supabase organisation after deleting paused projects; authenticated
rechecking still blocks another active Free project. Paused projects do not count.

## A: SSG public site, browser editor, protected API

Build homepage, project/blog lists and detail pages, metadata, sitemap and RSS
from an exact approved release snapshot. Admin stays lazy and browser-rendered.
Contact has public HTML, an API-backed form and a mailto fallback.

Publishing works from the editor without a manual Git commit. The owner reviews
an exact draft version; a transaction records the immutable approved revision
and durable deployment job. A trusted pipeline builds a complete release from
approved revisions/assets, runs content/route/security checks, deploys and
verifies the public release identifier before recording completion.

Distinguish draft saved, revision approved, deploying, live and failed.
A database commit is not proof of public deployment. Separate approved
publication from verified deployment with release IDs and entry/revision
manifests; this additional schema work needs review under the accepted SSG choice.

Serialize/coalesce jobs, stop older builds overtaking newer releases and
retain retry/error state across restarts. Deployment tokens stay server-side.
Build only approved code plus a pinned publication manifest; a CMS trigger
must not run unreviewed branches with production secrets.

Hydration and later navigation use the deployed snapshot, never silently
combine old HTML with newer database pointers. Missing public articles get
404; admin fallback is scoped separately. Invalid/missing content fails the
build instead of deploying an empty blog. Autosave never triggers builds.

**Withdrawal needs a replacement deployment.** Clearing a database pointer
does not remove HTML already hosted. Proposed healthy publish/withdrawal
target: five minutes, subject to measuring actual builds. This is not a
guaranteed deadline during outages or queue exhaustion. A hard withdrawal
bound would require SSR with bounded expiry or a separately designed
request-time release gate. Already downloaded copies cannot be recalled.

Keep CMS media behind a publication-aware gateway with <=300-second cache;
do not copy revocable images to permanently cached static assets. Rollback
must check a current withdrawal list. Historical deployments/preview URLs
must not remain public copies of withdrawn content: protect/remove them
through a tested retention procedure.

Cloudflare documents Angular static deployment. Pages Free allows 500 builds
per month, one concurrent build and a 20-minute timeout. These are ceilings,
not expected build times or an availability guarantee. Workers Static Assets
is another candidate; choose and verify one deployment path.
[Angular on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-angular-site/),
[Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

The API could use Supabase Edge Functions or a separate Node runtime. Their
auth/media constraints differ and need explicit selection. Static hosting
alone is not a complete dynamic application architecture.

## B: Angular SSR and Node HTTP API

Render from the live published reader and cache only anonymous public output.
Keep admin browser-rendered. Angular does not supply Next.js ISR/tag invalidation.
After publishing, retain durable invalidation work and verify details, lists
and feeds. Proposed healthy visibility target: 60 seconds.

A five-minute withdrawal target needs bounded CDN expiry. Do not serve
withdrawn content indefinitely as stale data during outages. Review availability
and withdrawal together. Keep sessions per request, never in process-global
singletons. Exclude drafts/private responses from Angular transfer cache and
all shared caches. Failure never substitutes a working draft.

Host selection must prove Node/Angular server output compatibility, status/
routing behaviour, cold starts, cache rules, secrets, regional processing and
free-tier limits. A static Angular guide is not evidence of SSR support.
Workers Free allows 10ms CPU per invocation; do not assume Angular SSR fits
without measured proof.
[Workers limits](https://developers.cloudflare.com/workers/platform/limits/).

SSR is the better fit when frequent publication, request-time public data or
short withdrawal windows justify more runtime operations. These have not
been established as requirements for this release.

## Shared requirements and remaining decisions

Both retain password/TOTP, no signup, EU CMS database/Storage, explicit
publication, structured content, draft isolation, protected contact quotas,
reviewed public CSP/strict private policy, backups/restoration/static fallback
and public dependencies. AI stays optional and disabled initially.

Before implementation:

1. Implement the accepted SSG direction only after the remaining design gates.
2. Resolve dedicated Supabase capacity in the owner's chosen organisation:
   authenticated rechecking still blocks creation after paused-project deletion.
   No active application retirement is authorised.
3. Select the API runtime, session mechanism and deployment path; reconcile
   CSP, media processing and publication contracts with that runtime.
4. Accept the revised schema, exact package versions and operating limits.

Record remaining choices before implementation. Do not interpret SSG acceptance
as blanket acceptance of the API runtime, provider billing or concrete schema.
