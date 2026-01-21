import { NextResponse } from "next/server";

import db from "@/db";
import { events } from "@/db/schema/events";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const {
      title,
      eventDate,
      startTime,
      endTime,
      capacity,
      streetLine,
      city,
      state,
      postalCode,
      country,
      description,
    } = body;

    if (
      !title ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !streetLine ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !description
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 },
      );
    }

    await db.insert(events).values({
      title,
      eventDate,
      startTime,
      endTime,
      capacity: capacity ?? null,
      streetLine,
      city,
      state,
      postalCode,
      country,
      description,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
