import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = "https://www.intermountaindumpsters.com";
  const currentDate = new Date().toISOString();
  
  const urls = [
    {
      path: "",
      priority: "1.0",
      changefreq: "weekly",
      lastmod: currentDate
    },
    {
      path: "/book",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: currentDate
    },
    {
      path: "/service-areas",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: currentDate
    },
    {
      path: "/about",
      priority: "0.7",
      changefreq: "monthly",
      lastmod: currentDate
    },
    {
      path: "/contact",
      priority: "0.7",
      changefreq: "monthly",
      lastmod: currentDate
    },
    {
      path: "/privacy-policy",
      priority: "0.3",
      changefreq: "yearly",
      lastmod: currentDate
    },
    {
      path: "/cart",
      priority: "0.6",
      changefreq: "daily",
      lastmod: currentDate
    },
    {
      path: "/success",
      priority: "0.4",
      changefreq: "monthly",
      lastmod: currentDate
    }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(
      (url) => `
  <url>
    <loc>${baseUrl}${url.path}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>
`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 