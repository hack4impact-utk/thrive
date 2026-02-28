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

    const url = new URL("https://geocode.maps.co/search");
    const api = process.env.GEOCODING_API_KEY!;
    const params = {
      street: streetLine,
      city: city,
      state: state,
      country: country,
      postalcode: postalCode,
      api_key: api,
    };
    url.search = new URLSearchParams(params).toString();

    const result = await fetch(url).then((response) => response.json());

    const firstResult = Array.isArray(result) ? result[0] : undefined;
    const latitude = firstResult?.lat ?? null;
    const longitude = firstResult?.lon ?? null;
    const registeredUsers = 0;

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
      registeredUsers,
      streetLine,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
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

/*
  - need to get the address from database
  - GET lng and lat from ex https://geocode.maps.co/search?street=555+5th+Ave&city=New+York&state=NY&postalcode=10017&country=US&api_key=YOUR_SECRET_API_KEY
  - POST to database
  */
