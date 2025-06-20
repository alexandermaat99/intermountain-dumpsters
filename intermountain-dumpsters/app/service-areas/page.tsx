'use client';

import ServiceAreaMap from "@/components/ServiceAreaMap";
import ServiceAreasList from "../../components/ServiceAreasList";
import Navigation from "@/components/Navigation";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";

interface ServiceArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export default function ServiceAreasPage() {
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading time to ensure smooth transitions
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 md:gap-10">
      {/* Navigation */}
      <Navigation currentPage="service-areas" />

      {/* Main Content */}
      <div className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-6xl p-5">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold">Service Areas</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide residential and commercial dumpster rental services throughout the Intermountain region. 
              Check if we serve your area and view our coverage map below.
            </p>
          </div>

          {pageLoading ? (
            <div className="grid lg:grid-cols-[1fr,350px] gap-8">
              {/* Map Loading Skeleton */}
              <div className="h-[400px] lg:h-[600px] rounded-lg overflow-hidden border-2 border-muted-foreground/25 bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Loading service areas...</p>
                </div>
              </div>

              {/* List Loading Skeleton */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Service Areas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 animate-pulse">
                      <div className="w-4 h-4 rounded-full bg-muted"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Main Content Grid */
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
          )}
        </div>
      </div>
    </div>
  );
}