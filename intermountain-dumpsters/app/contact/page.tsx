import Link from "next/link";
import ContactInfo from "@/components/ContactInfo";
import Navigation from "@/components/Navigation";

export default function ContactPage() {
  return (
    <div className="w-full flex flex-col gap-5 md:gap-10 items-center">
      {/* Navigation */}
      <Navigation currentPage="contact" />

      {/* Contact Content */}
      <div className="flex-1 flex flex-col gap-8 max-w-6xl p-5 w-full">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our residential or commercial dumpster rental services? We&apos;re here to help! 
            Reach out to us through any of the methods below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <ContactInfo />
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
                  <option value="residential">Residential Dumpster Rental</option>
                  <option value="commercial">Commercial Dumpster Rental</option>
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
      </div>
    </div>
  );
} 