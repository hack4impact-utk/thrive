"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import * as React from "react";

import type { RegOverride } from "@/features/home/components/HomePageContent";

import CalendarView, { type CalendarEvent } from "./CalendarView";
import ListView from "./ListView";
import { View } from "./view-types";

type ToggleViewsProps = {
  events: CalendarEvent[];
};

export default function ToggleViews({
  events,
}: ToggleViewsProps): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>("list");
  const [regOverrides, setRegOverrides] = React.useState<
    Record<string, RegOverride>
  >({});

  const handleRegChange = React.useCallback(
    (eventId: string, override: RegOverride): void => {
      setRegOverrides((prev) => ({ ...prev, [eventId]: override }));
    },
    [],
  );

  const toggleView = (view: View): void => {
    setActiveView((current) => (current === view ? "list" : view));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Toggle button row — rendered by the parent alongside Filters */}
      <Box>
        <ButtonGroup
          variant="outlined"
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid #0000003B",
          }}
        >
          {/* List view */}
          <IconButton
            onClick={() => toggleView("list")}
            aria-label="List view"
            sx={{
              borderRadius: 0,
              borderRight: "1px solid rgba(0,0,0,0.12)",
              backgroundColor:
                activeView === "list" ? "#E0E0E0" : "transparent",
              "&:hover": {
                backgroundColor: activeView === "list" ? "#D3D3D3" : "#f5f5f5",
              },
            }}
          >
            <FormatListBulletedIcon sx={{ color: "#555555" }} />
          </IconButton>

          {/* Calendar view */}
          <IconButton
            onClick={() => toggleView("calendar")}
            aria-label="Calendar view"
            sx={{
              borderRadius: 0,
              borderRight: "none",
              backgroundColor:
                activeView === "calendar" ? "#E0E0E0" : "transparent",
              "&:hover": {
                backgroundColor:
                  activeView === "calendar" ? "#D3D3D3" : "#f5f5f5",
              },
            }}
          >
            <CalendarMonthIcon sx={{ color: "#555555" }} />
          </IconButton>
        </ButtonGroup>
      </Box>

      {/* View content — rendered below the toggle row + filters */}
      <Box sx={{ width: "100%", mt: 0 }}>
        {activeView === "list" && (
          <ListView
            events={events}
            regOverrides={regOverrides}
            onRegChange={handleRegChange}
          />
        )}
        <CalendarView
          activeView={activeView}
          events={events}
          regOverrides={regOverrides}
          onRegChange={handleRegChange}
        />
      </Box>
    </Box>
  );
}
