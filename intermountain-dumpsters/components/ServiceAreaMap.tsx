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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

// 50 miles in kilometers
const RADIUS_IN_KM = 7 * 1.60934;

export default function ServiceAreaMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);

  useEffect(() => {
    setMounted(true);
    
    async function fetchServiceAreas() {
      const { data, error } = await supabase
        .from('service_areas')
        .select('*');
      
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
      // Create a 50-mile radius circle for each service area
      serviceAreas.forEach((area, index) => {
        const center = turf.point([area.longitude, area.latitude]);
        const circle = turf.circle(center, RADIUS_IN_KM, {
          steps: 64,
          units: 'kilometers'
        });

        // Add the circle source
        map.current!.addSource(`circle-${index}`, {
          type: 'geojson',
          data: circle
        });

        // Add fill layer
        map.current!.addLayer({
          id: `circle-fill-${index}`,
          type: 'fill',
          source: `circle-${index}`,
          paint: {
            'fill-color': '#3B82F6',
            'fill-opacity': 0.05
          }
        });

        // Add outline layer
        map.current!.addLayer({
          id: `circle-outline-${index}`,
          type: 'line',
          source: `circle-${index}`,
          paint: {
            'line-color': '#2563EB',
            'line-width': 2,
            'line-opacity': 0.5
          }
        });
      });

      // Fit the map to show all service areas with padding
      const bounds = new mapboxgl.LngLatBounds();
      serviceAreas.forEach(area => {
        // Extend bounds to include the circle's edges
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

    // Add markers for each service area
    serviceAreas.forEach((area) => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(area.name);

      new mapboxgl.Marker()
        .setLngLat([area.longitude, area.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mounted, serviceAreas]);

  return (
    <div className="w-full h-[400px] relative">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
