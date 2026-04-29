import { eq } from "drizzle-orm";

import db from "@/db";
import { locations } from "@/db/schema";
import { auth } from "@/lib/auth";

import CreateEventForm from "./CreateEventForm";

export default async function CreateEventPage(): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;
  const locationId = session?.user?.locationId ?? null;

  let locationName: string | null = null;
  if (role === "manager" && locationId) {
    const loc = await db.query.locations.findFirst({
      where: eq(locations.id, locationId),
    });
    locationName = loc?.name ?? null;
  }

  return (
    <CreateEventForm
      managerLocationId={role === "manager" ? locationId : null}
      managerLocationName={role === "manager" ? locationName : null}
    />
  );
}
