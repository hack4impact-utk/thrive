import { and, asc, gte, lte } from "drizzle-orm";

import db from "@/db";
import { events } from "@/db/schema";

export async function getAllEvents(): Promise<(typeof events.$inferSelect)[]> {
  return db.select().from(events).orderBy(asc(events.eventDate));
}

export async function getUpcomingEvents(): Promise<
  (typeof events.$inferSelect)[]
> {
  const today = new Date();
  const threeMonthsFromNow = new Date(today);
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const todayStr = today.toISOString().split("T")[0];
  const threeMonthsStr = threeMonthsFromNow.toISOString().split("T")[0];

  return db
    .select()
    .from(events)
    .where(
      and(
        gte(events.eventDate, todayStr),
        lte(events.eventDate, threeMonthsStr),
      ),
    )
    .orderBy(asc(events.eventDate));
}
