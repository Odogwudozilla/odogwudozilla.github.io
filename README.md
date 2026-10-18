# Chidozie Nnachor — Software Engineer Portfolio

A personal software engineering portfolio with professional experience,
Java and insurance work, and selected personal projects.

**Website:** [odogwudozilla.com](https://odogwudozilla.com/)

## Run the static site

Use Node.js **24.22.0**, pinned in `.node-version`, with bundled **npm 11.19.1**
as recorded in `package.json`. Select that runtime with your preferred
version manager or an isolated official archive; do not change global tooling
merely to build this project. Confirm `node --version` and `npm --version`.
The static workflow has no package dependencies;
you do not need `npm install` to build, preview, or check this site.
The engines range allows reviewed patches within Node 24; `.node-version`
records the exact verified baseline. These declarations are metadata, not an
automatic runtime installer or an enforced remote publication gate.

```sh
npm run build:static
npm run preview:static
```

Open [the local preview](http://127.0.0.1:4173/). It serves `docs/` on the
loopback interface. Stop it with Ctrl+C. Set `PORT` to use another port.
On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Edit and publish

1. Edit content in `docs/partials/` and styles in `docs/css/`.
2. Run `npm run build:static` to assemble the HTML.
3. Run `npm run check:static` to check generated output, internal links,
   asset references, document structure, and native case disclosures.
4. Preview at desktop and phone widths.
5. Commit the partials, styles, scripts, and generated HTML together.

GitHub Pages can serve the committed `docs/` folder directly. No browser-side
HTML fetching, database, authentication, external font, or icon library is
needed. Content and project disclosures remain usable without JavaScript.

`docs/index-modular.html` is generated from the same source to preserve the
older entry point. Do not edit generated pages directly.

A [static PR workflow](design/static-verification.md) is prepared to run
the same check before merges to `master`. Local validation and the first GitHub
PR run passed; required branch-check activation remains pending. Continue
running the manual checks until remote enforcement is verified.

The selected navy-and-orange design is now [the default preview](http://127.0.0.1:4173/).
It uses colours sampled from [Keylane's public website](https://keylane.com/):
navy `#274263`, dark blue `#253756`, orange `#FF8000`, pale blue `#CBE7EC`,
and near-white `#F4FAFB`, loaded through `docs/css/keylane-theme.css`.
Visitors can choose Navy or Teal in the header; their preference is remembered
in browser storage and applied before the page renders. Navy is the default
for new visitors. Switching still works if storage is unavailable.
The previous `keylane.html` URL serves the selected design too. `original.html`
starts with teal when no saved choice exists; saved preferences apply there too.

## Structure

```text
static/site-template.html       Page shell and partial order
scripts/build-static.mjs        Dependency-free HTML assembly
scripts/serve-static.mjs        Local preview server
tests/static-site.test.mjs      Published-page smoke checks
docs/partials/                 Content source
docs/css/base.css              Tokens, typography, document defaults
docs/css/navigation.css        Header and menu
docs/css/components.css        Cards, buttons, native disclosures
docs/css/sections.css          Section layouts and typography
docs/css/portfolio.css         Curated projects and project-specific visuals
docs/css/responsive.css        Breakpoints, reduced motion, print
docs/css/keylane-theme.css     Selected navy/orange palette overrides
docs/js/scripts.js             Menu, section highlighting, copy email
docs/js/theme.js               Early colour preference and accessible switch
docs/assets/                  Existing media assets
docs/index.html                Generated GitHub Pages entry point
docs/keylane.html              Compatible URL for the selected design
docs/original.html             Generated cream/teal comparison
src/                           Dormant Next.js scaffold; dynamic ambitions deferred
```

The club preview is a screenshot of its public test site. Energy and Java
workflow illustrations contain no household or company data. Professional project descriptions
stay at a high level and omit private source code and unverified metrics.
Career dates are taken from the existing portfolio; update the partials
when new employment information or a real CV is available.

Read [the redesign decisions](docs/static-redesign.md) and
[the static structure guide](docs/modular-structure-guide.md) for details.

## Current direction and deferred design

The owner selected **retain static** on 18 October 2026. Content remains
repository-owned and the existing static site is the primary product.
See [ADR 015](design/decisions.md) and [static maintenance](design/static-maintenance.md)
for the bounded supported-tooling and local verification work. No hosting
migration, CMS, backend, auth or new contact service is part of this scope.

Angular/blog/CMS/private-editor ambitions are deferred without permanent
cancellation or a restart date. A new explicit owner request and current
technical review are required to reopen them. The following records retain
their earlier acceptance evidence; the dynamic implementation gate remains closed.

Angular, company independence and public prerendering are chosen; API/hosting
and dedicated backend capacity remain unresolved in that deferred design. See
[the design review](design/README.md) and [repository instructions](AGENTS.md).
The partially accepted requirements, proposed security contracts and implementation
gates replace the older plans as the review baseline. Technical proposals
still require owner acceptance; no dynamic implementation or cloud cutover
has been authorised by this design review.

The `src/app/` application is a legacy Next.js scaffold, not the Angular target.
Its navigation and homepage are not the static production site.
The Supabase, authentication, blog, newsletter, and payment features in the
older planning documents are proposals, not implemented portfolio features.

The unused Next.js dependencies were removed from the active manifest on
14 October 2026 to resolve dependency alerts. Its source remains as a dormant
reference; it is not runnable through the root scripts. The prior manifest is
recoverable from Git history. Angular implementation still requires acceptance.

Root `dev` builds and previews the static site; `build`, `start`, and `test`
also refer to the static workflow. See [the dependency cleanup](docs/dependency-cleanup.md).
Historical SCSS and compiled Bootstrap files are retained as migration
references; the redesigned static entry points do not load them.

## Professional links

- [LinkedIn](https://www.linkedin.com/in/chidoziennachor/)
- [GitHub](https://github.com/Odogwudozilla)
- [Email](mailto:odogwu.naija@gmail.com)
