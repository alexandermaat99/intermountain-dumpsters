'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createClient } from '@supabase/supabase-js';

interface ServiceArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface ServiceAreaMapProps {
  selectedArea: ServiceArea | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

// 15 miles in kilometers
const RADIUS_IN_KM = 15 * 1.60934;

export default function ServiceAreaMap({ selectedArea }: ServiceAreaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const [mounted, setMounted] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);

  useEffect(() => {
    setMounted(true);
    
    async function fetchServiceAreas() {
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching service areas:', error);
        return;
      }

      if (data) {
        setServiceAreas(data);
      }
    }

    fetchServiceAreas();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mounted || !mapContainer.current || map.current || serviceAreas.length === 0) return;

    const defaultCenter: [number, number] = [-111.8505, 40.3916]; // Lehi coordinates
    const center: [number, number] = serviceAreas.length > 0 
      ? [serviceAreas[0].longitude, serviceAreas[0].latitude]
      : defaultCenter;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 8.5
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on('load', () => {
      // Create circles for each service area
      serviceAreas.forEach((area, index) => {
        const center = turf.point([area.longitude, area.latitude]);
        const circle = turf.circle(center, RADIUS_IN_KM, {
          steps: 64,
          units: 'kilometers'
        });

        // Add the circle source
        map.current!.addSource(`circle-${area.id}`, {
          type: 'geojson',
          data: circle
        });

        // Add fill layer
        map.current!.addLayer({
          id: `circle-fill-${area.id}`,
          type: 'fill',
          source: `circle-${area.id}`,
          paint: {
            'fill-color': '#3B82F6',
            'fill-opacity': 0.05
          }
        });

        // Add outline layer
        map.current!.addLayer({
          id: `circle-outline-${area.id}`,
          type: 'line',
          source: `circle-${area.id}`,
          paint: {
            'line-color': '#2563EB',
            'line-width': 2,
            'line-opacity': 0.5
          }
        });

        // Create marker
        const marker = new mapboxgl.Marker()
          .setLngLat([area.longitude, area.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(area.name))
          .addTo(map.current!);

        markersRef.current[area.id] = marker;
      });

      // Fit the map to show all service areas with padding
      const bounds = new mapboxgl.LngLatBounds();
      serviceAreas.forEach(area => {
        const point = turf.point([area.longitude, area.latitude]);
        const circle = turf.circle(point, RADIUS_IN_KM, {
          steps: 64,
          units: 'kilometers'
        });
        const circleBounds = turf.bbox(circle);
        bounds.extend([circleBounds[0], circleBounds[1]]);
        bounds.extend([circleBounds[2], circleBounds[3]]);
      });
      
      map.current!.fitBounds(bounds, {
        padding: 50
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mounted, serviceAreas]);

  // Handle selected area changes
  useEffect(() => {
    if (!map.current || !mounted) return;

    // Reset all circles to default style
    serviceAreas.forEach(area => {
      if (map.current!.getLayer(`circle-fill-${area.id}`)) {
        map.current!.setPaintProperty(`circle-fill-${area.id}`, 'fill-opacity', 0.05);
        map.current!.setPaintProperty(`circle-outline-${area.id}`, 'line-opacity', 0.5);
        map.current!.setPaintProperty(`circle-outline-${area.id}`, 'line-width', 2);
        markersRef.current[area.id]?.getElement().classList.remove('marker-selected');
      }
    });

    // Highlight selected area
    if (selectedArea) {
      const marker = markersRef.current[selectedArea.id];
      
      if (map.current!.getLayer(`circle-fill-${selectedArea.id}`)) {
        map.current!.setPaintProperty(`circle-fill-${selectedArea.id}`, 'fill-opacity', 0.15);
        map.current!.setPaintProperty(`circle-outline-${selectedArea.id}`, 'line-opacity', 1);
        map.current!.setPaintProperty(`circle-outline-${selectedArea.id}`, 'line-width', 3);
        
        // Add selected class to marker
        marker?.getElement().classList.add('marker-selected');

        // Fly to the selected area
        map.current!.flyTo({
          center: [selectedArea.longitude, selectedArea.latitude],
          zoom: 10,
          duration: 1500
        });

        // Open the popup
        marker?.togglePopup();
      }
    }
  }, [selectedArea, mounted, serviceAreas]);

  return (
    <div className="w-full h-[400px] relative">
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .marker-selected {
          filter: hue-rotate(15deg) saturate(150%);
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
