import { Metadata } from "next";
import BookPageClient from "./BookPageClient";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Book Your Dumpster",
  description: "Browse and book residential and commercial dumpsters for your construction, renovation, or cleanup project. Fast delivery and competitive pricing.",
  keywords: [
    "book dumpster",
    "dumpster rental booking",
    "residential dumpster booking",
    "commercial dumpster booking",
    "construction dumpster rental",
    "renovation dumpster rental"
  ],
  openGraph: {
    title: "Book Your Dumpster | Intermountain Dumpsters",
    description: "Browse and book residential and commercial dumpsters for your construction, renovation, or cleanup project. Fast delivery and competitive pricing.",
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

export default function BookPage() {
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
        "name": "Book Your Dumpster",
        "item": "https://intermountaindumpsters.com/book"
      }
    ]
  };

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <Script
        id="book-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <BookPageClient />
    </>
  );
}
