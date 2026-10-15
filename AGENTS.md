# Repository instructions

Read [design/README.md](design/README.md) and relevant decision records before
dynamic work. Requirements are **partially accepted**: Angular is chosen and
must be independent of company code, packages and infrastructure. Public pages
use prerendering with a dynamic private editor. Backend capacity, hosting and
concrete technical mechanisms remain open. Dynamic
implementation requires full relevant acceptance; documentation may continue.

The working static site is in `docs/`; `src/` is an incomplete Next.js
scaffold. The approved static site is the visual/content reference and
production fallback. The 2025 plans are background, not implementation authority.

## Design authority

- Human instructions and accepted ADRs govern choices; the corresponding
  `design/contract.json` records machine-readable intent.
- Follow `design/governance.md` for changes and planned enforcement.
- Never self-approve an ADR or treat an edited approval field as human consent.
- Do not silently change stack, provider, auth, schema, palette, scope, cost
  or security boundary. Propose tradeoffs/migration/rollback/tests and obtain
  owner acceptance before implementing a departure.
- Resolve conflicting accepted documents explicitly.

## Implementation after acceptance

Use accepted versions, not tool defaults. Keep runtime/package-manager pins
and the lockfile consistent. Validate runtime data, authorise each private
operation, protect server/client boundaries and test database policies directly.
Never execute database content as MDX/JavaScript or expose credentials.
Follow design/angular-isolation.md before any install. Start from public Angular
CLI, use clean task-local npm configuration, and never copy company source,
assets, .npmrc, lockfiles, node_modules, secrets or Artifactory dependencies.

Use semantic design tokens and reviewed primitives. Preserve navy default,
teal alternative and saved preference. Keep professional claims public-safe;
never commit the local Keylane context or private work/source records.

Build coherent changes and run checks appropriate to their behaviour. Keep
modules below 500 lines. Do not disable checks or update baselines merely to
hide failures. Report planned safeguards separately from active enforcement.

Static edits use `docs/partials/`, `npm run build:static` and
`npm run check:static`; do not hand-edit generated HTML. Future dynamic
rules do not require rewriting approved legacy CSS.

## Operations

Use isolated local/test data. Never reset/delete a non-disposable database
without a verified backup and explicit authorisation. Production, billing,
DNS and publication require the owner's applicable scope. Keep backups,
draft content, credentials and company information outside public artifacts.

Read tool output before dependent actions; use equivalent available tools
rather than inventing harness-specific APIs. Do not delegate unless asked.
Use `codex/` branches unless the owner specifies otherwise. Do not infer
continued commit/push/cutover authority from an earlier completed push.
The named Git protocol applies only when invoked; see
[docs/git-workflow-protocol.md](docs/git-workflow-protocol.md).
