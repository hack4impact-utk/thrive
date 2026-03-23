import { addUserToWelcomeFlow } from "@/lib/email/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const firstName = String(body?.firstName ?? "").trim();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const result = await addUserToWelcomeFlow(email, firstName);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("messAuto error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}