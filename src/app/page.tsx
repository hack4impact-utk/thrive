import Box from "@mui/material/Box";

import VolunteerEventCardHeader from "@/app/VolunteerEventCardHeader";
import WelcomeCard from "@/app/WelcomeCard";
import { getUpcomingEvents } from "@/lib/events";

import HomePageClient from "./HomePageClient";

export default async function HomePage(): Promise<React.ReactElement> {
  const events = await getUpcomingEvents();

  return (
    <div>
      <Box
        sx={{
          width: "80%",
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WelcomeCard />
        <VolunteerEventCardHeader />
        <HomePageClient events={events} />
      </Box>
    </div>
  );
}
