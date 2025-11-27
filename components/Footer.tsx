'use client';

import Link from "next/link";
import { useContactInfo } from "@/lib/hooks/useContactInfo";
import { FooterThemeSwitcher } from "./FooterThemeSwitcher";

export default function Footer() {
  const { contactInfo, loading, error } = useContactInfo();

  return (
    <footer className="w-full border-t border-transparent bg-brand-green-dark text-white">
      <div className="max-w-7xl mx-auto px-5 py-12">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Intermountain Dumpsters</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Professional dumpster rental services for residential and commercial projects. 
              From home renovations to large construction sites, we provide fast delivery, 
              competitive pricing, and exceptional customer service.
            </p>
            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.facebook.com/profile.php?id=61578904738151&mibextid=LQQJ4d&rdid=m9ja1CegWswQomeh#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* idek */}

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/book" className="block text-sm text-white/80 hover:text-white transition-colors">
                Book Your Dumpster
              </Link>
              <Link href="/service-areas" className="block text-sm text-white/80 hover:text-white transition-colors">
                View Service Areas
              </Link>
              <Link href="/about" className="block text-sm text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-white/80 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-sm text-white/80">
              {loading ? (
                <p>Loading contact info...</p>
              ) : error ? (
                <p className="text-red-400">Failed to load contact info.</p>
              ) : (
                <>
                  <p>
                    <span className="font-semibold text-white">Phone:</span>{" "}
                    <a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                      {contactInfo.phone}
                    </a>
                  </p>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Hours:</span>
                    <div className="mt-1 space-y-1">
                      <p>Mon-Fri: {contactInfo.business_hours.monday_friday}</p>
                      <p>Sat: {contactInfo.business_hours.saturday}</p>
                      <p>Sun: {contactInfo.business_hours.sunday}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/20">
          <div className="flex items-center gap-8 text-xs text-white/60">
            <p>&copy; 2024 Intermountain Dumpsters. All rights reserved.</p>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          <FooterThemeSwitcher />
        </div>
      </div>
    </footer>
  );
} 