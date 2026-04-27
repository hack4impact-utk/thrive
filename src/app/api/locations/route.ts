import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { events } from "@/db/schema/events";
import { locations } from "@/db/schema/locations";

export async function GET(): Promise<Response> {
  try {
    const rows = await db.select().from(locations).orderBy(asc(locations.name));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch locations", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { name, streetLine, city, state, postalCode, country } = body;

    if (!name || !streetLine || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const url = new URL("https://geocode.maps.co/search");
    const api = process.env.GEOCODING_API_KEY!;
    const params = {
      street: streetLine,
      city,
      state,
      country,
      postalcode: postalCode,
      api_key: api,
    };
    url.search = new URLSearchParams(params).toString();

    const result = await fetch(url).then((r) => r.json());
    const firstResult = Array.isArray(result) ? result[0] : undefined;
    const latitude = firstResult?.lat ?? null;
    const longitude = firstResult?.lon ?? null;

    const [location] = await db
      .insert(locations)
      .values({
        name,
        streetLine,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
      })
      .returning();

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("Failed to create location", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { id, deleted } = body;

    if (!id || typeof deleted !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: id and deleted" },
        { status: 400 },
      );
    }

    const [location] = await db
      .update(locations)
      .set({ deleted })
      .where(eq(locations.id, id))
      .returning();

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }

    if (deleted) {
      await db
        .update(events)
        .set({ deleted: true })
        .where(eq(events.locationId, id));
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("Failed to update location", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
