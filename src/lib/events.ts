import { and, asc, eq, getTableColumns, gte, lte, ne } from "drizzle-orm";

import db from "@/db";
import { events } from "@/db/schema";
import { locations } from "@/db/schema/locations";

type EventRow = typeof events.$inferSelect & {
  locationName: string | null;
  streetLine: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
};

const eventWithLocation = {
  ...getTableColumns(events),
  locationName: locations.name,
  streetLine: locations.streetLine,
  city: locations.city,
  state: locations.state,
  postalCode: locations.postalCode,
  country: locations.country,
  latitude: locations.latitude,
  longitude: locations.longitude,
};

export async function getAllEvents(): Promise<EventRow[]> {
  return db
    .select(eventWithLocation)
    .from(events)
    .leftJoin(locations, eq(locations.id, events.locationId))
    .where(ne(events.deleted, true))
    .orderBy(asc(events.eventDate));
}

export async function getUpcomingEvents(): Promise<EventRow[]> {
  const today = new Date();
  const endOfWindowMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 3,
    0,
  );

  const todayStr = today.toISOString().split("T")[0];
  const threeMonthsStr = endOfWindowMonth.toISOString().split("T")[0];

  return db
    .select(eventWithLocation)
    .from(events)
    .leftJoin(locations, eq(locations.id, events.locationId))
    .where(
      and(
        ne(events.deleted, true),
        gte(events.eventDate, todayStr),
        lte(events.eventDate, threeMonthsStr),
      ),
    )
    .orderBy(asc(events.eventDate), asc(events.startTime));
}
