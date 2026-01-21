import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 256 }).notNull(),

  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }).notNull(),

  capacity: integer("capacity"),

  streetLine: text("street_line"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),

  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),

  description: text("description"),
});
