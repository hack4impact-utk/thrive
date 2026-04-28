import { NextResponse } from "next/server";

import db from "@/db";
import { recurringEvents } from "@/db/schema/recurring-events";

const VALID_FREQUENCIES = ["daily", "weekly", "biweekly", "monthly"] as const;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const {
      title,
      startTime,
      endTime,
      capacity,
      unlimitedCapacity,
      locationId,
      description,
      frequency,
      startDate,
      endDate,
    } = body;

    if (
      !title ||
      !startTime ||
      !endTime ||
      !description ||
      !locationId ||
      !frequency ||
      !startDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json({ error: "Invalid frequency" }, { status: 400 });
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

    if (endDate && endDate < startDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 },
      );
    }

    await db.insert(recurringEvents).values({
      title,
      startTime,
      endTime,
      capacity: capacity ?? null,
      locationId,
      description,
      frequency,
      startDate,
      endDate: endDate || null,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
