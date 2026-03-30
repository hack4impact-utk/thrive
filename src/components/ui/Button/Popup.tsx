"use client";

import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";

type Props = {
  buttonLabel: string;
  title?: string;
  message?: string;
};

export function Popup({
  buttonLabel,
  title = "Popup",
  message = "Popup goes here.",
}: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1200,
        }}
      >
        <Button variant="contained" onClick={openPopup}>
          {buttonLabel}
        </Button>
      </Box>

      {isOpen && (
        <Box
          onClick={closePopup}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
          }}
        >
          <Box
            onClick={(e): void => e.stopPropagation()}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              p: 3,
              minWidth: 300,
              position: "relative",
              boxShadow: 24,
            }}
          >
            <Button
              onClick={closePopup}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                minWidth: "auto",
                color: "black",
              }}
            >
              ×
            </Button>

            <Typography variant="h6" mb={1}>
              {title}
            </Typography>

            <Typography>{message}</Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
