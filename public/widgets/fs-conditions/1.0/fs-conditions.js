// <fs-conditions>: fishing / surf / kite / boat forecast widget. Shadow DOM, D3 v7 for scales, shapes and zoom; all numbers come from engine.js.
// Attributes, theme tokens and the config schema: see README.md.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchRaw, normalise, MODES, scoreHours, explain, makeCtx, effectiveWeights, windows, bestWindow, rating, extrema, moon, relAngle, windClass, kn } from "./engine.js";
import { ICONS } from "./icons.js";

const HEAD = 22, SCORE = 44, LANE = 64, RIB = 72;
const LANE_ORDER = ["tide", "swell", "period", "wind", "gust", "sea", "pressure", "sst"];
const LANE_NAME = { tide: "Tide", swell: "Swell", period: "Period", wind: "Wind", gust: "Gusts", sea: "Sea", pressure: "Pressure", sst: "Sea temp" };
const LANE_COL = { tide: "tide", swell: "swell", period: "swell", wind: "wind", gust: "wind", sea: "swell", pressure: "pressure", sst: "sst" };
const LV = { warn: "safety-warn", danger: "safety-danger" };
const INT = { wind: [12, 25, 38], swell: [1, 2, 3] };  // intensity band edges: wind km/h (Beaufort 3 / 5 / 7), swell and sea m
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const POINTS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

const ls = {  // every storage call is guarded: private mode and blocked storage throw
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* quota or blocked */ } },
  del: k => { try { localStorage.removeItem(k); } catch { /* blocked */ } },
};
const nn = v => v != null;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad = n => String(n).padStart(2, "0");
const fmt = (v, n = 0) => v == null ? "-" : v.toFixed(n);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dayName = t => DAYS[new Date(t.slice(0, 10) + "T00:00Z").getUTCDay()];
const hhmm = t => t.slice(11, 16);
const compass = deg => deg == null ? "" : POINTS[Math.round(deg / 22.5) % 16];
const mean = a => { const v = a.filter(nn); return v.length ? v.reduce((p, c) => p + c, 0) / v.length : null; };
const ext = a => { const v = a.filter(nn); return v.length ? [Math.min(...v), Math.max(...v)] : [0, 1]; };
const dom = (lo, hi) => [lo, hi > lo ? hi : lo + 1];
const body = id => (ICONS[id] || "").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
// works in HTML and as a nested <svg> inside the chart (pass x/y/style in `at`)
const ico = (id, px = 16, at = "") => `<svg ${at} width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body(id)}</svg>`;

const CSS = `
:host{display:block}
:host([hidden]),[hidden]{display:none!important}
*{box-sizing:border-box}
.root{--c-bg:var(--fs-bg,#ffffff);--c-surface:var(--fs-surface,#f2f5f7);--c-text:var(--fs-text,#16222c);--c-muted:var(--fs-muted,#5b6873);--c-grid:var(--fs-grid,#d3dbe1);
--c-good:var(--fs-good,#3aa675);--c-fair:var(--fs-fair,#e2b93b);--c-poor:var(--fs-poor,#d9822b);--c-danger:var(--fs-danger,#c0262d);
--c-i1:var(--fs-int-1,#5aa9e6);--c-i2:var(--fs-int-2,#3aa675);--c-i3:var(--fs-int-3,#e2b93b);--c-i4:var(--fs-int-4,#d9534f);
--c-wind:var(--fs-wind,#4f7cc4);--c-swell:var(--fs-swell,#1f9aa8);--c-tide:var(--fs-tide,#2f6fb0);--c-pressure:var(--fs-pressure,#8a63b8);--c-sst:var(--fs-sst,#d6684f);--c-moon:var(--fs-moon,#9a8f5a);
--font:var(--fs-font,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif);--radius:var(--fs-radius,10px);
position:relative;font:13px/1.4 var(--font);color:var(--c-text);background:var(--c-bg);border-radius:var(--radius);padding:10px}
button{font:inherit;color:inherit;background:var(--c-surface);border:1px solid var(--c-grid);border-radius:999px;padding:5px 11px;display:inline-flex;gap:6px;align-items:center;cursor:pointer;min-height:32px}
button:focus-visible,.cell:focus-visible,input:focus-visible{outline:2px solid var(--c-text);outline-offset:2px}
button[aria-selected=true],button[aria-pressed=true]{background:var(--c-text);color:var(--c-bg);border-color:var(--c-text)}
.tabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;margin-bottom:8px}
.tl,.tools{display:flex;flex-wrap:wrap;gap:6px}
.units b{opacity:.5;font-weight:500}.units b.on{opacity:1;font-weight:700}
.banner,.stale{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:8px;margin-bottom:8px;border:2px solid var(--c-danger);background:color-mix(in srgb,var(--c-danger) 14%,var(--c-bg))}
.banner.warn{border-style:dashed}.banner span{color:var(--c-muted)}
.banner svg,.stale svg{color:var(--c-danger);flex:none}
.msg{padding:18px 8px;text-align:center;color:var(--c-muted)}
.overview{display:none;gap:4px;margin-bottom:8px}
.phone .overview{display:flex}
.overview button{flex:1;flex-direction:column;border-radius:8px;padding:4px;gap:3px;min-width:0;font-size:11px;min-height:0}
.overview button[aria-current=true]{border-color:var(--c-text)}
.ov{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;width:100%}.ov i{height:9px;display:block}
.chart{display:grid;grid-template-columns:var(--lw,84px) 1fr;position:relative;border:1px solid var(--c-grid);border-radius:8px;overflow:hidden}
.labels{border-right:1px solid var(--c-grid);background:var(--c-bg);z-index:1}
.lb{padding:2px 6px;display:flex;flex-direction:column;justify-content:center;border-bottom:1px solid var(--c-grid);overflow:hidden;font-size:11px;line-height:1.25}
.lb b{font-size:12px;display:flex;align-items:center;gap:4px}.lb span{color:var(--c-muted)}
.scroll{overflow-x:auto;overflow-y:hidden;position:relative;min-width:0}
.phone .scroll{scroll-snap-type:x mandatory}
.inner{position:relative}
svg.main{display:block;touch-action:pan-x pan-y}
.anc{position:absolute;inset:0;pointer-events:none}
.anc i{position:absolute;top:0;height:1px;scroll-snap-align:start}
.xh{pointer-events:none}
text{font-family:inherit;fill:var(--c-text)}
.t{font-size:10px;fill:var(--c-muted)}
.num{font-size:15px;font-weight:700;paint-order:stroke;stroke:var(--c-bg);stroke-width:3px;stroke-linejoin:round}
.cell{cursor:pointer;outline:none}.cell .fr{fill:none}.cell:focus-visible .fr{stroke:var(--c-text);stroke-width:2.5}
.tip{position:absolute;pointer-events:none;z-index:5;background:var(--c-surface);border:1px solid var(--c-grid);border-radius:8px;padding:6px 8px;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.25);max-width:250px}
.tip div{display:flex;gap:6px;align-items:center}.tip i{width:8px;height:8px;border-radius:50%;flex:none}.tip .w{color:var(--c-danger);font-weight:600}
.rb{font-size:10.5px;line-height:15px;padding:3px 6px;height:${RIB}px;overflow:hidden}
.rb div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rb svg{vertical-align:-3px}.rb .fl{color:var(--c-danger);font-weight:600}.rb .Good{color:var(--c-good)}.rb .Fair{color:var(--c-fair)}.rb .Poor{color:var(--c-poor)}.rb b{font-weight:700}
dialog{border:1px solid var(--c-grid);background:var(--c-surface);color:var(--c-text);border-radius:var(--radius);width:min(440px,92vw);padding:14px 16px;font:13px/1.4 var(--font)}
dialog::backdrop{background:rgba(0,0,0,.45)}
dialog h3{margin:0;font-size:15px}.hd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}
.big{display:flex;gap:10px;align-items:center;margin-bottom:6px}.big b{font-size:28px;line-height:1}
.pill{padding:2px 9px;border-radius:999px;font-weight:700;color:#10202c}
.br{display:grid;grid-template-columns:1fr 1.2fr 28px;gap:8px;align-items:center;margin:5px 0}
.br small{display:block;color:var(--c-muted)}.br em{font-style:normal;text-align:right;font-weight:700}
.bar{position:relative;height:10px;background:var(--c-grid);border-radius:5px;overflow:hidden;opacity:.9}.bar i{position:absolute;left:0;top:0;bottom:0;background:var(--c-text);opacity:.8}
.wn{color:var(--c-danger);font-weight:600;margin:8px 0 0;display:flex;gap:6px;align-items:center}
.note{color:var(--c-muted);font-size:11px;margin:8px 0 0}
.tn{display:grid;grid-template-columns:1fr 1.4fr 30px;gap:8px;align-items:center;margin:6px 0}.tn input{width:100%}
.act{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
.foot{font-size:11px;color:var(--c-muted);margin-top:8px;display:flex;flex-wrap:wrap;gap:2px 14px}.foot a{color:inherit}.foot svg{vertical-align:-2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;

const SHELL = `<style>${CSS}</style>
<div class="root" part="root">
  <div class="tabs" part="tabs">
    <div class="tl" role="tablist" aria-label="Activity"></div>
    <div class="tools">
      <button class="units" type="button"></button>
      <button class="tunebtn" type="button" aria-haspopup="dialog">${ico("ui-tune", 16)}Tune</button>
      <button class="all" type="button" aria-pressed="false">Show all lanes</button>
    </div>
  </div>
  <div class="banner" part="banner" role="alert" hidden></div>
  <div class="stale" part="banner" role="status" hidden></div>
  <div class="overview" part="overview"></div>
  <div class="msg" role="status">Loading forecast...</div>
  <div class="chart" role="tabpanel" hidden>
    <div class="labels"></div>
    <div class="scroll"><div class="inner">
      <svg class="main" role="group"><g class="m"></g><g class="xh"></g></svg>
      <div class="anc"></div>
    </div></div>
    <div class="tip" hidden></div>
  </div>
  <dialog class="panel" part="panel" aria-modal="true"></dialog>
  <dialog class="tune" part="tune" aria-modal="true"></dialog>
  <div class="foot" part="footer"></div>
  <table class="sr"></table>
</div>`;

class FsConditions extends HTMLElement {
  static observedAttributes = ["lat", "lon", "sea-lat", "sea-lon", "coast-bearing", "modes", "default-mode", "place", "endpoint", "config"];
  #r = {}; #o = null; #d = null; #raw = null; #offline = false;
  #mode = null; #units = "kmh"; #showAll = false; #k = 1; #phone = false; #lastW = 0;
  #res = {}; #w = {}; #x = null; #view = null; #focusW = null;
  #gen = 0; #started = false; #timer = 0; #raf = 0; #ro;

  constructor() {
    super();
    const sh = this.attachShadow({ mode: "open" });
    sh.innerHTML = SHELL;
    const q = s => sh.querySelector(s), r = this.#r;
    Object.assign(r, { root: q(".root"), tl: q(".tl"), units: q(".units"), tunebtn: q(".tunebtn"), all: q(".all"), banner: q(".banner"), stale: q(".stale"),
      ov: q(".overview"), msg: q(".msg"), chart: q(".chart"), labels: q(".labels"), sc: q(".scroll"), inner: q(".inner"), svg: q("svg.main"), m: q(".m"), xh: q(".xh"),
      anc: q(".anc"), tip: q(".tip"), panel: q(".panel"), tune: q(".tune"), foot: q(".foot"), table: q(".sr") });

    this.#ro = new ResizeObserver(() => {
      const w = r.root.clientWidth, ph = w < 640;
      if (ph === this.#phone && Math.abs(w - this.#lastW) < 2) return;
      this.#lastW = w;
      requestAnimationFrame(() => { this.#phone = ph; r.root.classList.toggle("phone", ph); this.#render(); });  // not in the callback: resizing the observed box there trips the RO loop warning
    });

    r.tl.addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (b) this.#setMode(b.dataset.m); });
    r.tl.addEventListener("keydown", e => {
      const ids = this.#o?.modes || [], i = ids.indexOf(this.#mode), to = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key];
      if (to == null) return;
      e.preventDefault(); this.#setMode(ids[(to + ids.length) % ids.length]); r.tl.querySelector(`[data-m="${this.#mode}"]`).focus();
    });
    r.units.addEventListener("click", () => {
      this.#units = this.#units === "kn" ? "kmh" : "kn"; ls.set("fs-conditions:units", this.#units); this.#render();
    });
    r.all.addEventListener("click", () => { this.#showAll = !this.#showAll; this.#render(); });
    r.tunebtn.addEventListener("click", () => this.#openTune());
    r.msg.addEventListener("click", e => { if (e.target.closest(".retry")) this.#load(); });
    r.ov.addEventListener("click", e => {
      const b = e.target.closest("[data-d]"); if (!b || !this.#x) return;
      r.sc.scrollTo({ left: this.#x(+b.dataset.d * 24), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    r.sc.addEventListener("scroll", () => {
      r.tip.hidden = true;
      if (!this.#phone || !this.#x) return;
      const day = Math.round(r.sc.scrollLeft / (this.#x(24) - this.#x(0)));
      r.ov.querySelectorAll("[data-d]").forEach(b => b.setAttribute("aria-current", String(+b.dataset.d === day)));
    });

    // crosshair + tooltip
    const at = e => { const [px] = d3.pointer(e, r.svg); return clamp(Math.floor(this.#x.invert(px)), 0, this.#d.time.length - 1); };
    const move = e => { if (this.#x && this.#d && this.#view) this.#cross(at(e), e); };
    r.svg.addEventListener("pointermove", move);
    r.svg.addEventListener("pointerdown", move);
    r.svg.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") this.#uncross(); });
    r.svg.addEventListener("pointercancel", () => this.#uncross());
    r.svg.addEventListener("click", e => { const c = e.target.closest(".cell"); if (c) this.#open(+c.dataset.w); });
    r.svg.addEventListener("keydown", e => {
      const c = e.target.closest?.(".cell"); if (!c) return;
      const k = +c.dataset.w, row = k - k % 6;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.#open(k); return; }
      const to = { ArrowRight: k + 1, ArrowLeft: k - 1, ArrowDown: k + 6, ArrowUp: k - 6, Home: row, End: row + 5 }[e.key];
      const nx = to != null && r.svg.querySelector(`.cell[data-w="${to}"]`);
      if (!nx) return;
      e.preventDefault(); c.tabIndex = -1; nx.tabIndex = 0; this.#focusW = to; nx.focus();
    });

    // pinch / ctrl+wheel zoom on x only; native scroll pans. ponytail: zoom centre is approximated by keeping the scroll midpoint
    d3.select(r.svg).call(d3.zoom().scaleExtent([.5, 3])
      .filter(e => e.type === "wheel" ? e.ctrlKey : e.type.startsWith("touch") && e.touches.length > 1)
      .on("zoom", e => {
        if (e.transform.k === this.#k) return;
        const s = r.sc, mid = (s.scrollLeft + s.clientWidth / 2) / (s.scrollWidth || 1);
        this.#k = e.transform.k; this.#render();
        s.scrollLeft = mid * s.scrollWidth - s.clientWidth / 2;
      }));
    r.svg.style.touchAction = "pan-x pan-y";

    // dialogs: showModal() traps focus, closes on Escape and restores focus; a click on the backdrop closes too
    for (const dlg of [r.panel, r.tune]) dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest(".close")) dlg.close(); });
    r.tune.addEventListener("input", e => this.#tuneInput(e.target));
    r.tune.addEventListener("click", e => { if (e.target.closest(".reset")) this.#resetTune(); });
  }

  connectedCallback() {
    this.#ro.observe(this.#r.root);
    this.#timer = setInterval(() => { if (document.visibilityState === "visible" && this.#o) this.#load(); }, 30 * 60e3);
    document.addEventListener("visibilitychange", this.#vis);
    if (!this.#started) { this.#started = true; this.#start(); }
  }
  disconnectedCallback() { clearInterval(this.#timer); this.#ro.disconnect(); document.removeEventListener("visibilitychange", this.#vis); }
  attributeChangedCallback() { if (this.#started) queueMicrotask(() => this.#start()); }
  #vis = () => { if (document.visibilityState === "visible" && this.#d && Date.now() - Date.parse(this.#raw.fetchedAt) > 30 * 60e3) this.#load(); };

  // ---- options, data ----
  async #start() {
    const g = ++this.#gen, a = n => this.getAttribute(n), num = n => { const v = a(n); return v == null || v === "" || isNaN(+v) ? undefined : +v; };
    let o = { lat: num("lat"), lon: num("lon"), seaLat: num("sea-lat"), seaLon: num("sea-lon"), coastBearing: num("coast-bearing"),
      modes: a("modes"), defaultMode: a("default-mode"), place: a("place"), endpoint: a("endpoint") };
    const cu = a("config");
    if (cu) try { const r = await fetch(cu); if (!r.ok) throw new Error("HTTP " + r.status); o = { ...o, ...await r.json() }; } catch (e) { console.warn("fs-conditions: config not loaded:", e.message); }
    if (g !== this.#gen) return;
    o.lat = +o.lat; o.lon = +o.lon;
    if (!isFinite(o.lat) || !isFinite(o.lon)) { this.#msg("fs-conditions: lat and lon are required."); return; }
    const list = (Array.isArray(o.modes) ? o.modes : String(o.modes || "").split(",")).map(s => String(s).trim()).filter(k => MODES[k]);  // unknown modes are ignored
    o.modes = list.length ? [...new Set(list)] : Object.keys(MODES);
    if (o.coastBearing == null) { console.warn("fs-conditions: no coast-bearing set, using 115"); o.coastBearing = 115; }
    o.place = o.place || o.lat + "," + o.lon;
    this.#o = o; this.#res = {}; this.#w = {}; this.#k = 1;
    this.#mode = o.modes.includes(o.defaultMode) ? o.defaultMode : o.modes[0];
    const u = ls.get("fs-conditions:units");
    this.#units = u === "kn" || u === "kmh" ? u : MODES[this.#mode].defaultUnits;
    this.#r.tl.innerHTML = o.modes.map(k => `<button type="button" role="tab" data-m="${k}">${ico("mode-" + k, 16)}${MODES[k].label}</button>`).join("");
    await this.#load();
  }

  async #load() {
    const o = this.#o, g = this.#gen, key = `fs-conditions:data:${o.lat},${o.lon}`;
    try {
      const raw = await fetchRaw({ lat: o.lat, lon: o.lon, seaLat: o.seaLat, seaLon: o.seaLon, endpoint: o.endpoint });
      if (g !== this.#gen) return;
      const c = { fetchedAt: new Date().toISOString(), forecast: raw.forecast, marine: raw.marine };
      this.#setData(c, false); ls.set(key, JSON.stringify(c));
    } catch (e) {
      if (g !== this.#gen) return;
      console.warn("fs-conditions:", e.message);
      if (this.#d) { this.#offline = true; this.#render(); return; }
      let c = null; try { c = JSON.parse(ls.get(key)); } catch { /* bad cache */ }
      try { if (c?.forecast) { this.#setData(c, true); return; } } catch { /* unusable cache */ }
      this.#msg("The forecast could not be loaded and nothing is saved on this device.", true);
    }
  }

  #setData(c, offline) {
    this.#d = normalise(c.forecast, c.marine, c.fetchedAt); this.#raw = c; this.#offline = offline; this.#res = {};
    this.#msg(""); this.#render();
  }
  #msg(t, retry) { const m = this.#r.msg; m.hidden = !t; m.innerHTML = t ? esc(t) + (retry ? ' <button class="retry" type="button">Retry</button>' : "") : ""; if (t && !this.#d) this.#r.chart.hidden = true; }

  #setMode(k) {
    if (!this.#o.modes.includes(k) || k === this.#mode) return;
    this.#mode = k; this.#focusW = null;
    if (!ls.get("fs-conditions:units")) this.#units = MODES[k].defaultUnits;
    this.#render();
  }

  // weights: mode default (engine) < site config < this visitor's sliders
  #wkey = m => `fs-conditions:w:${this.#o.place}:${m}`;
  #wts(m) {
    if (!this.#w[m]) { let s = {}; try { s = JSON.parse(ls.get(this.#wkey(m))) || {}; } catch { /* bad value */ } this.#w[m] = Object.fromEntries(Object.entries(s).filter(([, v]) => typeof v === "number")); }
    return { ...this.#o.weights?.[m], ...this.#w[m] };
  }
  #score(m = this.#mode) {
    return this.#res[m] ??= scoreHours(this.#d, m, { coastBearing: this.#o.coastBearing, weights: this.#wts(m), safety: this.#o.safety?.[m] });
  }
  #again() { cancelAnimationFrame(this.#raf); this.#raf = requestAnimationFrame(() => this.#render()); }

  // ---- render ----
  #render() {
    const d = this.#d, r = this.#r, o = this.#o; if (!d || !o) return;
    const phone = this.#phone, mk = this.#mode, m = MODES[mk], res = this.#score(), wins = windows(d, res), n = d.time.length, days = n / 24 | 0;
    const lw = phone ? 64 : 84, avail = r.root.clientWidth - 22 - lw; if (avail <= 0) return;  // 22 = root padding + chart border
    r.root.style.setProperty("--lw", lw + "px");
    const pph = (phone ? 14 : Math.max(6, avail / n)) * this.#k, W = n * pph, x = d3.scaleLinear([0, n], [0, W]); this.#x = x;
    const step = Math.max(phone ? 2 : 3, Math.ceil(20 / pph));
    const u = this.#units, ul = u === "kn" ? "kn" : "km/h", spd = v => v == null ? null : u === "kn" ? kn(v) : v;
    const t0 = Date.parse(d.time[0] + ":00Z"), nowH = (Date.parse(new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 16) + ":00Z") - t0) / 3600e3, nowX = x(clamp(nowH, 0, n));
    const own = m.lanes, ids = this.#showAll ? [...own, ...LANE_ORDER.filter(l => !own.includes(l))] : own;
    const H = HEAD + SCORE + ids.length * LANE + RIB, laneY = i => HEAD + SCORE + i * LANE;
    const ctx = makeCtx(d, o.coastBearing);
    const E = { d, x, n, step, spd, u, ul, W, pph, key: mk, m, bearing: o.coastBearing, ctx, res };
    const lanes = ids.map(id => this.#lane(id, E));
    const nights = []; // hour intervals [from, to] that are dark
    d.sunrise.forEach((rs, k) => {
      const b = d.time.findIndex(t => t.startsWith(rs.slice(0, 10))), hm = s => +s.slice(11, 13) + +s.slice(14, 16) / 60;
      if (b >= 0 && d.sunset[k]) nights.push([b, b + hm(rs)], [b + hm(d.sunset[k]), b + 24]);
    });
    const night = y0 => nights.map(([a, b]) => `<rect x="${x(a)}" y="${y0}" width="${x(Math.min(b, n)) - x(a)}" height="${LANE}" style="fill:var(--c-muted);opacity:.14"/>`).join("");

    const af = this.shadowRoot.activeElement?.closest?.(".cell")?.dataset.w;
    const firstLive = Math.max(0, wins.findIndex(w => !w.past)), fw = this.#focusW ?? firstLive;
    let s = `<defs>${lanes.map(l => l.defs).join("")}<pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="7" style="fill:var(--c-danger);opacity:.45"/></pattern>
      <clipPath id="cp"><rect x="0" y="0" width="${nowX}" height="${H}"/></clipPath><clipPath id="cf"><rect x="${nowX}" y="0" width="${W - nowX}" height="${H}"/></clipPath></defs>`;

    for (let k = 0; k < days; k++) s += `<text class="t" x="${x(k * 24) + 6}" y="15" style="font-weight:600">${dayName(d.time[k * 24])} ${d.time[k * 24].slice(8, 10)}</text><line x1="${x(k * 24)}" x2="${x(k * 24)}" y1="${HEAD - 6}" y2="${H}" style="stroke:var(--c-grid)"/>`;

    // score row
    const col = d3.scaleThreshold([45, 70], ["var(--c-poor)", "var(--c-fair)", "var(--c-good)"]);
    s += `<g part="score-row">`;
    wins.forEach((w, k) => {
      const a = k * 4, cx = x(a) + 1.5, cw = x(a + 4) - x(a) - 3, y0 = HEAD + 2, ch = SCORE - 4, rt = rating(w.score);
      const label = `${dayName(w.start)} ${pad(a % 24)}:00-${pad(a % 24 + 4)}:00, score ${w.score}, ${rt}${w.flag ? ", warning: " + w.flag.text : ""}`;
      s += `<g class="cell" data-w="${k}" role="button" tabindex="${k === fw ? 0 : -1}" aria-label="${esc(label)}" style="opacity:${w.past ? .4 : 1}">
        <rect x="${cx}" y="${y0}" width="${cw}" height="${ch}" rx="4" style="fill:${col(w.score)}"/>
        ${w.flag ? `<rect x="${cx}" y="${y0}" width="${cw}" height="${ch}" rx="4" fill="url(#hatch)" style="stroke:var(--c-danger);stroke-width:${w.flag.level === "danger" ? 2.5 : 1.5}"/>` : ""}
        <text class="t" x="${cx + cw / 2}" y="${y0 + 12}" text-anchor="middle">${w.label}</text>
        <text class="num" x="${cx + cw / 2}" y="${y0 + 31}" text-anchor="middle">${w.score}</text>
        ${w.flag ? ico(LV[w.flag.level], 13, `x="${cx + cw - 14}" y="${y0 + 1}" style="color:var(--c-danger)"`) : ""}
        <rect class="fr" x="${cx - 1}" y="${y0 - 1}" width="${cw + 2}" height="${ch + 2}" rx="5"/></g>`;
    });
    s += `</g>`;

    // lanes: content drawn twice, clipped to past (dim) and future
    lanes.forEach((l, i) => {
      const y0 = laneY(i);
      s += `<g part="lane" transform="translate(0 ${y0})">${night(0)}<line x1="0" x2="${W}" y1="${LANE}" y2="${LANE}" style="stroke:var(--c-grid)"/>
        <g clip-path="url(#cp)" style="opacity:.4">${l.g}</g><g clip-path="url(#cf)">${l.g}</g></g>`;
    });
    if (nowH > 0 && nowH < n) s += `<line x1="${nowX}" x2="${nowX}" y1="${HEAD}" y2="${H - RIB}" style="stroke:var(--c-text);stroke-dasharray:3 3;opacity:.5"/>`;

    // ribbon
    const ry = HEAD + SCORE + ids.length * LANE;
    s += `<g part="ribbon" transform="translate(0 ${ry})">`;
    for (let k = 0; k < days; k++) s += `<foreignObject x="${x(k * 24)}" y="0" width="${x(24) - x(0)}" height="${RIB}">${this.#ribbon(k, res)}</foreignObject>`;
    s += `</g>`;

    r.m.innerHTML = s;
    r.svg.setAttribute("width", W); r.svg.setAttribute("height", H); r.inner.style.width = W + "px";
    r.anc.innerHTML = phone ? Array.from({ length: days }, (_, k) => `<i style="left:${x(k * 24)}px;width:${x(24) - x(0)}px"></i>`).join("") : "";
    this.#view = { lanes, res, H };
    this.#uncross();
    this.#focusW = fw;

    // best window summary for the chart's group label
    let best = null;
    for (let k = 0; k < days; k++) {
      const b = bestWindow(res.score, res.flags, k);
      if (b && nowH < k * 24 + +b.to.slice(0, 2) && (!best || b.avg > best.avg)) best = { ...b, day: k };
    }
    const sum = best ? `Best: ${dayName(d.time[best.day * 24])} ${best.from}-${best.to}, ${best.rating}` : "No safe window in the forecast";
    r.svg.setAttribute("aria-label", `${m.label} forecast. ${sum}`);
    r.chart.setAttribute("aria-label", `${m.label} conditions`);

    r.labels.innerHTML = `<div style="height:${HEAD}px;border-bottom:1px solid var(--c-grid)"></div>
      <div class="lb" style="height:${SCORE}px"><b>Score</b><span>per 4 h</span></div>` +
      lanes.map(l => `<div class="lb" style="height:${LANE}px"><b><i style="width:8px;height:8px;border-radius:50%;background:${l.c};display:inline-block"></i>${l.name}</b><span>${l.sub}</span></div>`).join("") +
      `<div class="lb" style="height:${RIB}px;border-bottom:0"><b>Day</b><span>moon, sun, best</span></div>`;

    this.#chrome(res, wins, nowH, ul);
    r.chart.hidden = false;
    if (af != null) r.svg.querySelector(`.cell[data-w="${af}"]`)?.focus({ preventScroll: true });
  }

  // tabs state, banner, stale, overview, footer, hidden table
  #chrome(res, wins, nowH, ul) {
    const r = this.#r, d = this.#d, m = MODES[this.#mode], n = d.time.length;
    r.tl.querySelectorAll("[data-m]").forEach(b => { const on = b.dataset.m === this.#mode; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    r.units.innerHTML = `${ico("ui-units", 16)}<b class="${ul === "km/h" ? "on" : ""}">km/h</b>|<b class="${ul === "kn" ? "on" : ""}">kn</b>`;
    r.units.setAttribute("aria-label", `Wind units: ${ul === "kn" ? "knots" : "kilometres per hour"}. Switch to ${ul === "kn" ? "km/h" : "knots"}`);
    r.all.setAttribute("aria-pressed", this.#showAll);

    const i0 = Math.max(0, Math.floor(nowH)); let f = null, fi = 0;  // next warning in 48 h; a danger wins over an earlier warn
    for (let i = i0; i < Math.min(n, i0 + 48); i++) { const x = res.flags[i]; if (x && (!f || (x.level === "danger" && f.level !== "danger"))) { f = x; fi = i; } }
    r.banner.hidden = !f;
    if (f) {  // only touch the DOM when the text changes, so the alert is not re-announced on every redraw
      const h = `${ico(LV[f.level], 22)}<div><b>${esc(f.text)}</b> <span>${dayName(d.time[fi])} ${hhmm(d.time[fi])} (${m.label})</span></div>`;
      r.banner.className = "banner " + f.level; if (r.banner.innerHTML !== h) r.banner.innerHTML = h;
    }

    const age = Date.now() - Date.parse(this.#raw.fetchedAt), hrs = Math.floor(age / 3600e3);
    r.stale.hidden = age <= 24 * 3600e3;
    if (age > 24 * 3600e3) r.stale.innerHTML = `${ico("ui-offline", 20)}<div><b>Old forecast.</b> Last updated ${hrs} h ago. Do not rely on it.</div>`;

    r.ov.innerHTML = Array.from({ length: n / 24 | 0 }, (_, k) => `<button type="button" data-d="${k}" aria-label="Go to ${dayName(d.time[k * 24])}"><span>${dayName(d.time[k * 24])}</span><span class="ov">${wins.slice(k * 6, k * 6 + 6).map(w =>
      `<i style="background:${w.score >= 70 ? "var(--c-good)" : w.score >= 45 ? "var(--c-fair)" : "var(--c-poor)"};${w.flag ? "outline:1px solid var(--c-danger);outline-offset:-1px;" : ""}${w.past ? "opacity:.4" : ""}"></i>`).join("")}</span></button>`).join("");

    const t = new Date(this.#raw.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    r.foot.innerHTML = `<span>Updated ${t}${this.#offline ? ` &middot; ${ico("ui-offline", 12)} offline${hrs ? `, ${hrs} h old` : ""}` : ""}</span>
      <span>Weather: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a> (CC BY 4.0). Tide is modelled, not for navigation.</span>`;

    r.table.innerHTML = `<caption>${m.label} forecast in 4-hour windows</caption><thead><tr><th>Window</th><th>Score</th><th>Rating</th><th>Warning</th></tr></thead><tbody>${
      wins.map((w, k) => `<tr><td>${dayName(w.start)} ${pad(k * 4 % 24)}:00-${pad(k * 4 % 24 + 4)}:00</td><td>${w.score}</td><td>${rating(w.score)}</td><td>${w.flag ? esc(w.flag.text) : ""}</td></tr>`).join("")}</tbody>`;
  }

  #ribbon(k, res) {
    const d = this.#d, mo = moon(d.time[k * 24 + 12]), date = d.time[k * 24].slice(0, 10), si = d.sunrise.findIndex(s => s.startsWith(date));
    const bw = bestWindow(res.score, res.flags, k), fl = res.flags.slice(k * 24, k * 24 + 24).filter(Boolean);
    const f = fl.find(x => x.level === "danger") || fl[0];
    const sn = mo.springs ? "springs" : mo.daysFromSyzygy >= 5 ? "neaps" : "";
    return `<div class="rb">
      <div>${ico("moon-" + mo.phaseIndex, 14, 'style="color:var(--c-moon)"')} ${Math.round(mo.illum * 100)}%${sn ? ` ${ico(sn, 14)} ${sn}` : ""}</div>
      <div>${si >= 0 ? `${ico("sunrise", 14)} ${hhmm(d.sunrise[si])} ${ico("sunset", 14)} ${hhmm(d.sunset[si])}` : ""}</div>
      <div>${bw ? `Best ${bw.from}-${bw.to} <b class="${bw.rating}">${bw.rating}</b>` : "No safe window"}</div>
      ${f ? `<div class="fl" title="${esc(f.text)}">${ico(LV[f.level], 14)} ${esc(f.text)}</div>` : ""}</div>`;
  }

  // ---- lanes: { name, sub, c, g (svg, lane-local), tip(i) } ----
  #lane(id, E) {
    const { d, x, n, step, spd, u, ul, W, key, m, bearing, ctx } = E, X = i => x(i + .5), c = `var(--c-${LANE_COL[id]})`;
    const ln = (vals, y, st, w = 1.6, dash) => { const p = d3.line().defined(nn).x((v, i) => X(i)).y(y)(vals); return p ? `<path d="${p}" style="fill:none;stroke:${st};stroke-width:${w}"${dash ? ' stroke-dasharray="4 3"' : ""}/>` : ""; };
    const ar = (vals, y, base, st, op) => { const p = d3.area().defined(nn).x((v, i) => X(i)).y0(base).y1(y)(vals); return p ? `<path d="${p}" style="fill:${st};opacity:${op}"/>` : ""; };
    const samples = fn => { let s = ""; for (let i = 0; i < n; i += step) s += fn(i); return s; };
    // tiny direction triangle sitting on the line, pointing the way the wind or swell travels
    const tri = (cx, cy, deg, st) => `<path d="M0 -4.5L3.2 3.2L0 1.6L-3.2 3.2Z" transform="translate(${cx} ${cy}) rotate(${deg})" style="fill:${st};stroke:var(--c-bg);stroke-width:.9;paint-order:stroke"/>`;
    // intensity bands: a vertical gradient with hard stops at the band edges, so the line and area change colour with height
    const icol = (v, t) => `var(--c-i${v == null ? 1 : 1 + t.filter(b => v >= b).length})`;
    const heat = (gid, y, t) => {
      const o = t.map(b => clamp((B - y(b)) / B, 0, 1)), st = (k, at) => `<stop offset="${at}" style="stop-color:var(--c-i${k})"/>`;
      return `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${B}" x2="0" y2="0">${st(1, 0)}${o.map((at, k) => st(k + 1, at) + st(k + 2, at)).join("")}${st(t.length + 1, 1)}</linearGradient>`;
    };
    const rng = (vals, f, unit) => vals.some(nn) ? `${fmt(Math.min(...vals.filter(nn)), f)}-${fmt(Math.max(...vals.filter(nn)), f)} ${unit}` : "-";
    const wcls = i => windClass(relAngle(d.windDir[i], bearing));
    const out = (sub, g, tip, defs = "") => ({ id, name: LANE_NAME[id], sub, c, g, tip, defs });
    const B = LANE - 5;
    switch (id) {
      case "tide": {
        const [lo, hi] = ext(d.tide), y = d3.scaleLinear(dom(lo, hi), [LANE - 18, 18]), flow = i => d.tide[i - 1] == null || d.tide[i + 1] == null || !ctx.maxFlow ? .3 : Math.min(1, Math.abs(d.tide[i + 1] - d.tide[i - 1]) / (.7 * ctx.maxFlow));
        let g = `<g shape-rendering="crispEdges">`;
        for (let i = 1; i < n - 1; i++) if (d.tide[i] != null && d.tide[i + 1] != null) g += `<path d="M${X(i)} ${y(d.tide[i])}L${X(i + 1)} ${y(d.tide[i + 1])}V${B}H${X(i)}Z" style="fill:var(--c-tide);opacity:${(.08 + .5 * flow(i)).toFixed(2)}"/>`;
        g += `</g>` + ln(d.tide, y, c, 1.8);
        const t0 = Date.parse(d.time[0] + ":00Z");
        for (const e of extrema(d.time, d.tide)) {
          const ex = x((Date.parse(e.at + ":00Z") - t0) / 3600e3 + .5), ey = y(e.h);
          g += ico(e.high ? "tide-high" : "tide-low", 12, `x="${ex - 6}" y="${e.high ? ey - 15 : ey + 3}" style="color:var(--c-tide)"`) + `<text class="t" x="${ex + 8}" y="${e.high ? ey - 6 : ey + 12}">${e.at.slice(11, 16)}</text>`;
        }
        return out(rng(d.tide, 1, "m"), g, i => `Tide ${fmt(d.tide[i], 2)} m`);
      }
      case "swell": {
        const y = d3.scaleLinear(dom(0, Math.max(1.5, ext(d.swell)[1]) * 1.1), [B, 10]), hc = "url(#h-swell)";
        const g = ar(d.swell, y, B, hc, .2) + ln(d.swell, y, hc, 2) + samples(i => d.swell[i] == null || d.swellDir[i] == null ? "" : tri(X(i), y(d.swell[i]), d.swellDir[i] + 180, icol(d.swell[i], INT.swell)));
        return out(rng(d.swell, 1, "m"), g, i => { const a = relAngle(d.swellDir[i], bearing); return `Swell ${fmt(d.swell[i], 1)} m, ${fmt(d.swellPeriod[i])} s from ${compass(d.swellDir[i])}${a == null ? "" : a <= 45 ? " (head-on)" : a <= 90 ? " (angled)" : " (side-on)"}`; }, heat("h-swell", y, INT.swell));
      }
      case "period": {
        const y = d3.scaleLinear(dom(4, Math.max(14, ext(d.swellPeriod)[1])), [B, 8]);
        return out(rng(d.swellPeriod, 0, "s"), ar(d.swellPeriod, y, B, c, .12) + `<line x1="0" x2="${W}" y1="${y(12)}" y2="${y(12)}" style="stroke:var(--c-muted);stroke-dasharray:2 4"/><text class="t" x="3" y="${y(12) - 2}">12 s</text>` + ln(d.swellPeriod, y, c), i => `Period ${fmt(d.swellPeriod[i])} s`);
      }
      case "wind": {
        const ws = d.wind.map(spd), gs = d.gust.map(spd), band = key === "kite" ? [spd(12 * 1.852), spd(30 * 1.852)] : null;  // kite range 12-30 kn
        const kt = INT.wind.map(spd), y = d3.scaleLinear(dom(0, ext([...ws, ...gs, ...(band || [])])[1] * 1.1), [B, 10]), hc = "url(#h-wind)";
        // surf and kite colour the triangle by on/off/cross-shore; fishing and boat by intensity
        const tc = i => { const cl = wcls(i), t = m.windColour && cl ? m.windColour[cl] : null; return t ? `var(--c-${t})` : icol(d.wind[i], INT.wind); };
        const g = (band ? `<rect x="0" y="${y(band[1])}" width="${W}" height="${y(band[0]) - y(band[1])}" style="fill:var(--c-good);opacity:.12"/>` : "") + ar(ws, y, B, hc, .18) + ln(gs, y, hc, 1.2, 1) + ln(ws, y, hc, 2) +
          samples(i => ws[i] == null || d.windDir[i] == null ? "" : tri(X(i), y(ws[i]), d.windDir[i] + 180, tc(i)));
        return out(rng(ws, 0, ul), g, i => { const cl = wcls(i); return `Wind ${fmt(ws[i])} ${ul} ${compass(d.windDir[i])}${cl ? " (" + cl + ")" : ""}, gust ${fmt(gs[i])}`; }, heat("h-wind", y, kt));
      }
      case "gust": {
        const gs = d.gust.map(spd), y = d3.scaleLinear(dom(0, ext(gs)[1] * 1.1), [B, 8]), hc = "url(#h-gust)";
        return out(rng(gs, 0, ul), ar(gs, y, B, hc, .18) + ln(gs, y, hc, 2), i => `Gust ${fmt(gs[i])} ${ul}${d.wind[i] > 0 && d.gust[i] != null ? ", x" + fmt(d.gust[i] / d.wind[i], 1) + " the wind" : ""}`, heat("h-gust", y, INT.wind.map(spd)));
      }
      case "sea": {
        const y = d3.scaleLinear(dom(0, Math.max(1, ext(d.wave)[1]) * 1.1), [B, 8]), hc = "url(#h-sea)";
        return out(rng(d.wave, 1, "m"), ar(d.wave, y, B, hc, .2) + ln(d.wave, y, hc, 2), i => `Sea ${fmt(d.wave[i], 1)} m${d.wavePeriod[i] == null ? "" : ", " + fmt(d.wavePeriod[i]) + " s"}`, heat("h-sea", y, INT.swell));
      }
      case "pressure": {
        const [lo, hi] = ext(d.pressure), y = d3.scaleLinear(dom(lo - 1, hi + 1), [B, 8]);
        return out(rng(d.pressure, 0, "hPa"), ln(d.pressure, y, c), i => `Pressure ${fmt(d.pressure[i])} hPa${i >= 3 && d.pressure[i - 3] != null ? ", " + (d.pressure[i] - d.pressure[i - 3] >= 0 ? "+" : "") + fmt(d.pressure[i] - d.pressure[i - 3], 1) + " in 3 h" : ""}`);
      }
      default: {  // sst
        const [lo, hi] = ext(d.sst), y = d3.scaleLinear(dom(lo - .5, hi + .5), [B, 10]);
        return out(rng(d.sst, 1, "\u00b0C"), ar(d.sst, y, B, c, .12) + ln(d.sst, y, c), i => `Sea temp ${fmt(d.sst[i], 1)} \u00b0C`);
      }
    }
  }

  // ---- crosshair ----
  #cross(i, e) {
    const v = this.#view, r = this.#r, d = this.#d, cx = this.#x(i + .5), sc = v.res.score[i], fl = v.res.flags[i];
    r.xh.innerHTML = `<line x1="${cx}" x2="${cx}" y1="${HEAD}" y2="${v.H}" style="stroke:var(--c-text);opacity:.65"/>`;
    r.tip.innerHTML = `<b>${dayName(d.time[i])} ${hhmm(d.time[i])}</b><div>Score ${sc}, ${rating(sc)}</div>${fl ? `<div class="w">${ico(LV[fl.level], 13)} ${esc(fl.text)}</div>` : ""}` +
      v.lanes.map(l => `<div><i style="background:${l.c}"></i>${esc(l.tip(i))}</div>`).join("");
    r.tip.hidden = false;
    const cr = r.chart.getBoundingClientRect(), tw = r.tip.offsetWidth, th = r.tip.offsetHeight;
    let lx = e.clientX - cr.left + 14; if (lx + tw > cr.width) lx = e.clientX - cr.left - tw - 14;
    r.tip.style.left = Math.max(0, lx) + "px"; r.tip.style.top = clamp(e.clientY - cr.top + 14, 0, Math.max(0, cr.height - th)) + "px";
  }
  #uncross() { this.#r.xh.innerHTML = ""; this.#r.tip.hidden = true; }

  // ---- breakdown panel ----
  #raws(key, a) {
    const d = this.#d, n = d.time.length, u = this.#units, ul = u === "kn" ? "kn" : "km/h", A = arr => mean(arr.slice(a, a + 4)), sp = v => fmt(v == null ? null : u === "kn" ? kn(v) : v) + " " + ul;
    const flow = d.tide.map((_, i) => i > 0 && i < n - 1 && d.tide[i - 1] != null && d.tide[i + 1] != null ? Math.abs(d.tide[i + 1] - d.tide[i - 1]) * 50 : null);
    const wd = d.windDir[a + 2], cl = windClass(relAngle(wd, this.#o.coastBearing)), p1 = d.pressure[Math.min(a + 3, n - 1)], p0 = d.pressure[a];
    const R = {
      tideFlow: () => fmt(A(flow)) + " cm/h", sea: () => fmt(A(d.wave), 1) + " m", wind: () => sp(A(d.wind)), windSpeed: () => sp(A(d.wind)), windBand: () => sp(A(d.wind)), gust: () => sp(A(d.gust)),
      pressTrend: () => p0 == null || p1 == null ? "-" : (p1 - p0 >= 0 ? "+" : "") + fmt(p1 - p0, 1) + " hPa / 3 h", light: () => { const k = d.sunrise.findIndex(s => s.startsWith(d.time[a].slice(0, 10))), t = d.time[a + 2]; return k < 0 ? "-" : t < d.sunrise[k] || t > d.sunset[k] ? "dark hours" : "daylight"; },
      rain: () => fmt(A(d.rainProb)) + "%", springs: () => moon(d.time[a + 2]).springs ? "springs" : "not springs", swellSize: () => fmt(A(d.swell), 1) + " m",
      period: () => fmt(A(this.#mode === "boat" ? d.wavePeriod : d.swellPeriod)) + " s", offshore: () => compass(wd) + (cl ? ", " + cl : ""), direction: () => compass(wd) + (cl ? ", " + cl : ""),
      swellAim: () => "from " + compass(d.swellDir[a + 2]), tide: () => "fixed in v1", steady: () => { const w = A(d.wind), g = A(d.gust); return w > 0 && g != null ? "gusts x" + fmt(g / w, 1) : "-"; },
    };
    return R[key]?.() ?? "";
  }

  #open(k) {
    const r = this.#r, d = this.#d, res = this.#score(), mk = this.#mode, m = MODES[mk], a = k * 4, w = windows(d, res)[k];
    this.#focusW = k;
    const parts = Object.fromEntries(m.vars.map(v => [v.key, [mean(res.parts[v.key].slice(a, a + 4))]]));
    const ex = explain(mk, parts, 0, this.#wts(mk)), tot = ex.rows.reduce((p, c) => p + c.weight, 0) || 1, top = Math.max(...ex.rows.map(x => x.weight)) / tot * 100 || 1;
    const warns = [...new Map(res.flags.slice(a, a + 4).filter(Boolean).map(f => [f.text, f])).values()];
    const gate = m.gate ? mean(Array.from({ length: 4 }, (_, j) => m.gate(d, a + j, makeCtx(d, this.#o.coastBearing)))) : 1;
    const rt = rating(w.score);
    r.panel.innerHTML = `<div class="hd"><h3>${dayName(w.start)} ${pad(a % 24)}:00-${pad(a % 24 + 4)}:00, ${m.label}</h3><button class="close" type="button" autofocus>Close</button></div>
      <div class="big"><b>${w.score}</b><span class="pill" style="background:var(--c-${rt === "Good" ? "good" : rt === "Fair" ? "fair" : "poor"})">${rt}</span></div>
      <p>${esc(ex.sentence)}</p>` +
      ex.rows.map(x => `<div class="br"><span>${esc(x.label)}<small>${esc(this.#raws(x.key, a))}</small></span><span class="bar"><i style="width:${(x.share / top * 100).toFixed(1)}%"></i></span><em>${x.share.toFixed(0)}</em></div>`).join("") +
      (gate < .99 ? `<p class="note">Penalty: the score is multiplied by ${gate.toFixed(2)} (strong onshore wind).</p>` : "") +
      warns.map(f => `<p class="wn">${ico(LV[f.level], 18)} ${esc(f.text)}</p>`).join("") +
      `<p class="note">Bar length is each factor's contribution in points. Warnings are shown apart from the score.</p>`;
    r.panel.showModal();
  }

  // ---- tune ----
  #openTune() {
    const r = this.#r, mk = this.#mode, m = MODES[mk], base = effectiveWeights(mk, this.#wts(mk));
    r.tune.innerHTML = `<div class="hd"><h3>Tune ${m.label}</h3></div><p class="note" style="margin:0 0 6px">Drag to change how much each factor counts. Saved on this device.</p>` +
      m.vars.map(v => `<label class="tn"><span>${esc(v.label)}</span><input type="range" min="0" max="100" step="1" data-k="${v.key}" value="${Math.round(base[v.key] * 100)}"><output>${Math.round(base[v.key] * 100)}</output></label>`).join("") +
      `<div class="act"><button class="reset" type="button">Reset</button><button class="close" type="button" autofocus>Done</button></div>`;
    r.tune.showModal();
  }
  #tuneInput(el) {
    if (!el.dataset?.k) return;
    const mk = this.#mode; this.#wts(mk); this.#w[mk][el.dataset.k] = +el.value / 100;
    ls.set(this.#wkey(mk), JSON.stringify(this.#w[mk]));
    el.nextElementSibling.textContent = el.value; delete this.#res[mk]; this.#again();
  }
  #resetTune() {
    const mk = this.#mode; ls.del(this.#wkey(mk)); this.#w[mk] = {}; delete this.#res[mk];
    const base = effectiveWeights(mk, this.#wts(mk));
    this.#r.tune.querySelectorAll("input").forEach(i => { i.value = Math.round(base[i.dataset.k] * 100); i.nextElementSibling.textContent = i.value; });
    this.#again();
  }
}

if (!customElements.get("fs-conditions")) customElements.define("fs-conditions", FsConditions);
