"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl/maplibre";

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
  return (
    <Map
      initialViewState={{
        longitude: -111.8910,
        latitude: 40.7608,
        zoom: 8,
        bearing: 0,
        pitch: 0,
      }}
      style={{ width: "100%", height: 400 }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      {serviceAreaCities.map((city) => {
        console.log(`Marker for ${city.name}: longitude=${city.lng}, latitude=${city.lat}`);
        return (
          <Marker
            key={city.name}
            longitude={city.lng}
            latitude={city.lat}
          >
            <div
              style={{
                background: "#2563eb",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                border: "2px solid #fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                transform: "translate(-50%, -50%)",
                position: "absolute"
              }}
              title={city.name}
            >
              {city.name[0]}
            </div>
          </Marker>
        );
      })}
    </Map>
  );
} 