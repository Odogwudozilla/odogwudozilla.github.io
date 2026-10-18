# Static pull-request verification

Status, 18 October 2026: **local validation and first GitHub PR run passed;
required merge gate inactive**.
The owner explicitly approved preparing the proposed workflow and local
passing/failing validation, then explicitly said “proceed” to commit/push and
a real PR trial. [Draft PR #7](https://github.com/Odogwudozilla/odogwudozilla.github.io/pull/7)
contains the implementation and existing recovery documentation. Merge and
required-check activation remain separate owner decisions.
This work covers the bounded static assurance portion of F7/ST02 under ADR 015;
it does not implement the deferred dynamic governance suite.

## Behaviour and boundary

[static-check.yml](../.github/workflows/static-check.yml) defines the uniquely
named `static-verification` job for every pull request targeting `master`.
There are no path filters or job-level conditions that could silently skip a
required check for documentation, workflow or other changes. The default
checkout tests the proposed merge, rather than separately testing an outdated
head against a different base. New pushes to the same PR cancel obsolete runs.
The job uses GitHub-hosted `ubuntu-24.04` with a five-minute timeout.

Node is selected from `.node-version`, then its actual version is checked
against that file; bundled npm must be 11.19.1. The existing `npm run check:static`
runs directly, with no install or preceding build. That order preserves stale
committed HTML as a failure instead of repairing it in CI. The dependency-free
static scripts and test declarations are unchanged. Pages still publishes
`master` → `/docs` through its existing managed workflow.

Security scope: `contents: read`, no supplied secrets, no deploy permissions,
no persisted checkout credentials, no dependency cache and no privileged
`pull_request_target`/`workflow_run` trigger. Automatic setup-node npm caching
is explicitly disabled because package.json declares a package manager.
Untrusted PR code still executes on a disposable hosted runner, so keep
production credentials and privileged follow-on execution out of this job.

## Reviewed action pins

Exact release tags were resolved to commit objects through the official action
repositories on 18 October. The pinned action.yml files and relevant README
requirements were inspected; both actions use the Node 24 action runtime.
The hosted runner must support that runtime. Action runtime and selected
project Node version are separate concerns.

| Action | Reviewed release | Pinned commit |
| --- | --- | --- |
| [checkout](https://github.com/actions/checkout/releases/tag/v7.0.1) | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [setup-node](https://github.com/actions/setup-node/releases/tag/v7.1.0) | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |

Pin updates need reviewed provenance and fresh validation. Full-SHA pinning
avoids floating tags; it does not establish universal action safety.

## Actual local validation

- Standalone actionlint **1.7.12** validated the workflow without findings.
  Its official Windows archive checksum matched the published checksum:
  `6E7241B51E6817EA6A047693D8E6FED13B31819C9A0DD6C5A726E1592D22F6E9`.
  The tool was extracted into temporary storage, not added as a project
  dependency. ShellCheck/Pyflakes integrations were unavailable and explicitly
  disabled; this is not a claim those external tools ran.
- Git Bash parsed the workflow's extracted version-check shell block plus
  the exact `npm run check:static` command successfully. The sandbox initially
  prevented Bash from creating its signal pipe; the approved validation
  succeeded after an execution-permission escalation. This was an environment
  limitation, not a workflow syntax failure.
- An LF export of committed source at b91dd38 was extracted into a disposable
  directory. With isolated Node **24.22.0**/npm **11.19.1**, the shell version
  assertions and all **ten static tests passed** without rebuilding first.
- Appending a comment to only the copied index.html made the same commands
  exit **1** with `index.html is stale`. Rebuilding that copy restored a pass.
  The real generated files were not modified to perform this failure test.

These local results validate workflow structure and relevant commands;
remote evidence is recorded separately below.

## Actual GitHub trial

The `pull_request` event on draft PR #7 ran **static-verification** successfully
on GitHub-hosted `ubuntu-24.04`: [run 39130170166](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/39130170166),
[job 117683541497](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/39130170166/job/117683541497).
The observed head was `d56996c362cd22589459e420f837cfc03f9f8f0c`. Checkout,
setup-node, Node/npm version assertions and the existing static-check step all
completed successfully. This establishes a real passing event/action/runner
path, not merely a local shell simulation.

At that observation master remained 56a0f51 and unprotected; the PR was draft
and unmerged. A remote stale-output failure and protected-branch blocking
have not been demonstrated. Local stale-output rejection remains local
evidence. No required check is claimed active. This run records evidence for
its exact head; subsequent heads need their own passing result.

## Activation proposal and limits

The first real passing PR check is now observed. Before activation, demonstrate
stale output fails remotely and
the corrected output passes without merging the failing change. Then obtain
the applicable approval for a `master` rule requiring PRs, this check from
GitHub Actions and an up-to-date base, including administrator enforcement.
Keep force pushes/deletion disabled. Do not add an impossible second-person
approval requirement for the sole maintainer or require the currently broken
local signing setup. Verify the rule's actual blocking behaviour; its existence
alone is not evidence of enforcement.

The check and protected-branch rule are both needed before claiming checks
gate normal publication. A push-time check could race branch-based Pages;
this workflow therefore targets pre-merge verification. Owners/admins can
change repository rules, and a PR can edit this workflow or its checker code.
Owner review of those changes remains necessary: this is not an immutable,
independent policy enforcer or the future dynamic trusted-checker system.
If a required check is renamed/deleted, review the rule together so it cannot
quietly become irrelevant or leave all PRs permanently blocked.

Rollback before activation is a reviewed revert of only this slice's workflow
and documentation changes, preserving recovery work. After any later activation,
coordinate the required-check rule and workflow under explicit owner authority;
never silently disable a gate to make a failing change merge. No automatic
publication, infrastructure migration or paid service is introduced here.
