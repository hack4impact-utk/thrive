"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
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
  accentColor: string;
};

function UserManagementContent({
  users,
  callerRole,
  locationOptions,
  accentColor,
}: Props): React.ReactElement {
  const searchParams = useSearchParams();
  const [hoursSort, setHoursSort] = useState<HoursSort>(null);

  const search = searchParams.get("search") ?? "";
  const location = searchParams.get("location") ?? "";
  const role = searchParams.get("role") ?? "";
  const neighborhood = searchParams.get("neighborhood") ?? "";

  const neighborhoodOptions = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const user of users) {
      const n = user.preferredNeighborhood;
      if (n && n.trim() && !seen.has(n)) {
        seen.add(n);
        result.push(n);
      }
    }
    return result.sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (search) {
        const q = search.toLowerCase();
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const altName = (user.name ?? "").toLowerCase();
        const email = (user.email ?? "").toLowerCase();
        const phone = (user.phoneNumber ?? "").toLowerCase();
        if (
          !fullName.includes(q) &&
          !altName.includes(q) &&
          !email.includes(q) &&
          !phone.includes(q)
        ) {
          return false;
        }
      }
      if (location && user.locationName !== location) return false;
      if (role && user.role !== role) return false;
      if (neighborhood && user.preferredNeighborhood !== neighborhood)
        return false;
      return true;
    });
  }, [users, search, location, role, neighborhood]);

  const handleHoursSortToggle = (): void => {
    setHoursSort((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedUsers = useMemo(() => {
    if (!hoursSort) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const aH = a.hoursVolunteered ?? 0;
      const bH = b.hoursVolunteered ?? 0;
      return hoursSort === "desc" ? bH - aH : aH - bH;
    });
  }, [filteredUsers, hoursSort]);

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          justifyContent: { md: "space-between" },
          gap: 2,
        }}
      >
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
            flexDirection: { xs: "row-reverse", md: "row" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <UserTableSearch />
          <UserTableFilterPopover
            locationOptions={locationOptions}
            neighborhoodOptions={neighborhoodOptions}
          />
        </Box>
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

export default function UserManagementClient(props: Props): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <UserManagementContent {...props} />
    </Suspense>
  );
}
