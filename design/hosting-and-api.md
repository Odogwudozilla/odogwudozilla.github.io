# Hosting and API proposal for the accepted SSG direction

Status: **Proposed, not accepted or provisioned**. Public prerendering and
the dynamic Angular editor are accepted. The owner selected an existing
personal Supabase organisation; authenticated rechecking still blocks a new
Free project at the account's two-active-project limit.

## Recommended combination

| Responsibility | Proposal | Reason |
| --- | --- | --- |
| Public HTML and assets | Vercel Hobby static deployment | Personal non-commercial use fits the stated purpose; same host can run APIs |
| API and bounded media processing | Node 24 Vercel Functions | Standard TypeScript endpoints and native image processing without Angular SSR |
| CMS, identity, private media | Dedicated Supabase project in an EU region | Retain one PostgreSQL/Auth/Storage backend if capacity is available |
| Editing | Lazy Angular editor with Tiptap core | Restricted JSON documents; no React dependency |
| Contact email | Resend, subject to shared quotas and sender verification | Existing sending/privacy contracts |
| Optional AI | Server-side Cloudflare adapter, disabled initially | Does not require migrating the frontend host |

Vercel documents static artifacts and Node functions as separate deployment
outputs. This proposal does not depend on native Angular SSR support.
Verify the combined Angular static output, API routing and headers in the
foundation gate before accepting the deployment configuration.
[Build Output API](https://vercel.com/docs/build-output-api),
[Node runtime](https://vercel.com/docs/functions/runtimes/node-js).

The provider supports Node 24 but manages its patch updates. Pin local/CI
versions; set the deployed major and record/check the actual runtime against
Angular compatibility instead of promising an exact provider patch pin.
[Provider Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

Hobby is restricted to personal, non-commercial use. Verify account quotas,
deployment retention/protection and processing locations; do not enable paid
features, trial billing or automatic upgrades. The declared purpose fits
in principle, not as an account-capacity guarantee.
[Hobby policy](https://vercel.com/docs/plans/hobby).

## Proposed authentication and request boundary

Use the standard Supabase browser Auth SDK only in admin. Send explicit
bearer tokens to private APIs; verify signature, owner identity and MFA at
each operation, and enforce owner/aal2 again in RLS and RPCs. Never treat an
Angular guard or decoded JWT as authorisation. Forward the verified owner's
token to the CMS client; privileged keys are isolated from CMS operations.

Tokens are browser-accessible under this model. This tradeoff requires a
strict private CSP and no third-party scripts; it is not an HttpOnly session
claim. Keep public requests free of owner tokens. Do not silently add cookie
authentication to bearer endpoints. Reject invalid origins and unexpected
payloads; no permissive cross-origin access. Same-origin API URLs simplify
routing, but do not replace verification or quotas.

An uncached Node handler can serve the trusted admin/contact shell with a
fresh CSP nonce for Angular runtime styles if needed. It serves compiled
assets; it does not server-render CMS data. Test the routing/header/nonce
mapping and ensure this shell does not fall through to a public cache.
Public HTML uses a separately reviewed cache-compatible policy. Detailed
CSP and token-lifetime/revocation tests are still acceptance work.

## Proposed publication pipeline

1. Owner reviews an exact draft version and requests publication with MFA.
2. A transaction creates immutable approved revisions, a release manifest
   and a durable job. Saving a draft does not enqueue deployment.
3. A trusted pipeline checks out an approved code revision, reads that exact
   manifest through a narrowly scoped build credential, and builds Angular
   public HTML plus matching feeds/metadata and release assets.
4. Validate complete output, draft exclusion, routes, headers and release ID.
   Stage/protect the deployment before promoting the production domain.
5. Under a serialised promotion policy, check for superseding releases and
   withdrawals, promote, verify the production release ID, then mark live.

The pipeline can use the existing repository's trusted GitHub Actions rather
than a new application framework. Its concrete dispatch credentials, leasing,
retry/reconciliation and promotion mechanism need an implementation-ready
contract before foundation acceptance. Do not rely on a function continuing
after its response, in-memory queues, or a browser remaining open.

Vercel Hobby cron runs at most daily; it cannot supply five-minute job retries.
Use an explicit durable trigger and completion/reconciliation path. A daily
cron may be a safety check, never the primary publishing mechanism.
[Hobby cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing).

Production builds cannot execute untrusted PR code with production secrets.
Build credentials read only the approved release; deployment credentials
remain in the protected pipeline. No deployment token belongs in Angular.
Unknown article paths return 404; SPA fallback is scoped to admin only.

Protect or delete historical content deployments on withdrawal. Provider
default retention is not a confidentiality or withdrawal control. Test the
available free protection against old production URLs as well as previews;
if insufficient, revise the deployment strategy before release.
[Deployment protection](https://vercel.com/docs/deployment-protection),
[Deployment retention](https://vercel.com/docs/deployment-retention).

## Alternatives and unresolved feasibility

Cloudflare Pages plus Supabase Edge Functions remains viable for simple
APIs, but media processing needs a different tested decoder/encoder. Hosted
Edge Functions have a 2-second CPU limit and do not support sharp/libvips.
Do not waive re-encoding or silently add paid image services to make it work.
[Supabase runtime limits](https://supabase.com/docs/guides/functions/limits).

This proposal does not resolve the active-project quota. Supabase's two-Free-
project allowance spans owner/admin organisations; paused projects do not
count. The authenticated new-project page in the selected organisation still
blocks creation after deletion of the paused projects. No active application
retirement is authorised. Resolve capacity or revise the provider decision.
[Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase).

Remaining acceptance: host/API/session choice, dedicated capacity, publication
and protection mechanism, concrete schema, package versions and operating
limits. SSG acceptance does not authorise cloud creation or production cutover.
