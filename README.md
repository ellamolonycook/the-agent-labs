# The Agent Labs

Static site for **theagentlabs.ai**.

Moved out of `ellamolonycook/time-rich-site` (timerich.ai) on 2026-08-02.
Both pages were removed from timerich.ai in the same move — they 404 there now.

## Pages

| Path | Source | Indexed |
|---|---|---|
| `/` | `index.html` | no — **placeholder, replace me** |
| `/contentmachine/` | `contentmachine/index.html` | yes |
| `/contentmachine/apply/` | `contentmachine/apply/index.html` | no (`noindex`) |
| `/portal/` | `portal/index.html` | no (`noindex`) |

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

- `index.html` — the whole root page is a placeholder
- `portal/index.html` — `href="[LINK]"` and `src="[ELLA_HEADSHOT]"`
- `contentmachine/apply/index.html` — `href="[ELLA_CALENDAR_LINK]"`

## Note

`og-portal.jpg` was never committed to the old repo, so `timerich.ai/og-portal.jpg`
always 404'd and the portal had no working social preview image. It is committed
here, so the preview works once this site is live.
