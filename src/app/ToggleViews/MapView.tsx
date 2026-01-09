import { Box, Typography } from "@mui/material";
import * as React from "react";

import type { View } from "../ToggleViews/view-types";

type MapViewProps = {
  activeView: View;
};

export default function MapView({
  activeView,
}: MapViewProps): React.ReactElement | null {
  if (activeView !== "map") return null;

  return (
    <Box>
      <Typography>map view</Typography>
    </Box>
  );
}
