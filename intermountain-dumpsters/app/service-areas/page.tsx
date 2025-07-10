import { Metadata } from "next";
import ServiceAreasPageClient from "./ServiceAreasPageClient";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Service Areas",
  description: "View our service areas for dumpster rental throughout the Intermountain region. Check if we serve your location and see our coverage map.",
  keywords: [
    "dumpster rental service areas",
    "Intermountain dumpster rental",
    "local dumpster rental",
    "dumpster delivery areas",
    "construction dumpster service areas"
  ],
  openGraph: {
    title: "Service Areas | Intermountain Dumpsters",
    description: "View our service areas for dumpster rental throughout the Intermountain region. Check if we serve your location and see our coverage map.",
    images: [
      {
        url: "/hero_image_v2.png",
        width: 1200,
        height: 630,
        alt: "Intermountain Dumpsters - Professional Dumpster Rental Services",
      },
    ],
  },
};

export default function ServiceAreasPage() {
  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://intermountaindumpsters.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Service Areas",
        "item": "https://intermountaindumpsters.com/service-areas"
      }
    ]
  };

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <Script
        id="service-areas-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <ServiceAreasPageClient />
    </>
  );
}