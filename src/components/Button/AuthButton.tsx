"use client";
import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

type Props = {
  label: string;
  color?: string;
  bgcolor?: string;
};

export function AuthButton({
  label,
  bgcolor = "primary.main",
  color = "white",
}: Props): React.ReactElement {
  return (
    <Box
      sx={{
        bgcolor: bgcolor,
        borderRadius: 1,
        ml: 1,
        display: "flex",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <Button onClick={() => signIn("google")} sx={{ color: color }}>
        {label}
      </Button>
    </Box>
  );
}
