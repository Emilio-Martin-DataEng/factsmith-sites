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
    "Websites for South Coast small businesses whose current site is costing them enquiries. R4 000 brochure rebuilds — you own the domain, hosting stays R0.",
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

/** Samples. Three Birds stays pending until Paula says yes. */
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
    kind: "Client — Anerley",
    url: "https://threebirdscentre.co.za",
    blurb:
      "The actual package: Astro brochure, WhatsApp-first, domain in the client’s name, R0 hosting.",
    status: "live" as const,
  },
  {
    slug: "eagles-roost",
    title: "Eagle’s Roost B&B",
    kind: "Local — Umtentweni",
    url: "",
    blurb: "Neighbourhood B&B sample. Public preview URL coming.",
    status: "in-progress" as const,
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
    title: "Domain in your name",
    text: "We register the .co.za for you at actual cost. You own it from day one.",
  },
  {
    title: "Build from a sample",
    text: "Mobile-first Astro site. WhatsApp as the main button. Contact form included.",
  },
  {
    title: "Preview + two rounds",
    text: "Sharon walks you through a private preview. Two focused revision rounds are in the fee.",
  },
  {
    title: "Go live",
    text: "Cloudflare Pages, free SSL, email forwarding to your Gmail. Balance on hand-over.",
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
