import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { VIBE_SLUGS } from "../data/vibes";

const STATIC_PATHS = ["/", "/about", "/contact", "/enquire", "/search", "/destinations", "/packages", "/privacy"];

export const GET: APIRoute = async ({ site }) => {
  const destinations = await getCollection("destinations");
  const packages = await getCollection("packages");

  const paths = [
    ...STATIC_PATHS,
    ...VIBE_SLUGS.map((slug) => `/vibe/${slug}`),
    ...destinations.map((d) => `/destinations/${d.id}`),
    ...packages.map((p) => `/packages/${p.id}`),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site)}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
