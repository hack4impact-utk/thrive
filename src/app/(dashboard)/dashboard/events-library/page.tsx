import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import { auth } from "@/lib/auth";
import { getAllEvents } from "@/lib/events";
import { ROLE_COLORS } from "@/lib/role-colors";

import EventsLibraryClient from "./EventsLibraryClient";

export default async function EventsLibraryPage(): Promise<React.ReactElement> {
  const session = await auth();

  const role = session?.user?.role;
  if (role !== "admin" && role !== "manager") {
    redirect("/dashboard");
  }

  const allEvents = await getAllEvents();
  const managerLocationId = session?.user?.locationId ?? null;
  const isManager = role === "manager";

  const events =
    isManager && managerLocationId
      ? allEvents.filter((e) => e.locationId === managerLocationId)
      : allEvents;

  const accentColor = isManager ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <EventsLibraryClient
        events={events}
        accentColor={accentColor}
        showLocationFilter={!isManager}
      />
    </PageContainer>
  );
}
