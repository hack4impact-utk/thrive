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

export type RegOverride = {
  isRegistered: boolean;
  registeredUsers: number;
};

/**
 * Case-insensitive substring search: returns true when `query` appears
 * anywhere inside `text`. "parkridge" matches "...Workshop Parkridge",
 * "Y" matches "Youth...", "yo" matches "Youth..." but not "Community Food...".
 */
function matchesSearch(query: string, text: string): boolean {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function HomePageContent({
  events,
}: HomePageContentProps): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>("list");
  const [searchQuery, setSearchQuery] = React.useState("");
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
    // Clicking the active view does nothing (stays on that view)
    setActiveView(view ?? "list");
  };

  const filteredEvents = React.useMemo(
    () => events.filter((event) => matchesSearch(searchQuery, event.title)),
    [events, searchQuery],
  );

  return (
    <>
      {/* Controls row — sticky below the navbar */}
      <Box
        sx={{
          position: "sticky",
          top: 56.8,
          zIndex: 3,
          backgroundColor: "background.default",
          py: 1,
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

        <Filters searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </Box>

      {/* View content */}
      {activeView === "list" && (
        <ListView
          events={filteredEvents}
          regOverrides={regOverrides}
          onRegChange={handleRegChange}
        />
      )}
      <CalendarView
        activeView={activeView}
        events={filteredEvents}
        regOverrides={regOverrides}
        onRegChange={handleRegChange}
      />
    </>
  );
}
