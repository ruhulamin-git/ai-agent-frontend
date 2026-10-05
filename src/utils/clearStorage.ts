import { deleteCookie } from "cookies-next";

import credentialsApi from "@/modules/ai-builder/api/credentials";
import nodesApi from "@/modules/ai-builder/api/nodes";

import { ASSESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { queryClient } from "./reactQuery";

const clearStorage = () => {
  deleteCookie(ASSESS_TOKEN, { path: "/" });
  deleteCookie(REFRESH_TOKEN, { path: "/" });

  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Clear AI-Builder in-memory caches
  nodesApi.clearNodesCache();
  credentialsApi.clearCredentialsCache();

  queryClient.clear();
};

export { clearStorage };
