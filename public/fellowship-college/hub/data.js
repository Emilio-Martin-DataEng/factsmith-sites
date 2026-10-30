// School data for the static site. Each table is a CSV: today a file in data/, later the
// "File > Share > Publish to web > CSV" link of the matching tab in the school's Google Sheet.
// The school edits the Sheet (or imports a CSV into it); the site reads it on every page load.
const SOURCES = {
  terms: "data/terms.csv",
  exams: "data/exams.csv",
  fees: "data/fees.csv",
  activities: "data/activities.csv",
  notices: "data/notices.csv",
  contacts: "data/contacts.csv",
};

// RFC 4180 CSV: quoted fields, "" escapes, commas and newlines inside quotes. Returns objects keyed by the header row.
function parseCSV(text) {
  const rows = [[]];
  let field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { rows.at(-1).push(field); field = ""; }
    else if (c === "\n") { rows.at(-1).push(field.replace(/\r$/, "")); field = ""; rows.push([]); }
    else field += c;
  }
  rows.at(-1).push(field);
  const [head, ...body] = rows.filter(r => r.some(v => v.trim()));
  const keys = head.map(h => h.trim().toLowerCase());
  return body.map(r => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}
console.assert(JSON.stringify(parseCSV('a,b\r\n"x, ""y""",\n\n1,2')) === '[{"a":"x, \\"y\\"","b":""},{"a":"1","b":"2"}]', "parseCSV");

const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const TBC = '<span class="tbc">TBC</span>';
const day = d => /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + "T12:00").toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" }) : null;
const span = (a, b) => !day(a) ? TBC : day(b) && b !== a ? `${day(a)} to ${day(b)}` : day(a);
const today = new Date().toISOString().slice(0, 10);
const put = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
const BASE = document.currentScript.src;
const load = name => fetch(new URL(SOURCES[name], BASE)).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(parseCSV);

const RENDER = {
  terms: rows => put("terms", rows.map(r => `<tr><td>${esc(r.term)}</td><td>${span(r.start, r.end)}</td></tr>`).join("")),
  exams: rows => {
    put("exams", rows.map(r => `<tr><td>${esc(r.name)}</td><td>${span(r.start, r.end)}</td></tr>`).join(""));
    const next = rows.filter(r => day(r.start) && (r.end || r.start) >= today).sort((a, b) => a.start.localeCompare(b.start))[0];
    put("next-up", next ? `${esc(next.name)}, ${day(next.start)}` : `Next dates ${TBC}`);
    const cd = document.getElementById("countdown");
    if (cd) {
      put("countdown-label", next ? esc(next.name) : "Next exams");
      cd.textContent = next ? (next.start > today ? Math.ceil((new Date(next.start + "T08:00") - Date.now()) / 864e5) + " days" : "Under way") : "Date TBC";
    }
  },
  fees: rows => put("fees", rows.map(r => `<tr><td>${esc(r.item)}${r.notes ? `<br><small class="muted">${esc(r.notes)}</small>` : ""}</td><td>${r.amount ? esc(r.amount) : TBC}</td></tr>`).join("")),
  activities: rows => put("activities", rows.map(r => `<div class="panel"><h3>${esc(r.activity)}</h3><p class="muted" style="margin:0">${[r.when, r.where].filter(Boolean).map(esc).join(", ") || TBC}${r.notes ? "<br>" + esc(r.notes) : ""}</p></div>`).join("")),
  notices: rows => put("notices", rows.sort((a, b) => b.date.localeCompare(a.date)).map(r => `<div class="notice"><time>${day(r.date) ?? "Date TBC"}</time><h3 style="margin:4px 0 6px;font-size:1.1rem">${esc(r.title)}</h3><p class="muted" style="margin:0">${esc(r.body)}</p></div>`).join("")),
  contacts: rows => {
    const q = a => encodeURIComponent(a);
    const line = (label, v) => `<p class="cl"><b>${label}</b> ${v}</p>`;
    put("contacts", rows.map(r => {
      const web = r.web ? `<a href="${esc(r.web)}" rel="noopener">${esc(r.web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a>` : TBC;
      const mail = r.email ? `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>` : TBC;
      const tel = r.phone ? `<a href="tel:${esc(r.phone.replace(/[^+\d]/g, ""))}">${esc(r.phone)}</a>` : TBC;
      const adr = r.address ? esc(r.address) : TBC;
      const map = r.address ? `<details class="mapbox" data-q="${esc(q(r.address))}"><summary>Show map</summary></details>
        <a class="earth" href="https://earth.google.com/web/search/${q(r.address)}" rel="noopener">Fly there in Google Earth</a>` : "";
      return `<article class="panel contact-card"><span class="ctype">${esc(r.type)}</span><h3>${esc(r.name)}</h3>
        ${r.role ? `<p class="muted" style="margin:0 0 10px">${esc(r.role)}</p>` : ""}
        ${line("Web", web)}${line("Email", mail)}${line("Phone", tel)}${line("Address", adr)}
        ${r.notes ? `<p class="note">${esc(r.notes)}</p>` : ""}${map}</article>`;
    }).join(""));
    // Build each map iframe only when its panel is opened, so the page does not load a dozen maps.
    document.querySelectorAll("details.mapbox").forEach(d => d.addEventListener("toggle", () => {
      if (d.open && !d.querySelector("iframe")) d.insertAdjacentHTML("beforeend",
        `<iframe class="map" loading="lazy" title="Map" src="https://maps.google.com/maps?q=${d.dataset.q}&z=15&output=embed"></iframe>`);
    }));
  },
};

// Only fetch the tables this page shows.
const NEEDS = { terms: ["terms"], exams: ["exams", "next-up", "countdown"], fees: ["fees"], activities: ["activities"], notices: ["notices"], contacts: ["contacts"] };
for (const [name, ids] of Object.entries(NEEDS)) {
  if (ids.some(id => document.getElementById(id)))
    load(name).then(RENDER[name]).catch(e => console.error("data.js", name, e));
}
