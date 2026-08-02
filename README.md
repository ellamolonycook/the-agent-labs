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

The older `/contentmachine` and `/contentmachine/apply` paths stay alive as
redirect stubs, for links already out in the world. See Deploy below.

## Deploy — GitHub Pages

The repo is **public** and GitHub Pages serves `main` from the repo root, with
`CNAME` holding the custom domain. Push to `main` and it deploys.

There is no build step and no Actions workflow — Pages is on its classic
branch-based source.

**No server-side redirects.** GitHub Pages cannot issue a 301, so the old
`/contentmachine` paths are kept alive by client-side redirect stubs
(`contentmachine/index.html`, `contentmachine/apply/index.html`) rather than a
`_redirects` file, which is a Cloudflare Pages feature and does nothing here.

## What still points at timerich.ai (deliberate)

These stayed absolute because the pages themselves stayed on timerich.ai:

- `/challenge/terms.html` and `/challenge/privacy.html` — the AICM legal pages
- `/coaching` — the coaching deep-dive
- `support@timerich.ai` — support inbox

If The Agent Labs gets its own terms/privacy, update the footer links in
`index.html`.

## Known placeholders inherited from the old repo

- `portal/index.html` — `href="[LINK]"` and `src="[ELLA_HEADSHOT]"`
- `apply/index.html` — `href="[ELLA_CALENDAR_LINK]"`

## Note

`og-portal.jpg` was never committed to the old repo, so `timerich.ai/og-portal.jpg`
always 404'd and the portal had no working social preview image. It is committed
here, so the preview works.
