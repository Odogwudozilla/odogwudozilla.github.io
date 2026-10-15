# Current dynamic design findings

This review covers the 2025 planning documents, the legacy Next.js scaffold,
the approved static portfolio, and the repository's development instructions.
Priorities identify work needed before the dynamic foundation can be accepted.
The owner subsequently chose independent Angular; Next findings identify
migration scope, not instructions to retain that framework.

The repository findings below record the original review baseline. On
14 October the owner requested static redesign and dependency-alert fixes;
unused Next dependencies and commands were removed from the active manifest.
The source remains dormant. See [cleanup evidence](../docs/dependency-cleanup.md).

## Historical repository evidence

The evidence column describes the original review, not today's manifest or
runtime. The per-finding dispositions below were revalidated on 15 October
2026. Original priorities are retained for history; they are not active
static-site incident priorities.

| Finding | Evidence | Required design change | Priority |
| --- | --- | --- | --- |
| Unsupported framework line | Lockfile resolves Next.js 14.2.33; package specifies `^14.2.0` | Retire through an authorised fresh Angular migration | P0 |
| Runtime policy is too broad | `package.json` allows Node >=18; old guide requires 18+ | Pin Node 24 LTS for dynamic development and CI | P0 |
| Test commands lack their framework | `test` invokes Jest, but Jest is absent from dependencies and lockfile | Choose and install a real test stack after design acceptance | P0 |
| No dynamic CI workflow | `.github/` contains instructions only; workflow in the guide is an example | Add required quality and architecture checks as the first implementation gate | P0 |
| Unbounded image fetching | `next.config.mjs` allows any HTTPS image hostname | Permit local assets and explicit approved origins only | P0 |
| CMS source contradicts itself | Architecture puts posts in SQL; roadmap proposes MDX; guide mixes Markdown posts with database projects | Store editable content in one CMS with one publication contract | P0 |
| Draft protection is underspecified | Proposed `published` flag shares the row with editable body and metadata | Separate working drafts and published snapshots | P0 |
| Authentication has alternatives | Supabase plus Clerk and several OAuth providers are listed | One owner identity, one provider, MFA, no public registration | P0 |
| Data-access authority is duplicated | Prisma is proposed alongside Supabase SDK and RLS | Use Supabase SDK plus SQL migrations; no Prisma in this release | P0 |
| Security is a checklist | Old plan mentions middleware, CSRF, RLS and sanitisation without contracts | Define auth at each mutation, row grants, safe rendering, and failure states | P0 |
| Production robots apply globally | `src/app/layout.tsx` sets indexing without environment separation | Preview and admin deployments must not become indexed | P0 |
| UI differs from accepted design | Scaffold has generic hero/cards, green tokens, and generic typography | Use approved static layout and navy/teal visual contracts | P1 |
| Navigation targets are unimplemented | Five configured routes but only the root page exists | Define and implement a route inventory; do not display dead links | P1 |
| Current-path highlighting lacks an input | Root layout does not supply header `currentPath` | Put route-aware behaviour in a small client island | P1 |
| Mobile navigation is not yet a complete contract | Header uses scroll locking; trigger is outside its click-outside marker | Choose an inline disclosure, focus return, and browser-tested behaviour | P1 |
| Primitive contracts need review | Card title uses a paragraph ref for an h3; button docs show unsupported `primary` variant | Review semantics/types in independent Angular controls | P1 |
| Domain types assume broad features | Skills use self-ratings; project dates are `Date`; visibility and publishing state are absent | Introduce serialisable, schema-validated public and admin models | P1 |
| Backups are assumed | Old guide promises daily backups; no configured backup process exists | Design exports and a verified restore path for the chosen free tier | P0 |
| Success metrics are overpromised | 99.9% uptime, SEO ranking and growth numbers are presented without a baseline | Use measurable acceptance criteria and separate goals from guarantees | P1 |
| AI instructions conflict and depend on one harness | Copilot file requires named tools, green tokens, dark mode, and universal atomisation | Use a short root contract plus tool-neutral bridges and CI | P0 |

For unresolved future-target findings, P0 blocks accepting the dynamic
foundation and P1 must be closed before its release. Dormant scaffold findings
do not require repairing Next.js. The scaffold is not evidence that the
planned backend exists.

## Current dispositions (15 October 2026)

“Superseded” closes an obsolete prescription, not verification of a future
implementation. “Pending” retains an unresolved requirement. Current design
acceptance is recorded only in [decisions.md](decisions.md) and
[contract.json](contract.json).

| Original finding | Disposition and current scope | Evidence / remaining work |
| --- | --- | --- |
| Unsupported framework line | Closed for active static dependencies; dormant Next source retained | Manifest/lockfile contain no third-party dependencies. Angular migration remains gated; see dependency cleanup. |
| Runtime policy is too broad | Pending, active static tooling and future target | Static manifest still permits Node >=18. A supported static baseline needs selection; the dynamic Node proposal does not select it automatically. |
| Test commands lack their framework | Closed for active static workflow; future test stack pending | `test` invokes `check:static`, which uses Node built-ins. Do not install Jest to repair this historical finding. |
| No dynamic CI workflow | Pending, future target; separate static automation opportunity | No workflow files exist locally. Static checks are available manually; remote merge settings remain unverified. |
| Unbounded image fetching | Dormant Next configuration; pending future media contract | Root scripts do not invoke Next. Future origins/media validation require review before implementation. |
| CMS source contradicts itself | Historical plans superseded; concrete target schema pending | Current ADR 006 prohibits executable HTML/MDX and proposes structured content. Historical plans are background. |
| Draft protection is underspecified | Pending, future target | Separate drafts/immutable revisions are proposed; release/public-read authority and failure recovery remain open. |
| Authentication has alternatives | Historical alternatives superseded; mechanism pending | ADR 005 accepts one owner, password/TOTP and no signup; session transport/revocation/recovery remain unresolved. |
| Data-access authority is duplicated | Historical Prisma prescription superseded; provider/schema pending | ADR 004 proposes SDK/SQL migrations. This row does not approve that proposal or install it. |
| Security is a checklist | Pending, future target | Content/security documents refine intent; concrete enforcement and direct-path tests do not exist. |
| Production robots apply globally | Dormant Next source; pending future preview/admin design | No active Next build. Preview isolation/indexing must be verified for the chosen host. |
| UI differs from accepted design | Dormant scaffold superseded as visual reference | Use the current linear static portfolio and navy/teal behaviour, not scaffold cards or the earlier bento design. |
| Navigation targets are unimplemented | Dormant scaffold; pending future route inventory | Active static anchors are covered by structural checks. Future routes need their own implementation/verification. |
| Current-path highlighting lacks an input | Dormant React defect; prescription superseded | Angular route-aware behaviour needs Angular design; a React client island is not a requirement. |
| Mobile navigation is not yet a complete contract | Dormant scaffold; pending future interaction design | Preserve static progressive enhancement. Future editor/navigation browser and focus checks remain required. |
| Primitive contracts need review | Dormant scaffold; pending future Angular primitives | Do not repair unused React primitives as an Angular prerequisite. |
| Domain types assume broad features | Dormant scaffold; pending future content schema | Concrete serialisable public/admin models still require acceptance and validation. |
| Backups are assumed | Pending, future backend | ADR 014 accepts interruptions with backup/restore/static fallback; no configured CMS backup or tested restore is claimed. |
| Success metrics are overpromised | Historical guarantees superseded; measurement pending | Current ADR 013 describes a healthy publication target, not an outage guarantee. Field measurements and operating limits remain unverified. |
| AI instructions conflict and depend on one harness | Corrected locally; durability and enforcement pending | Root AGENTS.md and thin bridges point to current design. Most are untracked; other harness loading and CI/remote controls are not verified. |

See [assessment follow-up](assessment-follow-up.md) for the F1–F7 handoff
status and the bounded context baseline to preserve together.

## Stack assessment after the owner's choice

The initial supported Next.js upgrade recommendation is superseded by the
owner's Angular choice. The existing Next 14 scaffold remains legacy code until
the authorised migration; its dependencies are not the dynamic target.
[Next support](https://nextjs.org/support-policy).

Recommend supported Angular 22 from public packages, compatible Node 24 LTS,
strict TypeScript/templates, standalone components and a lazy browser editor.
ADR 013 accepts public prerendering and a dynamic private editor following
the SSG/SSR comparison; concrete hosting/publication mechanisms remain open.
React Server Components,
Server Actions and Radix/shadcn conventions do not transfer to Angular.
[Angular compatibility](https://angular.dev/reference/versions),
[Rendering comparison](rendering-comparison.md).

Tailwind 4 remains a styling candidate with explicit browser requirements.
Combine these with Angular's browser Baseline rather than retaining the
earlier React-oriented browser list. Use Angular primitives where needed.
[Tailwind requirements](https://tailwindcss.com/docs/upgrade-guide).

## Security and measurement observations

The historical GitHub push reported dependency alerts, while the then-local
`npm audit --json` invocation returned zero findings. These are different
observations, not a security sign-off. Reconcile the provider's current
alerts with the cleanup evidence and, before adding target dependencies, a
fresh audit of the resolved replacement dependency tree. The active manifest
now has no third-party dependencies; remote alert status is unverified.
No dynamic production build or penetration test has been performed.

Replace the old FID target with INP. Proposed field targets are LCP <=2.5s,
INP <=200ms and CLS <=0.1 at the 75th percentile, once sufficient field
data exists. Lab tests must not be presented as field measurements.
[Web Vitals](https://web.dev/articles/vitals).

Target WCAG 2.2 AA and test both palettes, editor flows, forms, and keyboard
navigation. Automated scans alone do not establish conformance.
[WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Retain from the approved static site

- Business-oriented senior-engineer positioning and restrained claims.
- Professional Keylane work ahead of personal projects.
- Actual personal-project summaries and explicit private-source boundaries.
- Navy default and teal alternative, with persistent preference.
- Current linear portfolio, restrained borders, project rows, typography
  hierarchy and native disclosures. The 14 October
  [static redesign](../docs/static-redesign.md) supersedes the bento layout.
- Content available on arrival, semantic links, keyboard support, and mobile
  readability without unnecessary third-party scripts.

Preserve the current static deployment during design and migration.
