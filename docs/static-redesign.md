# Static portfolio redesign

## Scope and direction

Refresh the GitHub Pages site in `docs/`. The Next.js application remains
a separate migration scaffold. Use an original editorial bento layout:
strong type, an illustrative systems diagram, and purposeful cards. The
selected palette is navy and orange, with pale blue and white surfaces.
The earlier warm-paper and dark-teal design remains as a comparison.

Make mature Java systems, API modernisation, and insurance experience the
central story. The author's supplied professional context confirms a
current Senior Software Engineer role at Keylane. Retain supported dates
and avoid unverified metrics, private company details, and completed
features that only exist in a roadmap.

## Architecture decision

| Approach | Benefit | Tradeoff |
| --- | --- | --- |
| Hand-maintained single HTML file | No build or runtime dependencies | Repeated markup becomes harder to edit |
| Build-time HTML partials (chosen) | Modular source; complete HTML on arrival | Run a small Node build after content edits |
| Complete Next.js migration | React components and future application features | Larger scope and new deployment requirements |

Keep the existing HTML partials as the content source. A dependency-free
Node script assembles them with a page template into `docs/index.html`.
The old `index-modular.html` URL receives the same generated page.
Commit generated HTML so GitHub Pages can serve the existing folder.
CSS files own tokens/base, navigation, components, sections, project cards,
and responsive rules respectively. JavaScript only enhances the mobile menu, active
navigation, and email copying. No content depends on JavaScript.

## Page and interaction contracts

- Header: name/home link, Work, Experience, About, Contact; a mobile menu
  enhanced with a button only when JavaScript runs.
- Hero: short introduction, Work and Contact links, featured enterprise
  project, a clearly labelled conceptual workflow.
- Work: Keylane engineering themes lead, followed by Fusion Almere FC,
  HomeWizard Energy Intelligence, and Advent of Code. Native `details`
  reveal further context without scripts.
- Experience: dated roles and concrete responsibilities.
- Capabilities: categories and context instead of numerical self-ratings.
- About: banking-to-engineering background, portrait, compact education.
- Contact: readable email and real email/social links. No placeholder CV.

## Accessibility and failure behaviour

Use one h1, sequential headings, a skip link, visible focus, sufficiently
contrasting colours, meaningful link labels, and generous touch targets.
Provide reduced-motion styles and preserve readable content without JS.
Mobile navigation supports Escape, outside click, and closing after a link
selection. Clipboard failure leaves the selectable address and mail link
available and reports the failure inline. Native case-study disclosures
support keyboard interaction and do not require a modal or focus trap.

## Verification and delivery

1. Establish the template and complete head/navigation source.
2. Implement and inspect each content partial in page order.
3. Add the visual system and progressive enhancements.
4. Generate the static entry points; verify idempotence and local links.
5. Inspect desktop, tablet, and narrow phone layouts in the browser.
6. Verify menu, disclosures, anchors, keyboard focus, and console output.
7. Confirm the page remains complete when JavaScript is disabled.

Keep visuals in CSS/SVG and use the existing portrait. No external fonts,
icon scripts, or animation libraries are needed. Preserve existing assets
and the migration source so the redesign is reversible through Git.

## References

- [Bento hierarchy](https://miaai-lab.github.io/Claude-Opus-5.5-100-HTML-Files/068-bento-portfolio.html)
- [Swiss typography/grid](https://miaai-lab.github.io/Claude-Opus-5.5-100-HTML-Files/003-swiss-poster-machine.html)
- [Native disclosures](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Verification completed

- Generated HTML and all nine published-page checks pass.
- Reviewed 1280px desktop, 900px intermediate, 768px tablet, and 390px/320px
  phone layouts. No horizontal overflow was observed.
- Verified native project disclosures, menu selection, Escape focus return,
  active navigation, skip-link focus, and successful clipboard feedback.
- Loaded a temporary page with all script tags removed: content, navigation,
  and native disclosures remained usable. The fixture was removed afterward.
- Browser console showed no warnings or errors during the checks.
- Body text and secondary text tokens were checked for contrast. No full
  Lighthouse audit or external social-profile validation was performed.
- The professional-content refresh was inspected at 1280px, 768px, and
  320px, including keyboard disclosure and mobile menu behaviour.
  The local drafting context is excluded from version control and publishing.

## Selected navy-and-orange version

The default page uses `css/keylane-theme.css` over the shared layout. Its palette
was sampled from [Keylane's public homepage](https://keylane.com/) on
13 October 2026: navy, dark blue, orange, pale blue, and near-white.
It uses the portfolio's own assets and identity. The user selected this design
as the default. `keylane.html` and `index-modular.html` also serve it;
`original.html` preserves the cream-and-teal version for comparison.

The header includes Navy/Teal buttons with accessible pressed states and
44px touch targets. A small local head script restores saved colour choices
before rendering; navy remains the default for new visitors. The control
works without storage, and saved choices apply across all entry points.

The variant was reviewed at 1280px, 768px, and 320px, with no horizontal
overflow or browser warnings/errors observed. Navigation and native
disclosures work. Principal text and button colour pairs exceed 4.5:1
contrast. No full accessibility audit was performed.
