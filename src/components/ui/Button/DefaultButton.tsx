"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  href: string;
  onClick?: () => void;
  color?: string;
  bgcolor?: string;
  disabled?: boolean;
};

export function DefaultButton({
  label,
  href,
  onClick,
  bgcolor = "primary.main",
  color = "white",
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
        bgcolor: disabled ? "grey.300" : bgcolor,
        borderRadius: 1,
        ml: 1,
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Button
        onClick={handleClick}
        disabled={disabled}
        sx={{ color: disabled ? "text.disabled" : color }}
      >
        {label}
      </Button>
    </Box>
  );
}
