import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { recurringEvents } from "@/db/schema/recurring-events";
import { materializeRecurringEvent } from "@/lib/materialize-recurring-event";
import { addDays, formatDateOnly } from "@/lib/recurrence";

const VALID_FREQUENCIES = ["daily", "weekly", "biweekly", "monthly"] as const;
const VALID_MONTHLY_TYPES = ["day-of-month", "nth-weekday"] as const;
const VALID_MONTHLY_NTH = new Set([1, 2, 3, 4, -1]);

function isWeekdayIndex(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 6;
}

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
      // recurrence options
      daysOfWeek,
      weekdaysOnly,
      monthlyType,
      monthlyNth,
      monthlyWeekday,
    } = body as {
      title: string;
      startTime: string;
      endTime: string;
      capacity: number | null;
      unlimitedCapacity: boolean;
      locationId: string;
      description: string;
      frequency: string;
      startDate: string;
      endDate?: string;
      daysOfWeek?: number[];
      weekdaysOnly?: boolean;
      monthlyType?: string;
      monthlyNth?: number;
      monthlyWeekday?: number;
    };

    // ── Required field validation ────────────────────────────────────────────
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

    if (
      !VALID_FREQUENCIES.includes(
        frequency as (typeof VALID_FREQUENCIES)[number],
      )
    ) {
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

    // ── Recurrence-specific validation ───────────────────────────────────────
    if (
      (frequency === "weekly" || frequency === "biweekly") &&
      (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0)
    ) {
      return NextResponse.json(
        { error: "Select at least one day for weekly / biweekly events" },
        { status: 400 },
      );
    }

    if (
      daysOfWeek !== undefined &&
      (!Array.isArray(daysOfWeek) ||
        daysOfWeek.some((day) => !isWeekdayIndex(day)) ||
        (frequency === "biweekly" && daysOfWeek.length !== 1))
    ) {
      return NextResponse.json(
        { error: "Invalid daysOfWeek" },
        { status: 400 },
      );
    }

    if (
      frequency === "monthly" &&
      (monthlyType === undefined ||
        !VALID_MONTHLY_TYPES.includes(
          monthlyType as (typeof VALID_MONTHLY_TYPES)[number],
        ))
    ) {
      return NextResponse.json(
        { error: "Invalid monthlyType" },
        { status: 400 },
      );
    }

    if (
      frequency === "monthly" &&
      monthlyType === "nth-weekday" &&
      (monthlyNth === undefined ||
        monthlyNth === null ||
        monthlyWeekday === undefined ||
        monthlyWeekday === null)
    ) {
      return NextResponse.json(
        { error: "Monthly nth-weekday requires both nth and weekday" },
        { status: 400 },
      );
    }

    if (
      frequency === "monthly" &&
      monthlyType === "nth-weekday" &&
      (!VALID_MONTHLY_NTH.has(monthlyNth!) || !isWeekdayIndex(monthlyWeekday!))
    ) {
      return NextResponse.json(
        { error: "Invalid monthly nth-weekday options" },
        { status: 400 },
      );
    }

    if (
      monthlyType !== undefined &&
      !VALID_MONTHLY_TYPES.includes(
        monthlyType as (typeof VALID_MONTHLY_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Invalid monthlyType" },
        { status: 400 },
      );
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    const [pattern] = await db
      .insert(recurringEvents)
      .values({
        title,
        startTime,
        endTime,
        capacity: capacity ?? null,
        locationId,
        description,
        frequency,
        startDate,
        endDate: endDate || null,
        daysOfWeek:
          frequency === "weekly" || frequency === "biweekly"
            ? daysOfWeek
            : null,
        weekdaysOnly: frequency === "daily" ? (weekdaysOnly ?? false) : false,
        monthlyType: frequency === "monthly" ? monthlyType : null,
        monthlyNth:
          frequency === "monthly" && monthlyType === "nth-weekday"
            ? monthlyNth
            : null,
        monthlyWeekday:
          frequency === "monthly" && monthlyType === "nth-weekday"
            ? monthlyWeekday
            : null,
      })
      .returning();

    const today = formatDateOnly(new Date());
    const tomorrow = addDays(today, 1);
    await materializeRecurringEvent(pattern, today, tomorrow);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request): Promise<Response> {
  try {
    const { id, title, description, capacity, endDate } =
      (await req.json()) as {
        id: string;
        title?: string;
        description?: string;
        capacity?: number | null;
        endDate?: string | null;
      };

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }

    if (description !== undefined && !description.trim()) {
      return NextResponse.json(
        { error: "Description cannot be empty" },
        { status: 400 },
      );
    }

    await db
      .update(recurringEvents)
      .set({
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(capacity !== undefined && { capacity: capacity ?? null }),
        ...(endDate !== undefined && { endDate: endDate || null }),
      })
      .where(eq(recurringEvents.id, id));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db
      .update(recurringEvents)
      .set({ active: false })
      .where(eq(recurringEvents.id, id));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
