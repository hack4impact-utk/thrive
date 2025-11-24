"use client";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  href: string;
  color?: string;
  bgcolor?: string;
};

export default function DefaultButton({
  label,
  href,
  bgcolor = "primary.main",
  color = "white",
}: Props): React.ReactElement {
  const router = useRouter();

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
      <Button onClick={() => router.push(href)} sx={{ color: color }}>
        {label}
      </Button>
    </Box>
  );
}
