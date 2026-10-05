interface WebSocketMessage {
  data: {
    type: string;
    userId: number;
    isOnline: boolean;
  };
}

interface OutgoingWebSocketMessage {
  type: string;
  data?: Record<string, string | number | boolean | null>;
}

interface WebSocketConfig {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: OutgoingWebSocketMessage) => void;
}

export type { OutgoingWebSocketMessage, UseSocketReturn, WebSocketConfig, WebSocketMessage };
