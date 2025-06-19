'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const serviceAreaCities = [
  { name: 'Salt Lake City', latitude: 40.7608, longitude: -111.8910 },
  { name: 'West Valley City', latitude: 40.6916, longitude: -112.0011 },
  { name: 'West Jordan', latitude: 40.6097, longitude: -111.9391 },
  { name: 'Sandy', latitude: 40.5714, longitude: -111.8391 },
  { name: 'Ogden', latitude: 41.2230, longitude: -111.9738 },
  { name: 'Logan', latitude: 41.7370, longitude: -111.8338 },
  { name: 'Layton', latitude: 41.0602, longitude: -111.9710 },
  { name: 'Evanston', latitude: 41.2683, longitude: -110.9632 }
];

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function ServiceAreaMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-111.9710, 41.0602], // [lng, lat] for Layton
      zoom: 8.5
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add markers for each city
    serviceAreaCities.forEach((city) => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(city.name);

      new mapboxgl.Marker()
        .setLngLat([city.longitude, city.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mounted]);

  return (
    <div className="w-full h-[400px] relative">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
