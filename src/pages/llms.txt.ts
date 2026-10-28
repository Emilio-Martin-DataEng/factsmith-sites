import type { APIRoute } from "astro";
import { site, tiers, zar } from "../site.config";

// Generated so the prices and the entity sentence come from site.config, like every page.
const body = `# ${site.name}

> ${site.description}

FactSmith Sites is a web studio in South Africa (based on the KwaZulu-Natal South Coast) that builds fast, mobile-first, WhatsApp-first websites for small businesses across South Africa. Clients outside South Africa are accepted by quote. Invoices come from ${site.billingEntity}. FactSmith Sites is separate from FactSmith the product (www.factsmith.co.za).

Key facts:
- Tiers: ${tiers.map((t) => `${t.name} ${t.priceLabel} (${t.pages})`).join("; ")}. Prices are in rand.
- Deposit: ${zar(site.depositZar)} starts a Starter or Brochure job; the balance is due within 7 days of hand-over.
- On every tier: mobile-first design from an agreed sample, two focused revision rounds, hand-over of all source files, Google Search Console and Bing set up in your name, Google Analytics and a private stats page, WhatsApp and tap-to-call.
- Domain and hosting: you keep your domain, or a new .co.za is registered in your name at actual cost (typically R90 to R150). Keep your hosting if it can serve the site, or move to free static hosting.
- Page library, free where it fits the business: weather and tides pages (every tier), researched nearby attractions and restaurants pages (Brochure and up). The phone app (installable, works offline, in pilot) is a separate add-on for any business with relevant content, price on request.
- Not in the tier price: a new domain (actual cost), ongoing hosting or renewal bills, more custom pages than the tier allows, photography, logo design or writing from scratch, shops, booking engines and payments, a CMS, retainers, blogs, link-building, and third-party or API costs.
- Book a consult: ${site.bookUrl}
- Contact: South Coast enquiries WhatsApp +27 72 500 5179 (${site.contactName}); everywhere else WhatsApp +27 82 413 0438 (${site.emilio.name}), ${site.email}

## Pages
- [Home](${site.url}/): the tiers and how to book a consult
- [Offer](${site.url}/offer/): the tiers, what is and is not included, common questions
- [Included](${site.url}/included/): everything that comes with a site, and the admin page
- [How it is built](${site.url}/technical/): stack, SEO, AEO and GEO actions, process
- [Phone app](${site.url}/phone-app/): an installable offline phone app on your own site, for any business with useful visitor content
- [Method](${site.url}/method/): the steps from first message to go-live
- [Work](${site.url}/work/): live and in-process client sites
- [South Coast](${site.url}/south-coast/): local work and the towns we know best
- [Contact](${site.url}/contact/)

## Live client sites
- [Eagle's Roost B&B, Umtentweni](https://eaglesroost.co.za)
- [Three Birds Online Learning Centre, Anerley](${site.threeBirdsUrl})
- [Khaya La Manzi Guest Lodge, Hibberdene](https://khayalamanzi.co.za)
- [Mydo Fishing Lures](https://mydofishinglures.co.za)

Prices and offers on this site are the source of truth; last reviewed 28 October 2026.
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
