export interface OutgoingWebSocketMessage {
  [key: string]: unknown;
}

export interface WebSocketMessage {
  type?: string;
  data: unknown;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (event: Event) => void;
}

export interface UseSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: OutgoingWebSocketMessage) => void;
}
