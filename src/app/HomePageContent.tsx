"use client";
import { Box } from "@mui/material";
import * as React from "react";

import Filters from "./Filters";
import HomePageClient from "./HomePageClient";
import ToggleViews from "./ToggleViews";
import CalendarView from "./ToggleViews/CalendarView";
import MapView from "./ToggleViews/MapView";
import { View } from "./ToggleViews/view-types";

type HomePageContentProps = {
  events: {
    id: string;
    title: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    capacity: number | null;
    registeredUsers: number | null;
    streetLine: string;
    description: string;
    isRegistered?: boolean;
  }[];
};

export default function HomePageContent({
  events,
}: HomePageContentProps): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>("list");

  return (
    <>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Filters />
        <ToggleViews activeView={activeView} onViewChange={setActiveView} />
      </Box>

      {activeView === "list" && <HomePageClient events={events} />}
      {activeView === "map" && <MapView />}
      {activeView === "calendar" && <CalendarView />}
    </>
  );
}
