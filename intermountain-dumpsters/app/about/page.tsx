import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Script from "next/script";
import { getContactInfo } from "@/lib/contact-info";
import { MapPin, Phone, Mail, Clock, Users, Award, Truck, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Intermountain Dumpsters - a locally owned and operated dumpster rental company serving Utah since 2020. Family business with years of experience in waste management and construction services.",
  keywords: [
    "about Intermountain Dumpsters",
    "local dumpster rental company",
    "family owned dumpster rental",
    "Utah dumpster rental company",
    "dumpster rental history",
    "waste management company Utah",
    "construction dumpster rental company"
  ],
  openGraph: {
    title: "About Us | Intermountain Dumpsters",
    description: "Learn about Intermountain Dumpsters - a locally owned and operated dumpster rental company serving Utah since 2020.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | Intermountain Dumpsters",
    description: "Learn about Intermountain Dumpsters - a locally owned and operated dumpster rental company serving Utah since 2020.",
  },
};

export default async function AboutPage() {
  const contactInfo = await getContactInfo();

  // Structured data for About page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Intermountain Dumpsters",
    "description": "About page for Intermountain Dumpsters - locally owned dumpster rental company serving Utah",
    "url": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/about` : "http://localhost:3000/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Intermountain Dumpsters",
      "description": "Locally owned and operated dumpster rental company serving Utah since 2020",
      "foundingDate": "2020",
      "numberOfEmployees": "10-50",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": contactInfo.address,
        "addressLocality": "Salt Lake City",
        "addressRegion": "UT",
        "addressCountry": "US"
      },
      "telephone": contactInfo.phone,
      "email": contactInfo.email
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
        "item": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/about` : "http://localhost:3000/about"
      }
    ]
  };

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 items-center">
      {/* Structured Data for SEO */}
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <Script
        id="about-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      {/* Navigation */}
      <Navigation currentPage="about" />

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-brand-green-dark to-green-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Intermountain Dumpsters
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted partner for residential and commercial dumpster rental services throughout Utah
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full mx-auto p-5 py-16">
        {/* Company Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Founded in 2020, Intermountain Dumpsters was born from a simple mission: to provide reliable, 
                affordable dumpster rental services to our local community. As a family-owned business, we 
                understand the importance of trust, quality, and personal service.
              </p>
              <p>
                What started as a small operation serving Salt Lake City has grown into a trusted partner 
                for construction companies, contractors, and homeowners throughout the Intermountain region. 
                Our commitment to excellence and customer satisfaction has remained unchanged since day one.
              </p>
              <p>
                We're proud to be your neighbors, serving the same communities where we live and work. 
                When you choose Intermountain Dumpsters, you're supporting a local business that cares 
                about your project's success and our community's well-being.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-6">Why Choose Us?</h3>
            <div className="space-y-4">
                             <div className="flex items-start gap-3">
                 <Users className="w-6 h-6 text-brand-green-dark mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold">Family-Owned Business</h4>
                   <p className="text-muted-foreground">Personal attention and local values you can trust</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Award className="w-6 h-6 text-brand-green-dark mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold">Years of Experience</h4>
                   <p className="text-muted-foreground">Expert knowledge in waste management and construction</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Truck className="w-6 h-6 text-brand-green-dark mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold">Fast Delivery</h4>
                   <p className="text-muted-foreground">Quick turnaround times to keep your project on schedule</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Shield className="w-6 h-6 text-brand-green-dark mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold">Licensed & Insured</h4>
                   <p className="text-muted-foreground">Full compliance with all local regulations and safety standards</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
                         <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-8 h-8 text-brand-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
               </div>
               <h3 className="text-xl font-semibold">Customer First</h3>
               <p className="text-muted-foreground">
                 Every decision we make is guided by what's best for our customers. Your satisfaction is our top priority.
               </p>
             </div>
             <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-8 h-8 text-brand-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                 </svg>
               </div>
               <h3 className="text-xl font-semibold">Quality Service</h3>
               <p className="text-muted-foreground">
                 We maintain the highest standards in everything we do, from equipment maintenance to customer service.
               </p>
             </div>
             <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-8 h-8 text-brand-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </div>
               <h3 className="text-xl font-semibold">Local Focus</h3>
               <p className="text-muted-foreground">
                 We're committed to serving our local community and supporting the growth of our region.
               </p>
             </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Serving the Intermountain Region</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Our Coverage Area</h3>
              <p className="text-lg text-muted-foreground mb-6">
                We proudly serve communities throughout Utah, with a focus on the Intermountain region. 
                Our service area includes major cities and surrounding communities.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Major Cities:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Salt Lake City</li>
                    <li>• Provo</li>
                    <li>• Ogden</li>
                    <li>• West Valley City</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Surrounding Areas:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Sandy</li>
                    <li>• Murray</li>
                    <li>• Taylorsville</li>
                    <li>• And more!</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Whether you're planning a home renovation, construction project, or commercial cleanup, 
                we have the right dumpster for your needs.
              </p>
              <div className="space-y-3">
                                 <a 
                   href="/book" 
                   className="block w-full bg-brand-green-dark text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                 >
                   Book Your Dumpster
                 </a>
                 <a 
                   href="/contact" 
                   className="block w-full border border-brand-green-dark text-brand-green-dark text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                 >
                   Contact Us
                 </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
                         <a 
               href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
               className="text-center space-y-3 block hover:scale-105 transition-transform cursor-pointer"
             >
               <Phone className="w-8 h-8 text-brand-green-dark mx-auto" />
               <h3 className="font-semibold">Phone</h3>
               <p className="text-muted-foreground hover:text-brand-green-dark transition-colors">
                 {contactInfo.phone}
               </p>
             </a>
             <a 
               href={`mailto:${contactInfo.email}`}
               className="text-center space-y-3 block hover:scale-105 transition-transform cursor-pointer"
             >
               <Mail className="w-8 h-8 text-brand-green-dark mx-auto" />
               <h3 className="font-semibold">Email</h3>
               <p className="text-muted-foreground hover:text-brand-green-dark transition-colors">
                 {contactInfo.email}
               </p>
             </a>
             <div className="text-center space-y-3">
               <Clock className="w-8 h-8 text-brand-green-dark mx-auto" />
               <h3 className="font-semibold">Business Hours</h3>
               <p className="text-muted-foreground">
                 Mon-Fri: {contactInfo.business_hours.monday_friday}<br />
                 Sat: {contactInfo.business_hours.saturday}<br />
                 Sun: {contactInfo.business_hours.sunday}
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
} 