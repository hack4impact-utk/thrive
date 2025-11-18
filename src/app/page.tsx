"use client";
import { ReactNode } from "react";

import SignUpCard from "@/components/sign-up-card";
import OutlinedCard from "@/components/account-creation/index";
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
