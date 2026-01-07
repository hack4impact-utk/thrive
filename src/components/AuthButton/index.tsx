"use client";
import { Box, Button } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

type Props = {
  label: string;
  color?: string;
  bgcolor?: string;
};

export default function AuthButton({
  label,
  bgcolor = "primary.main",
  color = "white",
}: Props): React.ReactElement {
  const { status } = useSession();
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
      {status === "authenticated" ? (
        <Button onClick={() => signOut()} sx={{ color: color }}>
          {label}
        </Button>
      ) : (
        <Button onClick={() => signIn("google")} sx={{ color: color }}>
          {label}
        </Button>
      )}
    </Box>
  );
}
