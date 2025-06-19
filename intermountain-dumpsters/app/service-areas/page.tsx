import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ServiceAreasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-xl font-bold">
                Intermountain Dumpsters
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/book" className="hover:underline">
                Book Now
              </Link>
              <Link href="/service-areas" className="hover:underline font-semibold">
                Service Areas
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Service Areas Content */}
        <div className="flex-1 flex flex-col gap-8 max-w-6xl p-5 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Service Areas</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide dumpster rental services throughout the Intermountain region. 
              Check if we serve your area and view our coverage map below.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Interactive Service Area Map</h3>
                <p className="text-muted-foreground">Map integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Service Areas List */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Primary Service Areas</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Salt Lake City Metro</h3>
                  <p className="text-muted-foreground">Salt Lake City, West Valley City, Murray, Sandy, West Jordan</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Utah County</h3>
                  <p className="text-muted-foreground">Provo, Orem, Lehi, American Fork, Pleasant Grove</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Davis County</h3>
                  <p className="text-muted-foreground">Layton, Clearfield, Bountiful, Farmington, Kaysville</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Weber County</h3>
                  <p className="text-muted-foreground">Ogden, Roy, Clearfield, North Ogden, Riverdale</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Extended Service Areas</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Summit County</h3>
                  <p className="text-muted-foreground">Park City, Coalville, Kamas, Oakley</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Tooele County</h3>
                  <p className="text-muted-foreground">Tooele, Grantsville, Stansbury Park</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Cache County</h3>
                  <p className="text-muted-foreground">Logan, Smithfield, Hyrum, Providence</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Box Elder County</h3>
                  <p className="text-muted-foreground">Brigham City, Tremonton, Willard, Perry</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Delivery Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Standard Delivery</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Same-day delivery available in primary service areas</li>
                  <li>• Next-day delivery for extended service areas</li>
                  <li>• Free delivery within standard service radius</li>
                  <li>• Additional fees may apply for remote locations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Hours</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Monday - Friday: 7:00 AM - 6:00 PM</li>
                  <li>• Saturday: 8:00 AM - 4:00 PM</li>
                  <li>• Sunday: Closed (emergency service available)</li>
                  <li>• Holiday hours may vary</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Ready to Book Your Dumpster?</h2>
            <p className="text-muted-foreground">
              If you&apos;re in our service area, we&apos;re ready to help with your project!
            </p>
            <Link 
              href="/book" 
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>&copy; 2024 Intermountain Dumpsters. All rights reserved.</p>
          <p>Professional dumpster rental services</p>
        </footer>
      </div>
    </main>
  );
} 