import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Message Sent Successfully",
  description: "Thank you for contacting Intermountain Dumpsters. Your message has been sent successfully and we'll get back to you soon.",
  robots: {
    index: false, // Don't index this page in search engines
    follow: false,
  },
};

export default function ContactSuccessPage() {
  // Structured data for success page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact Form Success - Intermountain Dumpsters",
    "description": "Confirmation page for successfully submitted contact form",
    "url": "https://intermountaindumpsters.com/contact/success"
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Message Sent",
        "item": "https://intermountaindumpsters.com/contact/success"
      }
    ]
  };

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 items-center">
      {/* Structured Data for SEO */}
      <Script
        id="contact-success-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <Script
        id="contact-success-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      {/* GTM Conversion Tracking */}
      <Script
        id="contact-success-conversion"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track contact form conversion
            if (typeof gtag !== 'undefined') {
              gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                'event_category': 'Contact Form',
                'event_label': 'Contact Form Submission',
                'value': 1
              });
            }
            
            // Track custom event for GTM
            if (typeof dataLayer !== 'undefined') {
              dataLayer.push({
                'event': 'contact_form_success',
                'event_category': 'Contact',
                'event_label': 'Contact Form Submission',
                'value': 1
              });
            }
          `,
        }}
      />

      {/* Navigation */}
      <Navigation currentPage="contact" />

      {/* Success Content */}
      <div className="flex-1 flex flex-col gap-8 max-w-4xl p-5 w-full pb-40">
        <div className="text-center space-y-8 py-16">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400">
              Message Sent Successfully!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thank you for contacting Intermountain Dumpsters. Your message has been received and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 text-sm font-semibold">1</span>
                </div>
                <p className="text-muted-foreground">
                  We&apos;ll review your message and prepare a detailed response
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 text-sm font-semibold">2</span>
                </div>
                <p className="text-muted-foreground">
                  Our team will contact you via email or phone within 24 hours
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 text-sm font-semibold">3</span>
                </div>
                <p className="text-muted-foreground">
                  We&apos;ll provide answers to your questions and discuss your dumpster rental needs
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Send Another Message
              </Button>
            </Link>
            <Link href="/">
              <Button className="flex items-center gap-2 bg-primary text-primary-foreground">
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4">Need immediate assistance?</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="tel:+1-801-555-0123" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Call us directly</span>
              </a>
              <a 
                href="mailto:info@intermountaindumpsters.com" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email us directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
