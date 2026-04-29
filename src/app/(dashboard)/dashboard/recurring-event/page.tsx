import { asc, eq } from "drizzle-orm";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { locations } from "@/db/schema/locations";
import { recurringEvents } from "@/db/schema/recurring-events";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

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
  const session = await auth();
  const callerRole = session?.user?.role ?? "";
  const accentColor =
    callerRole === "manager" ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  const patterns = await getRecurringEvents();

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <RecurringEventsClient patterns={patterns} accentColor={accentColor} />
    </PageContainer>
  );
}
