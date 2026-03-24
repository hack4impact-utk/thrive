"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import * as React from "react";

import SubmitFormButton from "@/components/ui/Button/SubmitFormButton";

type FormLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export default function FormLayout({
  title,
  description,
  children,
  submitLabel,
  onSubmit,
}: FormLayoutProps): React.ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: { xs: 2, sm: 6 },
        mb: { xs: 2, sm: 6 },
        px: { xs: 0, sm: 2 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 700,
          boxShadow: { xs: "none", sm: 1 },
          borderRadius: { xs: 0, sm: 2 },
        }}
      >
        <CardContent
          sx={{
            px: { xs: 2, sm: 5 },
            py: { xs: 2, sm: 4 },
          }}
        >
          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h5">{title}</Typography>

            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}

            {children}

            <SubmitFormButton label={submitLabel} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
