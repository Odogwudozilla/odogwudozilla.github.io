# Portfolio direction and design history

Current scope, 18 October 2026: **retain static** under ADR 015. The owner
approved a bounded scope/tooling/verification slice in this repository.
See [static maintenance](static-maintenance.md) for the plan, runtime and
verification evidence. The template/partials → Node assembly → generated HTML
workflow remains primary. Angular/blog/CMS/private-editor/services are deferred
without permanent cancellation or a restart date; Next remains dormant.
Re-entry requires a new explicit owner request and affected revalidation.

The sections below retain the earlier dynamic design and its acceptance
limits. Its unresolved provider/session/publication decisions are deferred
requirements, not prerequisites for static maintenance. No dynamic gate is opened.

## Deferred dynamic design

Status: **Partially accepted; implementation gate closed**. Updated on
13 October 2026 against static baseline 21c2a69 and current official sources.

The owner chose Angular for learning and required complete independence from
company packages/configuration. The earlier Next.js proposal is superseded.
Prerendered public pages with a dynamic private editor are now accepted.
Backend capacity, API runtime and hosting still need resolution.

## Accepted requirements

- Public personal portfolio, blog and contact; private browser editor.
- Prerendered public HTML; publishing and withdrawal require deployment.
- One owner, password plus authenticator-app MFA, no public signup.
- EU CMS database/Storage; near-zero cost, paid services separately approved.
- Free-tier interruptions accepted with backups, tested restore and static fallback.
- Navy default, teal alternative and saved preference; company information private.
- Cached public pages with a reviewed framework policy, stricter admin/contact
  policy, no executable CMS HTML/MDX. Angular mechanisms remain to be designed.
- Shared harness instructions, recorded decisions, required CI and explicit
  owner acceptance for stack/provider/schema/security/scope/paid changes.
- AI optional; newsletter, visitor accounts, comments and payments deferred.

## Current recommendation and unresolved choices

Use a fresh public Angular CLI application, recommended Angular 22 with strict
typing/templates, standalone components, signals, RxJS and typed forms.
Use the accepted prerendered public HTML and lazy private editor. Do not
preserve React/Next-specific design conventions or switch to SSR silently.

The owner selected the existing personal Supabase organisation as the intended
CMS destination and deleted two paused projects. After signing in, the selected
organisation's new-project page still explicitly blocks creation at the account's
two-active-Free-project limit. Paused projects do not count; deleting them has
not freed capacity. This was reverified on 13 October 2026. No project was created
or changed by the assistant. Resolve capacity or revise the backend before building.

Potential UI/editor tools are semantic tokens, Tailwind 4, selected Angular
CDK/Material controls and framework-neutral Tiptap core. Runtime validation,
explicit publication and direct policy tests remain essential. Exact versions
and the API/session/hosting design are proposals, not accepted implementations.

## Review package

- [Rendering comparison](rendering-comparison.md): practical SSG/SSR tradeoffs.
- [Hosting/API proposal](hosting-and-api.md): concrete runtime and publishing path.
- [Angular independence](angular-isolation.md): clean public packages and provenance.
- [Architecture](architecture.md): routes, boundaries, runtime and capacity.
- [Content/security](content-and-security.md): CMS, access, contact, media and AI.
- [Decisions](decisions.md): precise human acceptance and open proposals.
- [Implementation gates](implementation-plan.md): feasibility before code.
- [Governance](governance.md): harness guidance and planned independent checks.
- [Machine-readable contract](contract.json): partial acceptance and open choices.
- [Repository findings](review.md): legacy scaffold problems and migration scope.
- [Assessment follow-up](assessment-follow-up.md): historical first-pass
  evidence; context files were subsequently versioned in commit 86775c0.
- [Static delivery and recovery](static-recovery.md): observed Pages source,
  deployment identity, local reconstruction rehearsal and remaining limits.
- [Static PR verification](static-verification.md): validated workflow and first
  passing GitHub PR run, action pins and separately gated merge enforcement.

## Readiness

The design is not yet ready for implementation. Verify dedicated backend
capacity, accept API/session/host mechanisms, then accept the concrete
schema and operating limits. Documentation refinement is authorised; package
installation, cloud provisioning and production cutover are not this task.

Root [AGENTS.md](../AGENTS.md) and harness bridges point to this package.
Instructions are present; dynamic CI, database rules and remote merge protections
are still planned. No claim of watertight enforcement is made before those
checks are implemented and tested. The static production fallback remains.
