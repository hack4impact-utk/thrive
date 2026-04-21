import { and, asc, eq, gte, lte } from "drizzle-orm";

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
  id: events.id,
  title: events.title,
  eventDate: events.eventDate,
  startTime: events.startTime,
  endTime: events.endTime,
  capacity: events.capacity,
  registeredUsers: events.registeredUsers,
  description: events.description,
  locationId: events.locationId,
  createdAt: events.createdAt,
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
    .orderBy(asc(events.eventDate));
}

export async function getUpcomingEvents(): Promise<EventRow[]> {
  const today = new Date();
  const threeMonthsFromNow = new Date(today);
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const todayStr = today.toISOString().split("T")[0];
  const threeMonthsStr = threeMonthsFromNow.toISOString().split("T")[0];

  return db
    .select(eventWithLocation)
    .from(events)
    .leftJoin(locations, eq(locations.id, events.locationId))
    .where(
      and(
        gte(events.eventDate, todayStr),
        lte(events.eventDate, threeMonthsStr),
      ),
    )
    .orderBy(asc(events.eventDate));
}
