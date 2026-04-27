"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import EventList, { type EventRecord } from "@/components/ui/EventList";
import Filters, { defaultFilters, type FilterState } from "@/features/filters";

type EventsLibraryClientProps = {
  events: EventRecord[];
  accentColor: string;
};

function matchesFilters(
  event: EventRecord,
  filters: FilterState,
  searchQuery: string,
): boolean {
  if (
    searchQuery &&
    !event.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return false;
  }
  if (
    filters.dateFrom &&
    event.eventDate < filters.dateFrom.format("YYYY-MM-DD")
  ) {
    return false;
  }
  if (filters.dateTo && event.eventDate > filters.dateTo.format("YYYY-MM-DD")) {
    return false;
  }
  if (filters.locationName && event.locationName !== filters.locationName) {
    return false;
  }
  if (filters.registrationStatus === "full") {
    const isFull =
      event.capacity !== null && event.registeredUsers >= event.capacity;
    if (!isFull) return false;
  }
  if (filters.registrationStatus === "available") {
    const isFull =
      event.capacity !== null && event.registeredUsers >= event.capacity;
    if (isFull) return false;
  }
  return true;
}

export default function EventsLibraryClient({
  events,
  accentColor,
}: EventsLibraryClientProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredEvents = useMemo(
    () => events.filter((event) => matchesFilters(event, filters, searchQuery)),
    [events, filters, searchQuery],
  );

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          justifyContent: { md: "space-between" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Events Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Every event in the database, organized by date.
          </Typography>
        </Box>
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Box>

      <EventList events={filteredEvents} accentColor={accentColor} />
    </Stack>
  );
}
