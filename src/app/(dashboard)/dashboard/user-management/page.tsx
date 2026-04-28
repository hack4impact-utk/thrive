import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import PageContainer from "@/components/layout/PageContainer";
import type { LocationOption, UserRecord } from "@/components/ui/UserTable";
import db from "@/db";
import { locations, userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

import UserManagementClient from "./UserManagementClient";

async function getUsers(): Promise<UserRecord[]> {
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
      onboarded: users.onboarded,
      role: users.role,
      locationName: locations.name,
      preferredNeighborhood: userInfo.preferredNeighborhood,
    })
    .from(users)
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .leftJoin(locations, eq(locations.id, users.locationId))
    .orderBy(asc(userInfo.lastName), asc(userInfo.firstName), asc(users.email));
}

async function getLocations(): Promise<LocationOption[]> {
  return db
    .select({ id: locations.id, name: locations.name })
    .from(locations)
    .where(eq(locations.deleted, false))
    .orderBy(asc(locations.name));
}

export default async function UserManagementPage(): Promise<React.ReactElement> {
  const session = await auth();
  const callerRole = session?.user?.role ?? "";

  if (callerRole !== "admin" && callerRole !== "manager") {
    redirect("/dashboard");
  }

  const accentColor =
    callerRole === "manager" ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  const [people, locationOptions] = await Promise.all([
    getUsers(),
    getLocations(),
  ]);

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Suspense fallback={null}>
        <UserManagementClient
          users={people}
          callerRole={callerRole}
          locationOptions={locationOptions}
          accentColor={accentColor}
        />
      </Suspense>
    </PageContainer>
  );
}
