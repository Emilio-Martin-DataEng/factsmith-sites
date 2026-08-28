# FactSmith Sites

Studio brochure for the South Coast web cash track.

- **Public URL (target):** https://sites.factsmith.co.za
- **Vault hub:** `03_Projects/Web-Dev-Projects/FactSmith-Sites/00-Overview/Project Overview.md`
- **Decision:** `(C)_Founder_Decision_FactSmith_Sites_2026-08-28.md`

## Stack

Astro + Tailwind v4 + Cloudflare Pages (same as client jobs).

## Local

```bash
npm install
npm run dev
```

Build: `npm run build` · output `dist`.

Optional Formspree: set `PUBLIC_FORMSPREE_ENDPOINT` before build.

## Deploy notes

- Cloudflare Pages project on **Emilio’s** account (not Paula’s Three Birds zone).
- xneelo DNS: CNAME `sites` → `<project>.pages.dev`. Do not touch apex / `www` (product site on GitHub Pages).
- Product footer link on www only after this subdomain returns 200.
