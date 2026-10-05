// User agent specific types based on API response structure
export interface UserAgentResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: UserAgent[];
  errors: unknown;
  pagination: {
    currentPage: number;
    numPages: number;
    pageSize: number;
    totalCount: number;
  };
}

export interface UserAgent {
  id: number;
  name: string;
  agent: {
    id: number;
    name: string;
    description: string;
    agentType: string;
    iconUrl: string | null;
  };
  status: string;
  isActive: boolean;
  embedCodeIdentifier: string | null;
  lastMessageAt: string | null;
  messageCount: number;
  businessContext: string;
  instructions: string;
  integrations: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface UseUserAgentsOptions {
  search?: string;
  status?: string;
  enabled?: boolean;
  config?: unknown;
}

// Payload for updating a user agent
export interface UpdateUserAgentPayload {
  name?: string;
  isActive?: boolean;
  businessContext?: string;
  instructions?: string;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Chat conversation type (from /api/ai-agents/v1/user-agents/{id}/chat-history/)
export interface ConversationLastMessage {
  id: number;
  content: string;
  direction: "inbound" | "outbound";
  createdAt: string;
}

export interface Conversation {
  id: number;
  platformConversationId: string;
  conversationType: string;
  participantId: string;
  participantName: string;
  participantPhone: string | null;
  participantEmail: string | null;
  status: string;
  isActive: boolean;
  lastMessageAt: string | null;
  lastMessage: ConversationLastMessage | null;
  unreadCount: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  data: Conversation[];
  pagination: {
    currentPage: number;
    numPages: number;
    pageSize: number;
    totalCount: number;
  };
}

// Chat message type (from /api/ai-agents/v1/user-agents/{id}/chat-history/{conversationId}/messages/)
export interface ConversationMessage {
  id: number;
  direction: "inbound" | "outbound";
  messageType: string;
  content: string;
  senderName: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessagesResponse {
  data: ConversationMessage[];
  pagination: {
    currentPage: number;
    numPages: number;
    pageSize: number;
    totalCount: number;
  };
}

// WebSocket new_message event
export interface NewMessageSocketEvent {
  type: "new_message";
  data: {
    conversationId: number;
    messageId: number;
    content: string;
    direction: "inbound" | "outbound";
    messageType: string;
    createdAt: string;
    status: string;
  };
}
