import type { APIRoute } from "astro";
import { launchOffer, site, zar } from "../site.config";

// Generated so the prices and the entity sentence come from site.config, like every page.
const price = launchOffer.active
  ? `${zar(site.priceZar)} fixed for the first ${launchOffer.slotsWord} South Coast sites, then ${zar(site.standardPriceZar)} fixed.`
  : `${zar(site.standardPriceZar)} fixed.`;

const body = `# ${site.name}

> ${site.description}

FactSmith Sites is a web studio on the KwaZulu-Natal South Coast, South Africa (Hibiscus Coast). It rebuilds slow or broken brochure websites as fast, mobile-first, WhatsApp-first sites. Invoices come from ${site.billingEntity}. FactSmith Sites is separate from FactSmith the product (www.factsmith.co.za).

Key facts:
- Price: ${price} A ${zar(site.depositZar)} deposit starts the job; the balance is due within 7 days of hand-over.
- Scope: a 4 to 6 page static site, two focused revision rounds after the first private preview, hand-over of all source files.
- Domain and hosting: you keep your domain, or a new .co.za is registered in your name at actual cost (typically R90 to R150). Keep your hosting if it can serve the site, or move to free static hosting.
- Included on every site: map with directions, SEO, AEO and GEO groundwork, Google Search Console and Bing set up in your name, Google Analytics and a private stats page, WhatsApp and tap-to-call.
- Added where it fits the business and included in the price: weather and tides pages, an installable guest app that works offline, researched nearby attractions and restaurants pages.
- Not in the fee: a new domain (actual cost), ongoing hosting or renewal bills, pages beyond six (quoted separately), photography, logo design or writing from scratch, shops, booking engines and payments, a CMS, retainers, blogs and link-building.
- Contact: WhatsApp +27 72 500 5179 (${site.contactName}), ${site.email}

## Pages
- [Home](${site.url}/): the free website check and the fixed price
- [Offer](${site.url}/offer/): price, what is and is not included, common questions
- [Included](${site.url}/included/): everything that comes with a site, and the admin page
- [How it is built](${site.url}/technical/): stack, SEO, AEO and GEO actions, process
- [Method](${site.url}/method/): the steps from first message to go-live
- [Work](${site.url}/work/): live and in-process client sites
- [South Coast](${site.url}/south-coast/): the towns we serve
- [Contact](${site.url}/contact/)

## Live client sites
- [Eagle's Roost B&B, Umtentweni](https://eaglesroost.co.za)
- [Three Birds Online Learning Centre, Anerley](${site.threeBirdsUrl})
- [Sasta Hill Lodge, Wild Coast](https://sastahill.co.za)
- [Andante Lodge, Pretoria East](https://andantelodge.co.za)
- [Mydo Fishing Lures](https://mydofishinglures.co.za)

Prices and offers on this site are the source of truth; last reviewed 22 October 2026.
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
