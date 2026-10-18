# Static delivery audit and recovery rehearsal

Verified on 18 October 2026. Scope: ST04, retaining the static product under
[ADR 015](decisions.md). The owner approved a read-only delivery audit, then
explicitly approved a local rehearsal: export deployed commit 56a0f51 into
temporary storage, rebuild/check/preview with the pinned runtime, compare
files with production and record this procedure. Production was only read;
no settings, deployment, DNS, publication, commit or push action was performed.

## Delivery evidence

| Observation | Evidence and consequence |
| --- | --- |
| Publishing source | Authenticated [Pages settings](https://github.com/Odogwudozilla/odogwudozilla.github.io/settings/pages) showed **Deploy from a branch**, `master`, `/docs`. This is no longer inferred solely from README/CNAME. |
| Domain and transport | Settings showed `odogwudozilla.com` and Enforce HTTPS checked. Public HTTP and the default github.io URL redirected to HTTPS on the custom domain. The settings DNS banner said check in progress; no full DNS/registrar audit was performed. |
| Observed deployed revision | `56a0f510561f9740addc3319d25319cada58cfd8`, successful [Pages run 38800315678](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/38800315678), deployment 7103272949. Success recorded 15 October at 20:14:49 UTC / 22:14:49 Amsterdam. Latest run identity was rechecked during rehearsal. |
| Current maintenance branch | The target checkout was clean at `b91dd38b6f9747a35d6c6d4251e2fc094f7448ea`, `codex/design-assessment-baseline`. Its context/tooling commits were not deployed. Active public source/scripts/output had no changes from 56a0f51; historical planning annotations under docs differed. |
| Actual deployment automation | GitHub-managed `dynamic/pages/pages-build-deployment` exists despite zero tracked workflow files. Observed jobs checked out/uploaded/deployed files; no `check:static` execution appeared in their step lists. Pages success is not evidence of the repository's structural checks. |
| Merge/publication assurance | Public branch metadata reported `master` unprotected, required checks off and no repository rulesets. No protection was enabled by this work. Manual verification remains the known prepublication process. |
| Retained deployment artifact | Latest run's artifacts API reported zero retained artifacts. Do not assume a downloadable Pages artifact exists as a backup. |
| Public response sample | Root and aliases returned 200; a deliberately nonexistent path returned 404. Root response identified GitHub.com, `Cache-Control: max-age=600`, and Last-Modified 15 October. CSP/HSTS headers were absent in that sample; no header policy change or general security certification follows. |

## Reconstructed artifact and checks

Source identity is the full deployed commit above, not a floating branch name.
Only tracked `docs/`, `static/`, `scripts/`, `tests/`, package.json and
package-lock.json were exported. This avoids private local drafts/configuration,
credentials, ignored files and dormant Next dependencies. No package install
was required. Node 24.22.0/npm 11.19.1 came from the previously checksum-verified
isolated official runtime; the older deployed manifest itself did not pin them.

The successful export used a one-command `core.autocrlf=false` override.
Its source ZIP SHA-256 was
`D700E8EDBB8CF1A815E703D7AF7A579C204568F443943B126920F0A3B21B456F`.
Temporary artifacts/manifests/screenshots are local rehearsal evidence, not
a durable backup or files intended for publication.

Before rebuilding, SHA-256/size/path records were collected for all **49 docs
files**, totalling **3,783,830 bytes**. The four generated HTML files were moved
to a separate baseline directory. Running the existing build therefore had
to recreate them from template/partials. The build and all **ten structural
tests passed**. The rebuilt docs inventory remained 49 files, with **zero
hash differences** from the controlled source export.

All **16 required public files** were then fetched read-only from the custom
domain and compared in memory with the recovered artifact: four HTML entry
points, favicon.svg, seven loaded CSS files, two JS files and the profile/club
preview PNGs. Every response was 200 and every SHA-256 matched. The reference
walk included local href/src and CSS URL references; no CSS imports, srcset
or external script sources were found in the checked active files. This does
not assert that every historical or unused file under docs was fetched live.

| Recreated output | Bytes | SHA-256 |
| --- | --- | --- |
| index.html | 23,300 | `9461F839A98960EA99AEB00353E2F4C12D163FCBD6264522B584615F2D2A239C` |
| index-modular.html | 23,300 | Same as index.html |
| keylane.html | 23,300 | Same as index.html |
| original.html | 23,341 | `6B234D3F131D9E154CF0A4F61D5BEBD06BD2CDF940E8158C8CEFE1F314ACE463` |

### Line-ending finding

The first export used the local Git defaults and produced CRLF text. The
rebuilt Navy files matched that export, but original.html differed by one CR
byte because the builder inserts an LF-only line into the comparison page.
All four were text-equivalent after CRLF-to-LF normalisation, yet none matched
the production LF hashes. A passing structural suite alone did not reveal this.

Repeating the export with `git -c core.autocrlf=false archive` produced LF
inputs and exact rebuilt/exported/live matches. No repository/global Git setting,
source code, baseline or check was changed to hide the first discrepancy.
Use the explicit export setting for byte comparisons; do not silently
normalise a mismatched production response and call it byte-identical.

### Local browser evidence

The reconstructed artifact was served only on `127.0.0.1:4175` using its
existing preview command. Browser observations confirmed canonical domain,
profile image and lazy club preview loading after disclosure expansion,
Navy/Teal switching and saved preference after reload, a native disclosure,
Work fragment navigation, keylane.html#experience, index-modular.html#contact,
original.html with saved preference and intact mailto. No email was sent.
At 390px the menu opened, Escape closed it and returned focus to the trigger;
no horizontal overflow was observed. The temporary viewport was reset and
the preview process stopped afterward.

This was a bounded local review through the computer-use skill, not full
accessibility/contrast, all-browser or production-interaction verification.
The earlier script-free review is retained in [static maintenance](static-maintenance.md);
it was not rerun or relabelled as a JavaScript-disabled browser test here.

## Repeatable local procedure

First recheck the actual successful deployment SHA and current owner
withdrawals/privacy constraints. This dated SHA is an example verified
baseline, not a permanent instruction to roll back future content. Use
separate approval for any new target execution or operation outside current
scope; production restore/publication always needs applicable owner authority.

From a repository containing the verified commit, with the pinned runtime
selected for this shell, create a new disposable directory and export:

```powershell
$deployedCommit = '56a0f510561f9740addc3319d25319cada58cfd8'
$recoveryPath = Join-Path $env:TEMP ('odogwudozilla-recovery-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $recoveryPath -ErrorAction Stop | Out-Null
$archivePath = Join-Path $recoveryPath 'source.zip'
git -c core.autocrlf=false archive --format=zip --output=$archivePath $deployedCommit docs static scripts tests package.json package-lock.json
if ($LASTEXITCODE -ne 0) { throw 'Archive failed; stop recovery' }
Expand-Archive -LiteralPath $archivePath -DestinationPath (Join-Path $recoveryPath 'tree') -ErrorAction Stop
```

Then, only in the extracted tree:

1. Inventory all docs file paths/sizes/SHA-256; retain CNAME, .nojekyll,
   source partials/template, scripts, tests, local CSS and required media.
2. Preserve the four generated files outside docs so a build must recreate
   them. Verify resolved paths are inside this disposable recovery directory
   before moving anything. Do not move/delete the real checkout or live site.
3. Run `npm.cmd run build:static`, then `npm.cmd run check:static`; stop on
   either failure. Require the complete rebuilt docs inventory to match its
   original file count and hashes, with no extra or missing files.
4. Compare required output/assets against the intended reviewed reference.
   Live HTTP comparisons establish what is currently served, not permission
   to publish older withdrawn content. Pause on a changed deployment identity
   or an unexplained mismatch.
5. Set `PORT` to an unused local port, run `npm.cmd run preview:static`, and
   review aliases/fragments/canonical, images, palettes, disclosures, mobile
   menu/focus and mailto. Stop only the task's server afterward.
6. Keep the working site unchanged. Prepare the reviewed artifact and proposed
   publication action for a separate owner decision if a real restore is needed.

## Ownership and remaining limits

The owner controls repository access, domain/registrar and Pages settings.
Git reconstructs the tested public files while the relevant commit remains
available; it does not restore account access, domain ownership, TLS settings,
Pages source selection, branch rules or provider availability. Record/reverify
those settings separately without exporting credentials. No full DNS/account
loss recovery, off-site backup retention, timed RPO/RTO or production restore
has been demonstrated.

ST04 now has a bounded local reconstruction rehearsal and observed delivery
identity, not a universal recovery guarantee. F7/ST02 prepublication enforcement
remains open: the observed Pages workflow does not run the static checks and
master has no observed required gate. A future assurance change must preserve
this publication path unless explicitly revised and accepted.
