import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ContactInfoFooter from "./ContactInfoFooter";

export default function Footer() {
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
            <ContactInfoFooter />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/20">
          <div className="flex items-center gap-8 text-xs text-white/60">
            <p>&copy; 2024 Intermountain Dumpsters. All rights reserved.</p>
          </div>
          <ThemeSwitcher iconClassName="text-white" />
        </div>
      </div>
    </footer>
  );
} 