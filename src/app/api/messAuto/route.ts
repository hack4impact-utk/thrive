import { NextResponse } from "next/server";

import { addUserToWelcomeFlow } from "@/lib/email/email";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const firstName = String(body?.firstName ?? "").trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const result = await addUserToWelcomeFlow(email, firstName);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("messAuto error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
