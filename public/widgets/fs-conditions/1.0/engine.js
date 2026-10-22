// fs-conditions engine: pure ES module, no DOM, no dependencies. Fetch, normalise, score, safety, windows, tide extrema, moon.
// Times are Open-Meteo local wall-clock strings ("2026-10-22T05:00", Africa/Johannesburg); all time arithmetic is tz-free, as in tide.js.

const FC_HOURLY = "temperature_2m,precipitation_probability,weather_code,cloud_cover,uv_index,wind_speed_10m,wind_gusts_10m,wind_direction_10m,pressure_msl";
const MA_HOURLY = "wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,swell_wave_direction,sea_surface_temperature,sea_level_height_msl";

// raw Open-Meteo JSON { forecast, marine }; the component caches this
export async function fetchRaw({ lat, lon, seaLat = lat, seaLon = lon, endpoint, tz = "Africa/Johannesburg" }) {
  const get = async u => { const r = await fetch(u); if (!r.ok) throw new Error("fs-conditions: HTTP " + r.status); return r.json(); };
  if (endpoint) return get(endpoint + "?" + new URLSearchParams({ lat, lon, sea_lat: seaLat, sea_lon: seaLon }));
  const q = (o) => new URLSearchParams({ ...o, forecast_days: 5, timezone: tz });
  const [forecast, marine] = await Promise.all([
    get("https://api.open-meteo.com/v1/forecast?" + q({ latitude: lat, longitude: lon, hourly: FC_HOURLY, daily: "sunrise,sunset,uv_index_max" })),
    get("https://marine-api.open-meteo.com/v1/marine?" + q({ latitude: seaLat, longitude: seaLon, hourly: MA_HOURLY, cell_selection: "sea" })),
  ]);
  return { forecast, marine };
}

export async function fetchConditions(opts) {
  const { forecast, marine } = await fetchRaw(opts);
  return normalise(forecast, marine);
}

// Data arrays are hourly and aligned to forecast.hourly.time; marine values are matched by time key, missing = null. Wind is km/h.
export function normalise(forecast, marine, fetchedAt = new Date().toISOString()) {
  const f = forecast.hourly, m = marine?.hourly, time = f.time;
  const at = new Map((m?.time || []).map((t, k) => [t, k]));
  const fc = k => time.map((_, i) => f[k]?.[i] ?? null);
  const ma = k => time.map(t => at.has(t) ? m[k]?.[at.get(t)] ?? null : null);
  return {
    time, wind: fc("wind_speed_10m"), gust: fc("wind_gusts_10m"), windDir: fc("wind_direction_10m"),
    wave: ma("wave_height"), waveDir: ma("wave_direction"), wavePeriod: ma("wave_period"),
    swell: ma("swell_wave_height"), swellPeriod: ma("swell_wave_period"), swellDir: ma("swell_wave_direction"),
    sst: ma("sea_surface_temperature"), tide: ma("sea_level_height_msl"),
    pressure: fc("pressure_msl"), rainProb: fc("precipitation_probability"), code: fc("weather_code"),
    cloud: fc("cloud_cover"), uv: fc("uv_index"),
    sunrise: forecast.daily?.sunrise || [], sunset: forecast.daily?.sunset || [], fetchedAt,
  };
}

// ---- helpers: 0..1, missing input scores a neutral .6 ----
export const ramp = (v, good, bad) => v == null ? .6 : Math.max(0, Math.min(1, (bad - v) / (bad - good)));  // 1 at or below good, 0 at or above bad
export const rise = (v, bad, good) => ramp(v, good, bad);  // 0 at or below bad, 1 at or above good
export const band = (v, lo0, lo1, hi1, hi0) => v == null ? .6 : v <= lo0 || v >= hi0 ? 0 : v < lo1 ? (v - lo0) / (lo1 - lo0) : v <= hi1 ? 1 : (hi0 - v) / (hi0 - hi1);
// 0-180: angle between where wind/swell comes from and the direction the beach faces out to sea. 0 = from the sea (onshore), 180 = from the land (offshore)
export const relAngle = (fromDeg, coastBearing) => {
  if (fromDeg == null || coastBearing == null) return null;
  const d = ((Math.abs(fromDeg - coastBearing) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
};
export const windClass = a => a == null ? null : a >= 135 ? "offshore" : a <= 45 ? "onshore" : "cross";
export const kn = kmh => kmh == null ? null : kmh / 1.852;

// ---- time helpers (tz-free) ----
const mins = t => +t.slice(11, 13) * 60 + +t.slice(14, 16);
const plusH = (t, h) => new Date(Date.parse(t + ":00Z") + h * 3600e3).toISOString().slice(0, 16);
const sastNow = () => new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 16);
const sun = (d, i) => {
  const k = d.sunrise.findIndex(s => s.slice(0, 10) === d.time[i].slice(0, 10));
  return k < 0 || !d.sunset[k] ? null : { rise: mins(d.sunrise[k]), set: mins(d.sunset[k]) };
};
const isNight = (d, i) => { const s = sun(d, i), t = mins(d.time[i]); return s ? t < s.rise || t > s.set : false; };

// ---- moon ----
const SYN = 29.530589, NEW0 = Date.UTC(2000, 0, 6, 18, 14);
export function moon(date) {  // Date, or an ISO string (a string with no zone is read as UTC; the 2 h SAST offset is noise at this precision)
  const t = date instanceof Date ? +date : Date.parse(date.length === 10 ? date + "T00:00Z" : /Z$/.test(date) ? date : date + "Z");
  const age = (((t - NEW0) / 864e5) % SYN + SYN) % SYN, h = SYN / 2, r = age % h, daysFromSyzygy = Math.min(r, h - r);
  return { age, phaseIndex: Math.round(age / SYN * 8) % 8, illum: (1 - Math.cos(2 * Math.PI * age / SYN)) / 2, daysFromSyzygy, springs: daysFromSyzygy <= 2 };
}

// High/low tide: local max/min of the hourly series, refined to the minute with a parabola through 3 points.
export function extrema(times, v) {
  const out = [];
  for (let i = 1; i < v.length - 1; i++) {
    const [a, b, c] = [v[i - 1], v[i], v[i + 1]];
    if (a == null || b == null || c == null) continue;
    const high = b > a && b >= c, low = b < a && b <= c;
    if (!high && !low) continue;
    const den = a - 2 * b + c, off = den ? 0.5 * (a - c) / den : 0;
    const at = new Date(new Date(times[i] + ":00Z").getTime() + off * 3600e3).toISOString().slice(0, 16);  // tz-free arithmetic on local wall time
    out.push({ i, high, at, h: b - 0.25 * (a - c) * off });
  }
  return out;
}

// ---- shared variable values; ctx = { coastBearing, maxFlow } ----
const flowAt = (d, i) => i > 0 && i < d.tide.length - 1 && d.tide[i - 1] != null && d.tide[i + 1] != null ? Math.abs(d.tide[i + 1] - d.tide[i - 1]) : null;
export const makeCtx = (d, coastBearing = null) => ({ coastBearing, maxFlow: Math.max(0, ...d.time.map((_, i) => flowAt(d, i) ?? 0)) });
const ge = (v, t) => v != null && v >= t;
const thunder = (d, i) => ge(d.code[i], 95);

const SHARED = {
  tideFlow: { key: "tideFlow", label: "Tide flow", phrase: { good: "the water is moving", bad: "it is slack water" },
    value: (d, i, x) => { const r = flowAt(d, i); return r == null || !x.maxFlow ? .6 : Math.min(1, r / (.7 * x.maxFlow)); } },  // moving water beats slack
  pressTrend: { key: "pressTrend", label: "Pressure trend", phrase: { good: "the glass is falling gently", bad: "the pressure is not helping" },
    value: (d, i) => {
      const dp = i >= 3 && d.pressure[i] != null && d.pressure[i - 3] != null ? d.pressure[i] - d.pressure[i - 3] : null;
      return dp == null ? .6 : dp < -4 ? .3 : dp < -1 ? 1 : Math.abs(dp) <= 1 ? .7 : .6;  // a gentle fall switches fish on; a crash means a front
    } },
  light: { key: "light", label: "Light", phrase: { good: "it is first or last light", bad: "it is the middle of the day" },
    value: (d, i) => { const s = sun(d, i); return s ? (Math.min(Math.abs(mins(d.time[i]) - s.rise), Math.abs(mins(d.time[i]) - s.set)) <= 90 ? 1 : .75) : .6; } },
  rain: { key: "rain", label: "Rain", phrase: { good: "it stays dry", bad: "rain is likely" },
    value: (d, i) => ge(d.code[i], 95) ? 0 : ramp(d.rainProb[i], 30, 90) },
  springs: { key: "springs", label: "Spring tide", phrase: { good: "it is a springs tide", bad: "it is a neaps tide" },
    value: (d, i) => { const x = moon(d.time[i]).daysFromSyzygy; return x <= 2 ? 1 : 1 - .6 * Math.min(1, (x - 2) / 3); } },
};
const S = (name, weight) => ({ ...SHARED[name], weight });

const flag = (level, code, text) => ({ level, code, text });

// ponytail: hand-set weights, tune by hand from feedback
// Modes. vars: { key, label, weight, value(d, i, ctx) -> 0..1, phrase: { good, bad } }. windColour: wind class -> good|fair|poor|danger, null = neutral.
// safety: { limits (every one is a >= threshold; sites may only lower them), check(d, i, ctx, limits) -> flag | null }. gate(d, i, ctx) -> 0..1 multiplies the score, not tunable.
export const MODES = {
  fishing: {
    label: "Fishing", lanes: ["tide", "swell", "wind", "pressure", "sst"], defaultUnits: "kmh", windColour: null,
    vars: [
      S("tideFlow", .20),
      { key: "sea", label: "Sea state", weight: .20, value: (d, i) => band(d.wave[i], -0.5, 0.5, 1.5, 3.0), phrase: { good: "the sea is workable", bad: "the sea is too flat or too rough" } },
      { key: "wind", label: "Wind", weight: .15, value: (d, i) => ramp(d.wind[i], 15, 40), phrase: { good: "the wind is light", bad: "the wind is strong" } },
      { key: "gust", label: "Gusts", weight: .10, value: (d, i) => ramp(d.gust[i], 25, 55), phrase: { good: "the gusts are mild", bad: "the gusts are strong" } },
      S("pressTrend", .15), S("light", .10), S("rain", .05), S("springs", .05),
    ],
    safety: {
      limits: { waveWarn: 2.5, gustWarn: 60, waveDanger: 3.5 },
      check: (d, i, x, t) => thunder(d, i) ? flag("danger", "thunder", "Thunderstorm: stay off the water and rocks")
        : ge(d.wave[i], t.waveDanger) ? flag("danger", "sea", "Dangerous sea: do not fish the rocks")
        : ge(d.wave[i], t.waveWarn) ? flag("warn", "sea", "Big sea: stay off the low rocks")
        : ge(d.gust[i], t.gustWarn) ? flag("warn", "gust", "Strong gusts") : null,
    },
  },
  surf: {
    label: "Surf", lanes: ["swell", "period", "wind", "tide"], defaultUnits: "kn", windColour: { offshore: "good", cross: "fair", onshore: "poor" },
    vars: [
      { key: "swellSize", label: "Swell size", weight: .25, value: (d, i) => band(d.swell[i], 0.5, 1.0, 2.5, 3.5), phrase: { good: "the swell is a good size", bad: "the swell is too small or too big" } },
      { key: "period", label: "Swell period", weight: .20, value: (d, i) => rise(d.swellPeriod[i], 6, 13), phrase: { good: "the swell has a long period", bad: "the swell is short and weak" } },
      { key: "windSpeed", label: "Wind speed", weight: .15, value: (d, i) => ramp(kn(d.wind[i]), 5, 20), phrase: { good: "the wind is light", bad: "the wind is strong" } },
      { key: "offshore", label: "Wind direction", weight: .25, phrase: { good: "the wind is offshore", bad: "the wind is onshore" },
        value: (d, i, x) => { const w = kn(d.wind[i]), a = relAngle(d.windDir[i], x.coastBearing); return w == null || a == null ? .6 : w < 5 ? .9 : a / 180; } },  // glassy under 5 kn
      { key: "swellAim", label: "Swell angle", weight: .10, value: (d, i, x) => ramp(relAngle(d.swellDir[i], x.coastBearing), 60, 110), phrase: { good: "the swell faces the beach", bad: "the swell comes in at a bad angle" } },
      { key: "tide", label: "Tide", weight: .05, value: () => .7, phrase: { good: "the tide is fine", bad: "the tide is wrong" } },  // fixed in v1: the break is unknown
    ],
    gate: (d, i, x) => { const a = relAngle(d.windDir[i], x.coastBearing); return a != null && a <= 45 ? .5 + .5 * ramp(kn(d.wind[i]), 10, 20) : 1; },  // strong onshore wind ruins any swell
    safety: {
      limits: { waveWarn: 3.0 },
      check: (d, i, x, t) => thunder(d, i) ? flag("danger", "thunder", "Thunderstorm: get out of the water")
        : ge(d.wave[i], t.waveWarn) ? flag("warn", "sea", "Experienced surfers only") : null,
    },
  },
  kite: {
    label: "Kite", lanes: ["wind", "gust", "sea", "tide"], defaultUnits: "kn", windColour: { cross: "good", onshore: "fair", offshore: "danger" },
    vars: [
      { key: "windBand", label: "Wind strength", weight: .35, value: (d, i) => band(kn(d.wind[i]), 10, 14, 25, 32), phrase: { good: "the wind is in the kite range", bad: "the wind is too light or too strong" } },
      { key: "steady", label: "Steadiness", weight: .20, value: (d, i) => ramp(d.wind[i] > 0 && d.gust[i] != null ? d.gust[i] / d.wind[i] : null, 1.3, 1.8), phrase: { good: "the wind is steady", bad: "the wind is gusty" } },
      { key: "direction", label: "Wind direction", weight: .30, value: (d, i, x) => band(relAngle(d.windDir[i], x.coastBearing), 10, 45, 100, 130), phrase: { good: "the wind is cross-shore", bad: "the wind direction is wrong" } },
      S("rain", .10),
      { key: "sea", label: "Sea state", weight: .05, value: (d, i) => ramp(d.wave[i], 1.5, 3.0), phrase: { good: "the sea is flat", bad: "the sea is rough" } },
    ],
    safety: {
      limits: { gustRatioWarn: 1.8, offshoreKnDanger: 8, gustKnDanger: 35 },
      check: (d, i, x, t) => {
        const a = relAngle(d.windDir[i], x.coastBearing);
        return thunder(d, i) ? flag("danger", "thunder", "Thunderstorm: do not kite")
          : windClass(a) === "offshore" && ge(kn(d.wind[i]), t.offshoreKnDanger) ? flag("danger", "offshore", "Offshore wind: do not kite")
          : ge(kn(d.gust[i]), t.gustKnDanger) ? flag("danger", "gust", "Gusts too strong to kite")
          : ge(kn(d.wind[i]), 10) && ge(d.gust[i] / d.wind[i], t.gustRatioWarn) ? flag("warn", "gust", "Gusty") : null;  // the ratio means nothing in light air
      },
    },
  },
  boat: {
    label: "Boat", lanes: ["wind", "sea", "swell", "tide"], defaultUnits: "kn", windColour: null,
    vars: [
      { key: "wind", label: "Wind", weight: .30, value: (d, i) => ramp(d.wind[i], 10, 30), phrase: { good: "the wind is light", bad: "the wind is strong" } },
      { key: "gust", label: "Gusts", weight: .15, value: (d, i) => ramp(d.gust[i], 20, 45), phrase: { good: "the gusts are mild", bad: "the gusts are strong" } },
      { key: "sea", label: "Sea state", weight: .25, value: (d, i) => ramp(d.wave[i], 0.8, 2.0), phrase: { good: "the sea is calm", bad: "the sea is rough" } },
      { key: "period", label: "Wave period", weight: .10, value: (d, i) => rise(d.wavePeriod[i], 6, 10), phrase: { good: "the waves are well spaced", bad: "the waves are short and steep" } },
      S("rain", .10),
      { key: "light", label: "Daylight", weight: .10, value: (d, i) => isNight(d, i) ? .3 : 1, phrase: { good: "it is daylight", bad: "it is dark" } },
    ],
    safety: {
      limits: { waveWarn: 2.0, gustWarn: 45, waveDanger: 3.0 },
      check: (d, i, x, t) => thunder(d, i) ? flag("danger", "thunder", "Thunderstorm: stay ashore")
        : ge(d.wave[i], t.waveDanger) ? flag("danger", "sea", "Dangerous sea: stay ashore")
        : ge(d.wave[i], t.waveWarn) ? flag("warn", "sea", "Rough sea")
        : ge(d.gust[i], t.gustWarn) ? flag("warn", "gust", "Strong gusts")
        : isNight(d, i) ? flag("warn", "night", "Night: poor visibility on the water") : null,
    },
  },
};

// Site safety overrides may only tighten: every limit is a >= threshold, so the lower value wins. Unknown keys and non-numbers are ignored.
export const tighten = (defaults, site = {}) =>
  Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, typeof site[k] === "number" ? Math.min(v, site[k]) : v]));

// weights layer: mode default, then overrides ({ key: number }); unknown keys are ignored
export const effectiveWeights = (modeKey, over = {}) => Object.fromEntries(MODES[modeKey].vars.map(v => [v.key, over[v.key] ?? v.weight]));

// score = 100 x sum(w x v) / sum(w) x gate. Flags are separate: the score is never capped by safety.
export function scoreHours(d, modeKey, { coastBearing = null, weights = {}, safety = {} } = {}) {
  const m = MODES[modeKey], x = makeCtx(d, coastBearing), lim = tighten(m.safety.limits, safety), w = effectiveWeights(modeKey, weights);
  const tot = Object.values(w).reduce((a, b) => a + b, 0), n = d.time.length;
  const parts = Object.fromEntries(m.vars.map(v => [v.key, Array(n)])), score = Array(n), flags = Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (const v of m.vars) s += w[v.key] * (parts[v.key][i] = v.value(d, i, x));
    score[i] = tot ? Math.round(100 * s / tot * (m.gate ? m.gate(d, i, x) : 1)) : 0;
    flags[i] = m.safety.check(d, i, x, lim);
  }
  return { score, parts, flags };
}

// Breakdown for hour i: rows with each variable's share of the score (w x v / sum(w) x 100) and a plain sentence.
// The sentence uses the two highest shares (phrase.good) and the biggest drag, w x (1 - v) (phrase.bad), only if it is real (v < .6).
export function explain(modeKey, parts, i, weights = {}) {
  const m = MODES[modeKey], w = effectiveWeights(modeKey, weights), tot = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  const rows = m.vars.map(v => ({ key: v.key, label: v.label, weight: w[v.key], value: parts[v.key][i], share: 100 * w[v.key] * parts[v.key][i] / tot, phrase: v.phrase }));
  const top = [...rows].sort((a, b) => b.share - a.share).slice(0, 2);
  const drag = [...rows].sort((a, b) => b.weight * (1 - b.value) - a.weight * (1 - a.value))[0];
  const s = top.map(r => r.phrase.good).join(" and ") + (drag && drag.value < .6 ? ", but " + drag.phrase.bad : "");
  return { rows, sentence: s.charAt(0).toUpperCase() + s.slice(1) + "." };
}

// ---- windows ----
export const rating = s => s >= 70 ? "Good" : s >= 45 ? "Fair" : "Poor";
const SLOTS = ["EA", "MO", "LA", "AF", "EV", "LP"];  // 00-04 ... 20-24

// 4-hour windows from a scoreHours result. now = local wall-clock string, defaults to the current time in SAST.
export function windows(d, hourly, now = sastNow()) {
  const out = [];
  for (let k = 0; k < (d.time.length / 4 | 0); k++) {
    const a = k * 4, sc = hourly.score.slice(a, a + 4), fl = hourly.flags.slice(a, a + 4).filter(Boolean);
    out.push({
      day: a / 24 | 0, slot: k % 6, label: SLOTS[k % 6], start: d.time[a],
      score: Math.round(sc.reduce((p, c) => p + c, 0) / 4),
      flag: fl.find(f => f.level === "danger") || fl[0] || null,
      past: plusH(d.time[a + 3], 1) <= now,
    });
  }
  return out;
}

// best sliding 3 h run on one day, skipping any run that has a flagged hour: { from: "05:00", to: "08:00", avg, rating } or null
export function bestWindow(score, flags, day) {
  let best = null;
  for (let h = 0; h <= 21; h++) {
    const a = day * 24 + h;
    if (a + 2 >= score.length || flags[a] || flags[a + 1] || flags[a + 2]) continue;
    const avg = (score[a] + score[a + 1] + score[a + 2]) / 3;
    if (!best || avg > best.avg) best = { h, avg };
  }
  if (!best) return null;
  const p = h => String(h).padStart(2, "0") + ":00", avg = Math.round(best.avg);
  return { from: p(best.h), to: p(best.h + 3), avg, rating: rating(avg) };
}
