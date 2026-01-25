import { boolean, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const userInfo = pgTable("user_info", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),

  email: text("email").notNull(),

  addressLine1: text("address_line_1").notNull(),
  addressLine2: varchar("address_line_2", { length: 50 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),

  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  isTextOptedIn: boolean("is_text_opted_in").notNull().default(false),

  birthMonth: integer("birth_month").notNull(),
  birthDay: integer("birth_day").notNull(),
  birthYear: integer("birth_year").notNull(),

  preferredNeighborhood: text("preferred_neighborhood"),

  gender: varchar("gender", { length: 20 }),

  shirtSize: varchar("shirt_size", { length: 10 }),

  medicalNotes: text("medical_notes"),
});
