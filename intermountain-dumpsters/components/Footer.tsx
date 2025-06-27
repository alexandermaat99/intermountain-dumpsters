import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getContactInfo } from "@/lib/contact-info";

export default async function Footer() {
  const contactInfo = await getContactInfo();
  
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
          </div>

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
              <Link href="/contact" className="block text-sm text-white/80 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>{contactInfo.address}</p>
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
          <ThemeSwitcher iconClassName="text-white" />
        </div>
      </div>
    </footer>
  );
} 