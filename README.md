# The Agent Labs

Static site for **theagentlabs.ai**.

Moved out of `ellamolonycook/time-rich-site` (timerich.ai) on 2026-08-02.
Both pages were removed from timerich.ai in the same move — they 404 there now.

## Pages

The AI Content Machine **is** the site root — theagentlabs.ai serves the sales
page directly, not a separate landing page in front of it.

| Path | Source | Indexed |
|---|---|---|
| `/` | `index.html` | yes — the AI Content Machine |
| `/apply/` | `apply/index.html` | no (`noindex`) |
| `/portal/` | `portal/index.html` | no (`noindex`) |

Its images (`ajay.jpg`, `ella*.jpg`) sit at the root next to `index.html`
because the page references them relatively (`src="ajay.jpg"`). Don't move them
into a subfolder without rewriting those `src` attributes.

`_redirects` keeps the older `/contentmachine` and `/contentmachine/apply`
paths alive as 301s, for links already out in the world.

## Deploy — Cloudflare Pages (not yet connected)

This repo is private, so GitHub Pages will not serve it on a free plan. Hosting
is Cloudflare Pages, which does support private repos. One-time setup, in the
Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**
2. Authorize GitHub and pick `ellamolonycook/the-agent-labs`
3. Build settings: **framework preset = None**, **build command = (blank)**,
   **build output directory = `/`**  (this is a plain static site, no build step)
4. Save and deploy → you get a `*.pages.dev` URL
5. **Custom domains → Set up a domain → `theagentlabs.ai`**

After that, every push to `main` deploys automatically.

There is deliberately no `CNAME` file and no GitHub Actions workflow — both are
GitHub Pages mechanisms and do nothing on Cloudflare Pages.

## What still points at timerich.ai (deliberate)

These stayed absolute because the pages themselves stayed on timerich.ai:

- `/challenge/terms.html` and `/challenge/privacy.html` — the AICM legal pages
- `/coaching` — the coaching deep-dive
- `support@timerich.ai` — support inbox

If The Agent Labs gets its own terms/privacy, update the footer links in
`contentmachine/index.html`.

## Known placeholders inherited from the old repo

- `portal/index.html` — `href="[LINK]"` and `src="[ELLA_HEADSHOT]"`
- `apply/index.html` — `href="[ELLA_CALENDAR_LINK]"`

## Note

`og-portal.jpg` was never committed to the old repo, so `timerich.ai/og-portal.jpg`
always 404'd and the portal had no working social preview image. It is committed
here, so the preview works once this site is live.
