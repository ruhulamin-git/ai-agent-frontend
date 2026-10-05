import type { StudioAgent } from "../types";
import type { Edge, Node } from "@xyflow/react";

// Mock data — replace with API response when backend is ready
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

const MOCK_AGENTS: StudioAgent[] = [
  {
    id: "agent-1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries with sentiment analysis and routing logic.",
    status: "published",
    nodesCount: 5,
    lastModified: "2 hours ago",
  },
  {
    id: "agent-2",
    name: "Lead Qualifier",
    description: "Qualifies inbound leads and routes to the correct sales rep.",
    status: "draft",
    nodesCount: 3,
    lastModified: "1 day ago",
  },
  {
    id: "agent-3",
    name: "Email Responder",
    description: "Automated email responses with context-aware replies.",
    status: "published",
    nodesCount: 7,
    lastModified: "3 days ago",
  },
  {
    id: "agent-4",
    name: "Knowledge Base Assistant",
    description: "Answers questions from your internal knowledge base using vector search.",
    status: "draft",
    nodesCount: 4,
    lastModified: "1 week ago",
  },
];

const MOCK_AGENT_FLOWS: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  "agent-1": {
    nodes: [
      {
        id: "entry-1",
        type: "entry",
        position: { x: 100, y: 100 },
        data: getDefaultData("entry", "User Query"),
      },
      {
        id: "prompt-1",
        type: "prompt",
        position: { x: 400, y: 100 },
        data: getDefaultData("prompt", "Sentiment Analysis"),
      },
      {
        id: "logic-1",
        type: "logic",
        position: { x: 700, y: 100 },
        data: getDefaultData("logic", "Route by Sentiment"),
      },
      {
        id: "email-1",
        type: "email",
        position: { x: 1000, y: 50 },
        data: getDefaultData("email", "Send Report"),
      },
      {
        id: "api-1",
        type: "apiTool",
        position: { x: 1000, y: 250 },
        data: getDefaultData("apiTool", "Log to CRM"),
      },
    ],
    edges: [
      {
        id: "e1",
        source: "entry-1",
        target: "prompt-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "prompt-1",
        target: "logic-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "logic-1",
        target: "email-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "logic-1",
        target: "api-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
    ],
  },
  "agent-2": {
    nodes: [
      {
        id: "entry-1",
        type: "entry",
        position: { x: 100, y: 150 },
        data: getDefaultData("entry", "Inbound Lead"),
      },
      {
        id: "prompt-1",
        type: "prompt",
        position: { x: 400, y: 150 },
        data: getDefaultData("prompt", "Qualify Lead"),
      },
      {
        id: "logic-1",
        type: "logic",
        position: { x: 700, y: 150 },
        data: getDefaultData("logic", "Score Threshold"),
      },
    ],
    edges: [
      {
        id: "e1",
        source: "entry-1",
        target: "prompt-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "prompt-1",
        target: "logic-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
    ],
  },
  "agent-3": {
    nodes: [
      {
        id: "entry-1",
        type: "entry",
        position: { x: 100, y: 100 },
        data: getDefaultData("entry", "Incoming Email"),
      },
      {
        id: "prompt-1",
        type: "prompt",
        position: { x: 400, y: 50 },
        data: getDefaultData("prompt", "Analyze Intent"),
      },
      {
        id: "prompt-2",
        type: "prompt",
        position: { x: 400, y: 250 },
        data: getDefaultData("prompt", "Generate Reply"),
      },
      {
        id: "logic-1",
        type: "logic",
        position: { x: 700, y: 50 },
        data: getDefaultData("logic", "Priority Router"),
      },
      {
        id: "email-1",
        type: "email",
        position: { x: 700, y: 250 },
        data: getDefaultData("email", "Send Reply"),
      },
      {
        id: "vectordb-1",
        type: "vectorDB",
        position: { x: 100, y: 300 },
        data: getDefaultData("vectorDB", "FAQ Knowledge"),
      },
      {
        id: "model-1",
        type: "model",
        position: { x: 1000, y: 150 },
        data: getDefaultData("model", "GPT-4o"),
      },
    ],
    edges: [
      {
        id: "e1",
        source: "entry-1",
        target: "prompt-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "entry-1",
        target: "prompt-2",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "prompt-1",
        target: "logic-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "prompt-2",
        target: "email-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
    ],
  },
  "agent-4": {
    nodes: [
      {
        id: "entry-1",
        type: "entry",
        position: { x: 100, y: 150 },
        data: getDefaultData("entry", "User Question"),
      },
      {
        id: "vectordb-1",
        type: "vectorDB",
        position: { x: 400, y: 100 },
        data: getDefaultData("vectorDB", "Knowledge Base"),
      },
      {
        id: "prompt-1",
        type: "prompt",
        position: { x: 700, y: 150 },
        data: getDefaultData("prompt", "Answer from Context"),
      },
      {
        id: "model-1",
        type: "model",
        position: { x: 400, y: 300 },
        data: getDefaultData("model", "GPT-4o"),
      },
    ],
    edges: [
      {
        id: "e1",
        source: "entry-1",
        target: "vectordb-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "vectordb-1",
        target: "prompt-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "model-1",
        target: "prompt-1",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
      },
    ],
  },
};

export { getDefaultData, MOCK_AGENT_FLOWS, MOCK_AGENTS };
