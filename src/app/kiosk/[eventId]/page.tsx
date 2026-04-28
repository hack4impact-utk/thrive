import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as React from "react";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { events, locations } from "@/db/schema";
import getTimeRange from "@/features/home/helpers";
import getUserSession from "@/utils/auth/get-user-session";

import KioskCheckInContent from "./KioskCheckInContent";

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function KioskEventPage({
  params,
}: Props): Promise<React.ReactElement> {
  const { eventId } = await params;
  const session = await getUserSession();

  if (!session?.user || session.user.role !== "kiosk") {
    redirect("/");
  }

  const locationId = session.user.locationId ?? null;
  const todayStr = new Date().toISOString().split("T")[0];

  const event = await db
    .select({
      id: events.id,
      title: events.title,
      eventDate: events.eventDate,
      startTime: events.startTime,
      endTime: events.endTime,
      locationId: events.locationId,
      locationName: locations.name,
    })
    .from(events)
    .leftJoin(locations, eq(locations.id, events.locationId))
    .where(and(ne(events.deleted, true), eq(events.id, eventId)))
    .then((res) => res[0]);

  // Must exist, be today, and belong to this kiosk's location
  if (
    !event ||
    event.eventDate !== todayStr ||
    event.locationId !== locationId
  ) {
    redirect("/kiosk");
  }

  const { timeRange } = getTimeRange(
    event.eventDate,
    event.startTime,
    event.endTime,
  );

  return (
    <PageContainer maxWidth={700}>
      <KioskCheckInContent
        eventId={event.id}
        eventTitle={event.title}
        timeRange={timeRange}
      />
    </PageContainer>
  );
}
