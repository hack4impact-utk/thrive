import { Box, Stack, Typography } from "@mui/material";
import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import UserTable, {
  type LocationOption,
  type UserRecord,
} from "@/components/ui/UserTable";
import db from "@/db";
import { locations, userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

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
      role: users.role,
      locationName: locations.name,
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
    callerRole === "admin" ? getLocations() : Promise.resolve([]),
  ]);

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A condensed view of each user&apos;s name, contact details, and
            account role.
          </Typography>
        </Box>

        <UserTable
          users={people}
          callerRole={callerRole}
          locationOptions={locationOptions}
          accentColor={accentColor}
        />
      </Stack>
    </PageContainer>
  );
}
