"use client";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

import type { EventInfo } from "@/components/VolunteerEventCard/volunteer-event-card";
import VolunteerEventCard from "@/components/VolunteerEventCard/volunteer-event-card";
import WelcomeCard from "@/components/WelcomeCard";

export default function HomePage(): ReactNode {
  const sampleEvents: Record<string, EventInfo[]> = {
    "2026-01-28": [
      {
        name: "Main Campus All Day Volunteer",
        date: new Date("2026-01-28"),
        slotsRemaining: 6,
        time: "3 PM - 6 PM",
        address: "1317 Connecticut Avenue Knoxville Tennessee 37921",
        description: "All Day Volunteer (3 hours)",
      },
      {
        name: "Papermill All Day Volunteer",
        date: new Date("2026-01-28"),
        slotsRemaining: 3,
        time: "3 PM - 6 PM",
        address: "1501 Kirby Road Knoxville, TN 37909",
        description: "All Day Volunteer (3 hours)",
      },
      {
        name: "West View All Day Volunteer",
        date: new Date("2026-01-28"),
        slotsRemaining: 6,
        time: "3 PM - 6 PM",
        address: "2510 Belmont Heights Ave Knoxville TN",
        description: "All Day Volunteer (3 hours)",
      },
      {
        name: "Westland All Afternoon Volunteer",
        date: new Date("2026-01-28"),
        slotsRemaining: 4,
        time: "4:20 PM - 4:45 PM",
        address:
          "Cornerstone Church of Knoxville, Heritage Lake Boulevard, Knoxville, TN, USA",
        description: "All Afternoon Volunteer (25 minutes)",
      },
      {
        name: "Westland Homework Helper",
        date: new Date("2026-01-28"),
        slotsRemaining: 20,
        time: "4:20 PM - 4:45 PM",
        address:
          "Cornerstone Church of Knoxville, Heritage Lake Boulevard, Knoxville, TN, USA",
        description: "Homework Helper (25 minutes)",
      },
      {
        name: "Papermill Homework through Dinner Helper",
        date: new Date("2026-01-28"),
        slotsRemaining: 2,
        time: "4:25 PM - 6 PM",
        address: "1501 Kirby Road Knoxville, TN 37909",
        description: "Homework through Dinner Helper (1.58 hours)",
      },
    ],

    "2026-01-29": [
      {
        name: "Westland All Day Volunteer",
        date: new Date("2026-01-29"),
        slotsRemaining: 15,
        time: "3 PM - 5:45 PM",
        address:
          "Cornerstone Church of Knoxville, Heritage Lake Boulevard, Knoxville, TN, USA",
        description: "All Day Volunteer (2.75 hours)",
      },
      {
        name: "Main Campus All Day Volunteer",
        date: new Date("2026-01-29"),
        slotsRemaining: 5,
        time: "3 PM - 6 PM",
        address: "1317 Connecticut Avenue Knoxville Tennessee 37921",
        description: "All Day Volunteer (3 hours)",
      },
      {
        name: "Papermill All Day Volunteer",
        date: new Date("2026-01-29"),
        slotsRemaining: 1,
        time: "3 PM - 6 PM",
        address: "1501 Kirby Road Knoxville, TN 37909",
        description: "All Day Volunteer (3 hours)",
      },
      {
        name: "West View All Day Volunteer",
        date: new Date("2026-01-29"),
        slotsRemaining: 6,
        time: "3 PM - 6 PM",
        address: "2510 Belmont Heights Ave Knoxville TN",
        description: "All Day Volunteer (3 hours)",
      },
      {
        name: "Westland Homework Helper",
        date: new Date("2026-01-29"),
        slotsRemaining: 6,
        time: "4:20 PM - 4:45 PM",
        address:
          "Cornerstone Church of Knoxville, Heritage Lake Boulevard, Knoxville, TN, USA",
        description: "Homework Helper (25 minutes)",
      },
      {
        name: "Papermill Homework through Dinner Helper",
        date: new Date("2026-01-29"),
        slotsRemaining: 2,
        time: "4:25 PM - 6 PM",
        address: "1501 Kirby Road Knoxville, TN 37909",
        description: "Homework through Dinner Helper (1.58 hours)",
      },
      {
        name: "West View Tutoring",
        date: new Date("2026-01-29"),
        slotsRemaining: 3,
        time: "4:30 PM - 5 PM",
        address: "2510 Belmont Heights Ave Knoxville TN",
        description: "Tutoring (30 minutes)",
      },
      {
        name: "Main Campus Elective Leader",
        date: new Date("2026-01-29"),
        slotsRemaining: 4,
        time: "4:35 PM - 5:15 PM",
        address: "1317 Connecticut Avenue Knoxville Tennessee 37921",
        description: "Elective Leader (40 minutes)",
      },
      {
        name: "West View Elective Leader",
        date: new Date("2026-01-29"),
        slotsRemaining: 3,
        time: "5 PM - 5:30 PM",
        address: "2510 Belmont Heights Ave Knoxville TN",
        description: "Elective Leader (30 minutes)",
      },
    ],

    "2026-01-30": [
      {
        name: "Westland Fun Friday Volunteer",
        date: new Date("2026-01-30"),
        slotsRemaining: 3,
        time: "3 PM - 5:45 PM",
        address:
          "Cornerstone Church of Knoxville, Heritage Lake Boulevard, Knoxville, TN, USA",
        description: "Fun Friday Volunteer (2.75 hours)",
      },
      {
        name: "Main Campus Fun Friday",
        date: new Date("2026-01-30"),
        slotsRemaining: 4,
        time: "3 PM - 6 PM",
        address: "1317 Connecticut Avenue Knoxville Tennessee 37921",
        description: "Fun Friday (3 hours)",
      },
      {
        name: "Papermill Fun Fridays!",
        date: new Date("2026-01-30"),
        slotsRemaining: 3,
        time: "3 PM - 6 PM",
        address: "1501 Kirby Road Knoxville, TN 37909",
        description: "Fun Friday (3 hours)",
      },
      {
        name: "West View All Day Volunteer",
        date: new Date("2026-01-30"),
        slotsRemaining: 6,
        time: "3 PM - 6 PM",
        address: "2510 Belmont Heights Ave Knoxville TN",
        description: "All Day Volunteer (3 hours)",
      },
    ],
  };

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

        {Object.entries(sampleEvents).map(([date, events]) => (
          <VolunteerEventCard key={date} date={date} events={events} />
        ))}
      </Box>
    </div>
  );
}
