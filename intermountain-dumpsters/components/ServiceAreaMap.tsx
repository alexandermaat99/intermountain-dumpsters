'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const serviceAreaCities = [
  { name: 'Salt Lake City', lat: 40.7608, lng: -111.8910 },
  { name: 'West Valley City', lat: 40.6916, lng: -112.0011 },
  { name: 'West Jordan', lat: 40.6097, lng: -111.9391 },
  { name: 'Sandy', lat: 40.5714, lng: -111.8391 },
  { name: 'Ogden', lat: 41.2230, lng: -111.9738 },
  { name: 'Logan', lat: 41.7370, lng: -111.8338 },
  { name: 'Layton', lat: 41.0602, lng: -111.9710 },
  { name: 'Evanston', lat: 41.2683, lng: -110.9632 }
];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 41.0602, // Centered on Layton
  lng: -111.9710
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
if (!apiKey) throw new Error('Google Maps API key is required');

export default function ServiceAreaMap() {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={9}
      >
        {serviceAreaCities.map((city) => (
          <Marker
            key={city.name}
            position={{ lat: city.lat, lng: city.lng }}
            title={city.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
