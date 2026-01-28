import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";

import DefaultButton from "../DefaultButton";

export type EventInfo = {
  date: Date;
  name: string;
  slotsRemaining: number;
  time: string;
  address: string;
  description: string;
};

type Props = {
  date: string | Date;
  events: EventInfo[];
};

export default function VolunteerEventCard({
  events,
}: Props): React.ReactElement {
  const date =
    events[0].date instanceof Date ? events[0].date : new Date(events[0].date);
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  const headerDate = date.toLocaleDateString("en-US");
  const formattedBodyDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const eventHeader = (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        color: "white",
        position: "sticky",
        top: 56.8,
        zIndex: 1,
        padding: 4,
        width: "100%",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {weekday}, {headerDate}
      </Typography>
    </Box>
  );

  return (
    <div>
      {eventHeader}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        {events.map((event, index) => (
          <React.Fragment key={index}>
            <CardContent sx={{ border: "1px solid #ccc" }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="h6" component="div">
                    {event.name}
                  </Typography>
                </Box>
                <DefaultButton label="Sign up" href="/sign-in" />
              </Box>
              <Box
                sx={{
                  width: "70%",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  marginTop={1}
                  marginLeft={2}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <QueryBuilderIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                    {formattedBodyDate} at {event.time}
                  </Typography>
                </Box>
                <Box
                  marginTop={1}
                  marginLeft={2}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                    {event.slotsRemaining} slots remaining
                  </Typography>
                </Box>
                <Box
                  marginTop={1}
                  marginLeft={2}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <LocationPinIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                    {event.address}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" paddingTop={2}>
                {event.description}
              </Typography>
            </CardContent>
          </React.Fragment>
        ))}
      </Box>
    </div>
  );
}
