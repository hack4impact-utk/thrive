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

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 256 }).notNull(),

  eventDate: date("event_date", { mode: "string" }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),

  capacity: integer("capacity"),
  registeredUsers: integer("registered_users").default(0).notNull(),

  locationId: uuid("location_id").references(() => locations.id),

  description: text("description").notNull(),

  deleted: boolean("deleted").default(false).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
