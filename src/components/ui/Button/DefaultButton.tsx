"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  href: string;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  disabled?: boolean;
};

export function DefaultButton({
  label,
  href,
  onClick,
  variant = "contained",
  disabled = false,
}: Props): React.ReactElement {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (disabled) return;
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
        ml: 1,
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Button
        variant={variant}
        color="primary"
        onClick={handleClick}
        disabled={disabled}
      >
        {label}
      </Button>
    </Box>
  );
}
