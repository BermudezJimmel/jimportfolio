# Portfolio modernization

Branch: `feature/modern-portfolio`

## What changed
- Rebuilt as a static page: `index.html`, `css/style.css`, `js/main.js` (about 8 KB of vanilla JS). No build step, no libraries, no web fonts (system font stack).
- Dark and light theme. It follows the visitor's system setting and a button saves the choice.
- Responsive layout, skip link, visible keyboard focus, alt text on the photo, semantic landmarks.
- Motion is subtle (fade-in on scroll, card hover, counters, terminal typing). All of it is switched off under `prefers-reduced-motion`.
- Interactive parts (all keyboard accessible):
  - Hero terminal (`aws sts get-caller-identity` style) with a Skip button. The full text is in the HTML, so it shows without JS.
  - Counters for 7+ years, 55+ accounts, 4 certs.
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
- Kept: `img/` (portrait `img/hero/JIM.webp`, logo used as favicon), CV link (same Google Docs URL), LinkedIn and GitHub links.

## Files touched
- Rewritten: `index.html`
- Replaced old template files in `css/` and `js/` with `css/style.css` and `js/main.js` (old `js/chatbot.js` and jQuery plugins are gone)
- Added: `CHANGES.md`
- Untouched: `img/`, `audio/`, `modal/contact.php`

## Contact form
`modal/contact.php` was not used (the old page already said the form was disabled for GitHub Pages) and GitHub Pages cannot run PHP. It still holds a placeholder address. Recommend deleting it and, if a form is wanted, using a form service (Formspree, Web3Forms) or a `mailto:` link.

## Needs Jim to confirm
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
- `node --check js/main.js` passes. HTML tags balance and all ids used by the JS exist. No email, phone or mailto in the page, CSS or JS.
- No headless browser render was run (memory is tight). Please open the page once, test the Ctrl K menu and the dark/light toggle.

## Preview
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.
