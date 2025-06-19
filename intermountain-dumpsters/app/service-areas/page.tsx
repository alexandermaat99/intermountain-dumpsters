'use client';

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import ServiceAreasList from "@/components/ServiceAreasList";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";

interface ServiceArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export default function ServiceAreasPage() {
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);

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

          {/* Mapbox Map */}
          <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-muted-foreground/25">
            <ServiceAreaMap selectedArea={selectedArea} />
          </div>

          {/* Service Areas List */}
          <div className="w-full">
            <ServiceAreasList onAreaSelect={setSelectedArea} selectedArea={selectedArea} />
          </div>

          {/* Delivery Information */}
          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Delivery Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Standard Delivery</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Same-day delivery available in our service areas</li>
                  <li>• Free delivery within standard service radius</li>
                  <li>• Additional fees may apply for remote locations</li>
                  <li>• Contact us for delivery outside our standard areas</li>
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
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
} 