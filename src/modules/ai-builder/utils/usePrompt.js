import { useCallback, useEffect } from "react";

// https://stackoverflow.com/questions/71572678/react-router-v-6-useprompt-typescript
// Modified for Next.js compatibility

export function useBlocker(blocker, when = true) {
  useEffect(() => {
    if (!when) return;

    // For Next.js, we'll use beforeunload event instead of React Router's navigator.block
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, [blocker, when]);
}

export function usePrompt(message, when = true) {
  const blocker = useCallback(() => {
    // Simple confirmation for Next.js
    return window.confirm(message);
  }, [message]);

  useBlocker(blocker, when);
}
