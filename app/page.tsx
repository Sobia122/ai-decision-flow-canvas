"use client";

import React, { useState, useCallback } from "react";
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
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DecisionNode } from "@/components/DecisionNode";
import { Plus, Play, Loader2, Terminal, Trash2, Download } from "lucide-react";

const nodeTypes = {
  decision: DecisionNode,
};

const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "decision",
    position: { x: 250, y: 100 },
    data: {
      label: "Support Check",
      prompt: "Is this query related to software technical support?",
    },
  },
];

export default function FlowEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Update prompt inside Node Data
  const handlePromptChange = useCallback((id: string, newPrompt: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, prompt: newPrompt },
          };
        }
        return node;
      })
    );
  }, []);

  // React Flow Listeners
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const isYes = params.sourceHandle === "yes";
        const customEdge = {
          ...params,
          animated: true,
          style: {
            stroke: isYes ? "#10b981" : "#f43f5e",
            strokeWidth: 2,
          },
          label: isYes ? "YES" : "NO",
          labelStyle: { fill: isYes ? "#10b981" : "#f43f5e", fontWeight: 700 },
        };
        return addEdge(customEdge, eds);
      }),
    []
  );

  // Add new Decision Node
  const addNode = () => {
    const newNodeId = `node-${nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      type: "decision",
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: {
        label: `Decision ${nodes.length + 1}`,
        prompt: "",
        onChangePrompt: handlePromptChange,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Export JSON Function
  const exportWorkflow = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "workflow.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Trigger Inngest Workflow Execution
  const handleExecute = async () => {
    setIsExecuting(true);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}]  Triggering Inngest AI Workflow...`]);

    try {
      const res = await fetch("/api/execute-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await res.json();
      if (data.success) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}]  Event dispatched successfully (ID: ${data.eventId})`,
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}]  Execution Failed: ${data.error}`,
        ]);
      }
    } catch (err: any) {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}]  Network Error: ${err.message}`,
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="text-white font-bold tracking-wide">AI Decision Flow Canvas</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addNode}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Add Decision Node
          </button>
          <button
            onClick={exportWorkflow}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isExecuting ? "Executing..." : "Execute Flow"}
          </button>
        </div>
      </header>

      {/* Main Canvas & Logs Layout */}
      <div className="flex-1 flex w-full h-[calc(100vh-4rem)] relative overflow-hidden">
        {/* React Flow Editor */}
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              data: { ...node.data, onChangePrompt: handlePromptChange },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#334155" variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800 !text-white fill-white" />
          </ReactFlow>
        </div>

        {/* Execution Logs Drawer Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/90 backdrop-blur flex flex-col h-full">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-blue-400" /> Execution Logs
            </div>
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="text-slate-600 italic text-center mt-10">
                Click "Execute Flow" to view execution traces.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-950 border border-slate-800/80 text-slate-300 leading-relaxed break-words"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}