// FactSmith Sites — studio brochure. Vault: FactSmith-Sites/01-Client-Brief/Offer Spec.md

export const site = {
  name: "FactSmith Sites",
  shortName: "Sites",
  domain: "sites.factsmith.co.za",
  url: "https://sites.factsmith.co.za",
  email: "factsmith@outlook.com",
  phoneDisplay: "082 413 0438",
  phoneTel: "+27824130438",
  whatsappLink: "https://wa.me/27824130438",
  whatsappMessage:
    "Hi Emilio — I saw FactSmith Sites. We need a website rebuild on the South Coast.",
  description:
    "Websites for South Coast small businesses whose current site is costing them enquiries. R4 000 brochure rebuilds — keep your domain if you have one; keep or downscale hosting.",
  ogImage: "/images/og-card.svg",
  productUrl: "https://www.factsmith.co.za",
  threeBirdsUrl: "https://threebirdscentre.co.za",
  billingEntity: "SELECT STAR DATA ENGINEERS (Pty) Ltd",
  priceZar: 4000,
  depositZar: 2000,
} as const;

export const nav = [
  { label: "Work", href: "/work" },
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
      "Capability ceiling — a full marketing site we built for our own product. Not the R4 000 package.",
    status: "live" as const,
  },
  {
    slug: "three-birds",
    title: "Three Birds Online Learning Centre",
    kind: "Live client — Anerley",
    url: "https://threebirdscentre.co.za",
    blurb:
      "The actual R4 000 package: Astro brochure, WhatsApp-first, domain in the client’s name, R0 hosting.",
    status: "live" as const,
  },
] as const;

/**
 * Approved and in process. Visuals from real project photography and
 * agreed mockups — not stock. Henton is Cape Town / larger than the R4 000 bar.
 */
export const inProcess = [
  {
    slug: "eagles-roost",
    title: "Eagle’s Roost B&B",
    kind: "Umtentweni · South Coast",
    package: "In process",
    blurb:
      "Heritage house above the Umzimkulu. Direction C (petrol teal, WhatsApp-first) is the agreed look. Build underway.",
    hero: "/images/work/eagles-roost/hero.jpg",
    heroAlt: "Eagle’s Roost from the air, greenery and ocean behind the house",
    images: [
      {
        src: "/images/work/eagles-roost/concept-c.png",
        alt: "Direction C phone mockups — first screen, the house, rates",
      },
      {
        src: "/images/work/eagles-roost/concept-c-p2.png",
        alt: "Direction C phone mockups — what’s included, the area, enquire",
      },
      {
        src: "/images/work/eagles-roost/verandah.jpg",
        alt: "Covered verandah at first light",
      },
    ],
  },
  {
    slug: "khaya-la-manzi",
    title: "Khaya La Manzi Guest Lodge",
    kind: "Hibberdene · South Coast",
    package: "In process · overhaul",
    blurb:
      "Existing table-layout site, not mobile, no tap-to-call. Rebuild using their own sunset, lodge and beach photography. Approved; in process.",
    hero: "/images/work/khaya/hero.jpg",
    heroAlt: "Khaya La Manzi sunset header from the current site",
    images: [
      {
        src: "/images/work/khaya/lodge.jpg",
        alt: "Khaya La Manzi lodge building",
      },
      {
        src: "/images/work/khaya/beach.jpg",
        alt: "Hibberdene beach near the lodge",
      },
    ],
    currentUrl: "https://khayalamanzi.co.za",
  },
  {
    slug: "henton",
    title: "Henton Timber Homes",
    kind: "Melkbosstrand · timber construction",
    package: "In process · larger than the R4 000 brochure",
    blurb:
      "Full rebuild of a static mirror of a dead WordPress install. Real project photography, ITFB award, enquiry path. Not the South Coast R4 000 package — this one is a bigger site.",
    hero: "/images/work/henton/elephant-hide.jpg",
    heroAlt: "Elephant Hide Lodge — a Henton timber structure",
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
