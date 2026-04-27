import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { locations } from "@/db/schema/locations";
import { auth } from "@/lib/auth";

import ManageLocationsClient from "./ManageLocationsClient";

async function getLocations(): Promise<
  {
    id: string;
    name: string;
    streetLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[]
> {
  return db
    .select({
      id: locations.id,
      name: locations.name,
      streetLine: locations.streetLine,
      city: locations.city,
      state: locations.state,
      postalCode: locations.postalCode,
      country: locations.country,
    })
    .from(locations)
    .where(eq(locations.deleted, false))
    .orderBy(asc(locations.name));
}

export default async function ManageLocationsPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const rows = await getLocations();

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <ManageLocationsClient locations={rows} />
    </PageContainer>
  );
}
