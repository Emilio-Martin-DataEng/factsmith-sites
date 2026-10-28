# FactSmith Sites (sites.factsmith.co.za)

Static Astro 7 + Tailwind 4 brochure site, deployed to GitHub Pages by `.github/workflows/deploy.yml`. **A push to `master` is live within minutes.** There is no staging: check locally first (below). Same conventions as the FactSmith website (`factsmith-website/site/CLAUDE.md`, built by Ben); only the differences are listed here.

## Run it locally

```
npm ci            # once, or after package-lock.json changes
npm run dev       # http://localhost:4321, live reload while editing
npm run build     # the real build into dist/
npm run preview   # serve dist/ on http://localhost:4321
npm run check     # with the preview running: sitemap pages return 200, internal links resolve, no dashes
```

Node 22.12 or newer. Versions are pinned exactly (astro 7.3.7, tailwindcss and @tailwindcss/vite 4.3.3) and `package-lock.json` is committed; do not loosen them. `trailingSlash: 'always'`: write internal links as `/offer/`, not `/offer`.

## Differences from the FactSmith website

| Website | Sites |
|---|---|
| Cloudflare Workers, `wrangler dev` preview | GitHub Pages, `astro preview` |
| Content in markdown under `src/content/pages/` | Pages are `.astro` files in `src/pages/`; prices, offer, tiers, nav, samples and features are data in `src/site.config.ts` |
| `check.mjs` checks old URLs and `_redirects` | `check.mjs` checks sitemap pages, internal links and dashes only |
| GSAP animation | None |

Client previews live in `public/<slug>/` and are copied unchanged: they are skipped by the link check, and their dashes are reported but do not fail it.

## Rules

- No em dash or en dash in the built pages (the check fails on them). Use a comma, colon or "to".
- Prices and offer text are set once in `src/site.config.ts`; every page, the FAQ, JSON-LD and `llms.txt` read from it.
- The offer source of truth is the vault note `FactSmith-Sites/01-Client-Brief/Offer Spec.md`.
