import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  const body = await req.json();

  const { ids } = await inngest.send({
    name: "workflow/run",
    data: body,
  });

  return NextResponse.json({ success: true, eventId: ids[0] });
}