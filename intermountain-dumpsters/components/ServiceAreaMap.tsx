"use client";
import { useMemo } from "react";
import Map, { Marker } from "react-map-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const serviceAreaCities = [
  { name: "Salt Lake City", lat: 40.7608, lng: -111.8910 },
  { name: "Provo", lat: 40.2338, lng: -111.6585 },
  { name: "Ogden", lat: 41.2230, lng: -111.9738 },
  { name: "Park City", lat: 40.6461, lng: -111.4980 },
  { name: "Tooele", lat: 40.5308, lng: -112.2983 },
  { name: "Logan", lat: 41.7369, lng: -111.8338 },
  { name: "Brigham City", lat: 41.5102, lng: -112.0155 },
];

export default function ServiceAreaMap() {
  const initialViewState = useMemo(
    () => ({
      longitude: -111.8910,
      latitude: 40.7608,
      zoom: 8,
    }),
    []
  );

  return (
    <Map
      initialViewState={initialViewState}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: "100%", height: "100%" }}
    >
      {serviceAreaCities.map((city) => (
        <Marker
          key={city.name}
          longitude={city.lng}
          latitude={city.lat}
          anchor="bottom"
        >
          <div style={{ color: "#2563eb", fontWeight: 700, fontSize: 18, textShadow: "0 1px 2px #fff" }}>
            •
          </div>
        </Marker>
      ))}
    </Map>
  );
} 