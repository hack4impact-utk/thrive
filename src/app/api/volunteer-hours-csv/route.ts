import { and, eq, gte, lte, ne } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { eventAttendees, events, locations } from "@/db/schema";
import { auth } from "@/lib/auth";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcHours(start: string, end: string): number {
  return (toMinutes(end) - toMinutes(start)) / 60;
}

function fmtDate(d: string): string {
  const [, month, day] = d.split("-").map(Number);
  return `${MONTHS[month - 1]}${day}`;
}

function buildFilename(
  locationName: string | undefined,
  dateFrom: string | undefined,
  dateTo: string | undefined,
): string {
  const locPart = locationName ? locationName.replaceAll(/\s+/g, "") : "";

  let datePart = "";
  let yearPart = "";
  if (dateFrom && dateTo) {
    datePart = `${fmtDate(dateFrom)}-${fmtDate(dateTo)}`;
    yearPart = dateFrom.split("-")[0];
  } else if (dateFrom) {
    datePart = fmtDate(dateFrom);
    yearPart = dateFrom.split("-")[0];
  } else if (dateTo) {
    datePart = fmtDate(dateTo);
    yearPart = dateTo.split("-")[0];
  }

  const parts = ["volunteer-hours", locPart, datePart, yearPart].filter(
    Boolean,
  );
  return `${parts.join("_")}.csv`;
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin" && role !== "manager") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const locationId = searchParams.get("locationId") ?? undefined;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  const conditions = [
    eq(eventAttendees.attended, true),
    ne(events.deleted, true),
  ];
  if (locationId) conditions.push(eq(events.locationId, locationId));
  if (dateFrom) conditions.push(gte(events.eventDate, dateFrom));
  if (dateTo) conditions.push(lte(events.eventDate, dateTo));

  const [rows, locationOptions] = await Promise.all([
    db
      .select({
        locationName: locations.name,
        startTime: events.startTime,
        endTime: events.endTime,
      })
      .from(eventAttendees)
      .innerJoin(events, eq(events.id, eventAttendees.eventId))
      .leftJoin(locations, eq(locations.id, events.locationId))
      .where(and(...conditions)),

    locationId
      ? db
          .select({ name: locations.name })
          .from(locations)
          .where(eq(locations.id, locationId))
          .limit(1)
      : Promise.resolve([]),
  ]);

  const byLocation = new Map<string, number>();
  for (const row of rows) {
    const key = row.locationName ?? "No Location";
    byLocation.set(
      key,
      (byLocation.get(key) ?? 0) + calcHours(row.startTime, row.endTime),
    );
  }

  const locationRows = [...byLocation.entries()]
    .map(([name, hours]) => ({ name, hours }))
    .sort((a, b) => b.hours - a.hours);

  const csvRows = [
    "Location,Total Hours",
    ...locationRows.map((row) => {
      const h =
        row.hours % 1 === 0
          ? String(row.hours)
          : String(Number.parseFloat(row.hours.toFixed(2)));
      return `${escapeCsv(row.name)},${h}`;
    }),
  ].join("\n");

  const filterLocationName = locationOptions[0]?.name;
  const filename = buildFilename(filterLocationName, dateFrom, dateTo);

  return new NextResponse(csvRows, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
