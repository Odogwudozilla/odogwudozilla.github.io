# Static site structure

The site is modular at build time. Visitors receive complete HTML rather
than waiting for JavaScript to fetch each section.

## Content source

`static/site-template.html` provides the page shell, main landmark, footer,
and section order. Each `{{name}}` slot maps to `docs/partials/name.html`.

The current order is head, navigation, hero, work, Engineering Lab, experience,
about/education, and contact. Skills are evidenced in the project overview;
the former `skills` fragment is an alias at Work & Projects. Stable IDs preserve links:
`home`, `portfolio`, `experience`, `skills`, `about`, `education`, `contact`.

`docs/partials/portfolio-section.html` owns the concise homepage cards and
shared engineering toolkit. `docs/partials/project-case-studies.html` owns
the full reviewed narratives, images and project links used by the four
dedicated case-study pages. `scripts/case-studies.mjs` generates those pages
with the shared head, navigation and footer. Keep detail in that narrative
partial; shortening a homepage card must not discard the full case study.

Run `npm run build:static` after changing a partial or template. The build
fails on missing/empty partials and unresolved placeholders. It writes
`docs/index.html`, the older `docs/index-modular.html` entry point, and
`docs/keylane.html`, a compatible URL for the selected navy-and-orange design.
`docs/original.html` preserves the cream-and-teal comparison.
Commit those outputs with their source. There is no production build server
requirement and no need to install packages for the static workflow.

## Styles

- `base.css`: colour/spacing/type tokens, reset, global typography, skip link.
- `navigation.css`: sticky masthead and navigation presentation.
- `components.css`: shared card/action/chip/disclosure styles.
- `sections.css`: personal introduction, experience, skills, about, and contact sections.
- `portfolio.css`: selected repositories, project imagery, and work layouts.
- `responsive.css`: tablet/phone rules, reduced motion, and print.
- `keylane-theme.css`: navy/orange palette, loaded on all entry points for switching.

The styles are linked locally. Existing SCSS and `styles.css` files are
historical references and are not loaded by the generated site.

## Progressive enhancement

`docs/js/theme.js` runs in the head to apply a saved Navy/Teal preference
before rendering. It then enables the header's labelled button group,
updates pressed states and the browser theme colour, and remembers choices
in local storage. Storage failures allow switching for the current page.
Without JavaScript, the default page retains navy and the controls stay hidden.

`docs/js/scripts.js` runs with `defer`, after the HTML exists. It enhances
the mobile menu, active navigation, and email copying. Unenhanced navigation
remains visible on mobile. Project and career details use native `details`/`summary`
elements. No article or contact method requires a script to render.

The menu supports Escape, outside clicks, and closing after selecting a
link. Copy email is only offered when the Clipboard API exists; failures
are announced inline while the normal email link remains available.

## Validation

```sh
npm run build:static
npm run check:static
npm run preview:static
```

`check:static` verifies generated files are current and runs structural
checks against the actual published page: one h1, unique IDs, resolving
anchors, existing local assets, native disclosures, and matching legacy
output. The checks run in one Node process for restricted Windows hosts.

Browser QA should include desktop, tablet, 390px and 320px phone widths,
menu open/close, keyboard focus, all disclosures, and clipboard feedback.
Check that content and navigation remain usable without JavaScript.
