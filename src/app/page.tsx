import { eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getUpcomingEvents } from "@/lib/events";
import * as React from "react";
import HomeClient from "./HomeClient";

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

  return <HomeClient eventsWithState={eventsWithState} />; 
}
