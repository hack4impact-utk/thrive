"use client";
import { ReactNode } from "react";

import OutlinedCard from "@/components/account-creation/index";
import SignUpCard from "@/components/sign-up-card";
import VolunteerEventCard from "@/components/VolunteerEventCard";

export default function HomePage(): ReactNode {
  return (
    <div>
      <SignUpCard />
      <h1>hello</h1>
      <VolunteerEventCard />
      <OutlinedCard />
    </div>
  );
}
