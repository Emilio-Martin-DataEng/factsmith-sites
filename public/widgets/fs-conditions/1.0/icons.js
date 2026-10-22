// Interim icons: simple 24-grid strokes in currentColor, no width/height. A Grok set replaces these; see README.md "Swapping icons".
const S = b => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`;
const CL = "M6.5 17h10.5a3.75 3.75 0 0 0 .5-7.46A5.5 5.5 0 0 0 7 9.2 4 4 0 0 0 6.5 17z";
const CLS = `<path transform="translate(6 6) scale(.7)" d="${CL}"/>`;  // small cloud, lower right
const SUN = "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 4.9l-1.4 1.4";
const CRES = "M20 14.5A8.5 8.5 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z";
const D = "M12 4A8 8 0 0 0 12 20", R = "M12 4A8 8 0 0 1 12 20";  // left / right half of the moon disc
const moon = lit => S(`<circle cx="12" cy="12" r="8"/>${lit ? `<path fill="currentColor" d="${lit}z"/>` : ""}`);

export const ICONS = {
  "wx-clear": S(`<circle cx="12" cy="12" r="4"/><path d="${SUN}"/>`),
  "wx-partly": S(`<circle cx="8" cy="8" r="2.6"/><path d="M8 2.5v1.2M2.5 8h1.2M4.1 4.1l.9.9M11.9 4.1l-.9.9"/>${CLS}`),
  "wx-cloud": S(`<path d="${CL}"/>`),
  "wx-fog": S(`<path d="M7 12a4 4 0 0 1 .5-7.9A5.5 5.5 0 0 1 17.8 6.4 3.2 3.2 0 0 1 17 12.5"/><path d="M3 15.5h18M5 19h14M9 22.5h6"/>`),
  "wx-drizzle": S(`<path transform="translate(0 -3)" d="${CL}"/><path d="M9 19.5h.01M15 19.5h.01"/>`),
  "wx-rain": S(`<path transform="translate(0 -3)" d="${CL}"/><path d="M8 17.5l-1 3M12 17.5l-1 3M16 17.5l-1 3"/>`),
  "wx-showers": S(`<path d="M15.5 3.2a3.2 3.2 0 0 1 5 3"/><path transform="translate(0 -1)" d="${CL}"/><path d="M9 18.5l-1 3M14 18.5l-1 3"/>`),
  "wx-thunder": S(`<path transform="translate(0 -3)" d="${CL}"/><path d="M12.5 14l-2.5 4h3.5l-2 4"/>`),
  "wx-night-clear": S(`<path d="${CRES}"/><path d="M18 3v3M16.5 4.5h3"/>`),
  "wx-night-partly": S(`<path transform="translate(-1 -1) scale(.62)" d="${CRES}"/>${CLS}`),
  "moon-0": moon(),
  "moon-1": moon(`${D}A4 8 0 0 1 12 4`),
  "moon-2": moon(D),
  "moon-3": moon(`${D}A4 8 0 0 0 12 4`),
  "moon-4": S(`<circle cx="12" cy="12" r="8" fill="currentColor"/>`),
  "moon-5": moon(`${R}A4 8 0 0 1 12 4`),
  "moon-6": moon(R),
  "moon-7": moon(`${R}A4 8 0 0 0 12 4`),
  "mode-fishing": S(`<path d="M3 12c3-5 9-5 13 0-4 5-10 5-13 0z"/><path d="M16 12l5-3.5v7z"/><path d="M7.5 11.5h.01"/>`),
  "mode-surf": S(`<path d="M3 14C4 8 9 4 15 5.5c-3 1.5-3 5 0 6 2 .6 3.5-.4 4.5-1.8"/><path d="M3 19c3 0 3 1.5 6 1.5s3-1.5 6-1.5 3 1.5 6 1.5"/>`),
  "mode-kite": S(`<path d="M12 2l6 7-6 5-6-5z"/><path d="M12 2v12M6 9h12M9 14l-2 7M15 14l2 7M5 21h4M15 21h4"/>`),
  "mode-boat": S(`<path d="M3 15h18l-3 5H6z"/><path d="M12 3v12"/><path d="M12 4l6 9h-6"/>`),
  "safety-warn": S(`<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>`),
  "safety-danger": S(`<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M12 8v5M12 16.5h.01"/>`),
  "tide-high": S(`<path d="M3 17c3 0 3-2 6-2s3 2 6 2 3-2 6-2"/><path d="M12 12V4M9 7l3-3 3 3"/>`),
  "tide-low": S(`<path d="M3 17c3 0 3-2 6-2s3 2 6 2 3-2 6-2"/><path d="M12 4v8M9 9l3 3 3-3"/>`),
  "press-up": S(`<path d="M12 20V5M6 11l6-6 6 6"/>`),
  "press-down": S(`<path d="M12 4v15M6 13l6 6 6-6"/>`),
  "press-fast": S(`<path d="M6 4l6 6 6-6M6 12l6 6 6-6"/>`),
  "press-steady": S(`<path d="M4 12h16M15 7l5 5-5 5"/>`),
  "springs": S(`<path d="M10 12H3M6 9l-3 3 3 3M14 12h7M18 9l3 3-3 3"/><path d="M12 11.5h.01M12 12.5h.01"/>`),
  "neaps": S(`<path d="M3 12h7M7 9l3 3-3 3M21 12h-7M17 9l-3 3 3 3"/>`),
  "sunrise": S(`<path d="M7 18a5 5 0 0 1 10 0M3 18h18M12 9V3M9 6l3-3 3 3"/>`),
  "sunset": S(`<path d="M7 18a5 5 0 0 1 10 0M3 18h18M12 3v6M9 6l3 3 3-3"/>`),
  "ui-tune": S(`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>`),
  "ui-units": S(`<path d="M4 15a8 8 0 0 1 16 0"/><path d="M12 15l4-5"/>`),
  "ui-offline": S(`<path transform="translate(0 -1)" d="${CL}"/><path d="M4 4l16 16"/>`),
};
