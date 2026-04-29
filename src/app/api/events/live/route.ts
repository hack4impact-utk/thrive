import { and, gte, lte, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { events } from "@/db/schema/events";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const today = new Date();
    const endOfWindowMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 3,
      0,
    );

    const todayStr = today.toISOString().split("T")[0];
    const endStr = endOfWindowMonth.toISOString().split("T")[0];

    const rows = await db
      .select({
        id: events.id,
        registeredUsers: events.registeredUsers,
        capacity: events.capacity,
      })
      .from(events)
      .where(
        and(
          ne(events.deleted, true),
          gte(events.eventDate, todayStr),
          lte(events.eventDate, endStr),
        ),
      );

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
