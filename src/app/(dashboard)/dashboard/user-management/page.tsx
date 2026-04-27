import { and, asc, eq, ilike, or, SQL } from "drizzle-orm";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import type { LocationOption, UserRecord } from "@/components/ui/UserTable";
import db from "@/db";
import { locations, userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

import UserManagementClient from "./UserManagementClient";

type Filters = {
  search?: string;
  location?: string;
  role?: string;
  neighborhood?: string;
};

async function getUsers(filters: Filters): Promise<UserRecord[]> {
  const conditions: SQL<unknown>[] = [];

  if (filters.search) {
    const pattern = `%${filters.search}%`;
    const clause = or(
      ilike(users.name, pattern),
      ilike(users.email, pattern),
      ilike(userInfo.firstName, pattern),
      ilike(userInfo.lastName, pattern),
      ilike(userInfo.phoneNumber, pattern),
    );
    if (clause) conditions.push(clause);
  }

  if (filters.role) conditions.push(eq(users.role, filters.role));
  if (filters.location) conditions.push(eq(locations.name, filters.location));
  if (filters.neighborhood)
    conditions.push(eq(userInfo.preferredNeighborhood, filters.neighborhood));

  return db
    .select({
      id: users.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      name: users.name,
      email: users.email,
      phoneNumber: userInfo.phoneNumber,
      hoursVolunteered: userInfo.hoursVolunteered,
      infoFilled: users.infoFilled,
      role: users.role,
      locationName: locations.name,
      preferredNeighborhood: userInfo.preferredNeighborhood,
    })
    .from(users)
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .leftJoin(locations, eq(locations.id, users.locationId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(userInfo.lastName), asc(userInfo.firstName), asc(users.email));
}

async function getLocations(): Promise<LocationOption[]> {
  return db
    .select({ id: locations.id, name: locations.name })
    .from(locations)
    .where(eq(locations.deleted, false))
    .orderBy(asc(locations.name));
}

async function getNeighborhoods(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ neighborhood: userInfo.preferredNeighborhood })
    .from(userInfo)
    .orderBy(asc(userInfo.preferredNeighborhood));
  return rows.map((r) => r.neighborhood).filter((n) => n.trim().length > 0);
}

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<React.ReactElement> {
  const session = await auth();
  const callerRole = session?.user?.role ?? "";

  if (callerRole !== "admin" && callerRole !== "manager") {
    redirect("/dashboard");
  }

  const { search, location, role, neighborhood } = await searchParams;
  const accentColor =
    callerRole === "manager" ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  const [people, locationOptions, neighborhoodOptions] = await Promise.all([
    getUsers({ search, location, role, neighborhood }),
    getLocations(),
    getNeighborhoods(),
  ]);

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <UserManagementClient
        users={people}
        callerRole={callerRole}
        locationOptions={locationOptions}
        neighborhoodOptions={neighborhoodOptions}
        accentColor={accentColor}
      />
    </PageContainer>
  );
}
