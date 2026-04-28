import { Box, Typography } from "@mui/material";
import { and, asc, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as React from "react";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { events, locations } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

import KioskEventCard from "./KioskEventCard";

export default async function KioskPage(): Promise<React.ReactElement> {
  const session = await getUserSession();

  if (!session?.user || session.user.role !== "kiosk") {
    redirect("/");
  }

  const locationId = session.user.locationId ?? null;
  const todayStr = new Date().toISOString().split("T")[0];

  const todayEvents = locationId
    ? await db
        .select({
          id: events.id,
          title: events.title,
          eventDate: events.eventDate,
          startTime: events.startTime,
          endTime: events.endTime,
          capacity: events.capacity,
          registeredUsers: events.registeredUsers,
          locationName: locations.name,
          streetLine: locations.streetLine,
          description: events.description,
        })
        .from(events)
        .leftJoin(locations, eq(locations.id, events.locationId))
        .where(
          and(
            ne(events.deleted, true),
            eq(events.eventDate, todayStr),
            eq(events.locationId, locationId),
          ),
        )
        .orderBy(asc(events.startTime))
    : [];

  return (
    <PageContainer>
      <Typography variant="h5" fontWeight={600} mb={3} color="secondary.main">
        Today&apos;s Events
      </Typography>

      {todayEvents.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            py: 6,
            px: 3,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "grey.100",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {locationId
              ? "No events scheduled at this location today."
              : "This kiosk has no assigned location. Contact an administrator."}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {todayEvents.map((event) => (
            <KioskEventCard key={event.id} {...event} />
          ))}
        </Box>
      )}
    </PageContainer>
  );
}
