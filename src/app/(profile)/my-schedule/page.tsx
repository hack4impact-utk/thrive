import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import ListView from "@/features/toggles/ToggleViews/ListView";
import { auth } from "@/lib/auth";
import { getUpcomingEvents } from "@/lib/events";

export default async function MySchedulePage(): Promise<React.ReactElement> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <>
        {}
        <Box
          sx={{
            backgroundColor: "secondary.main",
            color: "white",
            px: 10,
            py: 5,
            width: "100%",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 400 }}>
            My Schedule
          </Typography>
        </Box>

        {/* PAGE CONTENT */}
        <Box
          sx={{
            width: "100%",
            px: 10,
            py: 5,
          }}
        >
          <Typography>Please Sign In.</Typography>
        </Box>
      </>
    );
  }

  const events = await getUpcomingEvents();

  const registrations = await db
    .select({ eventId: eventAttendees.eventId })
    .from(eventAttendees)
    .where(eq(eventAttendees.userId, userId));

  const registeredSet = new Set(registrations.map((r) => r.eventId));

  const registeredEvents = events
    .filter((e) => registeredSet.has(e.id))
    .map((e) => ({
      ...e,
      isRegistered: true,
    }));

  return (
    <>
      {/* FULL-WIDTH HEADER (same as Update Profile) */}
      <Box
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          px: 10,
          py: 5,
          width: "100%",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          My Schedule
        </Typography>
      </Box>

      {/* PAGE CONTENT */}
      <Box
        sx={{
          width: "100%",
          px: 10,
          py: 5,
        }}
      >
        {registeredEvents.length === 0 ? (
          <Typography>You are not registered for any events yet.</Typography>
        ) : (
          <ListView events={registeredEvents} />
        )}
      </Box>
    </>
  );
}
