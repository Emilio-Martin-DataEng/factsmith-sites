// Pre-push checks, adapted from the FactSmith website (factsmith-website/site/scripts/check.mjs).
// Run `npm run build`, start `npm run preview` in another terminal, then `npm run check`.
//   1. every page in sitemap.xml returns 200 from the preview
//   2. every internal link, image and poster in the built site resolves
//   3. no em dash, en dash, "lorem" or "REPLACE" in the built pages. Folders copied unchanged from public/
//      (client previews) are reported but do not fail the check.
// Set BASE if the preview is not on http://localhost:4321 (astro preview prints its address when it starts).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4321';
const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const PUBLIC = new URL('../public/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const copied = readdirSync(PUBLIC, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name + '/');

const fails = [];
const exceptions = [];
const status = new Map();
// Every response body is cancelled unread: left open, they pile up until the local server stalls.
const get = (url) => {
  if (!status.has(url)) {
    status.set(url, fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) }).then((r) => { r.body?.cancel(); return r.status; }, () => 0));
  }
  return status.get(url);
};

// 1
const sitemap = await (await fetch(BASE + '/sitemap.xml')).text();
const pages = [...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
if (!pages.length) fails.push('sitemap.xml lists no pages (is the preview running on ' + BASE + '?)');
for (const p of pages) { const s = await get(BASE + p); if (s !== 200) fails.push(`sitemap page ${p} -> ${s}`); }

// 2 + 3
const files = readdirSync(DIST, { recursive: true }).map((f) => f.replaceAll('\\', '/')).filter((f) => f.endsWith('.html'));
const banned = [[/—/, 'em dash'], [/–/, 'en dash'], [/lorem/i, 'lorem'], [/REPLACE/, 'REPLACE']];
let links = 0;
for (const f of files) {
  const html = readFileSync(join(DIST, f), 'utf8');
  const page = '/' + f.replace(/index\.html$/, '').replace(/\.html$/, '/');
  const hand = copied.some((c) => f.startsWith(c));
  const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  for (const [re, what] of banned) if (re.test(visible)) (hand ? exceptions : fails).push(`${what} in ${page}`);
  if (hand) continue; // client previews are separate sites with their own links
  const refs = [...html.matchAll(/\s(?:href|src|poster)="([^"]+)"|\ssrcset="([^"]+)"/g)].flatMap((m) => m[1] ? [m[1]] : m[2].split(',').map((s) => s.trim().split(' ')[0]));
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/|\[|#)/.test(ref)) continue;
    const u = new URL(ref.replaceAll('&amp;', '&'), BASE + page);
    if (u.origin !== new URL(BASE).origin) continue;
    links++;
    const s = await get(u.origin + u.pathname);
    if (s !== 200) fails.push(`${page} links to ${u.pathname} -> ${s}`);
  }
}

console.log(`${pages.length} sitemap pages, ${files.length} built pages, ${links} internal references checked`);
if (exceptions.length) console.log(`reported, not failed (copied from public/): ${exceptions.length}`);
if (fails.length) { console.log(`FAIL ${fails.length}\n  ` + [...new Set(fails)].join('\n  ')); process.exit(1); }
console.log('OK');
