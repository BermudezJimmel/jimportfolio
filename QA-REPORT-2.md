# QA report 2: motion redesign and CV fixes (branch feature/modern-portfolio, from 64230df)

## Method
- Google Chrome 158 headless, driven over the DevTools protocol by `.qa/cdp.mjs` (git-ignored, no writes to /tmp). Unlike round 1 (iframes), the viewport is the real width through `Emulation.setDeviceMetricsOverride`. Widths 320, 375, 414 use mobile mode with touch (so `hover:none`); 1280 and 1440 use a mouse.
- 20 runs: 5 widths x dark/light x normal motion / `prefers-reduced-motion: reduce` (emulated media). Run before and after the fixes.
- `.qa/p2.js` (injected at document start) measured: horizontal overflow, h1 visibility at 0.3 s and 2.5 s, opacity of every `.reveal` after scrolling the whole page, sticky positions, counter labels vs entry counts, marquee width and wrap, cursor-glow display, tap targets, text contrast (opacity included), non-grey colours on all elements, text checks (name, email, phone, DOB, Multi-AZ, "five"), favicon loads, theme toggle, Ctrl K, case and service modal (open, focus inside, `:modal`, Esc, focus return), layout-shift (CLS), JS errors.
- `node --check js/main.js` and `js/motion.js`: pass.
- Screenshots read by eye: 1440 dark Experience (step 3), 1440 light Services (step 5), 320 light skills "Also" line.

## Results that were fine (after fixes, 20/20 runs)
- No horizontal overflow (only the off-screen skip link, by design).
- JS console errors: none. Reveals: all 27 reach opacity 1 (or 0.8 for dimmed inactive steps on desktop) after scrolling; none stuck at 0.
- Hero h1 visible at 2.5 s in all runs; reduced motion shows it at once.
- Counters: Experience "/ 04" matches 4 entries; Services "/ 07" matches 7 cards. Under 860px the counter is hidden and sections stack (`position: static`). At 1280/1440 `.sticky-col` is sticky at top 110px, with no overlap or scroll trap in the screenshots.
- Marquee: 72 chips, half-track 4069px, wider than 1440px, so no gap; one row; hover pause rule present. Reduced motion shows static wrapped chips.
- Cursor glow: `display:none` on touch widths, shown only for mouse. Never on for reduced motion.
- Modals (case and service): open, focus lands inside, `:modal` is true (native focus trap), Esc closes, focus returns to the opener, scroll lock is released. Ctrl K opens the palette (11 items, input focused). Theme toggles both ways.
- CLS at most 0.022 (desktop). Page height: 8.1k to 8.2k px at desktop, 11.8k to 14.4k at phones.
- No colour outside grey scale on any element (scan over all computed color, background, border, outline, fill and stroke). No email, phone or DOB. "Jim Bermudez" shows once, in the hero h1 (two words in separate spans, aria-label has the full name). "five" absent. Favicon svg, 32px png and apple-touch all load.
- The "Also:" line wraps cleanly at 320px.

## Bugs found and fixed
| # | Bug | Fix |
|---|-----|-----|
| 1 | Light theme: dimmed (72%) Experience text and service cards had contrast 4.00:1 (below AA 4.5). Dark passed. | Dim level raised to 80% in `css/motion.css` (about 4.8:1 light). |
| 2 | "Multi-AZ" still in 3 places in `index.html` (case "Government high-availability infrastructure": tag, approach; "Local government" case: approach). | Removed the wording. See "Not verified". |
| 3 | Step counter could show a stale number (seen: "02 / 04" at the end of Experience) after a fast scroll, because the observer only reacted to the last entry. | `js/motion.js` `steps()` now picks the active item by position (also on scroll). |
| 4 | Without JavaScript, `.reveal` content stayed at opacity 0 (page blank). | `.reveal` hide rule scoped to `.js` in `css/style.css`. |
| 5 | "Skip to content" link was 42px high. | `min-height:44px` in `css/style.css`. |

Re-run after fixes: all counters 04/04 and 07/07 in 20/20 runs, 0 small tap targets, contrast fails only false positives (below).

## Not verified
- Contrast tool false positives: the hidden rotating focus-line items (opacity 0) and the glass navbar (semi-transparent white; visually checked, black on white).
- Multi-AZ removal changes factual case text. Jim should confirm the two cases did not use multi-AZ; if they did, restore the wording.
- Animation smoothness, the climb-line timing and marquee speed were not watched live (still images and numbers only). Hover pause was checked in CSS only, not with a real mouse. Marquee pauses on hover only, not on keyboard focus or for touch.
- Cursor glow movement not exercised (no pointer events sent). Lighthouse not run.
- Safari, Firefox and real phones not tested. Mobile mode here is Chrome emulation.
