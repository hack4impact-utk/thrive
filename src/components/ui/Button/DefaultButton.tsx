"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  href: string;
  onClick?: () => void;
  color?: string;
  bgcolor?: string;
};

export function DefaultButton({
  label,
  href,
  onClick,
  bgcolor = "primary.main",
  color = "white",
}: Props): React.ReactElement {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else {
      router.push(href);
    }
  };

  return (
    <Box
      sx={{
        bgcolor,
        borderRadius: 1,
        ml: 1,
        display: "flex",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <Button onClick={handleClick} sx={{ color }}>
        {label}
      </Button>
    </Box>
  );
}
