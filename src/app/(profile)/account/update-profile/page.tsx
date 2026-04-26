import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import getUserSession from "@/utils/auth/get-user-session";

import UpdateProfileForm from "./UpdateProfileForm";

export default async function UpdateProfilePage(): Promise<React.ReactElement> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    notFound();
  }

  const info = await db.query.userInfo.findFirst({
    where: eq(userInfo.userId, session.user.id),
  });

  if (!info) {
    notFound();
  }

  return (
    <UpdateProfileForm
      initialValues={{
        firstName: info.firstName,
        lastName: info.lastName,
        addressLine1: info.addressLine1,
        addressLine2: info.addressLine2 ?? null,
        city: info.city,
        state: info.state,
        postalCode: info.postalCode,
        country: info.country,
        phoneNumber: info.phoneNumber,
        birthMonth: info.birthMonth,
        birthDay: info.birthDay,
        birthYear: info.birthYear,
        preferredNeighborhood: info.preferredNeighborhood,
        gender: info.gender,
        shirtSize: info.shirtSize,
        referralSource: info.referralSource,
        medicalNotes: info.medicalNotes ?? null,
      }}
    />
  );
}
