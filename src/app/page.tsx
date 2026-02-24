import Box from "@mui/material/Box";
import { eq } from "drizzle-orm";

import WelcomeCard from "@/app/WelcomeCard";
import db from "@/db";
import { eventAttendees } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getUpcomingEvents } from "@/lib/events";

import HomePageClient from "./HomePageClient";

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

  return (
    <div>
      <Box
        sx={{
          width: "80%",
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WelcomeCard />
        <HomePageClient events={eventsWithState} />
      </Box>
    </div>
  );
}
