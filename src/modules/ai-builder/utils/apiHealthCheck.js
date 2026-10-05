import { baseURL } from "@/modules/ai-builder/store/constant";
import { axios as sharedAxios } from "@/utils/axios";

export const checkApiHealth = async () => {
  try {
    const response = await sharedAxios.get(`${baseURL}/api/v1/health`, { withCredentials: true });
    return response?.status === 200;
  } catch (error) {
    console.error("API Health Check Failed:", error);
    return false;
  }
};

export const getApiStatus = () => {
  return {
    baseURL,
    isConfigured: !!baseURL,
    hasToken: false, // static token deprecated; use login cookies
    expectedPort: "8080",
    currentURL: typeof window !== "undefined" ? window.location.origin : "unknown",
  };
};
