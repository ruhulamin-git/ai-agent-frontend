// Token management utility — uses cookies for auth flow (matches app's main auth config)
import { getCookie } from "cookies-next";

// Must match the constant from src/utils/constants.ts
const ASSESS_TOKEN = "nextjs_access_token";

export const getToken = () => {
  if (typeof window !== "undefined") {
    try {
      const token = getCookie(ASSESS_TOKEN);
      return token || null;
    } catch (_e) {
      console.warn("Failed to retrieve token from cookies", _e);
      return null;
    }
  }
  return null;
};

export const setToken = (newToken) => {
  if (typeof window !== "undefined") {
    try {
      // Token is managed by the main auth interceptor
      console.warn("Token should be set through the main auth system, not directly");
    } catch (_e) {
      // ignore
    }
  }
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    try {
      // Token is managed by the main auth system
      console.warn("Token should be cleared through the main auth system");
    } catch (_e) {
      // ignore
    }
  }
};

export const loadTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const token = getCookie(ASSESS_TOKEN);
      if (token) {
        return token;
      }
    } catch (_e) {
      // ignore
    }
  }
  return null;
};

export default {
  getToken,
  setToken,
  clearToken,
  loadTokenFromStorage,
};
