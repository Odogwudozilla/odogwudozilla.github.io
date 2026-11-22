# Defined panels palette review — 22 November 2026

Owner acceptance: ADR 017. Both Navy and Teal use the approved Defined panels
sample. Layout, typography, spacing and component geometry are unchanged.

Local implementation is complete; not committed, merged or published.
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

Rollback: restore the affected CSS/theme metadata sources from the baseline and
run the static generator. Preserve unrelated files and user drafts. Release and
live-byte verification remain the next steps under applicable owner authority.
