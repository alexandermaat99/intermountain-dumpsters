import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ContactPage() {
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
              <Link href="/service-areas" className="hover:underline">
                Service Areas
              </Link>
              <Link href="/contact" className="hover:underline font-semibold">
                Contact
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Contact Content */}
        <div className="flex-1 flex flex-col gap-8 max-w-4xl p-5 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our dumpster rental services? We're here to help! 
              Reach out to us through any of the methods below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">(801) 555-0123</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 7:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">info@intermountaindumpsters.com</p>
                    <p className="text-sm text-muted-foreground">We typically respond within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Office</h3>
                    <p className="text-muted-foreground">
                      1234 Business Ave<br />
                      Salt Lake City, UT 84101
                    </p>
                    <p className="text-sm text-muted-foreground">By appointment only</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                  <p>Saturday: 8:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed (Emergency service available)</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Send us a Message</h2>
              
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactFirstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="contactFirstName"
                      name="contactFirstName"
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactLastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="contactLastName"
                      name="contactLastName"
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="contactSubject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="contactSubject"
                    name="contactSubject"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="pricing">Pricing Question</option>
                    <option value="service-area">Service Area Question</option>
                    <option value="booking">Booking Assistance</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contactMessage" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="contactMessage"
                    name="contactMessage"
                    rows={4}
                    required
                    placeholder="Please describe your inquiry..."
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-primary/10 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Emergency Service</h2>
            <p className="text-muted-foreground mb-4">
              Need immediate assistance outside of business hours?
            </p>
            <p className="font-semibold text-lg">Emergency Hotline: (801) 555-9999</p>
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