"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  ReactFlow,
  type ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useCreateAgent } from "@/modules/studio/manage-agents/services/createAgent";
import { useUserAgentDetail } from "@/modules/studio/manage-agents/services/getAgentDetail";
import { useUpdateAgent } from "@/modules/studio/manage-agents/services/updateAgent";

// Default data generator for new nodes in the builder
const getDefaultData = (type: string, label: string): Record<string, unknown> => {
  switch (type) {
    case "entry":
      return { label: label || "User Query", trigger: "Triggers on User Input via Chat Widget" };
    case "prompt":
      return {
        label: label || "Prompt Block",
        prompt: "You are an expert analyzer. Output strictly formatted JSON.",
        model: "GPT-4o",
        outputVar: "result_json",
        temperature: 0.7,
      };
    case "logic":
      return { label: label || "Routing Logic", conditions: ['If "Positive"', "Else"] };
    case "apiTool":
      return { label: label || "API Tool", method: "GET", endpoint: "/api/endpoint" };
    case "model":
      return { label: label || "Model Selector", model: "GPT-4o", temperature: 0.7 };
    case "vectorDB":
      return { label: label || "Vector DB", collection: "default" };
    case "email":
      return { label: label || "Email Out", recipient: "{{recipient}}" };
    default:
      return { label };
  }
};

import { APIToolNode } from "./nodes/APIToolNode";
import { EmailNode } from "./nodes/EmailNode";
import { EntryNode } from "./nodes/EntryNode";
import { LogicNode } from "./nodes/LogicNode";
import { ModelNode } from "./nodes/ModelNode";
import { PromptNode } from "./nodes/PromptNode";
import { VectorDBNode } from "./nodes/VectorDBNode";
import { BlockPalette } from "./BlockPalette";
import { BuilderHeader } from "./BuilderHeader";
import { NodePropertiesPanel } from "./NodePropertiesPanel";

import "@xyflow/react/dist/style.css";

export interface AgentBuilderPageProps {
  agentId?: string;
  agentName?: string;
}

// Register custom node types
const nodeTypes = {
  entry: EntryNode,
  prompt: PromptNode,
  logic: LogicNode,
  apiTool: APIToolNode,
  model: ModelNode,
  vectorDB: VectorDBNode,
  email: EmailNode,
};

// Default empty nodes for create mode
const defaultNodes: Node[] = [
  {
    id: "entry-1",
    type: "entry",
    position: { x: 100, y: 100 },
    data: getDefaultData("entry", "User Query"),
  },
];

const defaultEdges: Edge[] = [];

let nodeIdCounter = 10;
const getNodeId = () => `node-${nodeIdCounter++}`;

const AgentBuilderFlow = ({ agentId, agentName }: AgentBuilderPageProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isEditMode = !!agentId;

  // Use service hook for edit mode data
  const { data: agentDetail } = useUserAgentDetail({
    agentId: agentId ?? "",
    enabled: isEditMode,
  });

  const initialNodes = (agentDetail?.workflowDefinition?.nodes as Node[]) ?? defaultNodes;
  const initialEdges = (agentDetail?.workflowDefinition?.edges as Edge[]) ?? defaultEdges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editedName, setEditedName] = useState<string>(agentName || "New Agent");

  // Sync state when agentDetail loads/updates from API
  useEffect(() => {
    if (agentDetail) {
      const apiNodes = (agentDetail.workflowDefinition?.nodes as Node[]) ?? defaultNodes;
      const apiEdges = (agentDetail.workflowDefinition?.edges as Edge[]) ?? defaultEdges;
      setNodes(apiNodes);
      setEdges(apiEdges);
      if (agentDetail.name) {
        setEditedName(agentDetail.name);
      }
    }
  }, [agentDetail, setNodes, setEdges]);

  // API hooks
  const { mutate: createAgent, isPending: isCreating } = useCreateAgent();
  const { mutate: updateAgent, isPending: isUpdating } = useUpdateAgent();

  const isPending = isCreating || isUpdating;

  // Save handler — create or update agent
  const handleSave = useCallback(() => {
    const workflowDefinition = JSON.stringify({ nodes, edges });

    if (isEditMode && agentId) {
      updateAgent(
        {
          agentId,
          payload: { workflowDefinition, name: editedName },
        },
        {
          onSuccess: () => {
            toast.success("Agent updated successfully");
          },
        }
      );
    } else {
      createAgent(
        {
          name: editedName,
          description: "",
          welcomeMessage: "",
          workflowDefinition,
          tags: [],
          shortDescription: "",
          longDescription: "",
          demoUrl: "",
        },
        {
          onSuccess: () => {
            toast.success("Agent created successfully");
            router.push("/dashboard/ai-studio");
          },
        }
      );
    }
  }, [nodes, edges, isEditMode, agentId, editedName, createAgent, updateAgent, router]);

  // Handle name change from header
  const handleNameChange = useCallback((name: string) => {
    setEditedName(name);
  }, []);

  // Export workflow as JSON file
  const handleExport = useCallback(() => {
    const workflow = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editedName.replace(/\s+/g, "-").toLowerCase()}-workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Workflow exported successfully");
  }, [nodes, edges, editedName]);

  // Import workflow from JSON file
  const handleImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const workflow = JSON.parse(content) as { nodes?: Node[]; edges?: Edge[] };

          if (!Array.isArray(workflow.nodes)) {
            toast.error("Invalid file: missing nodes array");
            return;
          }

          setNodes(workflow.nodes);
          setEdges(workflow.edges ?? []);
          toast.success(`Imported ${String(workflow.nodes.length)} nodes successfully`);
        } catch {
          toast.error("Failed to parse JSON file");
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "var(--primary)", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  // Handle drag over canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop on canvas — create new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow-type");
      const label = event.dataTransfer.getData("application/reactflow-label");

      if (typeof type === "undefined" || !type) return;

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: getDefaultData(type, label),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handle node click to select
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data from properties panel
  const onNodeDataUpdate = useCallback(
    (id: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return { ...node, data: newData };
          }
          return node;
        })
      );
      // Update selectedNode reference
      setSelectedNode((prev) => (prev && prev.id === id ? { ...prev, data: newData } : prev));
    },
    [setNodes]
  );

  // Memoize node count for status bar
  const nodeCount = useMemo(() => nodes.length, [nodes]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-dvh w-dvw bg-background text-foreground font-sans overflow-hidden">
      <BuilderHeader
        agentName={agentDetail?.name ?? agentName}
        agentId={agentId}
        backUrl="/dashboard/ai-studio"
        isEditMode={isEditMode}
        onSave={handleSave}
        onNameChange={handleNameChange}
        isPending={isPending}
        onImport={handleImport}
        onExport={handleExport}
      />
      <div className="flex flex-1 overflow-hidden">
        <BlockPalette agentId={agentId} />

        {/* React Flow Canvas */}
        <div className="flex-1 relative flex flex-col" ref={reactFlowWrapper}>
          <ReactFlow
            className="flex-1"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "var(--primary)", strokeWidth: 2 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
            <Controls className="builder-controls" />
            <MiniMap
              className="builder-minimap"
              nodeColor={() => "var(--primary)"}
              maskColor="rgba(0, 0, 0, 0.6)"
            />
          </ReactFlow>

          {/* Footer Status Bar */}
          <div className="h-8 bg-card border-t border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4 text-[0.625rem] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>System Ready</span>
              </div>
              <span className="text-muted-foreground">Last saved: just now</span>
            </div>
            <div className="flex items-center gap-4 text-[0.625rem] text-muted-foreground">
              <span>{nodeCount} Nodes Active</span>
              <span>API Latency: 42ms</span>
            </div>
          </div>
        </div>

        {/* Node Properties Panel */}
        <NodePropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={onNodeDataUpdate}
        />
      </div>
    </div>
  );
};

export const AgentBuilderPage: React.FC<AgentBuilderPageProps> = ({ agentId, agentName }) => {
  return (
    <ReactFlowProvider>
      <AgentBuilderFlow agentId={agentId} agentName={agentName} />
    </ReactFlowProvider>
  );
};
