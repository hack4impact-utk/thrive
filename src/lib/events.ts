import { and, gte, lte } from "drizzle-orm";

import db from "@/db";
import { events } from "@/db/schema";

export async function getAllEvents(): Promise<(typeof events.$inferSelect)[]> {
  return db.select().from(events);
}

// Gets upcoming events up to 1 year from now
export async function getUpcomingEvents(): Promise<
  (typeof events.$inferSelect)[]
> {
  const today = new Date();
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(today.getFullYear() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const oneYearStr = oneYearFromNow.toISOString().split("T")[0];

  return db
    .select()
    .from(events)
    .where(
      and(gte(events.eventDate, todayStr), lte(events.eventDate, oneYearStr)),
    );
}
