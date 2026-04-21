"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import * as React from "react";

import Filters from "@/features/filters";
import CalendarView, {
  type CalendarEvent,
} from "@/features/toggles/ToggleViews/CalendarView";
import ListView from "@/features/toggles/ToggleViews/ListView";
import type { View } from "@/features/toggles/ToggleViews/view-types";

type HomePageContentProps = {
  events: CalendarEvent[];
};

export default function HomePageContent({
  events,
}: HomePageContentProps): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>("list");

  const toggleView = (view: View): void => {
    // Clicking the active view does nothing (stays on that view)
    setActiveView(view ?? "list");
  };

  return (
    <>
      {/* Controls row: view toggle buttons on the left, Filters on the right */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ButtonGroup
          variant="outlined"
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid #0000003B",
          }}
        >
          {/* List view button */}
          <IconButton
            onClick={() => toggleView("list")}
            aria-label="List view"
            aria-pressed={activeView === "list"}
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

          {/* Calendar view button */}
          <IconButton
            onClick={() => toggleView("calendar")}
            aria-label="Calendar view"
            aria-pressed={activeView === "calendar"}
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

        <Filters />
      </Box>

      {/* View content */}
      {activeView === "list" && <ListView events={events} />}
      <CalendarView activeView={activeView} events={events} />
    </>
  );
}
