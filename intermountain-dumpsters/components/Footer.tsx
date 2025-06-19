import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-5 py-12">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Intermountain Dumpsters</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional dumpster rental services for residential and commercial projects. 
              From home renovations to large construction sites, we provide fast delivery, 
              competitive pricing, and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/book" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Book Your Dumpster
              </Link>
              <Link href="/service-areas" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                View Service Areas
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="text-sm">123 Main Street, Salt Lake City, UT 84101</p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> (801) 555-1234
              </p>
              <div className="text-sm">
                <span className="font-medium">Hours:</span>
                <div className="mt-1 space-y-1">
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <p>&copy; 2024 Intermountain Dumpsters. All rights reserved.</p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
} 