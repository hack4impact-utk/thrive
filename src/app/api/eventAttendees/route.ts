import { NextResponse } from "next/server";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: Request): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { eventId } = await req.json();

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  await db
    .insert(eventAttendees)
    .values({
      eventId,
      userId,
    })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true }, { status: 201 });
}
