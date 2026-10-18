# Static pull-request verification

Status, 18 October 2026: **local and GitHub passing/failing/recovery trials
verified; required merge gate active and failing-head blocking observed**.
The owner explicitly approved preparing the proposed workflow and local
passing/failing validation, then explicitly said “proceed” to commit/push and
a real PR trial. [Draft PR #7](https://github.com/Odogwudozilla/odogwudozilla.github.io/pull/7)
contains the implementation and existing recovery documentation. The owner
subsequently granted continued approval for the static verification, merge-gate
and reviewed release sequence, pausing only when human input is needed.
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
and unmerged. That first run records evidence for its exact head; subsequent
heads need their own passing result.

### Remote failure and recovery

The owner subsequently authorised continuing the static-verification sequence
without repeated approval requests unless input is needed. A harmless comment
was added only to the source template, leaving generated HTML deliberately stale
on draft PR #7. Commit `920175503a3d5eec68fbb92d3ac3210508e042a9`
failed [run 39131052185](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/39131052185).
Checkout/setup and Node/npm assertions passed; the static-check step failed.
The failing change was not merged or deployed.

Commit `11a807dc7a0600d643e5f46436c9619f2d3bdeb8` removed the comment,
restoring the template exactly to its pre-trial source. Corrected
[run 39131220575](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/39131220575)
passed. Generated public HTML was never hand-edited. This establishes actual
remote failure and recovery, not only the earlier local negative case.

The approved master protection was prepared with PRs, strict up-to-date checks,
`static-verification` bound to GitHub Actions, administrator enforcement,
force pushes/deletion disabled, no second-reviewer requirement and no signed
commit requirement. Saving redirected to GitHub's Confirm access/sudo screen.
At that checkpoint public metadata still reported master at 56a0f51 and
unprotected. The owner completed the authentication prompt and GitHub reported
the rule created. No credentials or codes were supplied in chat.

### Active merge-gate verification

The saved rule was read back in GitHub settings and public branch metadata:
master protected, required context `static-verification` bound to GitHub
Actions app ID **15368**, enforcement level **everyone**, PRs and strict
up-to-date checks enabled. Administrator bypass, force pushes and deletion
were not allowed. Required approvals/signatures/linear history/deployment
requirements were not enabled. Classic branch protection is active; this is
not a claim that a repository ruleset was created.

With the rule active, a second harmless source-only probe at
`6e23a6e94045f47dab0273b74c1905431befe2d4` failed
[run 39131457426](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/39131457426).
PR #7 was marked ready for review to remove draft state as a confounder.
GitHub labelled the failing static check **Required** and disabled **Merge
pull request** for the signed-in repository owner. The failing head was not
merged. The source probe was then removed exactly before the reviewed release.
This tests required-check blocking as an administrator, not every possible
API, owner-account compromise or deliberate rule-edit bypass.

Publication/rollback operations are distinct from these tests. The final PR
head must pass its own checks and be reviewed before any merge. The observed
production baseline remains the dated 56a0f51 audit until a later deployment
is independently verified. Retain [recovery](static-recovery.md) as the tested
prior artifact; never publish withdrawn content merely because it is in Git.

## Operating the gate and limits

Remote stale failure, corrected success and active-rule merge blocking are
now observed. Keep the saved `master` rule requiring PRs, this check from
GitHub Actions and an up-to-date base, including administrator enforcement.
Keep force pushes/deletion disabled. Do not add an impossible second-person
approval requirement for the sole maintainer or require the currently broken
local signing setup. Reverify the rule when its configuration or check name
changes; its existence alone is not evidence of enforcement.

The check and saved protected-branch rule together gate normal publication
through this master PR path. A push-time check could race branch-based Pages;
this workflow therefore targets pre-merge verification. Owners/admins can
change repository rules, and a PR can edit this workflow or its checker code.
Owner review of those changes remains necessary: this is not an immutable,
independent policy enforcer or the future dynamic trusted-checker system.
If a required check is renamed/deleted, review the rule together so it cannot
quietly become irrelevant or leave all PRs permanently blocked.

Rollback is a reviewed change preserving recovery work. Coordinate the
required-check rule and workflow under explicit owner authority;
never silently disable a gate to make a failing change merge. No automatic
publication, infrastructure migration or paid service is introduced here.
