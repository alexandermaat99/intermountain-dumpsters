import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function BookPage() {
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
              <Link href="/book" className="hover:underline font-semibold">
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

        {/* Booking Form */}
        <div className="flex-1 flex flex-col gap-8 max-w-2xl p-5 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Book Your Dumpster</h1>
            <p className="text-muted-foreground">
              Fill out the form below to reserve your residential or commercial dumpster rental
            </p>
          </div>

          <form className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
            </div>

            {/* Project Type */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Project Information</h2>
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select project type</option>
                  <option value="residential-renovation">Residential Renovation</option>
                  <option value="residential-cleanup">Residential Cleanup</option>
                  <option value="residential-construction">Residential Construction</option>
                  <option value="commercial-construction">Commercial Construction</option>
                  <option value="commercial-renovation">Commercial Renovation</option>
                  <option value="commercial-cleanup">Commercial Cleanup</option>
                  <option value="demolition">Demolition</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Delivery Information</h2>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Rental Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dumpsterSize" className="block text-sm font-medium mb-2">
                    Dumpster Size *
                  </label>
                  <select
                    id="dumpsterSize"
                    name="dumpsterSize"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select size</option>
                    <option value="10-yard">10 Yard</option>
                    <option value="15-yard">15 Yard</option>
                    <option value="20-yard">20 Yard</option>
                    <option value="30-yard">30 Yard</option>
                    <option value="40-yard">40 Yard</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="rentalDuration" className="block text-sm font-medium mb-2">
                    Rental Duration *
                  </label>
                  <select
                    id="rentalDuration"
                    name="rentalDuration"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select duration</option>
                    <option value="1-day">1 Day</option>
                    <option value="3-days">3 Days</option>
                    <option value="1-week">1 Week</option>
                    <option value="2-weeks">2 Weeks</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="deliveryDate" className="block text-sm font-medium mb-2">
                  Preferred Delivery Date *
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium mb-2">
                  Special Instructions
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows={3}
                  placeholder="Any special delivery instructions or requirements..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Submit Booking Request
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>&copy; 2024 Intermountain Dumpsters. All rights reserved.</p>
          <p>Residential & commercial dumpster rental services</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
} 