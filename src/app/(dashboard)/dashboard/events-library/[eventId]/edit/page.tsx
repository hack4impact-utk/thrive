import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import CreateEventForm from "@/app/(dashboard)/dashboard/create-event/CreateEventForm";
import db from "@/db";
import { events, locations } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin" && role !== "manager") {
    redirect("/dashboard");
  }

  const { eventId } = await params;

  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      eventDate: events.eventDate,
      startTime: events.startTime,
      endTime: events.endTime,
      capacity: events.capacity,
      locationId: events.locationId,
    })
    .from(events)
    .where(eq(events.id, eventId));

  if (!event) notFound();

  let managerLocationId: string | null = null;
  let managerLocationName: string | null = null;

  if (role === "manager") {
    const locationId = session?.user?.locationId ?? null;
    managerLocationId = locationId;
    if (locationId) {
      const loc = await db.query.locations.findFirst({
        where: eq(locations.id, locationId),
      });
      managerLocationName = loc?.name ?? null;
    }
  }

  return (
    <CreateEventForm
      managerLocationId={managerLocationId}
      managerLocationName={managerLocationName}
      initialValues={{
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        capacity: event.capacity ?? null,
        locationId: event.locationId ?? "",
      }}
    />
  );
}
