import Link from "next/link";
import Navigation from "@/components/Navigation";
import CallButton from "@/components/CallButton";
import { Phone, MapPin, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* Navigation */}
      <Navigation currentPage="home" />

      {/* Hero Section - This will now be full-width */}
      <div 
        className="w-full h-[70vh] md:h-[60vh] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/hero_image.png')" }}
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
            <Link 
              href="/book" 
              className="w-full sm:min-w-[210px] flex items-center justify-center gap-2 bg-[#2C6B9E] text-white px-6 py-3 rounded-lg font-medium text-base shadow-md hover:bg-[#22527a] active:bg-[#17405a] transition-all border border-[#2C6B9E] focus:outline-none focus:ring-2 focus:ring-[#2C6B9E]/40 whitespace-nowrap"
            >
              <Calendar className="w-5 h-5 mr-1 opacity-80" />
              Book Online
            </Link>
            <a
              href="tel:+18015550123"
              className="w-full sm:min-w-[210px] flex items-center justify-center gap-2 bg-white text-[#2C6B9E] px-6 py-3 rounded-lg font-medium text-base shadow-md border border-[#2C6B9E] hover:bg-[#f3f8fc] active:bg-[#e6f0fa] transition-all focus:outline-none focus:ring-2 focus:ring-[#2C6B9E]/40 whitespace-nowrap"
            >
              <Phone className="w-5 h-5 mr-1 opacity-80" />
              Call to Book
            </a>
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

      {/* Features Section - This will have its own width constraint */}
      <div className="max-w-6xl w-full mx-auto p-5 py-20">
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
  );
}
