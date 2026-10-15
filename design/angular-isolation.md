# Angular independence contract

Status: The owner chose Angular and independence from company infrastructure
on 13 October 2026. These safeguards are proposed implementation requirements.
No Angular application or packages have been installed.

Use public Angular concepts to build an original portfolio application.
The reference may inform familiarity with Angular, but must not supply
source, business models, internal names, assets, components, build scripts,
configuration or credentials. Public documentation governs compatibility.

Start with a fresh public Angular CLI workspace. Do not copy a company
workspace, .npmrc, lockfile, node_modules, Nx configuration or environment file.
No company Artifactory dependency or private package scope is permitted.

## Installation isolation

Review effective registry/proxy settings without printing authentication values.
A registry command flag alone does not remove scoped registries or credentials.
Use task-local clean npm user/global configuration, an isolated cache and a
sanitised environment without inherited company registry/auth settings.
Do not modify the user's global configuration to achieve isolation.

Initially permit downloads only from https://registry.npmjs.org/.
Select exact compatible versions and approved dependencies. Reject private
packages, git/URL/file dependencies, external local workspace links and
lockfile origins outside the public registry. Exceptions require an accepted
dependency decision first. CI npm ci uses the same clean configuration.
Review lifecycle scripts for newly introduced dependencies.

## Planned verification

- Manifest and lockfile checks for approved packages and registry origins.
- Import checks rejecting external local references and server imports in UI.
- Source/build scans for secrets, internal hosts and private package references.
- Clean reproducible build with company services and credentials absent.
- Human provenance review; a string scan cannot establish code ownership.

If isolation fails, stop installation and explain the concrete blocker.
Do not copy files or weaken checks to make the build pass. Private company
inventory/code and account identifiers do not belong in public design files.
