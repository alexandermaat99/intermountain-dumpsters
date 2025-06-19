'use client';

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import ServiceAreasList from "../../components/ServiceAreasList";
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
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
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

      {/* Main Content */}
      <div className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-7xl p-5">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold">Service Areas</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide residential and commercial dumpster rental services throughout the Intermountain region. 
              Check if we serve your area and view our coverage map below.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-[1fr,350px] gap-8">
            {/* Mapbox Map */}
            <div className="h-[400px] lg:h-[600px] rounded-lg overflow-hidden border-2 border-muted-foreground/25">
              <ServiceAreaMap selectedArea={selectedArea} />
            </div>

            {/* Service Areas List */}
            <div>
              <ServiceAreasList onAreaSelect={setSelectedArea} selectedArea={selectedArea} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8 mt-16">
        <p>&copy; 2024 Intermountain Dumpsters. All rights reserved.</p>
        <p>Residential & commercial dumpster rental services</p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}