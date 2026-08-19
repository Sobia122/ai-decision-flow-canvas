"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DecisionNode } from "./ui/nodes/DecisionNode";
import { Button } from "@/components/ui/button";
import { Play, Download, Plus } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "decision",
    position: { x: 250, y: 100 },
    data: { label: "Start Node", prompt: "Is this query related to software technical support?", status: "IDLE" },
  },
  {
    id: "2",
    type: "decision",
    position: { x: 50, y: 320 },
    data: { label: "Support Branch", prompt: "Does the issue involve critical server outage?", status: "IDLE" },
  },
  {
    id: "3",
    type: "decision",
    position: { x: 450, y: 320 },
    data: { label: "Sales Branch", prompt: "Is the user asking for enterprise pricing discounts?", status: "IDLE" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", sourceHandle: "YES", target: "2", label: "YES", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e1-3", source: "1", sourceHandle: "NO", target: "3", label: "NO", animated: true, style: { stroke: "#f43f5e", strokeWidth: 2 } },
];

export default function FlowEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const nodeTypes = useMemo(() => ({ decision: DecisionNode }), []);

  const handlePromptChange = useCallback((id: string, prompt: string) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, prompt } } : node))
    );
  }, []);

  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: { ...n.data, onChangePrompt: handlePromptChange },
      })),
    [nodes, handlePromptChange]
  );

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect: OnConnect = useCallback((params) => {
    const isYes = params.sourceHandle === "YES";
    const customEdge = {
      ...params,
      label: params.sourceHandle,
      animated: true,
      style: { stroke: isYes ? "#10b981" : "#f43f5e", strokeWidth: 2 },
    };
    setEdges((eds) => addEdge(customEdge, eds));
  }, []);

  const addNode = () => {
    const newId = String(nodes.length + 1);
    const newNode: Node = {
      id: newId,
      type: "decision",
      position: { x: 250 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: { label: `Node ${newId}`, prompt: "Is this condition true?", status: "IDLE" },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const triggerWorkflow = async () => {
    setIsRunning(true);
    setLogs([]);

    try {
      const res = await fetch("/api/run-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges, startNodeId: "1" }),
      });
      const data = await res.json();
      setLogs(data.logs || []);

      if (data.logs) {
        setNodes((nds) =>
          nds.map((node) => {
            const step = data.logs.find((l: any) => l.nodeId === node.id);
            return step
              ? { ...node, data: { ...node.data, status: step.decision } }
              : { ...node, data: { ...node.data, status: "IDLE" } };
          })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const exportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ nodes, edges }))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "workflow.json");
    downloadAnchor.click();
  };

  return (
    <div className="flex h-screen w-full bg-slate-100">
      <div className="flex-1 h-full relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white/80 backdrop-blur p-2 rounded-lg border shadow-sm">
          <Button onClick={addNode} size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add Step</Button>
          <Button onClick={triggerWorkflow} disabled={isRunning} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Play className="w-4 h-4 mr-1" /> {isRunning ? "Executing..." : "Run Flow"}
          </Button>
          <Button onClick={exportJSON} size="sm" variant="ghost"><Download className="w-4 h-4 mr-1" /> Export JSON</Button>
        </div>

        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="w-80 h-full border-l bg-white p-4 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-sm mb-4 border-b pb-2">Execution Logs</h3>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400">Click &quot;Run Flow&quot; to execute nodes with Inngest + Gemini.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Node #{log.nodeId}</span>
                  <span className={log.decision === "YES" ? "text-emerald-600" : "text-rose-600"}>{log.decision}</span>
                </div>
                <p className="text-slate-600 italic">&quot;{log.prompt}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}