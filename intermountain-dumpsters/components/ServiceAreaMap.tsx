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
const RADIUS_IN_KM = 6 * 1.60934;

export default function ServiceAreaMap({ selectedArea }: ServiceAreaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: number]: mapboxgl.Popup }>({});
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
      serviceAreas.forEach((area) => {
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
            'fill-color': '#5B8DEF',
            'fill-opacity': 0.02
          }
        });

        // Add outline layer
        map.current!.addLayer({
          id: `circle-outline-${area.id}`,
          type: 'line',
          source: `circle-${area.id}`,
          paint: {
            'line-color': '#3B82F6',
            'line-width': 2,
            'line-opacity': 0.3
          }
        });

        // Create custom popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          className: 'custom-popup'
        })
        .setHTML(`
          <div class="popup-content">
            <h3>${area.name}</h3>
          </div>
        `);

        // Store popup reference
        popupsRef.current[area.id] = popup;

        // Create marker
        const marker = new mapboxgl.Marker({
          color: '#3B82F6',
          scale: 0.8
        })
          .setLngLat([area.longitude, area.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        // Store marker reference
        markersRef.current[area.id] = marker;

        // Add hover events to marker element
        const markerElement = marker.getElement();
        markerElement.addEventListener('mouseenter', () => popup.addTo(map.current!));
        markerElement.addEventListener('mouseleave', () => {
          if (!selectedArea || selectedArea.id !== area.id) {
            popup.remove();
          }
        });
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
    if (!map.current || !mounted || !map.current.isStyleLoaded()) return;

    // Reset all circles and popups to default style
    serviceAreas.forEach(area => {
      const fillLayerId = `circle-fill-${area.id}`;
      const outlineLayerId = `circle-outline-${area.id}`;
      
      // Check if layers exist before trying to access them
      if (map.current!.getLayer(fillLayerId) && map.current!.getLayer(outlineLayerId)) {
        map.current!.setPaintProperty(fillLayerId, 'fill-color', '#5B8DEF');
        map.current!.setPaintProperty(fillLayerId, 'fill-opacity', 0.05);
        map.current!.setPaintProperty(outlineLayerId, 'line-color', '#3B82F6');
        map.current!.setPaintProperty(outlineLayerId, 'line-opacity', 0.5);
        map.current!.setPaintProperty(outlineLayerId, 'line-width', 2);
        
        // Reset marker
        const marker = markersRef.current[area.id];
        if (marker) {
          marker.remove();
          const newMarker = new mapboxgl.Marker({
            color: '#3B82F6',
            scale: 0.8
          })
            .setLngLat([area.longitude, area.latitude])
            .setPopup(popupsRef.current[area.id])
            .addTo(map.current!);
          
          markersRef.current[area.id] = newMarker;
          
          // Add hover events to marker element
          const markerElement = newMarker.getElement();
          markerElement.addEventListener('mouseenter', () => popupsRef.current[area.id].addTo(map.current!));
          markerElement.addEventListener('mouseleave', () => {
            if (!selectedArea || selectedArea.id !== area.id) {
              popupsRef.current[area.id].remove();
            }
          });
        }
        popupsRef.current[area.id]?.remove();
      }
    });

    // Highlight selected area
    if (selectedArea) {
      const marker = markersRef.current[selectedArea.id];
      const popup = popupsRef.current[selectedArea.id];
      const selectedFillLayerId = `circle-fill-${selectedArea.id}`;
      const selectedOutlineLayerId = `circle-outline-${selectedArea.id}`;
      
      // Check if layers exist before trying to access them
      if (map.current!.getLayer(selectedFillLayerId) && map.current!.getLayer(selectedOutlineLayerId)) {
        // Change colors for selected state
        map.current!.setPaintProperty(selectedFillLayerId, 'fill-color', '#FB923C');
        map.current!.setPaintProperty(selectedFillLayerId, 'fill-opacity', 0.15);
        map.current!.setPaintProperty(selectedOutlineLayerId, 'line-color', '#F97316');
        map.current!.setPaintProperty(selectedOutlineLayerId, 'line-opacity', 1);
        map.current!.setPaintProperty(selectedOutlineLayerId, 'line-width', 3);
        
        // Change marker color for selected state
        if (marker) {
          marker.remove();
          const newMarker = new mapboxgl.Marker({
            color: '#F97316',
            scale: 1
          })
            .setLngLat([selectedArea.longitude, selectedArea.latitude])
            .setPopup(popup)
            .addTo(map.current!);
          
          markersRef.current[selectedArea.id] = newMarker;
          
          // Add hover events to marker element
          const markerElement = newMarker.getElement();
          markerElement.addEventListener('mouseenter', () => popup.addTo(map.current!));
          markerElement.addEventListener('mouseleave', () => {
            if (!selectedArea || selectedArea.id !== selectedArea.id) {
              popup.remove();
            }
          });
        }

        // Fly to the selected area
        map.current!.flyTo({
          center: [selectedArea.longitude, selectedArea.latitude],
          zoom: 10,
          duration: 1500
        });

        // Show the popup
        popup?.addTo(map.current);
      }
    }
  }, [selectedArea, mounted, serviceAreas]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .marker-selected {
          filter: hue-rotate(15deg) saturate(150%);
          transform: scale(1.2);
        }
        .custom-popup {
          font-family: var(--font-geist-sans);
        }
        .custom-popup .mapboxgl-popup-content {
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .custom-popup .popup-content h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .custom-popup .popup-content p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #666;
        }
        .mapboxgl-popup-tip {
          border-top-color: rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
