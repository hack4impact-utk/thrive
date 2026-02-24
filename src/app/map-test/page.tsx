"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../../components/MapComp"), { ssr: false });

// Making it fit 30 percent of the page
export default function MapTestPage(): React.ReactElement {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "70%" }} />
      <div style={{ width: "30%", height: "calc(100vh - 64px)", minHeight: 0 }}>
        <MapComponent />
      </div>
    </div>
  );
}
