import { Box, Typography } from "@mui/material";
import * as React from "react";

import type { View } from "./view-types";

type ListViewProps = {
  activeView: View;
};

export default function ListView({
  activeView,
}: ListViewProps): React.ReactElement | null {
  if (activeView !== "list") return null;

  return (
    <Box>
      <Typography>list view</Typography>
    </Box>
  );
}
