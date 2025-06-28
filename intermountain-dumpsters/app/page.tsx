import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroCallButton from "@/components/HeroCallButton";
import AllowedItemsSection from "@/components/AllowedItemsSection";
import { MapPin, Calendar } from "lucide-react";

export default function Home() {
  const allowedItems = [
    {
      title: "General Household Items",
      description: "Examples include furniture, toys, clothing, and other non-hazardous items typically found in your home."
    },
    {
      title: "Household Chemicals and Pesticides",
      description: "Accepted materials in this category may include common cleaning products and garden chemicals that are properly sealed and labeled."
    },
    {
      title: "Home Electronics and Appliances",
      description: "Old or unused electronics such as TVs, computers, and kitchen appliances can be placed in the dumpster for proper disposal."
    },
    {
      title: "Paint and Chemicals",
      description: "Latex and water-based paints, as well as certain homeowner-specific chemicals, are often accepted if they are dried out or solidified."
    }
  ];

  const notAllowedItems = [
    {
      title: "Batteries",
      description: "Due to their hazardous components, batteries of any kind should not be put in the dumpster and require special disposal methods."
    },
    {
      title: "Biohazardous Materials",
      description: "Items like medical waste or other materials that pose a biological risk are strictly prohibited from dumpster disposal."
    },
    {
      title: "Food Waste",
      description: "Organic waste can create health hazards and attract pests, so it is not allowed in our rental dumpsters."
    },
    {
      title: "Weapons",
      description: "Firearms, ammunition, and explosive materials are dangerous and cannot be disposed of in a standard dumpster."
    }
  ];

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
      <div className="w-full bg-[#2C6B9E] text-white py-20">
        <div className="max-w-6xl w-full mx-auto p-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Getting a dumpster for your project is simple and straightforward. Here&apos;s how our process works:
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-[#2C6B9E] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[#2C6B9E] font-bold text-sm">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Book Online</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Choose your dumpster size and rental period through our easy online booking system
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-[#2C6B9E] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[#2C6B9E] font-bold text-sm">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Fast Delivery</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  We&apos;ll deliver your dumpster to your location on your scheduled date
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-[#2C6B9E] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[#2C6B9E] font-bold text-sm">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Fill & Use</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Load your waste into the dumpster at your own pace during your rental period
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-[#2C6B9E] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-[#2C6B9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[#2C6B9E] font-bold text-sm">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Easy Pickup</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  We&apos;ll pick up the dumpster and handle all waste disposal when you&apos;re done
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link 
              href="/book" 
              className="inline-flex items-center gap-3 bg-white text-[#2C6B9E] px-10 py-4 rounded-lg font-semibold text-lg shadow-xl hover:bg-gray-50 active:bg-gray-100 transition-all border-2 border-white focus:outline-none focus:ring-4 focus:ring-white/30 hover:scale-105 transform duration-200"
            >
              <Calendar className="w-6 h-6" />
              Get Started Today
            </Link>
          </div>
        </div>
      </div>

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
              Our team brings years of experience in waste management and construction services, ensuring that every project—whether it&apos;s a home renovation, construction site, or commercial cleanup—receives the attention to detail and professional care it deserves. We believe in building lasting relationships with our customers through reliable service, transparent pricing, and unwavering commitment to quality.
            </p>
            <p>
              When you choose Intermountain Dumpsters, you&apos;re not just getting a dumpster—you&apos;re partnering with a local business that cares about your project&apos;s success and our community&apos;s well-being. From our family to yours, we&apos;re here to make your waste management needs simple, efficient, and stress-free.
            </p>
          </div>
        </div>
      </div>

      {/* Allowed Items Section */}
      <AllowedItemsSection allowedItems={allowedItems} notAllowedItems={notAllowedItems} />

      {/* Features Section - This will have its own width constraint */}
    </div>
  );
}
