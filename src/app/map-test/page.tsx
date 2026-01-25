"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../../components/MapComp"), { ssr: false });

// Making it fit 30 percent of the page
export default function MapTestPage() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "70%" }} />
      <div style={{ width: "30%", height: "100%" }}>
        <MapComponent />
      </div>
    </div>
  );
}
