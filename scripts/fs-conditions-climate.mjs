// Builds the local "normal" file the fs-conditions widget reads (attribute `climate`).
// node scripts/fs-conditions-climate.mjs <place> <lat> <lon> <seaLat> <seaLon>
// Pressure: ERA5 via the Open-Meteo archive, last 30 full years. Marine variables: Open-Meteo marine API from 2023 (earlier history is null).
import { writeFile, mkdir } from "node:fs/promises";
import { monthlyStats } from "../public/widgets/fs-conditions/1.0/engine.js";

const [place, ...nums] = process.argv.slice(2), [lat, lon, seaLat, seaLon] = nums.map(Number);
if (!place || nums.length !== 4 || nums.some(isNaN)) { console.error("usage: node scripts/fs-conditions-climate.mjs <place> <lat> <lon> <seaLat> <seaLon>"); process.exit(1); }

const TZ = "Africa/Johannesburg", day = d => d.toISOString().slice(0, 10);
const today = new Date(), yesterday = day(new Date(today - 864e5)), Y = today.getUTCFullYear();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url) {
  for (let k = 0; ; k++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    if (k >= 5 || (r.status !== 429 && r.status < 500)) throw new Error(`HTTP ${r.status} ${url}\n${await r.text()}`);
    await sleep(15000 * (k + 1));  // Open-Meteo rate limits: wait and retry
  }
}

// fetch hourly vars over [from, to] in chunks of `years` calendar years; returns { time[], <var>[] } concatenated
async function series(base, params, vars, from, to, years) {
  const out = { time: [] }; for (const v of vars) out[v] = [];
  for (let y = +from.slice(0, 4); y <= +to.slice(0, 4); y += years) {
    const a = y === +from.slice(0, 4) ? from : `${y}-01-01`, e = Math.min(y + years - 1, +to.slice(0, 4)), b = e === +to.slice(0, 4) ? to : `${e}-12-31`;
    console.log(base.split("/")[2], a, b);
    const j = await get(base + "?" + new URLSearchParams({ ...params, start_date: a, end_date: b, hourly: vars.join(","), timezone: TZ }));
    out.time.push(...j.hourly.time); for (const v of vars) out[v].push(...j.hourly[v]);
    await sleep(1000);
  }
  return out;
}

const r2 = o => JSON.parse(JSON.stringify(o, (k, v) => typeof v === "number" ? Math.round(v * 100) / 100 : v));
const stats = (s, v) => r2(monthlyStats(s.time, s[v]));

const p0 = `${Y - 30}-01-01`, p1 = `${Y - 1}-12-31`;
const pr = await series("https://archive-api.open-meteo.com/v1/archive", { latitude: lat, longitude: lon }, ["pressure_msl"], p0, p1, 5);
const m0 = "2023-01-01";
const ma = await series("https://marine-api.open-meteo.com/v1/marine", { latitude: seaLat, longitude: seaLon, cell_selection: "sea" }, ["sea_surface_temperature", "swell_wave_period", "sea_level_height_msl"], m0, yesterday, 1);

const doc = {
  place, lat, lon, generated: day(today),
  sources: { pressure: { from: p0, to: p1, api: "open-meteo archive (ERA5)" }, sst: { from: m0, to: yesterday, api: "open-meteo marine" }, period: { from: m0, to: yesterday, api: "open-meteo marine" }, tide: { from: m0, to: yesterday, api: "open-meteo marine" } },
  months: { pressure: stats(pr, "pressure_msl"), sst: stats(ma, "sea_surface_temperature"), period: stats(ma, "swell_wave_period"), tide: stats(ma, "sea_level_height_msl") },
};
const file = new URL(`../public/widgets/fs-conditions/climate/${place}.json`, import.meta.url);
await mkdir(new URL("./", file), { recursive: true });
await writeFile(file, JSON.stringify(doc));
console.log("wrote", file.pathname, JSON.stringify(doc).length, "bytes");
