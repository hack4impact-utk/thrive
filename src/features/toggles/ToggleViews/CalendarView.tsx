import { Box, Typography } from "@mui/material";
import * as React from "react";

import type { View } from "./view-types";

type CalendarViewProps = {
  activeView: View;
};

export default function CalendarView({
  activeView,
}: CalendarViewProps): React.ReactElement | null {
  if (activeView !== "calendar") return null;

  return (
    <Box>
      <Typography>calendar view</Typography>
    </Box>
  );
}
