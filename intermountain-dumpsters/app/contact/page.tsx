import ContactInfo from "@/components/ContactInfo";
import ContactForm from "@/components/ContactForm";
import Navigation from "@/components/Navigation";
import { Metadata } from "next";
import Script from "next/script";
import { getContactInfo } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Intermountain Dumpsters for residential and commercial dumpster rental services. Get in touch for quotes, questions, or booking assistance. Fast response times and local service.",
  keywords: [
    "contact Intermountain Dumpsters",
    "dumpster rental contact",
    "dumpster rental quote",
    "dumpster rental questions",
    "local dumpster rental contact",
    "construction dumpster contact",
    "residential dumpster contact"
  ],
  openGraph: {
    title: "Contact Us | Intermountain Dumpsters",
    description: "Contact Intermountain Dumpsters for residential and commercial dumpster rental services. Get in touch for quotes, questions, or booking assistance.",
    type: "website",
    images: [
      {
        url: "/hero_image_v2.png",
        width: 1200,
        height: 630,
        alt: "Intermountain Dumpsters - Professional Dumpster Rental Services",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Intermountain Dumpsters",
    description: "Contact Intermountain Dumpsters for residential and commercial dumpster rental services.",
    images: ["/hero_image_v2.png"],
  },
};

export default async function ContactPage() {
  const contactInfo = await getContactInfo();
  
  // Structured data for contact page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Intermountain Dumpsters",
    "description": "Contact page for Intermountain Dumpsters - residential and commercial dumpster rental services",
    "url": "https://intermountaindumpsters.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Intermountain Dumpsters",
      "telephone": contactInfo.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": contactInfo.address
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": contactInfo.phone,
        "contactType": "customer service",
        "availableLanguage": "English"
      }
    }
  };

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
        "name": "Contact Us",
        "item": "https://intermountaindumpsters.com/contact"
      }
    ]
  };

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 items-center">
      {/* Structured Data for SEO */}
      <Script
        id="contact-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <Script
        id="contact-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      {/* Navigation */}
      <Navigation currentPage="contact" />

      {/* Contact Content */}
      <div className="flex-1 flex flex-col gap-8 max-w-6xl p-5 w-full">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our residential or commercial dumpster rental services? We&apos;re here to help! 
            Reach out to us through any of the methods below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
} 