"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  leftLabel: string;
  leftHref: string;
  rightLabel: string;
  rightHref: string;
};

export default function DoubleNavigationButton({
  leftLabel,
  leftHref,
  rightLabel,
  rightHref,
}: Props): React.ReactElement {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", gap: 2, mt: 5, mb: 3 }}>
      <Button
        variant="contained"
        color="inherit"
        sx={{ flex: 1, fontSize: ".95rem" }}
        onClick={() => router.push(leftHref)}
      >
        {leftLabel}
      </Button>

      <Button
        variant="contained"
        sx={{ flex: 1, bgcolor: "#22A27E", fontSize: ".95rem" }}
        onClick={() => router.push(rightHref)}
      >
        {rightLabel}
      </Button>
    </Box>
  );
}
