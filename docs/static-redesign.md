# Static portfolio design

Updated on 14 October 2026 following the owner's review of the first version
on desktop and mobile. The static site remains in docs/ with build-time
partials and complete HTML on arrival.

## Current direction

Open with “Software engineering portfolio”, Chidozie Nnachor's name, role,
portrait, and a direct description of his work. Show the person before the
professional and personal project examples.

The previous slogan-led hero, featured-experience tile, rounded bento collage,
decorative diagram and repeated numbered cards are superseded. Use a linear
portfolio with restrained borders, project rows and factual headings instead.
Preserve the chosen navy/orange palette, teal alternative and saved preference.

## Typography and layout

Body text is 16px; introductory paragraphs are 17px on desktop and 16px on
phones. The main heading ranges from 32px to 44px; section headings range
from 24px to 30px. Supporting labels are generally 13–15px rather than
the previous miniature captions. Case-study paragraphs use the same body scale.

Primary cards and portraits use 10px corners; controls use 6px corners.
Shared content grids use a 24px gutter. Section descriptions sit immediately
below their headings instead of being pushed to the opposite edge. No floating
card animation, gradients or rotated mock browser windows are used. The
portrait appears beside the identity on phones, keeping it near the top.
Its location caption remains visible on phones rather than being hidden by
the responsive stylesheet. Skills use one column through 600px to avoid narrow
text columns on larger phones; tablet and desktop layouts retain two columns.
Project previews show a title, short description and native expansion control.
All four start folded, at about 210px high on desktop, following the owner's
compact Keylane reference. Content wraps naturally on phones. Images, status,
technology lists, detailed explanations and project links appear only after
expansion. Expanded project content uses image/text columns on desktop and
stacks on phones.

Sections share the same background and content alignment. Space and full-width
dividing rules mark their boundaries. Every page section has a 4px top rule,
orange in the navy palette and dark olive (#526b26) in the teal palette. Section separation does not depend on
different background colours.

Technology lists are plain text separated by dots, with no background, border,
rounded container or hover treatment. The Keylane list keeps 28px of space
before its engineering headings.

## Page structure

- Introduction: portfolio label, name, role, photograph, work/contact links,
  professional profiles and concise role/background facts.
- Work: concise cards for Personal Product Watch, Keylane, Fusion Almere FC and
  HomeWizard Energy Intelligence, in that order. Dedicated case studies retain the detail.
- Experience: dates, employers and short role summaries remain visible;
  each responsibility list has a separate native disclosure, closed initially.
- Skills: evidenced within Work & Projects, with a shared toolkit note; no separate section.
- About: banking-to-software background and education, without a second portrait.
- Contact: email/social links and progressive clipboard support.

Project status and source visibility remain explicit. The public club test
site supplies its screenshot. The energy project shows its collection workflow
instead of a chart with invented readings. Company contributions remain
public-safe and general, without a privacy disclaimer in the visitor-facing copy.

Copy describes the actual work: APIs, compatibility, defect investigation,
registration, local storage, and criteria-driven product monitoring. Remove stock case-study labels,
repeated summaries and drafting commentary. Keep development status, dates and
source availability because these help a reader assess each project.

## Interaction and accessibility

Hover and keyboard focus use the same clear action styling: navy or teal
background with light text on disclosures and work navigation.
Buttons, menu controls, palette controls and email copying share that treatment.
All underlined links, including internal links, keep their text colour and
background on hover and keyboard focus. Only their underline takes the section
accent: orange in navy, or dark olive in teal. Buttons and disclosure controls
keep their navy/teal treatment. The pale lime used for selection highlighting
does not supply section rules or link underlines.
Project articles have no hover animation; their expansion controls are interactive.

Preserve one h1, heading hierarchy, a skip link, visible focus, reduced motion,
44px or larger principal controls, native details/summary, and readable
content without JavaScript. Mobile navigation supports Escape with focus
return and closes after selection. Email copying has honest failure feedback.
The email address and footer home link also provide at least 44px of tap height.

## Build and dependencies

Edit docs/partials/ and docs/css/, then run npm run build:static and
npm run check:static. Commit generated entry points with their sources.
All entry points share content; navy is the default and original.html
starts in teal if no saved preference exists.

The active package manifest is now dependency-free. Unused Next.js tooling
was removed to eliminate the reported vulnerabilities; scaffold source is
retained as a dormant reference. This does not start the Angular migration.
See [dependency cleanup](dependency-cleanup.md).

## Verification

The generated output and ten published-page checks pass. The revised layout
was reviewed at 1280px, 768px, 390px and 320px, with no horizontal overflow.
Mobile menu/Escape focus return, native disclosure, strong action contrast
and saved palette switching were checked in the browser. Final checks also
cover console errors and unenhanced reading/navigation.

The follow-up mobile audit checked 320px, 390px, 430px, 600px and 768px. The
location caption is visible at every width, no non-disclosure body text is
hidden, and visible links and controls have at least 44px of height on phones.
The mobile menu closes after selection, Escape returns focus to its control,
and expanded club and energy projects remain within the viewport.

The static revision is available for owner review. This records requested
changes and observed checks, not automatic acceptance of the whole dynamic design.
