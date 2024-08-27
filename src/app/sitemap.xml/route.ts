import { NextResponse } from "next/server";

export async function GET() {
  const EXTERNAL_DATA_URL = "https://vrental.in";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${EXTERNAL_DATA_URL}/category?category=ROOM</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
      <changefreq>weekly</changefreq>
    </url>
    <url>
      <loc>${EXTERNAL_DATA_URL}/category?category=PG</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
      <changefreq>weekly</changefreq>
    </url>
    <url>
      <loc>${EXTERNAL_DATA_URL}/category?category=HOSTEL</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
      <changefreq>weekly</changefreq>
    </url>
    <url>
      <loc>${EXTERNAL_DATA_URL}/category?category=FLAT</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
      <changefreq>weekly</changefreq>
    </url>
    <url>
      <loc>${EXTERNAL_DATA_URL}/category?category=CO-LIVING</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
      <changefreq>weekly</changefreq>
    </url>
    <url>
      <loc>${EXTERNAL_DATA_URL}/auth</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
      <changefreq>weekly</changefreq>
    </url>
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
