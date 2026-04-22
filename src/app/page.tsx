import { eq } from "drizzle-orm";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { eventAttendees } from "@/db/schema";
import HomePageContent from "@/features/home/components/HomePageContent";
import WelcomeCard from "@/features/home/components/WelcomeCard";
import { getUpcomingEvents } from "@/lib/events";
import getUserSession from "@/utils/auth/get-user-session";

export default async function HomePage(): Promise<React.ReactElement> {
  const events = await getUpcomingEvents();

  const session = await getUserSession();
  const userId = session?.user?.id ?? null;

  const registrations = userId
    ? await db
        .select({ eventId: eventAttendees.eventId })
        .from(eventAttendees)
        .where(eq(eventAttendees.userId, userId))
    : [];

  const registeredSet = new Set(registrations.map((r) => r.eventId));

  const eventsWithState = events.map((e) => ({
    ...e,
    isRegistered: userId ? registeredSet.has(e.id) : false,
  }));

  return (
    <PageContainer>
      <WelcomeCard />
      <HomePageContent events={eventsWithState} />
    </PageContainer>
  );
}
