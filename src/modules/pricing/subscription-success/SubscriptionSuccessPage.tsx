"use client";

import { IconCheck, IconCrown, IconHome, IconLayoutDashboard } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";

export const SubscriptionSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <IconCheck size={40} className="text-green-500" stroke={3} />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-700 delay-200">
              <IconCrown size={20} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h1 className="text-3xl font-bold text-foreground">Subscription Activated!</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            Your plan has been successfully upgraded. All new features are now available in your
            account.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <Button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl font-semibold gap-2"
          >
            <IconLayoutDashboard size={18} />
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="rounded-xl font-semibold gap-2"
          >
            <IconHome size={18} />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};
