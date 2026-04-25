import { NextRequest, NextResponse } from "next/server";

import { processDueEmailReminders } from "@/lib/email-reminders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const bearer = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");

  return bearer === `Bearer ${secret}` || headerSecret === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processDueEmailReminders();
  return NextResponse.json(result);
}

export const POST = GET;
