import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { events } from "./events";
import { users } from "./users";

export const eventAttendees = pgTable(
  "event_attendee",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: text("role").default("attendee"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.eventId, table.userId],
    }),
  }),
);
