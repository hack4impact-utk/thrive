"use client";

import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import * as React from "react";

import { DefaultButton } from "@/components/Button";

import getTimeRange from "./helpers";

type VolunteerEventCardProps = {
  key: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  streetLine: string;
  description: string;
};

export default function VolunteerEventCard(
  event: VolunteerEventCardProps,
): React.ReactElement {
  const { status } = useSession();
  const finalString = getTimeRange(
    event.eventDate,
    event.startTime,
    event.endTime,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="h6" component="div">
                {event.title}
              </Typography>
            </Box>

            {status === "authenticated" && (
              <DefaultButton label="Register" href="/" />
            )}
          </Box>

          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Box
              mt={1}
              ml={2}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <QueryBuilderIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                {finalString}
              </Typography>
            </Box>

            <Box
              mt={1}
              ml={2}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                {event.capacity} slots remaining
              </Typography>
            </Box>

            <Box
              mt={1}
              ml={2}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <LocationPinIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                {event.streetLine}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" pt={2}>
            {event.description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
