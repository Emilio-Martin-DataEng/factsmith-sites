# fs-conditions 1.0

Fishing, surf, kite and boat forecast widget: a weighted score per 4-hour window, D3 lanes with smart glyphs, a daily ribbon, a breakdown panel and per-visitor "Tune" sliders. One `<fs-conditions>` Web Component (Shadow DOM), no build step.

## Embed

```html
<fs-conditions place="salt-cartel" lat="-30.6996" lon="30.457" sea-lat="-30.72" sea-lon="30.5"
               coast-bearing="115" modes="fishing,boat" default-mode="fishing"></fs-conditions>
<script type="module" src="https://sites.factsmith.co.za/widgets/fs-conditions/1.0/fs-conditions.js"></script>
```

A host on another origin must send `Access-Control-Allow-Origin` for the module files (`fs-conditions.js`, `engine.js`, `icons.js`). D3 7.9.0 loads from jsDelivr.

## Attributes

| Attribute | Meaning |
|---|---|
| `lat` `lon` | Place, decimal degrees. Required |
| `sea-lat` `sea-lon` | Point in the sea for the marine data. Default: `lat` `lon` |
| `coast-bearing` | Compass direction the beach faces out to sea. Default 115, with a console warning |
| `modes` | Comma list from `fishing,surf,kite,boat`. Unknown names are ignored. Default: all |
| `default-mode` | Tab shown first. Default: the first mode |
| `place` | Storage key and label (Tune weights are saved per place and mode) |
| `endpoint` | Optional Worker URL: `GET endpoint?lat&lon&sea_lat&sea_lon` returns `{forecast, marine}` as raw Open-Meteo JSON |
| `config` | Optional JSON URL, merged shallowly over the attributes (config wins) |

## Config JSON

```json
{
  "coastBearing": 115,
  "modes": ["fishing", "boat"],
  "defaultMode": "fishing",
  "place": "salt-cartel",
  "weights": { "fishing": { "wind": 0.3 } },
  "safety":  { "fishing": { "waveWarn": 2.0 } }
}
```

Any attribute can be set here in camelCase (`lat`, `lon`, `seaLat`, `seaLon`, `endpoint`, ...). `weights` are 0..1 per variable key (see `MODES` in `engine.js`); they sit between the engine defaults and the visitor's sliders. `safety` may only tighten: every limit is a `>=` threshold and the lower of the default and the site value wins. Limits: fishing `waveWarn gustWarn waveDanger`; surf `waveWarn`; kite `gustRatioWarn offshoreKnDanger gustKnDanger`; boat `waveWarn gustWarn waveDanger`. `demo-config.json` is a worked example.

## Theme tokens

Set on the element or any ancestor. Every token has a default.

Colours: `--fs-bg --fs-surface --fs-text --fs-muted --fs-grid --fs-good --fs-fair --fs-poor --fs-danger --fs-wind --fs-swell --fs-tide --fs-pressure --fs-sst --fs-moon`. Type and shape: `--fs-font --fs-radius`.

`--fs-good/fair/poor` fill the score cells (45 and 70 are the cut-offs) and the wind arrow classes. `--fs-danger` is only for safety: hatch, outline, banner. Colours are applied with `var()`, so changing a token restyles the widget live.

Parts for `::part()`: `root tabs banner overview score-row lane ribbon panel tune footer`.

## Data

- Free Open-Meteo API (forecast and marine) during the build. Before launch, switch to the paid Standard plan behind a Cloudflare Worker (`endpoint`) so the key stays server-side.
- Tide is modelled (`sea_level_height_msl`), not chart datum, and is labelled so. Not for navigation.
- Attribution is in the footer: Open-Meteo.com, CC BY 4.0.
- Offline: the last good forecast is cached in `localStorage` (`fs-conditions:data:{lat},{lon}`) and shown with an "offline" age stamp. Older than 24 h shows an "Old forecast" warning. Refresh every 30 min while the page is visible.
- Safety flags are shown apart from the score and never styled as "Poor". The default thresholds are drafts until Emilio signs them off.

## Swapping icons

`icons.js` holds interim stroke icons. To replace them with the Grok set:

1. Follow the paste guide: `EmilioVault/03_Projects/Web-Dev-Projects/FactSmith-Sites/00-Overview/(C) fs-conditions Grok Icon Prompt Pack 2026-10-22.md`.
2. Overwrite each value in `ICONS` in `icons.js`; keep the 37 keys. Each value is a full `<svg viewBox="0 0 24 24" ...>` string using `currentColor`, no width or height.
3. Check: `node --input-type=module -e "import('./icons.js').then(m=>console.log(Object.keys(m.ICONS).length))"` prints 37, then reload `demo.html`.

The component strips the outer `<svg>` and re-wraps the inside with stroke 1.75 / round caps, so keep stroke-based drawing and `fill="currentColor"` only for solid shapes.

## Files

`engine.js` (pure logic, `node test.mjs`), `fs-conditions.js` (component), `icons.js`, `demo.html` + `demo-config.json` (dev page, never linked).
