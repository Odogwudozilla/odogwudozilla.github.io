# Defined panels palette review — 22 November 2026

Owner acceptance: ADR 017. Both Navy and Teal use the approved Defined panels
sample. Layout, typography, spacing and component geometry are unchanged.

Implemented, merged and verified live on 22 November 2026.
Release: `04332161946db50f19027f9ed24a0d7f88b5a742`,
[PR 67](https://github.com/Odogwudozilla/odogwudozilla.github.io/pull/67).
Baseline: `2417c53` (PR 66). Shared CSS tokens, theme chooser swatches and
browser theme metadata agree; generated HTML carries fresh asset versions.

## Verification

- Node 24.22.0 and npm 11.19.1; no packages installed.
- `npm run build:static` passed; `npm run check:static` passed all 78 tests.
  The sandbox initially blocked the 404 test's child process; rerunning with
  child-process permission passed without changing or suppressing the test.
- Contrast checks cover body/link text on the three light surfaces, filled
  controls, footer text and focus colours. New checks require control borders
  to exceed 3:1 against paper, surface and section-soft in both palettes.
- Local browser: both desktop palettes visually reviewed; Teal survived reload.
  Computed hero/page colours match the approved sample. Theme switching through
  the mobile menu worked. No horizontal overflow at 390px (both themes) or
  320px (Navy). Temporary viewport and local server were cleaned up.
- This is bounded local verification, not a full WCAG or cross-browser audit.

## Release verification

- Required static verification passed on the release head:
  [run 44969183811](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/44969183811).
  The PR also passed the secret check before merging.
- GitHub Pages successfully deployed release `0433216`:
  [run 44969254988](https://github.com/Odogwudozilla/odogwudozilla.github.io/actions/runs/44969254988).
- Read-only HTTPS comparisons found matching content (normalising CRLF to LF)
  for all nine generated HTML entry points, base.css, keylane-theme.css,
  navigation.css and theme.js at odogwudozilla.com.
- Live browser confirmed both approved page/panel colour pairs, Teal persistence
  after reload and no horizontal overflow at 390px. No warning/error console
  entries were captured in that bounded review. Existing layout is retained.

Rollback: restore the affected CSS/theme metadata sources from the baseline and
run the static generator. Preserve unrelated files and user drafts. Any rollback
requires the applicable release authority and the normal required PR checks.
