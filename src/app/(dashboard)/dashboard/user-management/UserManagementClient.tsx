"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Suspense, useMemo, useState } from "react";

import UserTable, {
  type LocationOption,
  type UserRecord,
} from "@/components/ui/UserTable";
import UserTableFilterPopover from "@/components/ui/UserTable/UserTableFilterPopover";
import UserTableSearch from "@/components/ui/UserTable/UserTableSearch";

type HoursSort = "desc" | "asc" | null;

type Props = {
  users: UserRecord[];
  callerRole: string;
  locationOptions: LocationOption[];
  neighborhoodOptions: string[];
  accentColor: string;
};

export default function UserManagementClient({
  users,
  callerRole,
  locationOptions,
  neighborhoodOptions,
  accentColor,
}: Props): React.ReactElement {
  const [hoursSort, setHoursSort] = useState<HoursSort>(null);

  const handleHoursSortToggle = (): void => {
    setHoursSort((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedUsers = useMemo(() => {
    if (!hoursSort) return users;
    return [...users].sort((a, b) => {
      const aH = a.hoursVolunteered ?? 0;
      const bH = b.hoursVolunteered ?? 0;
      return hoursSort === "desc" ? bH - aH : aH - bH;
    });
  }, [users, hoursSort]);

  return (
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Suspense fallback={null}>
          <UserTableSearch />
        </Suspense>
        <Suspense fallback={null}>
          <UserTableFilterPopover
            locationOptions={locationOptions}
            neighborhoodOptions={neighborhoodOptions}
          />
        </Suspense>
      </Box>

      <UserTable
        users={sortedUsers}
        callerRole={callerRole}
        locationOptions={callerRole === "admin" ? locationOptions : []}
        accentColor={accentColor}
        hoursSort={hoursSort}
        onHoursSortToggle={handleHoursSortToggle}
        onHoursSortClear={() => setHoursSort(null)}
      />
    </Stack>
  );
}
