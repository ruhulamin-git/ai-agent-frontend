"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import { useOAuthCallback } from "@/modules/marketplace/connections/hooks";

const CallbackHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestMade = useRef(false);
  const { processOAuthCallback, isConnecting } = useOAuthCallback();

  const code = searchParams.get("code");

  useEffect(() => {
    if (requestMade.current) return;

    if (code) {
      requestMade.current = true;
      const success = processOAuthCallback(code);

      if (!success) {
        // No pending integration found — redirect back
        router.push("/dashboard/connections");
      } else {
        // Redirect after a short delay to allow the mutation to complete
        const timer = setTimeout(() => {
          router.push("/dashboard/connections");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      // No code in URL — redirect back
      router.push("/dashboard/connections");
    }
  }, [code, processOAuthCallback, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {isConnecting ? "Connecting your account..." : "Processing authentication..."}
      </p>
    </div>
  );
};

const IntegrationCallbackPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
};

export default IntegrationCallbackPage;
