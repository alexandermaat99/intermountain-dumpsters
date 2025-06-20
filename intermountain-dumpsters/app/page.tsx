import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-10 items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-xl font-bold">
                Intermountain Dumpsters
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/book" className="hover:underline">
                Book Now
              </Link>
              <Link href="/service-areas" className="hover:underline">
                Service Areas
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col gap-20 max-w-6xl p-5">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight">
              Residential & Commercial Dumpster Rentals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reliable dumpster rental services for residential and commercial projects. 
              From home renovations to large construction sites, we provide fast delivery, 
              competitive pricing, and exceptional customer service.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/book" 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Book Your Dumpster
              </Link>
              <Link 
                href="/service-areas" 
                className="border border-input bg-background px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                View Service Areas
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Same-day or next-day delivery available for residential and commercial projects
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Competitive Pricing</h3>
              <p className="text-muted-foreground">
                Transparent pricing for both residential and commercial customers with no hidden fees
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Flexible Rentals</h3>
              <p className="text-muted-foreground">
                Rent by the day or week for any project size with easy pickup and delivery scheduling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
