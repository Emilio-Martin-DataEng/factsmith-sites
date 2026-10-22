// Self-check for engine.js: node test.mjs (exits non-zero on the first failure)
import assert from "node:assert/strict";
import { MODES, normalise, scoreHours, windows, bestWindow, rating, extrema, moon, ramp, rise, band, relAngle, windClass, kn, tighten, explain } from "./engine.js";

let n = 0;
const test = (name, f) => { f(); n++; console.log("ok", n, name); };
const near = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

// 120 hours from 2026-10-26 (a full moon), local wall-clock strings; sunrise 05:00, sunset 19:00
const hr = k => new Date(Date.UTC(2026, 9, 26, k)).toISOString().slice(0, 16);
const time = Array.from({ length: 120 }, (_, k) => hr(k));
const days = Array.from({ length: 5 }, (_, k) => hr(k * 24).slice(0, 10));
const mk = (over = {}) => {
  const base = {
    time, wind: 8, gust: 14, windDir: 295, wave: 1, waveDir: 115, wavePeriod: 10, swell: 1, swellPeriod: 12, swellDir: 115, sst: 20,
    tide: k => Math.sin(2 * Math.PI * k / 12.42), pressure: k => 1015 - k * .5, rainProb: 5, code: 1, cloud: 20, uv: 5,
  };
  const d = { sunrise: days.map(x => x + "T05:00"), sunset: days.map(x => x + "T19:00"), fetchedAt: "2026-10-26T00:00:00.000Z", time };
  for (const [key, v] of Object.entries({ ...base, ...over })) if (key !== "time") d[key] = time.map((_, k) => typeof v === "function" ? v(k) : v);
  return d;
};
const B = 115;  // beach faces ESE; wind from 115 is onshore, from 295 offshore, from 25 or 205 cross

test("band, ramp, rise edges", () => {
  assert.equal(ramp(5, 10, 20), 1); assert.equal(ramp(10, 10, 20), 1); assert.equal(ramp(15, 10, 20), .5);
  assert.equal(ramp(20, 10, 20), 0); assert.equal(ramp(25, 10, 20), 0); assert.equal(ramp(null, 10, 20), .6);
  assert.equal(rise(6, 6, 13), 0); assert.equal(rise(9.5, 6, 13), .5); assert.equal(rise(13, 6, 13), 1); assert.equal(rise(20, 6, 13), 1); assert.equal(rise(null, 6, 13), .6);
  assert.equal(band(0, 0, 1, 2, 3), 0); assert.equal(band(.5, 0, 1, 2, 3), .5); assert.equal(band(1, 0, 1, 2, 3), 1);
  assert.equal(band(2, 0, 1, 2, 3), 1); assert.equal(band(2.5, 0, 1, 2, 3), .5); assert.equal(band(3, 0, 1, 2, 3), 0);
  assert.equal(band(-1, 0, 1, 2, 3), 0); assert.equal(band(null, 0, 1, 2, 3), .6);
  near(kn(1.852), 1); assert.equal(kn(null), null);
});

test("relAngle, windClass", () => {
  assert.equal(relAngle(115, B), 0); assert.equal(relAngle(295, B), 180); assert.equal(relAngle(205, B), 90); assert.equal(relAngle(25, B), 90);
  assert.equal(relAngle(350, 10), 20); assert.equal(relAngle(null, B), null);
  assert.equal(windClass(relAngle(115, B)), "onshore"); assert.equal(windClass(relAngle(295, B)), "offshore"); assert.equal(windClass(relAngle(205, B)), "cross");
  assert.equal(windClass(135), "offshore"); assert.equal(windClass(45), "onshore"); assert.equal(windClass(46), "cross");
});

test("fishing: calm dawn scores Good, 4 m sea flags danger", () => {
  const calm = scoreHours(mk(), "fishing", { coastBearing: B });
  assert.ok(calm.score[6] >= 70, "calm dawn " + calm.score[6]); assert.equal(calm.flags[6], null);
  const rough = scoreHours(mk({ wave: 4 }), "fishing", { coastBearing: B });
  assert.equal(rough.flags[6].level, "danger");
  assert.equal(scoreHours(mk({ wave: 2.6 }), "fishing").flags[6].level, "warn");
  assert.equal(scoreHours(mk({ code: 95 }), "fishing").flags[6].code, "thunder");
  assert.equal(calm.score.length, 120); assert.equal(calm.parts.tideFlow.length, 120);
});

test("surf: offshore good, strong onshore ruined by the gate", () => {
  const off = scoreHours(mk({ swell: 1.5, swellPeriod: 14, wind: 8 * 1.852, windDir: 295 }), "surf", { coastBearing: B });
  assert.ok(off.score[12] >= 70, "offshore " + off.score[12]);
  const on = scoreHours(mk({ swell: 1.5, swellPeriod: 14, wind: 25 * 1.852, windDir: 115 }), "surf", { coastBearing: B });
  assert.ok(on.score[12] < 45, "onshore " + on.score[12]);
});

test("kite: cross-shore good, offshore raises danger", () => {
  const w = { wind: 18 * 1.852, gust: 22 * 1.852 };
  const cross = scoreHours(mk({ ...w, windDir: 25 }), "kite", { coastBearing: B });
  assert.ok(cross.score[12] >= 70, "cross " + cross.score[12]); assert.equal(cross.flags[12], null);
  const off = scoreHours(mk({ ...w, windDir: 295 }), "kite", { coastBearing: B });
  assert.equal(off.flags[12].level, "danger"); assert.equal(off.flags[12].code, "offshore");
  assert.equal(scoreHours(mk({ wind: 3, gust: 12, windDir: 25 }), "kite", { coastBearing: B }).flags[12], null, "light air is not 'gusty'");
  assert.equal(scoreHours(mk({ wind: 12 * 1.852, gust: 24 * 1.852, windDir: 25 }), "kite", { coastBearing: B }).flags[12].code, "gust");
});

test("boat: night raises a flag, day does not", () => {
  const r = scoreHours(mk(), "boat", { coastBearing: B });
  assert.equal(r.flags[2].code, "night"); assert.equal(r.flags[12], null);
});

test("windows (mean of 4 h, worst flag, past) and bestWindow (skips flags)", () => {
  const d = mk(), flags = Array(120).fill(null), score = Array.from({ length: 120 }, (_, k) => [10, 20, 30, 40][k % 4]);
  flags[5] = { level: "warn", code: "x", text: "x" }; flags[6] = { level: "danger", code: "y", text: "y" };
  const w = windows(d, { score, flags }, "2026-10-26T04:00");
  assert.equal(w.length, 30); assert.ok(w.every(x => x.score === 25));
  assert.deepEqual(w.slice(0, 2).map(x => x.label), ["EA", "MO"]); assert.equal(w[6].day, 1); assert.equal(w[6].slot, 0); assert.equal(w[1].start, "2026-10-26T04:00");
  assert.equal(w[1].flag.level, "danger"); assert.equal(w[0].flag, null);
  assert.deepEqual(w.map(x => x.past).slice(0, 3), [true, false, false]);
  const s = Array(120).fill(50); s[5] = s[6] = s[7] = 90;
  assert.deepEqual(bestWindow(s, Array(120).fill(null), 0), { from: "05:00", to: "08:00", avg: 90, rating: "Good" });
  const f = Array(120).fill(null); f[6] = flags[6];
  assert.deepEqual(bestWindow(s, f, 0), { from: "03:00", to: "06:00", avg: 63, rating: "Fair" });
  assert.equal(bestWindow(s, Array(120).fill(flags[6]), 0), null);
  assert.equal(rating(70), "Good"); assert.equal(rating(69), "Fair"); assert.equal(rating(45), "Fair"); assert.equal(rating(44), "Poor");
});

test("extrema: 4 highs, 4 lows, first high at 03:00", () => {
  const T = Array.from({ length: 48 }, (_, k) => `2026-01-0${1 + (k / 24 | 0)}T${String(k % 24).padStart(2, "0")}:00`);
  const e = extrema(T, T.map((_, k) => Math.cos(2 * Math.PI * (k - 3) / 12.42)));
  assert.equal(e.filter(x => x.high).length, 4); assert.equal(e.filter(x => !x.high).length, 4); assert.equal(e[0].at, "2026-01-01T03:00");
});

test("moon: phase index within +-1 day of the marine demo fixture", () => {
  const fixture = [  // from moon-phases-2026-2027.json (Astronomy Engine)
    { time_utc: "2026-10-18T16:13:19.496Z", phase: "first_quarter", quarter: 1 },
    { time_utc: "2026-10-26T04:12:15.538Z", phase: "full", quarter: 2 },
    { time_utc: "2026-11-01T20:28:58.794Z", phase: "last_quarter", quarter: 3 },
    { time_utc: "2026-11-09T07:02:42.392Z", phase: "new", quarter: 0 },
  ];
  for (const p of fixture) {
    const t = Date.parse(p.time_utc), want = p.quarter * 2;
    assert.ok([-1, 0, 1].some(k => moon(new Date(t + k * 864e5)).phaseIndex === want), `${p.phase}: ${moon(new Date(t)).phaseIndex}`);
    assert.ok(moon(new Date(t)).daysFromSyzygy <= 2 === (p.quarter % 2 === 0), p.phase);
  }
  const full = moon("2026-10-26T04:00");
  assert.equal(full.springs, true); assert.ok(full.illum > .95); assert.equal(moon("2026-11-01T20:00").springs, false);
});

test("normalise aligns marine by time key, not position", () => {
  const t = time.slice(0, 24), f = { hourly: { time: t, wind_speed_10m: t.map(() => 10) }, daily: { sunrise: [days[0] + "T05:00"], sunset: [days[0] + "T19:00"] } };
  const mt = t.slice(3, 20), m = { hourly: { time: mt, wave_height: mt.map((_, k) => k + 3), sea_level_height_msl: mt.map(() => 0) } };
  const d = normalise(f, m);
  assert.equal(d.wave.length, 24); assert.equal(d.wave[0], null); assert.equal(d.wave[2], null); assert.equal(d.wave[3], 3);
  assert.equal(d.wave[19], 19); assert.equal(d.wave[20], null); assert.equal(d.wave[23], null);
  assert.equal(d.wind[0], 10); assert.equal(d.swell[5], null); assert.equal(d.gust[5], null); assert.equal(normalise(f, null).wave[3], null);
});

test("site safety overrides can only tighten", () => {
  for (const [key, m] of Object.entries(MODES)) {
    const lim = m.safety.limits, hi = Object.fromEntries(Object.keys(lim).map(k => [k, lim[k] * 10])), lo = Object.fromEntries(Object.keys(lim).map(k => [k, lim[k] / 2]));
    assert.deepEqual(tighten(lim, hi), lim, key + " looser override ignored"); assert.deepEqual(tighten(lim, lo), lo, key + " tighter override applied");
    assert.deepEqual(tighten(lim, { bogus: 1, [Object.keys(lim)[0]]: "x" }), lim);
  }
  const d = mk({ wave: 2.2 });  // under the 2.5 default: no flag; a site limit of 2.0 flags it; a site limit of 9 changes nothing
  assert.equal(scoreHours(d, "fishing").flags[6], null);
  assert.equal(scoreHours(d, "fishing", { safety: { waveWarn: 2.0 } }).flags[6].level, "warn");
  assert.equal(scoreHours(mk({ wave: 2.6 }), "fishing", { safety: { waveWarn: 9 } }).flags[6].level, "warn");
  assert.equal(scoreHours(mk({ wave: 3.6 }), "fishing", { safety: { waveDanger: 9 } }).flags[6].level, "danger");
});

test("parts, weights and explain", () => {
  const d = mk(), base = scoreHours(d, "fishing", { coastBearing: B });
  const sw = Object.fromEntries(MODES.fishing.vars.map(v => [v.key, v.key === "rain" ? 1 : 0]));
  const rainOnly = scoreHours(d, "fishing", { coastBearing: B, weights: sw });
  assert.equal(rainOnly.score[6], Math.round(100 * base.parts.rain[6]));
  const sum = MODES.fishing.vars.reduce((a, v) => a + v.weight, 0); near(sum, 1);
  const e = explain("fishing", base.parts, 6);
  assert.equal(e.rows.length, 8); near(e.rows.reduce((a, r) => a + r.share, 0), base.score[6], 0.5); assert.ok(/^[A-Z].*\.$/.test(e.sentence));
  for (const m of Object.values(MODES)) near(m.vars.reduce((a, v) => a + v.weight, 0), 1);
});

console.log(`all ${n} passed`);
