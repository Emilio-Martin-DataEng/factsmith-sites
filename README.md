# FactSmith Sites

Studio brochure for the South Coast web cash track.

- **Public URL (target):** https://sites.factsmith.co.za
- **Vault hub:** `03_Projects/Web-Dev-Projects/FactSmith-Sites/00-Overview/Project Overview.md`
- **Decision:** `(C)_Founder_Decision_FactSmith_Sites_2026-08-28.md`

## Stack

- **Studio host:** GitHub Pages — same family as `www.factsmith.co.za`
- **Site:** Astro + Tailwind v4 (brochure; client jobs may use Astro + Cloudflare Pages or the same GH Pages path)

## Local

```bash
npm install
npm run dev
```

Build: `npm run build` · output `dist`. Deploy: push to `master` (Actions → Pages).

Optional Formspree: set `PUBLIC_FORMSPREE_ENDPOINT` as a repo Actions variable / secret baked at build, or leave WhatsApp-only.

## Deploy / DNS

1. Pages is served from this repo (Actions workflow).
2. **xneelo** Manage DNS on `factsmith.co.za` — add only:

   | Type | Host | Points to |
   |---|---|---|
   | CNAME | `sites` | `emilio-martin-dataeng.github.io` |

   Do **not** touch apex A/AAAA, `www`, `mail`, or MX.
3. Repo **Settings → Pages → Custom domain** = `sites.factsmith.co.za` → wait for DNS check → **Enforce HTTPS**.
4. Product footer link on www only after `https://sites.factsmith.co.za/` returns 200.
