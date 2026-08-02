# The Agent Labs

Static site for **theagentlabs.ai**, deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

Moved out of the `time-rich-site` repo (timerich.ai) on 2026-08-02.

## Pages

| Path | Source | Indexed |
|---|---|---|
| `/` | `index.html` | no — **placeholder, replace me** |
| `/contentmachine/` | `contentmachine/index.html` | yes |
| `/contentmachine/apply/` | `contentmachine/apply/index.html` | no (`noindex`) |
| `/portal/` | `portal/index.html` | no (`noindex`) |

## What still points at timerich.ai (deliberate)

These stayed absolute because the pages themselves stayed on timerich.ai:

- `/challenge/terms.html` and `/challenge/privacy.html` — the AICM legal pages
- `/coaching` — the coaching deep-dive
- `support@timerich.ai` — support inbox

If The Agent Labs gets its own terms/privacy, update the footer links in
`contentmachine/index.html`.

## Known placeholders inherited from the old repo

- `portal/index.html` — `href="[LINK]"` and `src="[ELLA_HEADSHOT]"`
- `contentmachine/apply/index.html` — `href="[ELLA_CALENDAR_LINK]"`

## Deploy

Push to `main`. GitHub Pages must be set to **Source: GitHub Actions**, and
`theagentlabs.ai` needs DNS pointed at GitHub Pages:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

Note: GitHub Pages on a **private** repo requires a paid GitHub plan. If the
deploy fails with a Pages entitlement error, either upgrade or make the repo public.
