# Static maintenance — 18 October 2026

Current authority: [ADR 015](decisions.md). The owner approved the target
proposal to clarify static scope, pin supported tooling and collect local
verification evidence. Coverage: ST03/ST01 and bounded ST02 from assessment
revision 2/schema 2/methodology 4/package 1. ST04 remote delivery/recovery is
outside this slice; actual hosting, deployed revision and remote protections
remain unverified. No commit, push, publication or account changes are included.

## Outcome and preservation

Keep template/partials → Node assembly → four generated HTML files, local
CSS/assets, repository content ownership, mailto and optional browser
enhancement. Preserve canonical/alias/fragment links, Navy default/Teal saved
preference, native disclosures, mobile navigation/focus and useful reading
without JavaScript. Public-safe claims/private-source exclusions remain.
No content, style, browser-script or dormant Next changes are planned.

Angular/blog/CMS/private-editor/services are deferred without permanent
cancellation or a restart date. Earlier dynamic ADRs and their unresolved
provider/session/release/schema/recovery mechanisms remain history and
re-entry requirements; they do not block this static workflow. Its dynamic
implementation gate remains closed. A new explicit owner request and current
affected evidence are required to reopen it.

## Supported tooling and proportional plan

Baseline: Node **24.22.0**, npm **11.19.1** bundled in its official archive.
[Node release schedule](https://nodejs.org/en/about/previous-releases) and
[24.22.0 release](https://nodejs.org/en/blog/release/v24.22.0), checked
18 October, identify the maintained LTS line and release. The Windows x64
archive SHA-256 matched its official SHASUMS256 entry:
`F9683A19877E12A9B167305C8DB71040D812876359DE21F0D2E97C3F321F80C3`.
It was extracted outside the repository into task-local temporary storage;
global Node/npm and company configuration were not changed.

`.node-version` pins the exact baseline. Manifest and lockfile engines allow
`>=24.22.0 <25`; `packageManager` and npm engines record 11.19.1. There are no
external dependencies. Pins/ranges document the workflow; they do not enforce
local version switching, CI or remote merge/publication rules. Review later
patches with updated pins and fresh check evidence rather than freezing
maintenance forever or adopting a new major automatically.

Select the pinned runtime using a preferred version manager or verified
official archive. On Windows, prepend its extracted directory to PATH for
that shell, then confirm `node --version` and `npm.cmd --version`. No install
is required. Do not inherit/copy company npm configuration or credentials.

1. Reconcile entry points/bridges and add current-scope metadata while retaining
   historical dynamic acceptance fields and closed gate.
2. Align runtime/npm metadata and run `npm run check:static` before rebuilding,
   then `npm run build:static` and `npm run check:static`. Inspect generated diff.
3. Copy only static inputs/outputs/scripts/tests/manifests to disposable local
   storage, introduce output drift there, require check failure, rebuild and
   require success. Do not corrupt the real working output to test detection.
4. Run `npm run preview:static` on loopback for bounded browser review:
   palettes/preference, aliases/fragments, disclosures, mobile menu/Escape
   focus, mailto and useful no-JavaScript reading. Stop the task's server after
   review. Browser results do not establish all-browser accessibility conformance.

## Verification record

Read-only recon confirmed clean HEAD `86775c0dacb192b2470bb9b1c8a30d99d9582663`
on `codex/design-assessment-baseline`, matching all 87 recorded target hashes.
All 26 hashed exported package members matched, within the 27-member package
approved under assessment-odogwudozilla-007. Historical draft labels in companion
records are explained by its approved provenance, not new implementation consent.
Installed global tools observed before this slice: Node 24.19.0/npm 11.17.0.

Executed on the isolated Node 24.22.0/npm 11.19.1 baseline:

| Check | Observed result |
| --- | --- |
| Existing `check:static`, before build | Generated HTML current; all ten tests passed. |
| Existing `build:static`, then `check:static` | Build passed; all ten tests passed. No generated HTML diff against baseline. |
| Disposable generated-output drift | Appending a comment to copied index.html caused exit 1 with `index.html is stale`. Rebuilding the copy restored a passing ten-test check. |
| Local browser, default desktop and 390px mobile | Navy/Teal switch and Teal persistence after reload worked. Saved Navy applied on original.html. Canonical remained the public domain. |
| Navigation/disclosures/contact | Mobile menu expanded; Escape closed it and returned focus to the trigger. Work fragment navigation succeeded. A native summary opened by click and closed with Enter. Mailto href remained intact; no message was sent. |
| Legacy aliases | keylane.html#experience and index-modular.html#contact loaded expected content and links. |
| Script-free disposable artifact | On separate loopback port 4174, four copied outputs had script tags removed only in the fixture. Browser observed zero scripts/no menu enhancement; visible mobile navigation, hero, working Work fragment, native disclosure and mailto remained. Teal original.html retained its default palette. |
| Layout sample | Desktop 1280px and mobile 390px screenshots reviewed; no horizontal overflow. Script-free 320px/390px checks also found no horizontal overflow. |
| Browser logs | No warning/error entries captured for the reviewed live tab. |

Browser review used the in-app browser through the computer-use skill. Its
exposed controls did not provide a JavaScript-disable switch; the script-free
fixture provides bounded no-script evidence, not a claim that the exact
production response was tested with browser JavaScript disabled. Full browser
coverage, blocked-storage simulation, contrast/accessibility conformance,
external link availability and production headers were not verified.

Screenshots were saved outside the repository, not added to public artifacts.
Local preview processes were stopped after review. No production/recovery-complete
claim follows from local success. F6/ST01 and ST03 have local implementation
evidence; F7/ST02 retain manual/remote-enforcement limits and bounded browser
coverage. ST04 delivery/recovery remains open.

## Failure and recovery

On runtime/check failure, pause adoption and retain the reviewed baseline.
Review the changed-file diff, then restore only this slice's affected files
from baseline 86775c0 and remove only its newly introduced files if rollback
is needed. Preserve unrelated local work. Source/assets/generated HTML belong
together; a failed check is not permission to suppress checks or edit baselines.
No automatic production restore or deployment is part of recovery here.
