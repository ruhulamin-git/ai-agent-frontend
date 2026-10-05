import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

import { useSocket } from "@/shared/hooks/useSocket";
import { buildWebSocketUrl } from "@/utils";
import { REFRESH_TOKEN } from "@/utils/constants";

import type { NotificationItem } from "@/shared/base-layout/notifications/types";
import type { WebSocketMessage } from "@/types/websocket";

export const useSocketNotifications = () => {
  const token = getCookie(REFRESH_TOKEN) as string;
  const [isPageVisible, setIsPageVisible] = useState(true);

  const [socketNotifications, setSocketNotifications] = useState<NotificationItem | null>(null);

  // Track page visibility to pause connections when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSocketMessage = (message: WebSocketMessage) => {
    if (message.data) {
      setSocketNotifications(message.data as unknown as NotificationItem);
    } else {
      console.warn("Invalid WebSocket message data:", message.data);
    }
  };

  const { isConnected, isConnecting, error, connect, disconnect } = useSocket({
    url: buildWebSocketUrl("notifications", token),
    onMessage: handleSocketMessage,
    onError: (error) => {
      console.error("WebSocket error for notifications:", error);
    },
    reconnectAttempts: 2,
    reconnectInterval: 5000,
  });

  useEffect(() => {
    // Connect when page is visible, disconnect when hidden
    if (isPageVisible) {
      connect();
    } else if (isConnected) {
      disconnect();
    }
  }, [token, isPageVisible, isConnected, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    socketNotifications,
  };
};
