// FactSmith Sites, studio brochure. Vault: FactSmith-Sites/01-Client-Brief/(C) Offer Spec v2 Draft 2026-10-28.md

// Prices are set here, once. Every page, the FAQ, the JSON-LD, the share text and llms.txt read from
// these, so a change goes out in one release.
const STARTER_PRICE = 4000;
const BROCHURE_PRICE = 7500;
const BUSINESS_PRICE = 12500;
const DEPOSIT = 2000;
const APP_STARTER_PRICE = 1500;
/** Admin dashboard: one-off add-on on Starter and Brochure, included on Business and Custom (Emilio, 2026-10-28). */
const ADMIN_PRICE = 1500;
/** 4000 becomes "R4 000" (plain space, safe in meta tags and text files). */
export const zar = (n: number) => "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const site = {
  name: "FactSmith Sites",
  shortName: "Sites",
  domain: "sites.factsmith.co.za",
  url: "https://sites.factsmith.co.za",
  email: "emilio@factsmith.co.za",
  /** Every "Book a consult" button goes here (same Cal.com link as www.factsmith.co.za). */
  bookUrl: "https://cal.com/emilio-martin-zmfawz/30min",
  bookLabel: "Book a consult",
  /** Sharon Cooper answers South Coast enquiries; Emilio answers the rest of the country and abroad. */
  contactName: "Sharon Cooper",
  phoneDisplay: "072 500 5179",
  phoneTel: "+27725005179",
  whatsappLink: "https://wa.me/27725005179",
  whatsappMessage: "Hi Sharon, I saw FactSmith Sites. I need a website for my business.",
  emilio: {
    name: "Emilio Martin",
    phoneDisplay: "082 413 0438",
    phoneTel: "+27824130438",
    whatsappLink: "https://wa.me/27824130438",
    whatsappMessage: "Hi Emilio, I saw FactSmith Sites. I need a website for my business.",
  },
  description: `Websites for small businesses across South Africa, from ${zar(STARTER_PRICE)}. Fixed prices, WhatsApp as the main button, your domain and source files stay yours. Outside South Africa? Ask for a quote.`,
  /** schema.org priceRange. */
  priceRange: `${zar(STARTER_PRICE)}-${zar(BUSINESS_PRICE)}+`,
  /** Alt text for the share image. */
  ogImageAlt: `FactSmith Sites, websites for small businesses from ${zar(STARTER_PRICE)}`,
  ogImage: "/images/og-card.png",
  /**
   * GitHub Pages has not issued the TLS certificate for this subdomain yet.
   * While true, og:image / og:url are emitted over http: WhatsApp and Facebook
   * refuse to fetch a link-preview card from a host with an invalid cert, so
   * https here means no preview image in a group post at all.
   * Flip to false the moment the certificate lands.
   */
  certPending: false,
  /** GA4 measurement ID (property "FactSmith Sites", 558194708). Disclosed on /privacy. */
  ga4: "G-G557XL2BNP",
  productUrl: "https://www.factsmith.co.za",
  threeBirdsUrl: "https://threebirdscentre.co.za",
  billingEntity: "SELECT STAR DATA ENGINEERS (Pty) Ltd",
  startingPriceZar: STARTER_PRICE,
  brochurePriceZar: BROCHURE_PRICE,
  depositZar: DEPOSIT,
  adminAddonPriceZar: ADMIN_PRICE,
} as const;

/**
 * The tiers, cheapest first. `price` is the "from" price in rand; Custom is quoted.
 * Library pages are free where they fit the business (see libraryPages); Starter gets template pages only.
 */
export const tiers = [
  {
    slug: "starter",
    name: "Starter",
    price: STARTER_PRICE,
    priceLabel: `from ${zar(STARTER_PRICE)}`,
    pages: "3 custom pages",
    app: `Phone app ${zar(APP_STARTER_PRICE)} one-off`,
    admin: `Admin dashboard ${zar(ADMIN_PRICE)} one-off`,
    library: "Template library pages where they fit, for example weather and tides",
    forWho: "A small business that needs a clear, fast site and a WhatsApp button",
  },
  {
    slug: "brochure",
    name: "Brochure",
    price: BROCHURE_PRICE,
    priceLabel: zar(BROCHURE_PRICE),
    pages: "4 to 6 custom pages",
    app: "Phone app included",
    admin: `Admin dashboard ${zar(ADMIN_PRICE)} one-off`,
    library: "Every library page that fits, including researched ones such as attractions and restaurants",
    forWho: "Guest houses, lodges, tutors, trades and professionals",
  },
  {
    slug: "business",
    name: "Business",
    price: BUSINESS_PRICE,
    priceLabel: `from ${zar(BUSINESS_PRICE)}`,
    pages: "About 10 custom pages",
    app: "Phone app included",
    admin: "Admin dashboard included",
    library: "Every library page that fits",
    forWho: "Services by job, areas served, certificates and case studies: larger firms",
  },
  {
    slug: "custom",
    name: "Custom",
    price: null,
    priceLabel: "Quoted",
    pages: "Scoped with you",
    app: "Phone app included",
    admin: "Admin dashboard included",
    library: "Every library page that fits",
    forWho: "WordPress sites, WooCommerce shops, bookings, payments, dashboards and live data",
  },
] as const;

export const nav = [
  { label: "Work", href: "/work/" },
  { label: "Included", href: "/included/" },
  { label: "Tech", href: "/technical/" },
  { label: "Method", href: "/method/" },
  { label: "Phone app", href: "/phone-app/" },
  { label: "Offer", href: "/offer/" },
  { label: "South Coast", href: "/south-coast/" },
  { label: "Contact", href: "/contact/" },
] as const;

/** Live samples. South Coast first (Sharon, Round 2 Q4), the rest after. */
export const samples = [
  {
    slug: "eagles-roost",
    snip: "/images/work/snips/eagles-roost.webp",
    title: "Eagle’s Roost B&B",
    kind: "Live client, Umtentweni, South Coast",
    url: "https://eaglesroost.co.za",
    blurb:
      "Heritage Port Master’s House above the Umzimkulu. WhatsApp booking, rooms and rates, experiences and guest recommendations on the home page. New: an hour-by-hour weather page with tides, Windy wave and storm maps and a live satellite view.",
    hero: "/images/work/eagles-roost/hero.jpg",
    heroAlt: "Eagle’s Roost from the air, greenery and ocean behind the house",
    images: [
      { src: "/images/work/eagles-roost/verandah.jpg", alt: "Covered verandah at first light" },
    ],
    status: "live" as const,
  },
  {
    slug: "three-birds",
    snip: "/images/work/snips/three-birds.webp",
    title: "Three Birds Online Learning Centre",
    kind: "Live client, Anerley",
    url: "https://threebirdscentre.co.za",
    blurb:
      "The actual brochure package: fast on a phone, WhatsApp as the main button, domain in the client’s name, R0 hosting.",
    status: "live" as const,
  },
  {
    slug: "mydo",
    snip: "/images/work/snips/mydo.webp",
    title: "Mydo Fishing Lures",
    kind: "Live client, online shop, ZA and export",
    url: "https://mydofishinglures.co.za",
    blurb:
      "A WooCommerce shop (WordPress) for hand-made fishing lures. Baitswimmers by weight and rigging, dropper packs, and separate South African and international pricing.",
    hero: "/images/work/mydo/hero.jpg",
    heroAlt: "Mydo silver bullet baitswimmer lure",
    images: [
      { src: "/images/work/mydo/baitswimmer.jpg", alt: "Mydo three-ounce baitswimmer" },
      { src: "/images/work/mydo/flying-fish.jpg", alt: "Mydo flying fish head lure" },
    ],
    status: "live" as const,
  },
  {
    slug: "khaya-la-manzi",
    snip: "/images/work/snips/khaya-la-manzi.webp",
    title: "Khaya La Manzi Guest Lodge",
    kind: "Live client, Hibberdene",
    url: "https://khayalamanzi.co.za",
    blurb:
      "Overhaul of a table-layout site that wasn't mobile and had no tap-to-call. Ten pages with a page per sea-facing apartment, NightsBridge booking buttons, WhatsApp on every unit, an hour-by-hour weather page with sea temperature, tides, Windy maps and satellite, and a new sunset logo.",
    hero: "/images/work/khaya/deck.jpg",
    heroAlt: "Breakfast table on a Khaya La Manzi deck above the palms and the Indian Ocean",
    images: [
      { src: "/images/work/khaya/lodge.jpg", alt: "Khaya La Manzi lodge building at dusk" },
      { src: "/images/work/khaya/dolphin.jpg", alt: "Sea-facing bedroom in the Dolphin apartment" },
    ],
    status: "live" as const,
  },
  {
    slug: "factsmith",
    snip: "/images/work/snips/factsmith.webp",
    title: "FactSmith",
    kind: "Our product site",
    url: "https://www.factsmith.co.za",
    blurb:
      "Capability ceiling, a full marketing site we built for our own product. Bigger than the standard brochure package.",
    status: "live" as const,
  },
] as const;

/**
 * Approved and in process. Visuals from real project photography and
 * agreed mockups, not stock. Henton is Cape Town / larger than the brochure bar.
 */
export const inProcess = [
  {
    slug: "henton",
    snip: "/images/work/snips/henton.webp",
    title: "Henton Timber Homes",
    kind: "Melkbosstrand · timber construction",
    package: "In process · preview live",
    blurb:
      "Full rebuild of a static mirror of a dead WordPress install. Real project photography, ITFB award, enquiry path. Work-in-progress preview is live for Horton / Tamryn review.",
    previewUrl: "https://sites.factsmith.co.za/henton-homes/",
    hero: "/images/work/henton/elephant-hide.jpg",
    heroAlt: "Elephant Hide Lodge: a Henton timber structure",
    mockupPdf: {
      href: "/mockups/henton-timber-homes-proposed-website.pdf",
      label: "Download the 7-screen proposal (PDF)",
    },
    images: [
      {
        src: "/images/work/henton/house-goosen.jpg",
        alt: "House Goosen timber home",
      },
      {
        src: "/images/work/henton/deck.jpg",
        alt: "Henton decking",
      },
      {
        src: "/images/work/henton/hero.png",
        alt: "Henton Homes featured build",
      },
    ],
    currentUrl: "https://www.hentonhomes.co.za",
  },
  {
    slug: "jbay-surf-view",
    snip: "/images/work/snips/jbay-surf-view.webp",
    title: "JBay Surf View",
    kind: "Jeffreys Bay · three self-catering surf flats",
    package: "Concept · preview live",
    blurb:
      "Built from a digital presence audit: WhatsApp on every flat, live availability calendar per unit, surf guide, hourly surf and weather forecast with swell and wind direction, tides, Windy wave and storm maps, EUMETSAT satellite, EN/AF toggle. Concept preview, not yet approved by the owner.",
    previewUrl: "https://sites.factsmith.co.za/jbay-surf-view/",
    hero: "/images/work/jbay-surf-view/hero-deck.jpg",
    heroAlt: "JBay Surf View deck looking over the bay",
    images: [
      { src: "/images/work/jbay-surf-view/wave.jpg", alt: "A wave breaking at Supertubes" },
      { src: "/images/work/jbay-surf-view/aerial.jpg", alt: "Aerial view of the flats and the bay" },
    ],
    currentUrl: "https://jbaysurfview.com",
  },
] as const;

/**
 * Standard on every FactSmith site, from the first build, not add-ons.
 * Shown on /included. `example` links to a live page that shows it.
 */
export const standardFeatures = [
  {
    title: "Map and directions",
    text: "Your pin on a live map, with one-tap Google Maps directions to the door.",
    example: { label: "Eagle’s Roost contact", href: "https://eaglesroost.co.za/contact/" },
  },
  {
    title: "Fly-to",
    text: "A “Fly there in Google Earth” button next to the map. One tap flies visitors in over your building in 3D, so they see the place before they arrive.",
    example: { label: "Khaya La Manzi contact", href: "https://sites.factsmith.co.za/khaya-la-manzi/contact.html" },
  },
  {
    title: "SEO",
    text: "Fast static pages, a title and description on every page, sitemap, robots.txt, and schema.org data for your business, address and reviews.",
  },
  {
    title: "GEO: generative engine optimisation",
    text: "An llms.txt file with your key facts, and plain factual pages, so ChatGPT, Gemini and Perplexity can describe you correctly.",
    example: { label: "Eagle’s Roost llms.txt", href: "https://eaglesroost.co.za/llms.txt" },
  },
  {
    title: "AEO: answer engine optimisation",
    text: "Real questions answered in a FAQ with FAQPage schema, so Google and voice assistants can quote the answer and name you.",
  },
  {
    title: "Your analytics",
    text: `Google Search Console and Bing set up in your name, and Google Analytics, so the numbers belong to you. The admin dashboard that shows them in one place is included on Business and Custom, and an add-on on Starter and Brochure (${zar(ADMIN_PRICE)} one-off).`,
  },
  {
    title: "WhatsApp and tap-to-call",
    text: "A WhatsApp button and a tap-to-call number on every page, built for the phone first.",
  },
] as const;

/**
 * The page library: reusable pages, free where they fit the business (a guest house gets weather,
 * a fencing firm does not). `kind`: template = Starter and up, researched = Brochure and up,
 * addon = priced separately. Images are snips of the live Eagle's Roost site.
 */
export const libraryPages = [
  {
    title: "Weather and tides",
    kind: "template" as const,
    text: "Hour-by-hour weather for today and tomorrow, a 7-day outlook, wind, swell and sea temperature, Windy wave and storm maps and the latest satellite picture. A tides page shows high and low tide, a 7-day tide curve and the moon, for beach walks, fishing and rock pools.",
    image: "/images/work/eagles-roost/feature-weather.webp",
    imageAlt: "Eagle's Roost weather page on a phone: temperature, wind, sea, water temperature, next tide",
    phone: true,
    example: { label: "Eagle’s Roost weather", href: "https://eaglesroost.co.za/weather/" },
    extra: { label: "and tides", href: "https://eaglesroost.co.za/tides/" },
  },
  {
    title: "A guest app that works without signal",
    kind: "app" as const,
    text: "A guest guide your visitors add to their home screen: Wi-Fi, check-in times, house rules, weather now, places to eat and one-tap WhatsApp requests. It keeps the last good copy on the phone, so it still opens with no signal.",
    image: "/images/work/eagles-roost/feature-guide.webp",
    imageAlt: "Eagle's Roost guest guide app: Wi-Fi, weather now, the house and check-in times",
    phone: true,
    example: { label: "Eagle’s Roost guest guide", href: "https://eaglesroost.co.za/guide/" },
  },
  {
    title: "Nearby attractions, researched",
    kind: "researched" as const,
    text: "We research what is around you (beaches, walks, the river, family days out, fishing guides) and write a page with real distances from your door, photos and a map, so guests plan their stay on your site.",
    image: "/images/work/eagles-roost/feature-attractions.webp",
    imageAlt: "Eagle's Roost attractions page: guided fishing, the main beach and the whale deck",
    phone: false,
    example: { label: "Eagle’s Roost attractions", href: "https://eaglesroost.co.za/attractions/" },
  },
  {
    title: "Where to eat, researched",
    kind: "researched" as const,
    text: "Restaurants and takeaways near you, grouped by area, each with address, phone, website and a map, and a note where you have eaten there yourself.",
    image: "/images/work/eagles-roost/feature-dining.webp",
    imageAlt: "Eagle's Roost restaurants page: cards per restaurant with address, phone and map",
    phone: false,
    example: { label: "Eagle’s Roost restaurants", href: "https://eaglesroost.co.za/dining/" },
  },
] as const;

/**
 * The admin dashboard: one private page per client site. Included on Business and Custom, a one-off add-on on
 * Starter and Brochure (ADMIN_PRICE). Scope per Emilio, 2026-10-28: site stats, project completion, task
 * reminders and one page of links. Sellable from 2026-10-28 (Emilio). Each client gets their own page on the hub,
 * /client/<id>/ (factsmith-website), behind a Cloudflare Access rule for that client only; setup steps are in the
 * vault Site Process Flow, section 9a. Reminders are kept by us in the repo; there are no email reminders.
 */
export const adminFeatures = [
  "Your own private page: you sign in with your Google account, and only you and we can open it",
  "Site stats: visitors, sessions, page views and average visit length for the last 7, 28 or 90 days, with sessions per day as a chart",
  "Top pages, where visitors came from and which countries they are in",
  "Google searches: the words people typed to find you, how often you were shown and clicked, and your average position, from Search Console",
  "Project completion: a checklist of what is done on your site, ticked from automatic checks of the live pages (titles, sitemap, schema and the analytics tag)",
  "Task reminders: what is still to do on your site, so nothing waits unseen",
  "One page of links to the accounts in your name, such as Google Analytics, Search Console and your social pages, so you do not hunt for them",
  "Set up for you: we give your Google account access to your numbers and fill in the reminders and links, so there is nothing for you to edit. On Business and Custom we also keep the reminders and links up to date",
] as const;

export const methodSteps = [
  {
    title: "Spot the problem",
    text: "Your site breaks on a phone, has no WhatsApp button, or you cannot change it yourself.",
  },
  {
    title: "Book a consult",
    text: "A short call to agree what the site needs and which tier fits. No report, no pitch deck.",
  },
  {
    title: "Pack + deposit",
    text: `Invoice, domain form, content questions, hosting note, and scope. A ${zar(DEPOSIT)} deposit starts a Starter or Brochure job.`,
  },
  {
    title: "Domain and hosting, your call",
    text: "Already have a domain? We use it. Need one? Registered in your name at cost. Hosting: keep what you pay for, or downscale to free static.",
  },
  {
    title: "Build from a sample",
    text: "Mobile-first site. WhatsApp as the main button. A contact form where you want one, once it is connected and tested. Map with a Google Earth fly-to, SEO, GEO and AEO are built in from the first build, not add-ons. Library pages such as weather are added where they fit.",
  },
  {
    title: "Photos: placeholders first, then yours",
    text: "We build with your old photos or stock, each in a named slot (dolphin-1, home-hero). After your shoot, each new photo is saved under its slot name and replaces the placeholder, no layout changes.",
    link: {
      label: "Example: Khaya La Manzi photo slots",
      href: "https://sites.factsmith.co.za/khaya-la-manzi/photos.html",
    },
  },
  {
    title: "Preview + two rounds",
    text: "Sharon walks you through a private preview. Two focused revision rounds are in the fee.",
  },
  {
    title: "Go live",
    text: "Deploy on the host you chose. Balance on hand-over.",
  },
] as const;

export const towns = [
  "Hibberdene",
  "Umzumbe",
  "Anerley",
  "Umtentweni",
  "Port Shepstone",
  "Oslo Beach",
  "Shelly Beach",
  "Uvongo",
  "Margate",
  "Ramsgate",
  "Southbroom",
  "Port Edward",
] as const;

/**
 * The phone app: an installable web app (PWA) on the client's own site at /guide/, no app store.
 * Live at Eagle's Roost (2026-10-20) and Khaya La Manzi (confirmed by Emilio, 2026-10-28). Included from Brochure up; R1 500 one-off on Starter (Emilio, 2026-10-28).
 * Hard rules (Offer Spec): no secrets in the app, no review gating.
 */
export const phoneApp = {
  name: "Phone app for your visitors",
  lede: "An installable guide on your own website. Visitors scan a QR code or tap a link, add it to their home screen, and it still opens with no signal.",
  status: "Live at Eagle’s Roost and Khaya La Manzi",
  /** Included from Brochure up; one-off on Starter. Customisation beyond the site's own content is quoted. */
  starterPriceZar: APP_STARTER_PRICE,
  pricing: `Included on Brochure, Business and Custom. On Starter it is a one-off ${zar(APP_STARTER_PRICE)}. It is live at Eagle’s Roost and Khaya La Manzi. It repackages what is already on your website, so there is nothing to re-write. Customisation beyond that is quoted after a short consult.`,
  example: { label: "Eagle’s Roost guest guide", href: "https://eaglesroost.co.za/guide/" },
  image: "/images/work/eagles-roost/feature-guide.webp",
  imageAlt: "Eagle's Roost guest guide app: Wi-Fi, weather now, the house and check-in times",
  forVisitors: [
    "Opens from a QR card or a link in your welcome message, no app store",
    "Keeps the last good copy on the phone, so it works without signal",
    "Key information one tap away: Wi-Fi, opening or check-in times, rules, contacts",
    "Live weather and local recommendations where they are relevant",
    "Requests and orders go straight to your WhatsApp",
  ],
  forYou: [
    "Fewer repeat questions by phone and message",
    "A way to offer extras: orders, upgrades, bookings by WhatsApp",
    "Problems reach you while the visitor is still with you",
    "A one-tap Google review link for every visitor, never filtered by rating",
  ],
  /** Where it fits. The test is relevant content: information people need on their phone, on the spot. */
  fits: [
    ["Guest houses, lodges and self-catering", "Wi-Fi, check-in, house rules, what to do nearby. Live at Eagle’s Roost and Khaya La Manzi."],
    ["Restaurants, venues and events", "Menu, hours, map, how to book, what to expect on the day."],
    ["Tour and activity operators", "Itinerary, what to bring, safety information, meeting point."],
    ["Estates, body corporates and offices", "Rules, contacts, how to report a problem, visitor information."],
    ["Anyone else with useful content", "If visitors need it on their phone, in the moment, ask us."],
  ],
  rules: [
    "No passwords or codes stored in the app: the Wi-Fi password travels only in the link or QR code",
    "No review gating: every visitor gets the same review link",
    "Built for your content first. If your content is not useful on a phone, we say so",
  ],
} as const;

/** Common questions: shown in full on /offer, four of them on the home page. Answers read prices from above. */
export const faq = [
  {
    q: "How much does a website cost?",
    a: `Starter is from ${zar(STARTER_PRICE)} (3 custom pages), Brochure is ${zar(BROCHURE_PRICE)} (4 to 6 pages), Business is from ${zar(BUSINESS_PRICE)} (about 10 pages), and Custom work is quoted. A ${zar(DEPOSIT)} deposit starts a Starter or Brochure job and the balance is due within 7 days of hand-over. A new .co.za domain, if you need one, is at actual cost, typically R90 to R150.`,
  },
  {
    q: "What are library pages?",
    a: "Reusable pages we have already built and tested, such as weather and tides, nearby attractions and where to eat. If a page fits your business we add it at no page-building charge. Starter gets the template pages; Brochure and up also get the researched ones.",
  },
  {
    q: "What is the phone app?",
    a: `An installable app version of your website content that opens from a QR code and works with no signal. It is included on Brochure, Business and Custom, and a one-off ${zar(APP_STARTER_PRICE)} on Starter. Customisation beyond your own content is quoted.`,
  },
  {
    q: "What is the admin dashboard?",
    a: `One private page for your site: your stats, a checklist of what is done, reminders of what is still to do, and links to the accounts in your name, such as Google Analytics and Search Console. You sign in with Google and only you and we can open it. We set it up, and on Business and Custom we keep the reminders and links current. It is included on Business and Custom, and a one-off ${zar(ADMIN_PRICE)} set-up add-on on Starter and Brochure.`,
  },
  {
    q: "Will a new website bring me more enquiries?",
    a: "We cannot promise a number. We fix what loses enquiries: a site that breaks on a phone, no WhatsApp button, no clear price. The admin dashboard, included on Business and Custom and an add-on on Starter and Brochure, then shows how many people visit and which Google searches find you.",
  },
  {
    q: "Who owns the website?",
    a: "You do. The domain is in your name and we hand over all source files.",
  },
  {
    q: "Do I have to move my domain or hosting?",
    a: "No. We use the domain you have. Keep your hosting if it can serve the new site, or downscale to free static hosting and stop paying for what you no longer need.",
  },
  {
    q: "I am outside South Africa. Can you build my site?",
    a: "Yes, by quote. Prices on this page are in rand. Message Emilio and we agree the scope, currency and payment method before any work starts.",
  },
  {
    q: "Can you build a WordPress site or an online shop?",
    a: "Yes. Our standard sites are fast static pages with nothing to log in to. When you want to edit pages yourself or sell online, we build a WordPress site or a WooCommerce shop instead. That is Custom work, quoted after a consult. Mydo Fishing Lures is a live WooCommerce shop with separate South African and international pricing.",
  },
  {
    q: "What is not in the fee?",
    a: "A new domain at actual cost, ongoing hosting or renewal bills, more custom pages than your tier allows, photography, logo design or writing from scratch, shops, booking engines and payments (WordPress and WooCommerce sites are Custom work, quoted), retainers, blogs, link-building, and third-party or API costs.",
  },
];
