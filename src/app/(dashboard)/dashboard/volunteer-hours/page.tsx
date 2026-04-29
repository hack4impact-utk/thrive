import { Box, Stack, Typography } from "@mui/material";
import { and, eq, gte, lte, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { eventAttendees, events, locations, userInfo } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

import type { AttendeeEntry, LocationRow } from "./LocationHoursTable";
import LocationHoursTable from "./LocationHoursTable";
import VolunteerHoursFilters from "./VolunteerHoursFilters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcHours(start: string, end: string): number {
  return (toMinutes(end) - toMinutes(start)) / 60;
}

type Props = { searchParams: SearchParams };

export default async function VolunteerHoursPage({
  searchParams,
}: Props): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin" && role !== "manager") redirect("/dashboard");

  const accentColor =
    role === "manager" ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  const params = await searchParams;
  const locationId =
    typeof params.locationId === "string" ? params.locationId : undefined;
  const dateFrom =
    typeof params.dateFrom === "string" ? params.dateFrom : undefined;
  const dateTo = typeof params.dateTo === "string" ? params.dateTo : undefined;

  const conditions = [
    eq(eventAttendees.attended, true),
    ne(events.deleted, true),
  ];
  if (locationId) conditions.push(eq(events.locationId, locationId));
  if (dateFrom) conditions.push(gte(events.eventDate, dateFrom));
  if (dateTo) conditions.push(lte(events.eventDate, dateTo));

  const [rows, locationOptions] = await Promise.all([
    db
      .select({
        locationName: locations.name,
        startTime: events.startTime,
        endTime: events.endTime,
        userId: eventAttendees.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        eventTitle: events.title,
        eventDate: events.eventDate,
      })
      .from(eventAttendees)
      .innerJoin(events, eq(events.id, eventAttendees.eventId))
      .leftJoin(locations, eq(locations.id, events.locationId))
      .leftJoin(userInfo, eq(userInfo.userId, eventAttendees.userId))
      .where(and(...conditions)),

    db
      .select({ id: locations.id, name: locations.name })
      .from(locations)
      .where(eq(locations.deleted, false))
      .orderBy(locations.name),
  ]);

  const byLocation = new Map<
    string,
    { hours: number; attendees: AttendeeEntry[] }
  >();

  for (const row of rows) {
    const key = row.locationName ?? "No Location";
    if (!byLocation.has(key)) {
      byLocation.set(key, { hours: 0, attendees: [] });
    }
    const loc = byLocation.get(key)!;
    const h = calcHours(row.startTime, row.endTime);
    loc.hours += h;
    loc.attendees.push({
      userId: row.userId,
      volunteerName:
        [row.firstName, row.lastName].filter(Boolean).join(" ") || "Unknown",
      eventTitle: row.eventTitle,
      eventDate: row.eventDate,
      hours: h,
    });
  }

  for (const loc of byLocation.values()) {
    loc.attendees.sort(
      (a, b) =>
        a.eventDate.localeCompare(b.eventDate) ||
        a.volunteerName.localeCompare(b.volunteerName),
    );
  }

  const locationRows: LocationRow[] = [...byLocation.entries()]
    .map(([name, d]) => ({ name, hours: d.hours, attendees: d.attendees }))
    .sort((a, b) => b.hours - a.hours);

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Volunteer Hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track hours volunteered across locations and date ranges.
          </Typography>
        </Box>

        <Suspense fallback={null}>
          <VolunteerHoursFilters
            locationOptions={locationOptions}
            accentColor={accentColor}
          />
        </Suspense>

        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={1.5}
            sx={{ color: accentColor }}
          >
            Hours by Location
          </Typography>
          {locationRows.length === 0 ? (
            <EmptyState />
          ) : (
            <LocationHoursTable
              locationRows={locationRows}
              accentColor={accentColor}
            />
          )}
        </Box>
      </Stack>
    </PageContainer>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <Box
      sx={{
        py: 5,
        textAlign: "center",
        borderRadius: 2,
        backgroundColor: "grey.100",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        No attended events match the selected filters.
      </Typography>
    </Box>
  );
}
