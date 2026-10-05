"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCurrentSubscription } from "@/modules/pricing/subscription-dashboard/service";
import { Skeleton } from "@/shared/ui/skeleton";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
  requireActiveSubscription?: boolean;
  showRedirectMessage?: boolean;
  allowFreePlan?: boolean;
}

/**
 * SubscriptionGuard Component
 * 
 * Protects routes that require an active developer subscription.
 * - If subscription is active: renders children
 * - If subscription is inactive/expired: redirects to redirectPath
 * - If loading: shows loading state
 * 
 * @param children - Content to render when authorized
 * @param redirectPath - Where to redirect if subscription is not active (default: "/user-dashboard")
 * @param requireActiveSubscription - Whether to require active subscription (default: true)
 * @param showRedirectMessage - Whether to show a message before redirecting (default: false)
 */
export const SubscriptionGuard = ({
  children,
  redirectPath = "/user-dashboard",
  requireActiveSubscription = true,
  showRedirectMessage = false,
  allowFreePlan = true,
}: SubscriptionGuardProps) => {
  const router = useRouter();
  const { data: subscription, isLoading, isError, refetch } = useCurrentSubscription({
    config: {
      retry: 2,
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache
      refetchOnMount: "always", // Always refetch on mount
      refetchOnWindowFocus: true, // Refetch on window focus
    },
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Don't check until data is loaded
    if (isLoading) return;

    // If there's an error, deny access
    if (isError) {
      setIsRedirecting(true);
      if (showRedirectMessage) {
        console.warn("Error fetching subscription. Redirecting to:", redirectPath);
      }
      const timer = setTimeout(() => {
        router.replace(redirectPath);
      }, 300);
      return () => clearTimeout(timer);
    }

    // If there's no subscription data at all, deny access
    if (!subscription) {
      setIsRedirecting(true);
      if (showRedirectMessage) {
        console.warn("No subscription found. Redirecting to:", redirectPath);
      }
      const timer = setTimeout(() => {
        router.replace(redirectPath);
      }, 300);
      return () => clearTimeout(timer);
    }

    // Check if subscription is active (triple validation)
    const isActive = subscription.isActive === true;
    const isNotExpired = subscription.isExpired === false;
    const statusActive = subscription.status?.status === "active";

    const isFreePlan = subscription.plan?.code === "free_plan";
    const subscriptionIsValid = isActive && isNotExpired && statusActive;
    const meetsPlanRequirement = allowFreePlan ? true : !isFreePlan;

    if (requireActiveSubscription && (!subscriptionIsValid || !meetsPlanRequirement)) {
      setIsRedirecting(true);
      if (showRedirectMessage) {
        console.warn("Subscription not active. Redirecting to:", redirectPath);
      }
      const timer = setTimeout(() => {
        router.replace(redirectPath);
      }, 300);
      return () => clearTimeout(timer);
    }

    // All checks passed
    setIsAuthorized(true);
  }, [subscription, isLoading, isError, requireActiveSubscription, router, redirectPath, showRedirectMessage]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  // Show redirecting state
  if (isRedirecting) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin">
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show content only if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Fallback - this shouldn't normally show as redirect happens first
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You need an active subscription to access this area.
        </p>
        <p className="text-sm text-muted-foreground">
          Visit the <a href="/start-building" className="text-primary hover:underline">pricing page</a> to subscribe.
        </p>
      </div>
    </div>
  );
};

