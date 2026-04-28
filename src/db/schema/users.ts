import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { locations } from "./locations";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  role: text("role").notNull().default("user"),
  name: text("name"),
  email: text("email").unique(),
  infoFilled: boolean("info_filled").notNull().default(false),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  locationId: uuid("location_id").references(() => locations.id),
  onboarded: boolean("onboarded").notNull().default(false),
});
