"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { events } from "@/db/schema/events";

export async function deleteEvent(id: string): Promise<void> {
  await db.update(events).set({ deleted: true }).where(eq(events.id, id));
  revalidatePath("/dashboard/events-library");
}
