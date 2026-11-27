# Portfolio modernization

Branch: `feature/modern-portfolio`

## What changed
- Rebuilt `index.html` as one self-contained static page (inline CSS and a small inline script). No build step, no jQuery, no web fonts (system font stack), so it loads fast on GitHub Pages.
- Dark and light theme. It follows the visitor's system setting and a button saves the choice.
- Responsive layout, skip link, visible keyboard focus, alt text on the photo, semantic landmarks.
- Motion is subtle (fade-in on scroll, card hover). It is switched off under `prefers-reduced-motion`.
- Role now reads: Solutions Architect, Service Delivery Lead and TAM (Sagesoft, Oct 2024 to present).
- Four anonymized case studies: government WordPress to AWS Auto Scaling, Control Tower governance, WAF assessment, client AWS training.
- Only these numbers are used: 55+ accounts, 6+ years, and the three AWS certs with their dates.
- Public email removed (page and chatbot). Contact is now LinkedIn, GitHub and the CV link.
- Title, description, canonical and Open Graph / Twitter tags fixed.
- Kept: `img/` (portrait `img/hero/JIM.webp`, logo used as favicon), CV link (same Google Docs URL), LinkedIn and GitHub links.

## Files touched
- Rewritten: `index.html`
- Deleted (old template, no longer used): `css/*`, `js/*` (including `js/chatbot.js`)
- Added: `CHANGES.md`
- Untouched: `img/`, `audio/`, `modal/contact.php`

## Contact form
`modal/contact.php` was not used (the old page already said the form was disabled for GitHub Pages) and GitHub Pages cannot run PHP. It still holds a placeholder address. Recommend deleting it and, if a form is wanted, using a form service (Formspree, Web3Forms) or a `mailto:` link.

## Needs Jim to confirm
- Case study wording. All four are generic. Check each is okay to publish, and the "My part" lines.
- WordPress case: I said the driver was OS end of life and named ASG, ALB, RDS, Route 53. Remove anything that is not final.
- Control Tower case: "landing zone design and ongoing operation" is my assumption.
- Training case: topics (Bedrock, Kiro) assumed from your brief.
- Older cases removed from the page: eCommerce microservices, microservices migration, Bedrock government chatbot, HA infrastructure, LGU cloud, and the 5 web development projects. Say which to bring back.
- The old "Services" section, skill percentage bars, Facebook link, testimonials and background audio are gone. Bring back any you want.
- Education (BSIT, Bestlink College, 2015 to 2019) was dropped from the page. Add back if wanted.
- Location shows "Metro Manila, Philippines" (old page said Caloocan City).
- Chatbot removed. It showed an email and claimed "5+ years" and "15+ AWS services". Say if you want a rebuilt version.
- Open Graph image uses the portrait. A 1200x630 card image would look better.
- The site URL `https://bermudezjimmel.github.io/jimportfolio/` is assumed for canonical and OG tags. Pages is likely served from `gh-pages`, so the PR must be merged to `main` and then published the way you do today.
- Git showed many files as modified (mode or line-ending noise, no content change, e.g. `audio/*.mp3`). I did not commit those.

## Preview
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.
