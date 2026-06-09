import { and, asc, eq } from "drizzle-orm";

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
  description: string;
  capacity: number | null;
  frequency: string;
  daysOfWeek: number[] | null;
  weekdaysOnly: boolean;
  monthlyType: string | null;
  monthlyNth: number | null;
  monthlyWeekday: number | null;
  startDate: string;
  endDate: string | null;
  active: boolean;
  locationName: string | null;
};

async function getRecurringEvents(
  locationId?: string,
): Promise<RecurringEventRow[]> {
  return db
    .select({
      id: recurringEvents.id,
      title: recurringEvents.title,
      description: recurringEvents.description,
      capacity: recurringEvents.capacity,
      frequency: recurringEvents.frequency,
      daysOfWeek: recurringEvents.daysOfWeek,
      weekdaysOnly: recurringEvents.weekdaysOnly,
      monthlyType: recurringEvents.monthlyType,
      monthlyNth: recurringEvents.monthlyNth,
      monthlyWeekday: recurringEvents.monthlyWeekday,
      startDate: recurringEvents.startDate,
      endDate: recurringEvents.endDate,
      active: recurringEvents.active,
      locationName: locations.name,
    })
    .from(recurringEvents)
    .leftJoin(locations, eq(locations.id, recurringEvents.locationId))
    .where(
      locationId ? and(eq(recurringEvents.locationId, locationId)) : undefined,
    )
    .orderBy(asc(recurringEvents.startDate));
}

export default async function RecurringEventsPage(): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role ?? "";
  const isManager = role === "manager";
  const managerLocationId = isManager
    ? (session?.user?.locationId ?? undefined)
    : undefined;

  const accentColor = isManager ? ROLE_COLORS.manager : ROLE_COLORS.admin;
  const patterns = await getRecurringEvents(managerLocationId);

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <RecurringEventsClient
        patterns={patterns}
        accentColor={accentColor}
        showLocationFilter={!isManager}
      />
    </PageContainer>
  );
}
