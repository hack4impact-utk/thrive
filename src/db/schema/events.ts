import {
  date,
  integer,
  numeric,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 256 }).notNull(),

  eventDate: date("event_date", { mode: "string" }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),

  capacity: integer("capacity"),
  registeredUsers: integer("registered_users"),

  streetLine: text("street_line").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),

  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),

  description: text("description").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
