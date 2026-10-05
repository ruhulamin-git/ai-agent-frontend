import { useState } from "react";

import { useError } from "@/modules/ai-builder/store/context/ErrorContext";

export default (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { setError, handleError } = useError();

  const request = async (...args) => {
    setLoading(true);
    try {
      const result = await apiFunc(...args);
      setData(result.data);
      setError(null);
      setApiError(null);
    } catch (err) {
      // Handle different types of errors
      let errorMessage = "Unexpected Error!";

      if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Network Error: Unable to connect to server. Please check if the server is running.";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage = "Connection refused: Server is not responding.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Only call handleError if err.response exists (API error with status code)
      if (err.response) {
        handleError(err);
      } else {
        // Network errors (no backend, timeout, etc.) — use warn to avoid Next.js error overlay
        console.warn("[API] Network error:", err.code, err.message);
      }

      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    error: apiError,
    data,
    loading,
    request,
  };
};
