"use client";
import Box from "@mui/material/Box";
import { eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import WelcomeCard from "@/features/home/components/WelcomeCard";
import ToggleViews from "@/features/toggles/ToggleViews";
import ListView from "@/features/toggles/ToggleViews/ListView";
import { auth } from "@/lib/auth";
import { getUpcomingEvents } from "@/lib/events";
import { useState, useMemo } from "react";

import { fuzzyMatch } from "@/utils/levenshtein";
import Filters from "../features/filters";

export default async function HomePage(): Promise<React.ReactElement> {
  const events = await getUpcomingEvents();

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const registrations = userId
    ? await db
        .select({ eventId: eventAttendees.eventId })
        .from(eventAttendees)
        .where(eq(eventAttendees.userId, userId))
    : [];

  const registeredSet = new Set(registrations.map((r) => r.eventId));

  const eventsWithState = events.map((e) => ({
    ...e,
    isRegistered: userId ? registeredSet.has(e.id) : false,
  }));

  const [query, setQuery] = useState("");
  const filtered = useMemo(() =>
    events.filter(event => fuzzyMatch(event.title, query)),
    [query]
  );
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WelcomeCard />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ToggleViews />
          <Filters query={query} onQueryChange={setQuery} /> 
        </Box>
        <div>
          Hello
        </div>
        <ListView events={filtered} />
      </Box>
    </div>
  );
}
