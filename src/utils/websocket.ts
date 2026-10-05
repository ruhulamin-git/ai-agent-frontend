import { WEBSOCKET_BASE_URL } from "@/config";

export const buildWebSocketUrl = (endpoint: string, token?: string): string => {
  const baseUrl = WEBSOCKET_BASE_URL?.replace(/\/$/, "") || "";
  if (!baseUrl) return "";

  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${baseUrl}/ws/${cleanEndpoint}/`;

  if (token) {
    return `${url}?token=${encodeURIComponent(token)}`;
  }
  return url;
};
