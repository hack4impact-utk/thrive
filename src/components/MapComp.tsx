"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type LatitudeLongitudeStore = { lat: number; lng: number };

// For future use, making it exportable (use mapComponent))
export default function MapComponent(): React.ReactElement {
  const [center, setCenter] = useState<LatitudeLongitudeStore | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Using New York location as default
      setCenter({ lat: 40.7128, lng: -74.006 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setCenter({ lat: 40.7128, lng: -74.006 }),
    );
  }, []);

  // Waiting time response
  if (!center) return <div>Loading...</div>;

  return (
    // Entire map container details
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={[center.lat, center.lng]} />
    </MapContainer>
  );
}
