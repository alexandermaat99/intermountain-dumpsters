'use client';

import { MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ServiceArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface ServiceAreasListProps {
  onAreaSelect: (area: ServiceArea | null) => void;
  selectedArea: ServiceArea | null;
  serviceAreas: ServiceArea[];
  loading: boolean;
  error: string | null;
}

export default function ServiceAreasList({ onAreaSelect, selectedArea, serviceAreas, loading, error }: ServiceAreasListProps) {
  const handleAreaClick = (area: ServiceArea) => {
    if (selectedArea?.id === area.id) {
      onAreaSelect(null); // Deselect if clicking the same area
    } else {
      onAreaSelect(area);
    }
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Service Areas</h2>
        <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Service Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
        {serviceAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => handleAreaClick(area)}
            className={`flex items-center gap-2 hover:text-primary transition-colors text-left ${
              selectedArea?.id === area.id ? 'text-primary font-medium' : ''
            }`}
          >
            <MapPin className={`w-4 h-4 ${selectedArea?.id === area.id ? 'text-primary fill-primary' : 'text-primary'}`} />
            <span>{area.name}</span>
          </button>
        ))}
      </div>
      {serviceAreas.length === 0 && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-center">No service areas found</p>
        </div>
      )}
      
      {/* Book Now Button */}
      <div className="pt-4 border-t border-muted">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Ready to book your dumpster?
          </p>
          <Link href="/book">
            <Button id="book-now-btn" className="w-full bg-[#2C6B9E] hover:bg-[#22527a] text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 