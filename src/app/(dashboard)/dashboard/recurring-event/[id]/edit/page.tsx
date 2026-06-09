import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import RecurringEventCreationForm from "@/app/(dashboard)/dashboard/recurring-event/create/RecurringEventCreationForm";
import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { locations } from "@/db/schema/locations";
import { recurringEvents } from "@/db/schema/recurring-events";
import { auth } from "@/lib/auth";

export default async function EditRecurringEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin" && role !== "manager") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const [pattern] = await db
    .select()
    .from(recurringEvents)
    .where(eq(recurringEvents.id, id));

  if (!pattern) notFound();
  if (!pattern.active) redirect("/dashboard/recurring-event");

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
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <RecurringEventCreationForm
        managerLocationId={managerLocationId}
        managerLocationName={managerLocationName}
        initialValues={{
          id: pattern.id,
          title: pattern.title,
          description: pattern.description,
          capacity: pattern.capacity ?? null,
          frequency: pattern.frequency,
          startDate: pattern.startDate,
          endDate: pattern.endDate ?? null,
          startTime: pattern.startTime,
          endTime: pattern.endTime,
          locationId: pattern.locationId ?? "",
          daysOfWeek: pattern.daysOfWeek ?? null,
          weekdaysOnly: pattern.weekdaysOnly,
          monthlyType: pattern.monthlyType ?? null,
          monthlyNth: pattern.monthlyNth ?? null,
          monthlyWeekday: pattern.monthlyWeekday ?? null,
        }}
      />
    </PageContainer>
  );
}
