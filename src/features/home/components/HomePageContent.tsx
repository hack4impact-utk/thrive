"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import * as React from "react";

import Filters, { defaultFilters, type FilterState } from "@/features/filters";
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

function matchesSearch(query: string, text: string): boolean {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}

function matchesFilters(event: CalendarEvent, filters: FilterState): boolean {
  if (
    filters.dateFrom &&
    event.eventDate < filters.dateFrom.format("YYYY-MM-DD")
  )
    return false;
  if (filters.dateTo && event.eventDate > filters.dateTo.format("YYYY-MM-DD"))
    return false;
  if (filters.locationName && event.locationName !== filters.locationName)
    return false;
  if (filters.registrationStatus === "going" && !event.isRegistered)
    return false;
  if (filters.registrationStatus === "available") {
    const isFull =
      event.capacity !== null && (event.registeredUsers ?? 0) >= event.capacity;
    if (isFull || event.isRegistered) return false;
  }
  if (filters.registrationStatus === "full") {
    const isFull =
      event.capacity !== null && (event.registeredUsers ?? 0) >= event.capacity;
    if (!isFull) return false;
  }
  return true;
}

export default function HomePageContent({
  events,
}: HomePageContentProps): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<FilterState>(defaultFilters);
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
    setActiveView(view ?? "list");
  };

  const filteredEvents = React.useMemo(
    () =>
      events.filter(
        (event) =>
          matchesSearch(searchQuery, event.title) &&
          matchesFilters(event, filters),
      ),
    [events, searchQuery, filters],
  );

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 56.8,
          zIndex: 3,
          backgroundColor: "background.default",
          pt: 2,
          pb: 1,
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

        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Box>

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
