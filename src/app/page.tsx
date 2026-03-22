import Box from "@mui/material/Box";
import { eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import Events from "@/features/home/components/Events";
import WelcomeCard from "@/features/home/components/WelcomeCard";
import ToggleViews from "@/features/toggles/ToggleViews";
import { auth } from "@/lib/auth";
import { getUpcomingEvents } from "@/lib/events";

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

  return (
    <div>
      <Box
        sx={{
          width: { xs: "100%", sm: "80%" },
          maxWidth: 1000,
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
          <Filters />
        </Box>
        <Events events={eventsWithState} />
      </Box>
    </div>
  );
}
