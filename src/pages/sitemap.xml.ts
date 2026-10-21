import type { APIRoute } from "astro";
import { site } from "../site.config";

// Lists the pages in src/pages. Preview folders under public/ (client concepts) are
// left out on purpose, and so are the noindex stats page and this file.
const pages = import.meta.glob("./*.astro");
const skip = new Set(["stats"]);

export const GET: APIRoute = () => {
  const urls = Object.keys(pages)
    .map((path) => path.replace("./", "").replace(".astro", ""))
    .filter((name) => !skip.has(name))
    .map((name) => (name === "index" ? `${site.url}/` : `${site.url}/${name}/`))
    .sort();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
