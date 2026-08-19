import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  try {
    const { nodes, edges } = await req.json();

    if (!nodes || nodes.length === 0) {
      return NextResponse.json({ error: "No nodes found in canvas" }, { status: 400 });
    }

    // Root node find karein (jis par koi input connection na ho)
    const targetNodeIds = new Set(edges.map((e: any) => e.target));
    const startNode = nodes.find((n: any) => !targetNodeIds.has(n.id)) || nodes[0];

    // Inngest workflow trigger karein
    const event = await inngest.send({
      name: "workflow/run",
      data: {
        startNodeId: startNode.id,
        nodes,
        edges,
        prompt: startNode.data.prompt,
      },
    });

    return NextResponse.json({ success: true, eventId: event.ids[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}