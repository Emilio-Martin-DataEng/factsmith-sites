// FactSmith Sites — studio brochure. Vault: FactSmith-Sites/01-Client-Brief/Offer Spec.md

// Prices and the launch offer are set here, once. Every page, the FAQ, the JSON-LD,
// the share text and llms.txt read from these, so a change goes out in one release.
const LAUNCH_PRICE = 4000;
const STANDARD_PRICE = 7500;
const DEPOSIT = 2000;
const LAUNCH_ACTIVE = true;
const LAUNCH_SLOTS = 5;
/** The price a visitor pays today. */
const CURRENT_PRICE = LAUNCH_ACTIVE ? LAUNCH_PRICE : STANDARD_PRICE;
/** 4000 becomes "R4 000" (plain space, safe in meta tags and text files). */
export const zar = (n: number) => "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const slotsWord = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][LAUNCH_SLOTS];

export const site = {
  name: "FactSmith Sites",
  shortName: "Sites",
  domain: "sites.factsmith.co.za",
  url: "https://sites.factsmith.co.za",
  email: "emilio@factsmith.co.za",
  /** Sharon Cooper is the published contact for Sites enquiries. */
  contactName: "Sharon Cooper",
  phoneDisplay: "072 500 5179",
  phoneTel: "+27725005179",
  whatsappLink: "https://wa.me/27725005179",
  whatsappMessage:
    "Hi Sharon — I saw FactSmith Sites. We need a website rebuild on the South Coast.",
  description: LAUNCH_ACTIVE
    ? `Websites for South Coast small businesses whose current site is costing them enquiries. ${zar(STANDARD_PRICE)} brochure rebuilds — ${zar(LAUNCH_PRICE)} for the first ${slotsWord}. Keep your domain if you have one; keep or downscale hosting.`
    : `Websites for South Coast small businesses whose current site is costing them enquiries. ${zar(STANDARD_PRICE)} brochure rebuilds. Keep your domain if you have one; keep or downscale hosting.`,
  /** schema.org priceRange. */
  priceRange: LAUNCH_ACTIVE ? `R${LAUNCH_PRICE}-R${STANDARD_PRICE}` : `R${STANDARD_PRICE}`,
  /** Alt text for the share image. */
  ogImageAlt: LAUNCH_ACTIVE
    ? `FactSmith Sites — website rebuilds, first ${LAUNCH_SLOTS} sites ${zar(LAUNCH_PRICE)}`
    : `FactSmith Sites — website rebuilds from ${zar(STANDARD_PRICE)}`,
  ogImage: "/images/og-card.png",
  /**
   * GitHub Pages has not issued the TLS certificate for this subdomain yet.
   * While true, og:image / og:url are emitted over http — WhatsApp and Facebook
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
  /** Launch-special price. Reverts to standardPriceZar once the 5 slots are gone. */
  priceZar: LAUNCH_PRICE,
  /** Normal published price after the launch five. */
  standardPriceZar: STANDARD_PRICE,
  depositZar: DEPOSIT,
} as const;

/**
 * Launch special — the first 5 South Coast sites at R4 000 instead of R7 500.
 * A deposit secures the slot and locks the price.
 * Set active: false once five deposits are in; the pages then fall back to
 * site.standardPriceZar automatically.
 */
export const launchOffer = {
  active: LAUNCH_ACTIVE,
  slots: LAUNCH_SLOTS,
  /** The slot count in words, for running text. */
  slotsWord,
  headline: `First ${LAUNCH_SLOTS} sites only`,
  lede: `${zar(LAUNCH_PRICE)} instead of ${zar(STANDARD_PRICE)}.`,
  detail: `The first ${slotsWord} South Coast rebuilds are ${zar(LAUNCH_PRICE)} — a ${zar(DEPOSIT)} deposit secures your slot and locks the price. After the ${slotsWord}, the published price is ${zar(STANDARD_PRICE)}.`,
  bonus:
    "Every site includes Google Search Console + Bing set up in your name, and a private stats page.",
  turnaround: "Mockups this weekend. Your new site live next week.",
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Included", href: "/included" },
  { label: "Tech", href: "/technical" },
  { label: "Method", href: "/method" },
  { label: "Offer", href: "/offer" },
  { label: "South Coast", href: "/south-coast" },
  { label: "Contact", href: "/contact" },
] as const;

/** Live samples. South Coast first (Sharon, Round 2 Q4), the rest after. */
export const samples = [
  {
    slug: "eagles-roost",
    title: "Eagle’s Roost B&B",
    kind: "Live client — Umtentweni, South Coast",
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
    title: "Three Birds Online Learning Centre",
    kind: "Live client — Anerley",
    url: "https://threebirdscentre.co.za",
    blurb:
      "The actual brochure package: fast on a phone, WhatsApp as the main button, domain in the client’s name, R0 hosting.",
    status: "live" as const,
  },
  {
    slug: "sasta-hill",
    title: "Sasta Hill Lodge",
    kind: "Live client — Lwandile Point, Wild Coast",
    url: "https://sastahill.co.za",
    blurb:
      "Dorm-style self-catering lodge in the Transkei. Five pages with a live weather and wind/wave page, Google map, and set up to be found on Google and by AI assistants from day one.",
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
      "Guest lodge and venue. Rebuilt around a big photo and a booking button, suites, venues and a clear contact footer, where the old site had no visible address, phone or rates.",
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
      "Online shop for hand-made fishing lures. Baitswimmers by weight and rigging, dropper packs, and separate South African and international pricing.",
    hero: "/images/work/mydo/hero.jpg",
    heroAlt: "Mydo silver bullet baitswimmer lure",
    images: [
      { src: "/images/work/mydo/baitswimmer.jpg", alt: "Mydo three-ounce baitswimmer" },
      { src: "/images/work/mydo/flying-fish.jpg", alt: "Mydo flying fish head lure" },
    ],
    status: "live" as const,
  },
  {
    slug: "factsmith",
    title: "FactSmith",
    kind: "Our product site",
    url: "https://www.factsmith.co.za",
    blurb:
      "Capability ceiling — a full marketing site we built for our own product. Bigger than the standard brochure package.",
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
  nextStep: `If they like the sample: ${zar(CURRENT_PRICE)} pack (deposit + domain form).`,
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
    title: "Your stats",
    text: "Google Search Console and Bing set up in your name, Google Analytics, and a private stats page: visitors, top pages, where they came from, and what people search on Google to find you.",
  },
  {
    title: "WhatsApp and tap-to-call",
    text: "A WhatsApp button and a tap-to-call number on every page, built for the phone first.",
  },
] as const;

/**
 * Added where it fits the business (a guest house gets weather and a guest app,
 * a fencing firm does not). Images are snips of the live Eagle's Roost site.
 */
export const fitFeatures = [
  {
    title: "Weather and tides",
    text: "Hour-by-hour weather for today and tomorrow, a 7-day outlook, wind, swell and sea temperature, Windy wave and storm maps and the latest satellite picture. A tides page shows high and low tide, a 7-day tide curve and the moon, for beach walks, fishing and rock pools.",
    image: "/images/work/eagles-roost/feature-weather.webp",
    imageAlt: "Eagle's Roost weather page on a phone: temperature, wind, sea, water temperature, next tide",
    phone: true,
    example: { label: "Eagle’s Roost weather", href: "https://eaglesroost.co.za/weather/" },
    extra: { label: "and tides", href: "https://eaglesroost.co.za/tides/" },
  },
  {
    title: "A guest app that works without signal",
    text: "A guest guide your visitors add to their home screen: Wi-Fi, check-in times, house rules, weather now, places to eat and one-tap WhatsApp requests. It keeps the last good copy on the phone, so it still opens with no signal.",
    image: "/images/work/eagles-roost/feature-guide.webp",
    imageAlt: "Eagle's Roost guest guide app: Wi-Fi, weather now, the house and check-in times",
    phone: true,
    example: { label: "Eagle’s Roost guest guide", href: "https://eaglesroost.co.za/guide/" },
  },
  {
    title: "Nearby attractions, researched",
    text: "We research what is around you (beaches, walks, the river, family days out, fishing guides) and write a page with real distances from your door, photos and a map, so guests plan their stay on your site.",
    image: "/images/work/eagles-roost/feature-attractions.webp",
    imageAlt: "Eagle's Roost attractions page: guided fishing, the main beach and the whale deck",
    phone: false,
    example: { label: "Eagle’s Roost attractions", href: "https://eaglesroost.co.za/attractions/" },
  },
  {
    title: "Where to eat, researched",
    text: "Restaurants and takeaways near you, grouped by area, each with address, phone, website and a map, and a note where you have eaten there yourself.",
    image: "/images/work/eagles-roost/feature-dining.webp",
    imageAlt: "Eagle's Roost restaurants page: cards per restaurant with address, phone and map",
    phone: false,
    example: { label: "Eagle’s Roost restaurants", href: "https://eaglesroost.co.za/dining/" },
  },
] as const;

/** The private admin (stats) page every site gets, as built in /stats. */
export const adminFeatures = [
  "Sign in with your Google account; nobody else sees it",
  "Visitors, sessions, page views and average visit length for the last 7, 28 or 90 days",
  "Sessions per day as a chart",
  "Top pages: which pages people actually read",
  "Where visitors came from (source and medium, for example Google search or Facebook)",
  "Which countries they are in",
  "Google searches: the words people typed to find you, how often you were shown and clicked, and your average position, from Search Console",
  "Search Console and Bing set up in your name, so the data is yours if you ever leave us",
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
    text: `Invoice, domain form, content questions, hosting note, and scope. ${zar(DEPOSIT)} starts the job.`,
  },
  {
    title: "Domain and hosting — your call",
    text: "Already have a domain? We use it. Need one? Registered in your name at cost. Hosting: keep what you pay for, or downscale to free static.",
  },
  {
    title: "Build from a sample",
    text: "Mobile-first site. WhatsApp as the main button. Contact form included. Map with a Google Earth fly-to, live weather, SEO, GEO and AEO are built in from the first build — not add-ons.",
  },
  {
    title: "Photos: placeholders first, then yours",
    text: "We build with your old photos or stock, each in a named slot (dolphin-1, home-hero). After your shoot, each new photo is saved under its slot name and replaces the placeholder — no layout changes.",
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
