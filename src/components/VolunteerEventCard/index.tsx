import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import * as React from "react";

import DefaultButton from "../DefaultButton";

export default function VolunteerEventCard(): React.ReactElement {
  const { status } = useSession();

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
                Main Campus All Day Volunteer
              </Typography>
            </Box>

            {status === "authenticated" && (
              <DefaultButton label="Sign Up" href="/" />
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
                Wed, November 19 at 3 PM - 6 PM (3 Hours)
              </Typography>
            </Box>

            <Box
              mt={1}
              ml={2}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                5 slots remaining
              </Typography>
            </Box>

            <Box
              mt={1}
              ml={2}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <LocationPinIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                1317 Connecticut Avenue Knoxville Tennessee 37921
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" pt={2}>
            Join us for a fun-filled day of worship, Bible study, academic time,
            group games, and so much more!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
