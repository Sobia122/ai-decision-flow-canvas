import { inngest } from "./client";

export const runDecisionFlow = inngest.createFunction(
  { id: "run-decision-flow" },
  { event: "workflow/run" },
  async ({ event, step }) => {
    const { nodes, edges, startNodeId } = event.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error("GEMINI_API_KEY missing");

    let currentNodeId = startNodeId || nodes[0]?.id;
    const executionPath: Array<{ nodeId: string; prompt: string; decision: string }> = [];

    // Continuous dynamic execution loop based on graph edges
    while (currentNodeId) {
      const currentNode = nodes.find((n: any) => n.id === currentNodeId);
      if (!currentNode) break;

      const prompt = currentNode.data?.prompt || "Is this valid?";

      // Step execution
      const decision = await step.run(`evaluate-${currentNodeId}`, async () => {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Analyze this prompt and reply strictly with YES or NO: ${prompt}` }] }],
            }),
          }
        );

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase() || "NO";
        return responseText.includes("YES") ? "YES" : "NO";
      });

      executionPath.push({ nodeId: currentNodeId, prompt, decision });

      // Find next node based on edge source handle (yes/no)
      const targetEdge = edges.find(
        (e: any) => e.source === currentNodeId && e.sourceHandle?.toUpperCase() === decision
      );

      currentNodeId = targetEdge ? targetEdge.target : null;
    }

    return { success: true, path: executionPath };
  }
);