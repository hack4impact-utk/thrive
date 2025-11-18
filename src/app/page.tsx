"use client";
import { ReactNode } from "react";

import VolunteerEventCard from "@/components/VolunteerEventCard";
import OutlinedCard from "@/components/account-creation/index";

export default function HomePage(): ReactNode {
  return (
    <div>
      <h1>hello</h1>
      <VolunteerEventCard />
      <OutlinedCard />
    </div>
  );
}
