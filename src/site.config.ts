// FactSmith Sites — studio brochure. Vault: FactSmith-Sites/01-Client-Brief/Offer Spec.md

export const site = {
  name: "FactSmith Sites",
  shortName: "Sites",
  domain: "sites.factsmith.co.za",
  url: "https://sites.factsmith.co.za",
  email: "factsmith@outlook.com",
  /** Sharon Cooper is the published contact for Sites enquiries. */
  contactName: "Sharon Cooper",
  phoneDisplay: "072 500 5179",
  phoneTel: "+27725005179",
  whatsappLink: "https://wa.me/27725005179",
  whatsappMessage:
    "Hi Sharon — I saw FactSmith Sites. We need a website rebuild on the South Coast.",
  description:
    "Websites for South Coast small businesses whose current site is costing them enquiries. R7 500 brochure rebuilds — R4 000 for the first five. Keep your domain if you have one; keep or downscale hosting.",
  ogImage: "/images/og-card.png",
  /**
   * GitHub Pages has not issued the TLS certificate for this subdomain yet.
   * While true, og:image / og:url are emitted over http — WhatsApp and Facebook
   * refuse to fetch a link-preview card from a host with an invalid cert, so
   * https here means no preview image in a group post at all.
   * Flip to false the moment the certificate lands.
   */
  certPending: true,
  productUrl: "https://www.factsmith.co.za",
  threeBirdsUrl: "https://threebirdscentre.co.za",
  billingEntity: "SELECT STAR DATA ENGINEERS (Pty) Ltd",
  /** Launch-special price. Reverts to standardPriceZar once the 5 slots are gone. */
  priceZar: 4000,
  /** Normal published price after the launch five. */
  standardPriceZar: 7500,
  depositZar: 2000,
} as const;

/**
 * Launch special — the first 5 South Coast sites at R4 000 instead of R7 500.
 * A deposit secures the slot and locks the price.
 * Set active: false once five deposits are in; the pages then fall back to
 * site.standardPriceZar automatically.
 */
export const launchOffer = {
  active: true,
  slots: 5,
  headline: "First 5 sites only",
  lede: "R4 000 instead of R7 500.",
  detail:
    "The first five South Coast rebuilds are R4 000 — a R2 000 deposit secures your slot and locks the price. After the five, the published price is R7 500.",
  bonus:
    "On these five, Search Console + Bing ownership setup (normally R1 000) is included free.",
  turnaround: "Mockups this weekend. Your new site live next week.",
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Included", href: "/included" },
  { label: "Method", href: "/method" },
  { label: "Offer", href: "/offer" },
  { label: "South Coast", href: "/south-coast" },
  { label: "Contact", href: "/contact" },
] as const;

/** Live samples. */
export const samples = [
  {
    slug: "factsmith",
    title: "FactSmith",
    kind: "Our product site",
    url: "https://www.factsmith.co.za",
    blurb:
      "Capability ceiling — a full marketing site we built for our own product. Bigger than the standard brochure package.",
    status: "live" as const,
  },
  {
    slug: "three-birds",
    title: "Three Birds Online Learning Centre",
    kind: "Live client — Anerley",
    url: "https://threebirdscentre.co.za",
    blurb:
      "The actual brochure package: Astro build, WhatsApp-first, domain in the client’s name, R0 hosting.",
    status: "live" as const,
  },
  {
    slug: "sasta-hill",
    title: "Sasta Hill Lodge",
    kind: "Live client — Lwandile Point, Wild Coast",
    url: "https://sastahill.co.za",
    blurb:
      "Dorm-style self-catering lodge in the Transkei. Five pages with a live weather and wind/wave page, Google map, and SEO, FAQ schema and llms.txt from day one.",
    hero: "/images/work/sasta-hill/hero.webp",
    heroAlt: "Wild Coast landscape and seascape at Lwandile",
    images: [
      { src: "/images/work/sasta-hill/homestead.webp", alt: "Wild Coast homestead at Lwandile" },
      { src: "/images/work/sasta-hill/hike.webp", alt: "Hiking to Lwandile with a local fishing guide" },
    ],
    status: "live" as const,
  },
  {
    slug: "andante-lodge",
    title: "Andante Lodge",
    kind: "Live client — Pretoria East",
    url: "https://andantelodge.co.za",
    blurb:
      "Guest lodge and venue. Rebuilt around a hero and booking CTA, suites, venues and a clear contact footer, where the old site had no visible address, phone or rates.",
    hero: "/images/work/andante/hero.jpg",
    heroAlt: "Bell Luxury Suite bedroom at Andante Lodge",
    images: [
      { src: "/images/work/andante/garden-suite.webp", alt: "Garden Suite at Andante Lodge" },
    ],
    status: "live" as const,
  },
  {
    slug: "mydo",
    title: "Mydo Fishing Lures",
    kind: "Live client — online shop, ZA and export",
    url: "https://mydofishinglures.co.za",
    blurb:
      "WooCommerce shop for hand-made fishing lures. Baitswimmers by weight and rigging, dropper packs, and separate South African and international pricing.",
    hero: "/images/work/mydo/hero.jpg",
    heroAlt: "Mydo silver bullet baitswimmer lure",
    images: [
      { src: "/images/work/mydo/baitswimmer.jpg", alt: "Mydo three-ounce baitswimmer" },
      { src: "/images/work/mydo/flying-fish.jpg", alt: "Mydo flying fish head lure" },
    ],
    status: "live" as const,
  },
  {
    slug: "eagles-roost",
    title: "Eagle’s Roost B&B",
    kind: "Live client — Umtentweni, South Coast",
    url: "https://eaglesroost.co.za",
    blurb:
      "Heritage Port Master’s House above the Umzimkulu. WhatsApp-first booking, rooms and rates, experiences and guest recommendations on the home page. New: an hour-by-hour weather page with tides, Windy wave and storm maps and a live satellite view.",
    hero: "/images/work/eagles-roost/hero.jpg",
    heroAlt: "Eagle’s Roost from the air, greenery and ocean behind the house",
    images: [
      { src: "/images/work/eagles-roost/verandah.jpg", alt: "Covered verandah at first light" },
    ],
    status: "live" as const,
  },
] as const;

/**
 * Approved and in process. Visuals from real project photography and
 * agreed mockups — not stock. Henton is Cape Town / larger than the brochure bar.
 */
export const inProcess = [
  {
    slug: "khaya-la-manzi",
    title: "Khaya La Manzi Guest Lodge",
    kind: "Hibberdene · South Coast",
    package: "In process · preview live",
    blurb:
      "Overhaul of a table-layout site that wasn't mobile and had no tap-to-call. Ten pages with a page per sea-facing apartment, NightsBridge booking buttons, WhatsApp on every unit, an hour-by-hour weather page with sea temperature, tides, Windy maps and satellite, and a new sunset logo. Approved; photo shoot next.",
    previewUrl: "https://sites.factsmith.co.za/khaya-la-manzi/",
    hero: "/images/work/khaya/deck.jpg",
    heroAlt: "Breakfast table on a Khaya La Manzi deck above the palms and the Indian Ocean",
    images: [
      { src: "/images/work/khaya/lodge.jpg", alt: "Khaya La Manzi lodge building at dusk" },
      { src: "/images/work/khaya/dolphin.jpg", alt: "Sea-facing bedroom in the Dolphin apartment" },
    ],
    currentUrl: "https://khayalamanzi.co.za",
  },
  {
    slug: "henton",
    title: "Henton Timber Homes",
    kind: "Melkbosstrand · timber construction",
    package: "In process · preview live",
    blurb:
      "Full rebuild of a static mirror of a dead WordPress install. Real project photography, ITFB award, enquiry path. Work-in-progress preview is live for Horton / Tamryn review.",
    previewUrl: "https://sites.factsmith.co.za/henton-homes/",
    hero: "/images/work/henton/elephant-hide.jpg",
    heroAlt: "Elephant Hide Lodge — a Henton timber structure",
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
  {
    slug: "secure-electric-fencing-jbay",
    title: "Secure Electric Fencing JBay",
    kind: "Jeffreys Bay · electric fencing",
    package: "Concept · preview live",
    blurb:
      "Full six-page concept site for the Jeffreys Bay branch, which today has no site of its own. Built around what the strongest competitor sites share: services by job, fast repairs, a compliance certificate page, areas, FAQ and quote form. Not yet approved.",
    previewUrl: "https://sites.factsmith.co.za/secure-electric-fencing-jbay/",
    hero: "/images/work/secure-electric-fencing/hero-sign.jpg",
    heroAlt: "Danger electric fence sign on a razor-wire fence (stock photo)",
    images: [{ src: "/images/work/secure-electric-fencing/warning.jpg", alt: "Warning electric fence sign on a post (stock photo)" }],
  },
  {
    slug: "secure-electric-fencing-vaal",
    title: "Secure Electric Fencing Vaal",
    kind: "Vanderbijlpark · fencing, gates, security",
    package: "Concept · preview live",
    blurb:
      "Full six-page rebuild of a one-page company-profile site. Leads with trading since 2000 and one team for fence, gates, garage doors, alarms and CCTV, plus certificate, areas and FAQ pages. Not yet approved.",
    previewUrl: "https://sites.factsmith.co.za/secure-electric-fencing-vaal/",
    hero: "/images/work/secure-electric-fencing/hero-sign.jpg",
    heroAlt: "Danger electric fence sign on a razor-wire fence (stock photo)",
    images: [{ src: "/images/work/secure-electric-fencing/warning.jpg", alt: "Warning electric fence sign on a post (stock photo)" }],
  },
  {
    slug: "pollution-control-services",
    title: "Pollution Control Services",
    kind: "Jeffreys Bay · 24/7 industrial cleaning and hazmat response",
    package: "Concept · preview live",
    blurb:
      "Full concept site for a 175-staff industrial cleaner: services by job, fleet, compliance, areas and case studies, with a Fleet Live demo page that maps the trucks. Not yet approved.",
    previewUrl: "https://sites.factsmith.co.za/pollution-control-services/",
    hero: "/images/work/pollution-control-services/hero.jpg",
    heroAlt: "Pollution Control Services super sucker truck on site",
    images: [
      { src: "/images/work/pollution-control-services/jetting-unit.jpg", alt: "High-pressure jetting unit" },
      { src: "/images/work/pollution-control-services/fleet-line.jpg", alt: "Pollution Control Services fleet lined up" },
    ],
  },
] as const;

/** Free opener for prospects — lighter than the Henton Timber Homes deep audit. */
export const freeAuditPack = {
  name: "Free website check + homepage sample",
  notHenton: "Not a 10-page condition report or 7-screen redesign. That stays for after they reply.",
  deliverables: [
    "Half-page findings note (3–5 concrete fails)",
    "One mobile screenshot of the worst fail",
    "One homepage sample (HTML mock) using their real name/photos where legal",
  ],
  nextStep: "If they like the sample: R4 000 pack (deposit + domain form).",
} as const;

/**
 * Standard on every FactSmith site, from the first build — not add-ons.
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
    title: "Live weather",
    text: "Hour-by-hour charts for today and tomorrow, a 7-day outlook, sea temperature and tides, animated Windy wave and storm maps, and the latest satellite picture.",
    example: { label: "Eagle’s Roost weather", href: "https://eaglesroost.co.za/weather/" },
  },
  {
    title: "SEO",
    text: "Fast static pages, a title and description on every page, sitemap, robots.txt, and schema.org data for your business, address and reviews.",
  },
  {
    title: "GEO — generative engine optimisation",
    text: "An llms.txt file with your key facts, and plain factual pages, so ChatGPT, Gemini and Perplexity can describe you correctly.",
    example: { label: "Sasta Hill llms.txt", href: "https://sastahill.co.za/llms.txt" },
  },
  {
    title: "AEO — answer engine optimisation",
    text: "Real questions answered in a FAQ with FAQPage schema, so Google and voice assistants can quote the answer and name you.",
  },
  {
    title: "WhatsApp and tap-to-call",
    text: "A WhatsApp button and a tap-to-call number on every page, built for the phone first.",
  },
] as const;

export const methodSteps = [
  {
    title: "Spot the problem",
    text: "Your site breaks on a phone, has no WhatsApp button, or you cannot change it yourself.",
  },
  {
    title: "Short opener",
    text: "We send a four-line message and one screenshot of the fail — not a ten-page report.",
  },
  {
    title: "Pack + deposit",
    text: "Invoice, domain form, content questions, hosting note, and scope. R2 000 starts the job.",
  },
  {
    title: "Domain and hosting — your call",
    text: "Already have a domain? We use it. Need one? Registered in your name at cost. Hosting: keep what you pay for, or downscale to free static.",
  },
  {
    title: "Build from a sample",
    text: "Mobile-first site. WhatsApp as the main button. Contact form included.",
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
