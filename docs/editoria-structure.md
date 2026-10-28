# Editoria and Non profit

Requested outcome: expand the existing Direct Channel proposal with the Editoria pages and Italian copy from the supplied Google document, and give both divisions a clear URL hierarchy.

- `/sito/`: shared entry page linking to both divisions.
- `/sito/editoria/`: division overview and eight service pages: subscriptions, e-commerce, periodicals and newspapers, collections, analysis, marketing consultancy, B2B subscriptions, and Direct Reader (the latter uses the supplied platform description).
- `/sito/non-profit/`: existing fundraising homepage; products, modules, and integrations live below this prefix.
- Existing published URLs redirect to their corresponding new page, preserving query strings and fragments.
- Reuse the existing logo, typography, cream background, and pastel accents. Division navigation is present in HTML and works without JavaScript.
- Use supplied customer-facing text; omit the document's to-do list and internal editorial questions. Keep the supplied figures without presenting them as newly measured data.
- Remain a static HTML/CSS/JavaScript proposal with no new submission backend.

Implementation and checks:

- [x] Add route checks, verify the missing division routes fail.
- [x] Create canonical Non profit paths, legacy redirects, and shared division navigation.
- [x] Create the Editoria overview and eight populated service pages.
- [x] Check every local destination, static asset, fragment, and redirect; check desktop and mobile navigation in a browser.
- [x] Independent review; fix the desktop dropdown position below the division bar and verify the position before and after scrolling.

Deployment target: the existing GitHub Pages proposal at `https://dcmrkt.github.io/propostesito/sito/`.
