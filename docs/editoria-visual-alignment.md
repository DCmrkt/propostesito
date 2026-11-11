# Editoria visual alignment · 11 November 2026

## Problem and context

The user requests that Editoria better match the CSS and style of the existing Non Profit division, using Elephant–Goldfish review plus a creative scrutinator. The reference is https://dcmrkt.github.io/propostesito/sito/non-profit/. The static site is published from this repository. The existing Editoria theme is already a partial alignment; a new design system or hosting migration is unnecessary.

Sources: `docs/editoria-structure.md`, `sito/non-profit/index.html`, `sito/css/site.css`, `fundraising-shared/experience.css`, `sito/editoria/**/index.html`, `sito/css/editoria.css`, `sito/css/editoria-theme.css`.

## Design and implementation

- Keep all nine Editoria pages, Italian service content, supplied figures, links and existing publishing illustrations. Keep Non Profit and the division entrance unchanged.
- Edit the existing `editoria-theme.css` rather than add another override file. Use shared ink, muted text, cream, paper, sky, radius and spacing tokens; scope all new effects to Editoria.
- Match Non Profit's top-aligned hero and 980px stacking breakpoint. On overview mobile/tablet, show heading, lead and actions before the decorative illustration. Preserve logical DOM reading/tab order.
- Match the overview headline emphasis to the shared marker treatment, without adding animation or eyebrow labels. Retain the publishing metaphor.
- Give eight solutions a balanced two-column desktop layout, one column on phones, using the reference's light surfaces, 18px corners, fine borders, readable descriptions and pill CTA treatment. Keep service identity colors stable across overview and related links rather than dependent on position.
- On service pages, put the actual article before the alternative-service navigation on mobile. Keep the desktop sidebar. Render related services as compact links with descriptions rather than another seven oversized cards. Keep every destination accessible.
- Harmonize prose, contact panel, heading scale and spacing. Ensure decorative shapes, book covers, tablet and charts stay inside narrow layouts.
- Correct the overview navigation's current-page indication. Bump the theme cache version in all nine pages.

## Alternatives and limits

Changing Non Profit to meet Editoria would reverse the requested direction. Rebuilding all illustrations or removing service content would expand scope. Loading the fundraising enhancement script would introduce unrelated map/form/editing behavior. Keep the existing buildless structure and navigation script.

## Acceptance and review

- Fresh Goldfish reviewer checks this document against the referenced files without conversation history; a separate creative scrutinator challenges consistency and hierarchy.
- Review overview, a book service, Analisi and Direct Reader at desktop, tablet and 390/320px phone widths. Check overflow, artwork containment, CTA before artwork, article before alternative navigation, active page, keyboard menu and anchors below the sticky header.
- Run the existing route/asset/fragment/redirect test suite and JavaScript syntax checks. Inspect the complete diff to confirm Non Profit and source service copy are unchanged.
- Save screenshots and the review findings; deliver the local changes and preview. Publishing to GitHub Pages is separate unless requested.

## Work sequence

1. Capture baseline rendering and resolve independent review findings.
2. Apply the scoped CSS and minimal HTML ordering/metadata changes.
3. Run structural checks and responsive browser checks, address concrete failures, then independent final review.

Implementation choices above are the assistant's proposed interpretation of the requested alignment.

## Review and verification outcome

The user confirmed Elephant = the main agent holding project context; Goldfish = a reviewer with fresh context. A fresh-context Goldfish approved this brief with cautions about shared marker animation, DOM order, inherited related-card styles and clipped artwork. Those cautions were addressed. A separate creative scrutinator reviewed the desktop overview, mobile overview, solutions and complete Collezioni page and approved the visual result. A fresh code reviewer found no actionable issues.

Verified on 11 November 2026:

- All four existing route, asset, fragment and redirect tests pass; both JavaScript syntax checks pass.
- All links on nine pages are preserved; all eight source service article HTML blocks are unchanged.
- Browser checks cover 320, 390, 760, 980, 981 and 1440px. All nine pages were checked at 320px and 981px. The 981px check exposed an intrinsic artwork-width problem, fixed with an explicit width/min-width. Direct Reader's tablet now scales with its canvas; follow-up checks at five widths confirm containment and at least 15px clearance above its caption.
- Main action precedes artwork on mobile; articles precede alternative navigation. The menu opens, Escape closes it and restores focus, and the article and solutions anchors clear the sticky header.
- Non Profit files are unchanged. No dependencies or submission behavior were introduced. The user requested publication to the existing GitHub Pages site after reviewing the local result.

Review images and measurements are saved outside the repository under `../output/proposta-sito/editoria-alignment/`. `responsive-checks.json` includes the intermediate discovery; `reader-checks.json` records the final corrected reader artwork.
