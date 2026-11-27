# QA report: feature/modern-portfolio

## How it was tested
- Real browser: Google Chrome 158 headless (macOS). Scripts are in `.qa/` (git-ignored).
- Phone widths 320, 375, 414 and laptop 1280, 1440 were rendered inside an iframe of that exact width, so media queries match the real width. (Headless Chrome will not make a window narrower than 500px.)
- Each width ran in dark and light mode (10 runs). A probe script measured: horizontal overflow, tap target sizes, missing icon-sprite ids, dead `#anchors`, JS errors, and the case modal (open, size, scroll, next button, arrow key, close, focus return).
- Screenshots of the 320px dark page were read by eye (hero, terminal, about, experience, architecture, case filters).
- `node --check js/main.js`: passes. All `$('#id')` ids used by JS exist in the HTML (no JS errors in any run).

## Results that were fine
- No horizontal scroll at any width (scrollWidth = viewport minus scrollbar).
- Navbar: DEVJIM brand + two icon buttons at 320/375/414; links show at 981px and up. The menu is the command palette button.
- Hero text and portrait fit; terminal wraps inside its box.
- Modal fits the screen (max 88vh), scrolls inside at phone sizes, next/prev, arrow keys and close work. Esc and outside click handled by code (native dialog cancel + click on backdrop).
- Colours: muted grey on black and on white are above 4.5:1. "Jim Bermudez" appears once (Hero h1). No email, phone or DOB found. LinkedIn link is `https://www.linkedin.com/in/jimmel-bermudez-037699169`.

## Bugs found and fixed
| # | Bug | Fix |
|---|-----|-----|
| 1 | Architecture diagram shrank to about 50% at 320px. Text was about 5px and nodes were 25px tall to tap. | Diagrams are wrapped in `.diagram` (scrolls sideways); on screens 640px and under the SVG is at least 600px wide. |
| 2 | Tap targets under 44px: filter chips (36px), "Details" buttons (23px), Terminal "Skip" (26px), DEVJIM brand (24-27px), nav links (40px), "related" buttons. | `min-height:44px` on those controls (end of `css/style.css`). |
| 3 | Icon buttons could shrink to 43px in flex rows. | `flex:none; min-width/min-height:44px`. |
| 4 | Focus ring on diagram nodes was weak. | Added a stronger stroke on `:focus-visible`. |

## Checked but left alone
- Modal icon buttons read 43px in the probe because the open animation scales the dialog to 98%. They are 44px at rest.
- "Skip to content" link is 42px high but only shows on focus. "Verify on Credly" is an inline text link in a sentence (exempt).
- At 320px the terminal text wraps onto new lines. It stays readable, so I kept it.

## Not verified
- Safari and Firefox (only Chrome tested). Real touch devices.
- Command palette layout at 320px and the light-mode screenshots were not looked at by eye. The probe showed no overflow in light mode.
- Page after the fix was re-probed (numbers) but not re-screenshotted.
