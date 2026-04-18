import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

import db from "@/db";
import { userInfo } from "@/db/schema";
import { auth } from "@/lib/auth";

function formatHours(hours: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(hours) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(hours);
}

export default async function ViewHours(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "user") {
    redirect("/");
  }

  const hoursRecord = await db.query.userInfo.findFirst({
    columns: {
      firstName: true,
      hoursVolunteered: true,
    },
    where: eq(userInfo.userId, session.user.id),
  });

  const volunteerHours = hoursRecord?.hoursVolunteered ?? 0;

  return (
    <>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          px: { xs: 3, sm: 6, md: 10 },
          py: 3,
          width: "100%",
          marginTop: 0,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          My Hours
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 1, maxWidth: 640, color: "rgba(255, 255, 255, 0.88)" }}
        >
          Review the volunteer hours currently recorded on your profile.
        </Typography>
      </Box>

      <Box
        sx={{
          color: "black",
          px: { xs: 2, sm: 4, md: 10 },
          py: { xs: 3, md: 5 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 850,
            mx: "auto",
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 30px rgba(34, 48, 91, 0.08)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ color: "secondary.main" }}
                >
                  <AccessTimeRoundedIcon />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Logged Volunteer Hours
                  </Typography>
                </Stack>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      mb: 1,
                    }}
                  >
                    Current Total
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      lineHeight: 1,
                    }}
                  >
                    {formatHours(volunteerHours)}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mt: 1, color: "secondary.main", fontWeight: 500 }}
                  >
                    hours volunteered
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  If this total looks incorrect, please contact an admin or
                  manager so they can review your recorded hours.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}
