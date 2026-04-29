"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function BackButton({
  label,
  accentColor,
}: {
  label: string;
  accentColor: string;
}): React.ReactElement {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      startIcon={<ArrowBackRoundedIcon />}
      size="small"
      disableRipple
      sx={{
        color: "text.secondary",
        textTransform: "none",
        fontWeight: 500,
        px: 0,
        "&:hover": { bgcolor: "transparent", color: accentColor },
      }}
    >
      {label}
    </Button>
  );
}
