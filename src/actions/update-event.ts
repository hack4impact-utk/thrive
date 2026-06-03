"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { events } from "@/db/schema/events";

type Payload = {
  id: string;
  title: string;
  description: string;
  capacity: number | null;
};

export async function updateEvent(data: Payload): Promise<void> {
  const { id, title, description, capacity } = data;

  await db
    .update(events)
    .set({ title, description, capacity })
    .where(eq(events.id, id));

  revalidatePath(`/dashboard/events-library/${id}`);
}
