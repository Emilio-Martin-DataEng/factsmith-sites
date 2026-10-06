# Brand assets

Two brands live in this repo. Keep them apart, and copy from here instead of redrawing.

## 1. FactSmith (the product): use on demos, audits, proposals and FactSmith-branded pages

- **Mark:** an Ember spark rising off an anvil bar. Files: `factsmith/mark.svg` (light backgrounds) and `factsmith/mark-on-dark.svg`.
  Copied verbatim from the live site mark (vault `wiki/factsmith/marketing/facebook-page/render/profile.html`). The source of truth is `src/dashboard/src/brand/LogoMark.tsx` in the product repo (`C:/Users/Emilio/FactSmith`); same geometry, checked 2026-10-06. Website favicons and OG card: `factsmith-website/assets/brand/`.
- **Wordmark:** "FactSmith" in Sora 600, letter-spacing -0.03em, ink. The wordmark is never Ember.
- **Colour:**
  - Ember `#F26F1E` (dark mode `#FF8A3D`). The spark and the accent only, at most 10%.
  - Ink `#0b0b0b`, paper `#fcfcfb` / `#f9f9f7`, dark background `#0d0d0d`.
  - Validate green `#0FA37F` is for status only.
- **Type:** Sora (display), Inter (body), JetBrains Mono (code / SQL).
- **Taglines:** "Say it. Get the fact." · "Answers, not dashboards."
- **Retired, do not use:** Forge Ink navy `#0E2A47` and the green `FactSmith-Brand-Pack.zip`. See vault `wiki/factsmith/marketing/Brand_Identity_Reconciliation.md`.

## 2. FactSmith Sites (this studio site)

- **Mark:** "FS" tile in sea teal. Files: `public/favicon.svg` and `src/components/BrandMark.astro`.
- **Colour / type:** sea `#1d6a7a`, cream `#f7f5f0`, Outfit / Figtree. Tokens are in `src/styles/global.css`.
- **OG card:** `public/images/og-card.svg` / `.png`.

## Rules

- Never hand-draw a FactSmith mark. Inline the `mark.svg` path, or port it as-is (for example to a reportlab path).
- Pages under `public/<client>/` that showcase FactSmith (such as `smhart-security/response-live/`, `pollution-control-services/fleet-live/`) use brand 1. Client concept sites use the client's own brand.
- `brand/` is not under `public/`, so these files are not deployed. Copy what a page needs.
