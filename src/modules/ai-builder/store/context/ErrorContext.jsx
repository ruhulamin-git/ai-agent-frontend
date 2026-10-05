"use client";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [authRateLimitError, setAuthRateLimitError] = useState(null);
  const router = useRouter();

  const handleError = async (err) => {
    console.error(err);
    if (
      err?.response?.status === 429 &&
      err?.response?.data?.type === "authentication_rate_limit"
    ) {
      setAuthRateLimitError("You're making a lot of requests. Please wait and try again later.");
    } else if (
      err?.response?.status === 429 &&
      err?.response?.data?.type !== "authentication_rate_limit"
    ) {
      const retryAfterHeader = err?.response?.headers?.["retry-after"];
      let retryAfter = 60; // Default in seconds
      if (retryAfterHeader) {
        const parsedSeconds = parseInt(retryAfterHeader, 10);
        if (Number.isNaN(parsedSeconds)) {
          const retryDate = new Date(retryAfterHeader);
          if (!Number.isNaN(retryDate.getTime())) {
            retryAfter = Math.max(0, Math.ceil((retryDate.getTime() - Date.now()) / 1000));
          }
        } else {
          retryAfter = parsedSeconds;
        }
      }
      router.push("/rate-limited", { state: { retryAfter } });
    } else setError(err);
  };

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        handleError,
        authRateLimitError,
        setAuthRateLimitError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

ErrorProvider.propTypes = {
  children: PropTypes.any,
};
