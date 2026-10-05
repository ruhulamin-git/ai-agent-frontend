import type { Edge, Node } from "@xyflow/react";

// Studio agent entity
interface StudioAgent {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published";
  nodesCount: number;
  lastModified: string;
}

// Studio agent detail with flow data
interface StudioAgentDetail extends StudioAgent {
  nodes: Node[];
  edges: Edge[];
}

// DTO for creating a studio agent
interface CreateStudioAgentDTO {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

// DTO for updating a studio agent
interface UpdateStudioAgentDTO {
  name?: string;
  description?: string;
  status?: "draft" | "published";
  nodes?: Node[];
  edges?: Edge[];
}

// Options for the list query hook
interface UseStudioAgentsListOptions {
  search?: string;
  enabled?: boolean;
}

export type {
  CreateStudioAgentDTO,
  StudioAgent,
  StudioAgentDetail,
  UpdateStudioAgentDTO,
  UseStudioAgentsListOptions,
};
