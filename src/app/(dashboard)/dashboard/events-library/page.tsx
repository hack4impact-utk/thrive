import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import { auth } from "@/lib/auth";
import { getAllEvents } from "@/lib/events";
import { ROLE_COLORS } from "@/lib/role-colors";

import EventsLibraryClient from "./EventsLibraryClient";

export default async function EventsLibraryPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const events = await getAllEvents();

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <EventsLibraryClient events={events} accentColor={ROLE_COLORS.admin} />
    </PageContainer>
  );
}
