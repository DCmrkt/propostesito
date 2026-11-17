# High Value Donors feature panels

> Execution: inline with executing-plans; final independent review.

**Goal:** Put version C's authentic Mentor interface in the lower feature section, rearranging its panels in place when a feature is selected.

**Architecture:** One persistent scene uses a full version C donor detail capture and SVG viewports of that same image. The existing feature links and copy track remain; selection moves and enlarges relevant panels without navigating or replacing the whole scene.

**Tech stack:** Existing HTML, CSS transitions, vanilla JavaScript. No added dependencies.

**Spec:** User requests in this chat: version C below “Come funziona”; elements rearrange instead of changing page. Existing text, selected A hero, red branding, blue app interface, and header SVG scroll animation stay intact.

## Review focus

- Selecting distant tabs should not briefly activate intermediate scenes.
- Mouse, keyboard and manual horizontal scrolling must select the same scene.
- Deep links and resizing must keep copy and scene synchronized.
- Mobile must fit without horizontal page overflow or moving the section on activation.
- Reduced-motion users must see the same panels without animated rearrangement.

## Task 1 — Scene and interaction

- [x] Record the current failing browser condition: no shared authentic interface scene exists in `#come-funziona`.
- [x] Add one scene and real version C asset in `index.html` / `media/features/`; remove four abstract monitor illustrations. Preserve all editorial strings.
- [x] Update `high-value-donors.css`: fixed base screen, native UI fragments, four responsive arrangements, no tilt, motion disabled under reduced-motion preference.
- [x] Update `high-value-donors.js`: synchronize persistent scene with active feature; preserve anchors, modifier clicks, keyboard controls and no vertical scroll on activation.
- [x] Verify in browser: active scene matches each of four links, no navigation/vertical jump, scene DOM remains the same, panels change positions, keyboard and mobile work.

## Task 2 — Review and publication

- [x] Compare all editorial text and hero markup with the baseline; run route tests and whitespace checks.
- [x] Request independent review; resolve material findings.
- [ ] Stage only feature-related changes, publish, verify live behavior and save screenshot.

## Execution notes

- Publishing is already authorized in this chat.
- The shared checkout is coordinated with the animation chat; it owns only hero changes. Use scoped staging if its changes arrive concurrently.
- Use authentic version C captures; do not invent extra screens or controls.

- QA: four tabs preserve URL, vertical position and base bounds; persistent scene markup unchanged. Keyboard Home/Right/End and direct #operativita link synchronize correctly. 320px/390px fit without page overflow.
- Capture: C v2 detail-1.png (1670x1018 actual pixels); exact source bytes retained.
- Verification: all original feature text unchanged, four route tests passed, JavaScript syntax and diff checks passed. Independent review approved.
