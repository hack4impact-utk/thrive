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

  // weekly / biweekly: day indices [0=Sun … 6=Sat]. null = derive from startDate (legacy).
  daysOfWeek: integer("days_of_week").array(),

  // daily: if true, only Mon–Fri
  weekdaysOnly: boolean("weekdays_only").default(false).notNull(),

  // monthly: 'day-of-month' | 'nth-weekday'. null = 'day-of-month' (legacy).
  monthlyType: varchar("monthly_type", { length: 32 }),

  // monthly nth-weekday: which occurrence (1–4 or -1 for last)
  monthlyNth: integer("monthly_nth"),

  // monthly nth-weekday: day of week (0=Sun … 6=Sat)
  monthlyWeekday: integer("monthly_weekday"),

  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
