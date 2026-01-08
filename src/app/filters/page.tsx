"use client";
import { Box } from "@mui/material";
import * as React from "react";

import Filters from "@/components/Filters";
import ToggleViews from "@/components/ToggleViews";

export default function FiltersPage(): React.ReactElement {
  return (
    <Box sx={{ display: "flex", pt: "1%" }}>
      <Box sx={{ width: "70%" }}>
        <Filters />
      </Box>
      <Box>
        <ToggleViews />
      </Box>
    </Box>
  );
}
