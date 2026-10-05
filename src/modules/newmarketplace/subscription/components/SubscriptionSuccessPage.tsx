"use client";

import { useRouter } from "next/navigation";

import { SectionContainer } from "@/shared/components";

export const SubscriptionSuccessPage = () => {
  const router = useRouter();
  const handleViewDashboard = () => {
    router.push("/");
  };

  return (
    <SectionContainer>
      <div className="min-h-screen flex justify-center items-center">
        <div className="">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-white mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-400">
              Thank you for your subscription. You now have access to your selected agent.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleViewDashboard}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 rounded-md text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Go To Home
              </div>
            </button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
