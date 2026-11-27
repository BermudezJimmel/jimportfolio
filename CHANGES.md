# Portfolio modernization

Branch: `feature/modern-portfolio`

## CV review fixes (from `JIM-SA/CV-REVIEW.md`)
Applied: #1 Education added (BS Information Technology, Bestlink College of the Philippines, Jun 2015 to May 2019); #2 "five" pillars removed; #3/#4 Globaltronics split into Technical Support / IT Support (Apr 2019 to Jul 2020) and Junior Web Programmer (Jul 2020 to Feb 2022) with the CV wording; #5/#6 Valueline wording from the CV (CI/CD removed); #7 "Manage 55+"; #13 About heading and the "I own both" clause; #14 label "years in IT"; #15 "other three AWS certs expire in Jul 2028"; #16 full certification names; #17 "New Leadership Onboarding Award" plus "Awarded at VBusiness / Valueline"; #19 SNS moved to Compute; #20 "Also:" line with the missing CV skills; #21 "Kiro CLI". The experience counter now reads "/ 04".
Multi-AZ: removed from the Backup and DR service text and tool chips and from the RDS node in the architecture explorer. The Backup and DR service no longer links to the "Government WordPress to AWS Auto Scaling" case (Jim's design is Single-AZ RDS). The older "Government high-availability infrastructure" and "Local government cloud infrastructure" cases still say Multi-AZ because they come from the old site and were left as they were.
Left as is on purpose (Jim's own claims from the old site): #9 to #12, #18, #22, and the rest of the Unverified list in the review.

## Motion redesign (style and feel of ourlifeos.ai, monochrome only)
I read the reference site's public CSS and JS and screenshotted it. Its motion vocabulary: blur-and-rise word reveal in the hero, fade-up reveals (22 px, 1.3 s, expo-out easing, staggered delays), a looping SVG "climb" with a moving dot and checkpoint ripples, a rotating statement line, mono uppercase numbered labels ("01 · The gap"), glass panels and soft drifting glows. I rebuilt that feel with Jim's content and white/grey/black only. No text, images or code were copied. No library is used. New files: `css/motion.css` (about 9 KB) and `js/motion.js` (about 4 KB). `css/style.css` and `js/main.js` are unchanged.

What moves, and where to tweak it (search for "TWEAK" in `css/motion.css`, or the comment in `js/motion.js`):
- Hero headline: "Jim" and "Bermudez" rise in with a blur, word by word. Stagger is `.14s` per word (`animation-delay` in `.js h1 .word`). Eyebrow, intro, focus line, buttons, stats and the portrait card fade up in sequence (delays `.05s` to `.75s`).
- Hero background: two slow drifting grey glows (22 s and 28 s) and a drawn "career climb" line (20 s loop) with a moving dot and three checkpoints labelled 2019, 2022, 2024 (years from the CV). It is masked on the left so it never sits behind the text.
- Rotating focus line under the intro (governance, migrations, WAF, training): 3.2 s per item, set in `js/motion.js`. Pauses on hover or focus and in hidden tabs.
- Scroll reveals on every section and card: 22 px rise, 1.3 s (`.reveal` in `css/motion.css`), with a small stagger on card grids.
- Marquee of tool chips under the hero (built from the Skills chips). Speed is set in `js/motion.js` (`names.length * 2` seconds per loop). Pauses on hover.
- Sticky, stepped Experience and Services: the section title and a big "01 / 03" counter stay in place while the entries scroll. The entry nearest the middle of the screen is highlighted and the counter follows. Inactive entries stay at 72 percent opacity so text stays readable.
- Numbered section labels ("01 · About") via CSS counters.
- Cursor-follow glow (grey/white) and a spotlight inside cards on hover. Only on mouse devices.
- Cards lift on hover, the page fades in on load, years counter still computes from `data-years-since`.
- Kept: modals, architecture explorer, filters, Ctrl K menu, theme toggle, DEVJIM nav with terminal icon, favicon, 44 px tap targets, one portrait.

Accessibility and performance:
- `prefers-reduced-motion`: no stagger, parallax, glow, cursor glow, marquee scroll or rotating line. The climb line is drawn fully and the marquee becomes a static wrapped list. Reveals show at once.
- Only transform, opacity and filter are animated. Images have width and height set, and the rotating line reserves its space, so there is no layout shift. The headline is hidden until split and has a 2 s CSS fallback if JS fails. Without JS everything is visible.
- Below 860 px the sticky columns become normal stacked sections and the glow line is dimmed.

Checked: `node --check` on both JS files, headless Chrome screenshots at 1280 px (dark, light with reduced motion, and normal motion) and 500 px (headless Chrome will not go below about 500). In normal-motion screenshots some lower sections look dim because the screenshot is taken mid-transition; with reduced motion they are at full strength. The live scroll animation, the sticky step highlight and the cursor glow cannot be seen in a still screenshot, so please scroll the page once. I did not run Lighthouse.
Not changed: any factual text (the CV accuracy review will follow). The 2019, 2022 and 2024 labels on the hero line come from the existing experience dates.

## What changed
- Rebuilt as a static page: `index.html`, `css/style.css`, `js/main.js` (vanilla JS). No build step, no libraries, no web fonts (system font stack).
- Dark and light theme. It follows the visitor's system setting and a button saves the choice.
- Responsive layout, skip link, visible keyboard focus, alt text on the photo, semantic landmarks.
- Motion is subtle (fade-in on scroll, card hover, counters). All of it is switched off under `prefers-reduced-motion`.
- Favicon replaced. The tab icon was the old orange DEVJIM cloud logo (`img/logo/devjim-logo.svg`, an embedded bitmap, unreadable at 16 px). New files: `img/favicon.svg` (black rounded square, white "DJ"), `img/favicon-32.png`, `img/apple-touch-icon.png` (180x180). The `<link>` tags use `?v=2` to bust the cache. The old `devjim-logo.svg/.png` are deleted and nothing references them. Checked at 16 and 32 px in headless Chrome on light and dark backgrounds. Browsers cache favicons hard, so you may need a hard refresh (Cmd+Shift+R), or close and reopen the tab, to see it. No web manifest was added.
- The navbar brand is unchanged (the terminal icon + DEVJIM); my earlier "DJ" badge change was reverted.
- Navbar rebuilt: brand "DEVJIM" left, links centered, 44px icon buttons right (command menu, sun/moon theme), sticky with blurred background, active link highlighted on scroll. Below 980px the links move into the command menu (Menu button, `/` or `Ctrl K`), so it fits 320px to 1440px.
- Icons: inline SVG sprite (Lucide style, no CDN) used on nav links, section labels, service cards, skill chips (one icon per category), filter buttons and contact links (LinkedIn, GitHub, Credly). I checked `skillicons.dev` (HTTP 200) but did not use it: it covers only some of the tools, mixes styles, and adds a third-party request.
- Case studies now open in a modal (native `<dialog>`): Problem / Approach / Outcome, tech chips, prev/next (buttons and arrow keys, respects the active filter), Esc, click outside, scroll lock, focus returns to the card, fade/slide animation (off under reduced motion). Cards with an architecture link show "See it in the architecture explorer", which closes the modal and opens the matching diagram.
- Feel borrowed from braydentw.io (layout and interaction only, no text or code): bolder hero type, staggered scroll reveal, lift on card hover, polished modal.
- Services now open the same modal as case studies: what it is, how I deliver it, typical tools as chips, and related case studies (click one to jump to it). Esc, outside click, focus trap, arrows and prev/next work among the services.
- Palette is now monochrome (white, grey, black only; cyan and navy removed). Links are underlined because they share the text color. Diagram and icon colors follow the variables. Style kept after braydentw.io (style only, no text, images or code copied). I read its public CSS. Values I chose, as CSS variables in `css/style.css`:
  - Dark (default): `--bg #000000`, `--bg2 #0a0a0a`, `--card #141414`, `--line #2e2e2e`, `--text #ffffff`, `--muted #b3b3b3`, `--accent #ffffff`, `--accent-ink #000000`.
  - Light: `--bg #ffffff`, `--bg2 #f2f2f2`, `--card #e8e8e8`, `--line #cfcfcf`, `--text #000000`, `--muted #4d4d4d`, `--accent #000000`, `--accent-ink #ffffff`.
  - Type: Be Vietnam Pro (text) and DM Mono (labels and chips), black-weight tight headline.
  - Components: outlined cyan buttons that fill on hover, 12px-radius cards that lift on hover and take a cyan border, accent bar after each section title, small-radius mono chips.
  - Contrast was checked by calculation for body text, muted text and accent on both themes (AA target). Not tested with a tool.
- Fonts come from Google Fonts (one extra request, with system-font fallback). If you want no third-party request, remove the two `fonts.g*` lines in `index.html`.
- Photo: `img/jim.jpg` (320x320, 26 KB, cropped with `sips` from the old `img/hero/JIM.webp`, now unused). It appears once, inside a rounded grey card in the Hero with a caption row (role, team lead and TAM, AWS SA Professional badge). It is not repeated in About. The backdrop has partial neon lettering at one edge; a plainer photo would look more professional.
- Name rule: "Jim Bermudez" appears once, in the Hero heading. Elsewhere the page says "DEVJIM" or "Jim". Title is "DEVJIM | Solutions Architect". `<link rel="canonical">` and `og:url` were removed because they contain the name in the URL. Remaining "bermudez/jimmel" strings are only inside link URLs (LinkedIn, GitHub, Credly) and the `og:image` URL host.
- Interactive parts (all keyboard accessible):
  - Hero portrait card (replaces the old terminal typing panel, its Skip button, JS and CSS).
  - Counters for years, 55+ accounts, 4 certs.
  - Years in IT update themselves. JS reads `data-years-since="2019-04-01"` (career start, Globaltronics, Apr 2019), takes whole years to the visitor's date and writes "N+" in the Hero counter and "N+ years" in About. The HTML keeps "7+" only as the no-JS fallback. To change the start date, edit that attribute in `index.html` (two places). Meta and Open Graph text no longer include a years number.
  - Architecture explorer: two SVG diagrams (multi-account organization, web tier). Click, focus or press Enter on a node to see what I did there. No numbers beyond 55+.
  - Case studies as expandable cards (Problem / Approach / Outcome + tech chips) with filters.
  - Skills as filterable chips (Network, Compute, Security, IaC and CI, Web and mail, AI).
  - Command menu: press `/` or `Ctrl K` (`Cmd K` on Mac), or use the Menu button. Jump to sections, toggle theme, open LinkedIn, GitHub, Credly.
- Carried over from the old live site: the 6 older cloud/consulting projects (anonymized), a web development and hosting card, and all 7 services with their descriptions.
- Role now reads: Solutions Architect / Service Delivery Tech Team Lead and TAM (Sagesoft, Oct 2024 to present). Experience, awards, AI Practitioner cert, "7+ years" and grouped skills follow Jim's current CV.
- 11 anonymized case studies. The first four are new: government WordPress to AWS Auto Scaling, Control Tower governance, WAF assessment, client AWS training.
- Only these numbers are used: 55+ accounts, 7+ years, 10+ client accounts, 7 engineers led, and the AWS certs with their dates.
- Public email removed (page and chatbot). Contact is now LinkedIn, GitHub and the CV link.
- Title, description, canonical and Open Graph / Twitter tags fixed.
- LinkedIn link corrected to the profile ending in -037699169 (page button and command menu); the old /in/ address is gone from the repo.
- Kept: `img/` (portrait now `img/jim.jpg`, old logo files removed), CV link (same Google Docs URL), LinkedIn and GitHub links.

## Files touched
- Rewritten: `index.html`
- Replaced old template files in `css/` and `js/` with `css/style.css` and `js/main.js` (old `js/chatbot.js` and jQuery plugins are gone)
- Added: `CHANGES.md`
- Untouched: `img/`, `audio/`, `modal/contact.php`

## Contact form
`modal/contact.php` was not used (the old page already said the form was disabled for GitHub Pages) and GitHub Pages cannot run PHP. It still holds a placeholder address. Recommend deleting it and, if a form is wanted, using a form service (Formspree, Web3Forms) or a `mailto:` link.

## Needs Jim to confirm
- Download CV: the Google Doc may show phone, date of birth or other private details. Open it in a private window. If it does, link a sanitized PDF instead.
- Items from the CV review left unchanged until you confirm: "enterprise clients", "WAF assessments", "CI/CD" and "replatforming" in the About text, skill chips not in the CV (CloudFront, IAM, Bash, CI/CD), the location line, and the whole list of case-study claims under Unverified in `CV-REVIEW.md`.
- Problem / Approach / Outcome text on every case study. I wrote it from the old site text and your brief. Outcomes are deliberately qualitative (no numbers). Check each is okay to publish.
- WordPress case: I said the driver was OS end of life and named ASG, ALB, RDS, Route 53. Remove anything that is not final.
- Control Tower case: "landing zone design and ongoing operation" is my assumption.
- Old items now carried over: check the "Problem" lines I added for them (e.g. "A monolithic application was hard to release and scale"). They are my wording.
- The 5 old web development projects are merged into one "Web development and hosting" card.
- Still dropped: skill percentage bars, Facebook link, testimonials and background audio. Bring back any you want.
- Architecture explorer text (e.g. Security Hub/GuardDuty "practices", Session Manager access, restore tested before go-live) comes from the old services text and your CV. Remove any line that is not true for your setups.
- Education (BSIT, Bestlink College, 2015 to 2019) is not on the page. Add back if wanted.
- Location shows "Metro Manila, Philippines" (old page said Caloocan City).
- Chatbot removed. It showed an email and claimed "5+ years" and "15+ AWS services". Say if you want a rebuilt version.
- Open Graph image uses the portrait. A 1200x630 card image would look better.
- The site URL `https://bermudezjimmel.github.io/jimportfolio/` is assumed for canonical and OG tags. Pages is likely served from `gh-pages`, so the PR must be merged to `main` and then published the way you do today.
- Git showed many files as modified (mode or line-ending noise, no content change, e.g. `audio/*.mp3`). I did not commit those.

## Testing done
- `node --check js/main.js` passes. All `<use href="#i-...">` icons exist in the sprite, and all ids used by the modal exist. HTML tags balance and all ids used by the JS exist. No email, phone or mailto in the page, CSS or JS.
- No headless browser render was possible (no Chrome found, memory tight), so layout at 320px and 1440px, the modal and the nav highlight were not visually checked. Please open the page once and try: the 320px width, a case study modal (arrows, Esc), Ctrl K and the theme button.

## Preview
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.
