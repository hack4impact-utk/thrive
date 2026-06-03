import { eq } from "drizzle-orm";
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
      unlimitedCapacity,
      locationId,
      description,
    } = body;

    if (
      !title ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !description ||
      !locationId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (capacity === null && unlimitedCapacity !== true) {
      return NextResponse.json(
        { error: "Capacity is required" },
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
      registeredUsers: 0,
      locationId,
      description,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const {
      id,
      title,
      eventDate,
      startTime,
      endTime,
      capacity,
      unlimitedCapacity,
      locationId,
      description,
    } = body;

    if (
      !id ||
      !title ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !description ||
      !locationId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (capacity === null && unlimitedCapacity !== true) {
      return NextResponse.json(
        { error: "Capacity is required" },
        { status: 400 },
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 },
      );
    }

    await db
      .update(events)
      .set({ title, eventDate, startTime, endTime, capacity: capacity ?? null, locationId, description })
      .where(eq(events.id, id));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
