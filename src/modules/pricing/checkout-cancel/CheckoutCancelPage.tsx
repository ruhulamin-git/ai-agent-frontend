"use client";

import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";

export const CheckoutCancelPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Cancel Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle size={40} className="text-red-500" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h1 className="text-3xl font-bold text-foreground">Checkout Canceled</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            Your payment process was canceled and you have not been charged. You can safely return
            to the dashboard or try again.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <Button
            onClick={() => router.push("/dashboard/pricing")}
            className="rounded-xl font-semibold gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl font-semibold gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
