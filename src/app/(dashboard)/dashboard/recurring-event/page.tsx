import { asc, eq } from "drizzle-orm";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { locations } from "@/db/schema/locations";
import { recurringEvents } from "@/db/schema/recurring-events";

import RecurringEventsClient from "./RecurringEventsClient";

type RecurringEventRow = {
  id: string;
  title: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  locationName: string | null;
};

async function getRecurringEvents(): Promise<RecurringEventRow[]> {
  return db
    .select({
      id: recurringEvents.id,
      title: recurringEvents.title,
      frequency: recurringEvents.frequency,
      startDate: recurringEvents.startDate,
      endDate: recurringEvents.endDate,
      active: recurringEvents.active,
      locationName: locations.name,
    })
    .from(recurringEvents)
    .leftJoin(locations, eq(locations.id, recurringEvents.locationId))
    .orderBy(asc(recurringEvents.startDate));
}

export default async function RecurringEventsPage(): Promise<React.ReactElement> {
  const patterns = await getRecurringEvents();

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <RecurringEventsClient patterns={patterns} />
    </PageContainer>
  );
}
