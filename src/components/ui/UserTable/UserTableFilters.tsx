"use client";

import { Box } from "@mui/material";
import * as React from "react";

import type { LocationOption } from "./RoleCell";
import UserTableFilterPopover from "./UserTableFilterPopover";
import UserTableSearch from "./UserTableSearch";

type UserTableFiltersProps = {
  locationOptions: LocationOption[];
  neighborhoodOptions: string[];
};

export default function UserTableFilters({
  locationOptions,
  neighborhoodOptions,
}: UserTableFiltersProps): React.ReactElement {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <UserTableFilterPopover
        locationOptions={locationOptions}
        neighborhoodOptions={neighborhoodOptions}
      />
      <UserTableSearch />
    </Box>
  );
}
