"use client";

// Doing all the imports for the map componnent
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

type LatitudeLongitudeStore = { lat: number; lng: number };

// For future use, making it exportable (use mapComponent))
export default function MapComponent() {
  const [center, setCenter] = useState<LatitudeLongitudeStore | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
        // Using New York location as default
      setCenter({ lat: 40.7128, lng: -74.0060 }); 
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ 
        lat: pos.coords.latitude,
         lng: pos.coords.longitude, 
        }),
      () => setCenter({ lat: 40.7128, lng: -74.0060 })
    );
  }, []);

  // Waiting time response
  if (!center) return <div>Loading...</div>;

  return (
    // Entire map container details
    <MapContainer 
    center={[center.lat, center.lng]} 
    zoom={14} 
    style={{ width: "100%", height: "100%" }}>
        <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution="© OpenStreetMap contributors" />
        <Marker 
        position={[center.lat, center.lng]} />
    </MapContainer>
  );
}