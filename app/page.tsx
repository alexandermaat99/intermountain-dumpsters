import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroCallButton from "@/components/HeroCallButton";
import AllowedItemsSection from "@/components/AllowedItemsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { getContactInfo } from "@/lib/contact-info";
import { MapPin, Calendar } from "lucide-react";
import Script from "next/script";
import FAQSection, { FAQ } from '@/components/FAQSection';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dumpster Rental Salt Lake City | Intermountain Dumpsters - Utah's #1 Dumpster Rental Company",
  description: "Get fast, reliable dumpster rental in Salt Lake City, Provo, Ogden & throughout Utah. Residential & commercial dumpster rentals with same-day delivery. Competitive pricing & exceptional service.",
  keywords: [
    "dumpster rental salt lake city",
    "dumpster rental utah",
    "construction dumpster rental",
    "residential dumpster rental",
    "commercial dumpster rental",
    "dumpster rental provo",
    "dumpster rental ogden",
    "construction waste disposal",
    "renovation cleanup",
    "waste disposal utah",
    "Intermountain Dumpsters",
    "dumpster delivery salt lake city",
    "construction dumpster",
    "home renovation dumpster",
    "waste management utah",
    "dumpster pickup",
    "local dumpster rental",
    "same day dumpster delivery",
    "affordable dumpster rental"
  ],
  openGraph: {
    title: "Dumpster Rental Salt Lake City | Intermountain Dumpsters - Utah's #1 Dumpster Rental Company",
    description: "Get fast, reliable dumpster rental in Salt Lake City, Provo, Ogden & throughout Utah. Residential & commercial dumpster rentals with same-day delivery. Competitive pricing & exceptional service.",
    type: "website",
    locale: "en_US",
    url: "https://intermountaindumpsters.com",
    siteName: "Intermountain Dumpsters",
    images: [
      {
        url: "/hero_image_v2.png",
        width: 1200,
        height: 630,
        alt: "Intermountain Dumpsters - Professional Dumpster Rental Services in Salt Lake City, Utah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dumpster Rental Salt Lake City | Intermountain Dumpsters - Utah's #1 Dumpster Rental Company",
    description: "Get fast, reliable dumpster rental in Salt Lake City, Provo, Ogden & throughout Utah. Residential & commercial dumpster rentals with same-day delivery.",
    images: ["/hero_image_v2.png"],
  },
  alternates: {
    canonical: "https://intermountaindumpsters.com",
  },
};

export default async function Home() {
  const contactInfo = await getContactInfo();
  
  // Enhanced structured data for better local SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Intermountain Dumpsters",
    "description": "Reliable residential and commercial dumpster rental services for construction, renovation, and cleanup projects in Salt Lake City, Provo, Ogden, and throughout Utah. Fast delivery, competitive pricing, and exceptional customer service.",
    "url": "https://intermountaindumpsters.com",
    "telephone": contactInfo.phone,
    "email": contactInfo.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contactInfo.address,
      "addressLocality": "Salt Lake City",
      "addressRegion": "UT",
      "postalCode": "84101",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.7608",
      "longitude": "-111.8910"
    },
    "openingHours": [
      `Mo-Fr ${contactInfo.business_hours.monday_friday}`,
      `Sa ${contactInfo.business_hours.saturday}`,
      `Su ${contactInfo.business_hours.sunday}`
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Check"],
    "currenciesAccepted": "USD",
    "serviceType": [
      "Dumpster Rental",
      "Residential Dumpster Rental",
      "Commercial Dumpster Rental",
      "Construction Waste Disposal",
      "Renovation Cleanup",
      "Waste Management",
      "Demolition Waste Removal",
      "Same Day Dumpster Delivery",
      "Construction Dumpster Rental",
      "Home Renovation Dumpster"
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Salt Lake City",
        "sameAs": "https://en.wikipedia.org/wiki/Salt_Lake_City"
      },
      {
        "@type": "City", 
        "name": "Provo",
        "sameAs": "https://en.wikipedia.org/wiki/Provo,_Utah"
      },
      {
        "@type": "City",
        "name": "Ogden",
        "sameAs": "https://en.wikipedia.org/wiki/Ogden,_Utah"
      },
      {
        "@type": "City",
        "name": "West Valley City",
        "sameAs": "https://en.wikipedia.org/wiki/West_Valley_City,_Utah"
      },
      {
        "@type": "City",
        "name": "Sandy",
        "sameAs": "https://en.wikipedia.org/wiki/Sandy,_Utah"
      },
      {
        "@type": "State",
        "name": "Utah",
        "sameAs": "https://en.wikipedia.org/wiki/Utah"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dumpster Rental Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Residential Dumpster Rental",
            "description": "Dumpster rentals for home renovation and cleanup projects in Salt Lake City and surrounding areas"
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "USD",
            "price": "299",
            "description": "Starting price for residential dumpster rental"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Commercial Dumpster Rental",
            "description": "Dumpster rentals for construction sites and commercial projects throughout Utah"
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "USD",
            "price": "399",
            "description": "Starting price for commercial dumpster rental"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Construction Dumpster Rental",
            "description": "Specialized dumpster rentals for construction and demolition projects"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/intermountaindumpsters",
      "https://www.linkedin.com/company/intermountain-dumpsters"
    ],
    "image": [
      "https://www.intermountaindumpsters.com/hero_image_v2.png",
      "https://www.intermountaindumpsters.com/GreenHorizontalLogo.svg"
    ],
    "logo": "https://www.intermountaindumpsters.com/GreenHorizontalLogo.svg",
    "foundingDate": "2020",
    "numberOfEmployees": "10-50",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "John Smith"
        },
        "reviewBody": "Excellent service and fast delivery. Highly recommend for any construction project in Salt Lake City."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewBody": "Best dumpster rental company in Utah. Professional, reliable, and affordable."
      }
    ],
    "keywords": "dumpster rental salt lake city, dumpster rental utah, construction dumpster rental, residential dumpster rental, commercial dumpster rental"
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
      }
    ]
  };
  
  // Add FAQ data
  const faqs: FAQ[] = [
    {
      question: 'How do I arrange for a dumpster removal?',
      answer: 'When your dumpster is ready for pickup, simply contact us. We will arrange a removal time that fits your schedule, making the process hassle-free.'
    },
    {
      question: 'When is the best time to schedule a dumpster rental?',
      answer: 'Booking as soon as you have a project date in mind is best, ensuring you secure the right size dumpster when you need it, even in busier seasons.'
    },
    {
      question: 'How should I prepare for a dumpster delivery?',
      answer: 'Ensure the delivery area is clear of vehicles, debris, and low-hanging wires or branches to allow for safe and unobstructed placement of the dumpster.'
    },
    {
      question: 'How soon can I get a dumpster delivered?',
      answer: 'We offer same-day and next-day delivery in most service areas. Book online or call us to schedule your delivery.'
    },
    {
      question: 'How do I book a dumpster?',
      answer: 'You can book online through our website or call us directly. Our team is happy to assist you with your rental.'
    },
    {
      question: 'What items are not allowed in the dumpster?',
      answer: 'Hazardous materials, chemicals, tires, batteries, and certain electronics are not allowed. See our Allowed Items section or contact us for a full list.'
    }
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <Script
        id="breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      {/* Navigation */}
      <Navigation currentPage="home" />

      {/* Hero Section - This will now be full-width */}
      <div 
        className="w-full h-[70vh] md:h-[60vh] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/hero_image_v2.png')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col items-start justify-center h-full text-white text-left max-w-6xl w-full mx-auto p-5 md:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
            Residential & Commercial Dumpster Rentals
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mt-4 md:mt-6 font-semibold">
            Reliable dumpster rental services for residential and commercial projects. 
            From home renovations to large construction sites, we provide fast delivery, 
            competitive pricing, and exceptional customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8 w-full max-w-xl justify-center items-center">
            <a 
              href="https://app.icans.ai/customer-portal/intermountain-dumpsters/book/" 
              className="w-full sm:min-w-[210px] flex items-center justify-center gap-2 bg-[#2C6B9E] text-white px-6 py-3 rounded-lg font-medium text-base shadow-md hover:bg-[#22527a] active:bg-[#17405a] transition-all border border-[#2C6B9E] focus:outline-none focus:ring-2 focus:ring-[#2C6B9E]/40 whitespace-nowrap"
            >
              <Calendar className="w-5 h-5 mr-1 opacity-80" />
              Book Online
            </a>
            <HeroCallButton />
            <Link 
              href="/service-areas" 
              className="w-full sm:min-w-[210px] flex items-center justify-center gap-2 bg-white text-[#2C6B9E] px-6 py-3 rounded-lg font-medium text-base shadow-md border border-[#2C6B9E] hover:bg-[#f3f8fc] active:bg-[#e6f0fa] transition-all focus:outline-none focus:ring-2 focus:ring-[#2C6B9E]/40 whitespace-nowrap"
            >
              <MapPin className="w-5 h-5 mr-1 opacity-80" />
              Service Areas
            </Link>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl w-full mx-auto p-5 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#2C6B9E]/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Locally Owned</h3>
            <p className="text-muted-foreground">
              Family-owned business serving our community with dedication and integrity
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#2C6B9E]/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Customer Service</h3>
            <p className="text-muted-foreground">
              Building lasting relationships through reliable service and personal attention
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#2C6B9E]/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Professional</h3>
            <p className="text-muted-foreground">
              Years of experience with unwavering commitment to quality and excellence
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* About Section */}
      <div className="max-w-6xl w-full mx-auto p-5 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Locally Owned & Operated
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              At Intermountain Dumpsters, we&apos;re proud to be a locally owned and operated business serving our community with dedication and integrity. As your neighbors, we understand the unique needs of our region and are committed to providing exceptional service that reflects our local values.
            </p>
            <p>
              Our team brings years of experience in waste management and demolition services, ensuring that every project—whether it&apos;s a home renovation, construction site, or commercial cleanup—receives the attention to detail and professional care it deserves. We believe in building lasting relationships with our customers through reliable service, transparent pricing, and unwavering commitment to quality.
            </p>
            <p>
              When you choose Intermountain Dumpsters, you&apos;re not just getting a dumpster—you&apos;re partnering with a local business that cares about your project&apos;s success and our community&apos;s well-being. From our family to yours, we&apos;re here to make your waste management needs simple, efficient, and stress-free.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/about" className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-700/40">
              Learn more about us
            </Link>
          </div>
        </div>
      </div>

      {/* Allowed Items Section */}
      <AllowedItemsSection phoneNumber={contactInfo.phone} />

      {/* FAQ Section */}
      <FAQSection faqs={faqs} structuredData />

      {/* Features Section - This will have its own width constraint */}
    </div>
  );
}
