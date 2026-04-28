import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { locations } from "./locations";

export const recurringEvents = pgTable("recurring_events", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 256 }).notNull(),

  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),

  capacity: integer("capacity"),

  locationId: uuid("location_id").references(() => locations.id),

  description: text("description").notNull(),

  // 'daily' | 'weekly' | 'biweekly' | 'monthly'
  frequency: varchar("frequency", { length: 32 }).notNull(),

  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
