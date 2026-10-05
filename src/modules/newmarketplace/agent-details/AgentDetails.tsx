"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { SectionContainer } from "@/shared/components";
import { axios } from "@/utils/axios";
import { ASSESS_TOKEN } from "@/utils/constants";
import { ROOT_API_URL } from "@/config";

import type { Agent, PricingPlan, UIAgent } from "../service/type";
import { getMyAgents } from "@/modules/newdashboard/user-dashboard/pages/my-agent/service/getMyAgent";

export interface AgentDetailsProps {
  agent: UIAgent;
  originalAgent?: Agent;
  onBack?: () => void;
}

export type TabType =
  | "info"
  | "install"
  | "reviews";

export const AgentDetails = ({ agent, originalAgent, onBack }: AgentDetailsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [subscribingPlanIds, setSubscribingPlanIds] = useState<Set<number>>(new Set());
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Check authentication by looking for access token
  const isAuthenticated = !!getCookie(ASSESS_TOKEN);

  const queryClient = useQueryClient();

  // Get user's active subscriptions to check if already subscribed
  const { data: myAgentsResponse } = useQuery({
    queryKey: ["myAgents", 1, 100],
    queryFn: () => getMyAgents({ page: 1, page_size: 100 }),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, agent.id]);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`${ROOT_API_URL}/api/marketplace/v1/agents/${agent.id}/reviews/`);
      const data = await response.json();
      if (data.status === "success") {
        setReviews(data.data || []);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Use pricing plans from originalAgent data
  const pricingPlans = originalAgent?.pricingPlans || (originalAgent as any)?.pricing_plans;

  // Function to handle subscription
  const handleSubscribe = async (plan: PricingPlan) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = "/auth/login";
      return;
    }

    // Add plan to subscribing set
    setSubscribingPlanIds((prev) => new Set(prev).add(plan.id));

    try {
      const payload = {
        pricing_plan_id: plan.id,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/cancel`,
      };

      console.log("Making subscription request with payload:", payload);

      const response = await axios.post(
        `/api/marketplace/v1/agents/${agent.id}/subscribe/`,
        payload
      );

      const responseData = response as any;
      console.log("Subscription response:", responseData);

      // Extract checkoutUrl whether it's top-level or inside data
      const checkoutUrl = responseData.checkout_url || responseData.data?.checkout_url;

      if (checkoutUrl) {
        toast.success("Redirecting to payment...");
        console.log("Redirecting to Stripe checkout:", checkoutUrl);
        window.location.replace(checkoutUrl);
      } else if (responseData.status === "success" || responseData.data?.status === "success") {
        toast.success(responseData.message || "Successfully subscribed to Free plan!");
        queryClient.invalidateQueries({ queryKey: ["myAgents"] });
      } else {
        console.log("API returned unexpected response:", responseData);
        toast.error(responseData.message || "Failed to subscribe");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);

      if (error.response?.status === 401) {
        toast.error("Please sign in to subscribe");
        window.location.href = "/auth/login";
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      // Remove plan from subscribing set
      setSubscribingPlanIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(plan.id);
        return newSet;
      });
    }
  };

  // Function to render pricing plan
  const renderPricingPlan = (plan: PricingPlan) => {
    const price = parseFloat(plan.price);
    const isFree = price === 0;

    // Check if user is already subscribed to this agent and this plan
    let isAlreadySubscribed = false;
    let subscribedPlanName = "";

    if (isAuthenticated && myAgentsResponse?.data) {
      // Find if this specific agent is in the user's active subscriptions
      const activeSubscription = myAgentsResponse.data.find(
        (sub) => sub.agent.id === Number(agent.id) && sub.status === "active"
      );

      const planIdFromSub = (activeSubscription as any)?.pricingPlan?.id ?? (activeSubscription as any)?.pricing_plan?.id;

      if (activeSubscription && planIdFromSub === plan.id) {
        isAlreadySubscribed = true;
      }
    }

    return (
      <div key={plan.id} className="p-5 rounded-lg border border-gray-800 bg-gray-900/50">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>
          <p className="text-sm text-gray-400 mb-3">
            {plan.features.length > 0 ? plan.features[0] : `${plan.name} plan for this agent.`}
          </p>
        </div>

        {isFree && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded mb-4">
            <span className="text-sm text-green-400 font-medium">Always free</span>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">
              {plan.currency === "USD" ? "$" : plan.currency}
              {price}
            </span>
            <span className="text-gray-400">
              /
              {plan.pricingType === "monthly"
                ? "mo"
                : plan.pricingType === "yearly"
                  ? "yr"
                  : "one-time"}
            </span>
          </div>
          {plan.pricingType === "yearly" && price > 0 && (
            <p className="text-xs text-gray-500">Save with yearly billing</p>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {plan.maxMessagesPerMonth > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-300">
                {plan.maxMessagesPerMonth.toLocaleString()} calls/month
              </span>
            </div>
          )}
          {plan.maxMessagesPerMonth === -1 && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-300">Unlimited calls/month</span>
            </div>
          )}
          {plan.maxIntegrations > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-300">{plan.maxIntegrations} integrations</span>
            </div>
          )}
          {plan.maxIntegrations === -1 && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-300">Unlimited integrations</span>
            </div>
          )}
          {plan.trialDays > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-300">{plan.trialDays} days free trial</span>
            </div>
          )}
          {plan.features.slice(1).map((feature) => (
            <div key={`${plan.id}-feature-${feature}`} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleSubscribe(plan)}
          disabled={subscribingPlanIds.has(plan.id) || isAlreadySubscribed}
          className={`cursor-pointer w-full py-2 px-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 rounded-md text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed ${isAlreadySubscribed ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/30 cursor-not-allowed" : ""}`}
        >
          {subscribingPlanIds.has(plan.id) ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : isAlreadySubscribed ? (
            "Already Subscribed"
          ) : isFree ? (
            "Get started free"
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    );
  };

  const tabs = [
    { id: "info" as const, label: "Info" },
    { id: "install" as const, label: "Install" },
    { id: "reviews" as const, label: "Reviews" },
  ];

  return (
    <SectionContainer>
      <div className="pt-10 pb-20 ">
        <nav className="flex items-center space-x-2 text-sm text-gray-400">
          <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer">
            Marketplace
          </button>
          <span>/</span>
          <span className="text-white">{agent.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="py-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8 gap-6">
            {/* Left side - Agent info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 flex-1">
              {/* Agent Icon */}
              <div className="w-16 h-16 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                {agent.icon?.startsWith("http") ? (
                  <img
                    src={agent.icon}
                    alt={`${agent.name} icon`}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <span className="text-2xl">
                    {agent.icon && !agent.icon.startsWith("http") ? agent.icon : "🤖"}
                  </span>
                )}
              </div>

              {/* Agent Details */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 wrap-break-word">
                  {agent.name}
                </h1>

                {/* Author info with email in same line */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-gray-400 text-sm">by</span>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">
                        {(originalAgent as any)?.owner?.name?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-medium text-sm">
                        {(originalAgent as any)?.owner?.name || "Unknown Author"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed text-sm mb-3 line-clamp-2 sm:line-clamp-none whitespace-pre-wrap">
                  {(originalAgent as any)?.welcomeMessage || (originalAgent as any)?.welcome_message || "No welcome message provided."}
                </p>

                {/* Stats/Tags */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  {agent.tags.slice(0, 2).map((tag) => (
                    <div
                      key={`tag-${tag}`}
                      className="flex items-center px-3 py-1 bg-gray-800/50 rounded-md"
                    >
                      <span className="text-xs text-gray-400 font-medium">{tag}</span>
                    </div>
                  ))}
                  {agent.tags.length > 2 && (
                    <div className="flex items-center px-3 py-1 bg-gray-800/50 rounded-md">
                      <span className="text-xs text-gray-400 font-medium">
                        +{agent.tags.length - 2} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Details Section - Left side */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            {/* Tab Navigation - Mobile Responsive */}
            <div className="border rounded border-gray-800 mb-8 overflow-hidden">
              {/* Mobile & Desktop Tab Navigation */}
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0 min-w-fit ${index === 0 ? "ml-0" : ""
                      } ${index === tabs.length - 1 ? "mr-0" : ""} ${activeTab === tab.id
                        ? "text-white bg-gray-800/90"
                        : "border-transparent text-gray-400 hover:text-white hover:bg-gray-800/20"
                      }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="pb-8">
              {activeTab === "info" && (
                <div className="space-y-8">
                  {/* Overview */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Short Description</h2>
                    <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {(originalAgent as any)?.shortDescription || (originalAgent as any)?.short_description || "No short description provided."}
                    </p>
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                    <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {agent.description || "No description provided."}
                    </p>
                  </section>
                </div>
              )}

              {/* Install Tab */}
              {activeTab === "install" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Widget Embed Code</h2>
                    <p className="text-gray-400 mb-4">
                      Paste this anywhere in the <code className="text-blue-400 bg-blue-400/10 px-1 py-0.5 rounded">&lt;body&gt;</code> tag of your html file.
                    </p>
                    <div className="relative group">
                      <pre className="bg-[#0d1117] text-gray-300 p-4 rounded-lg overflow-x-auto border border-gray-800 font-mono text-sm">
                        <code>
                          <span className="text-pink-400">&lt;script</span> <span className="text-green-300">type</span>=<span className="text-yellow-300">"module"</span><span className="text-pink-400">&gt;</span>
                          {"\n    "}<span className="text-purple-400">import</span> Chatbot <span className="text-purple-400">from</span> <span className="text-yellow-300">"https://flowisechatembed-0ozc.onrender.com/web.js?v=1"</span>
                          {"\n    "}Chatbot.<span className="text-blue-400">init</span>({"{"}
                          {"\n        "}chatflowid: <span className="text-yellow-300">"............"</span>,
                          {"\n        "}apiHost: <span className="text-yellow-300">"............"</span>,
                          {"\n    "}{"}"})
                          {"\n"}<span className="text-pink-400">&lt;/script&gt;</span>
                        </code>
                      </pre>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Installation Instructions</h2>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold border border-blue-500/30">
                          1
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">Copy the Embed Code</h3>
                          <p className="text-gray-400">Copy the generated script above to your clipboard.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold border border-blue-500/30">
                          2
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">Add to Your Website</h3>
                          <p className="text-gray-400">Paste the copied script tag into your HTML file, anywhere inside the <code className="text-gray-300 bg-gray-800 px-1 py-0.5 rounded">&lt;body&gt;</code> tag.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold border border-blue-500/30">
                          3
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">Test</h3>
                          <p className="text-gray-400">Open your website in a browser. The chat widget should appear in the bottom-right corner.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Example HTML</h2>
                    <pre className="bg-[#0d1117] text-gray-300 p-4 rounded-lg overflow-x-auto border border-gray-800 font-mono text-sm">
                      <code>
                        <span className="text-gray-500">&lt;!DOCTYPE html&gt;</span>
                        {"\n"}<span className="text-pink-400">&lt;html</span> <span className="text-green-300">lang</span>=<span className="text-yellow-300">"en"</span><span className="text-pink-400">&gt;</span>
                        {"\n"}  <span className="text-pink-400">&lt;head&gt;</span>
                        {"\n"}    <span className="text-pink-400">&lt;meta</span> <span className="text-green-300">charset</span>=<span className="text-yellow-300">"UTF-8"</span> <span className="text-pink-400">/&gt;</span>
                        {"\n"}    <span className="text-pink-400">&lt;title&gt;</span>My Website<span className="text-pink-400">&lt;/title&gt;</span>
                        {"\n"}  <span className="text-pink-400">&lt;/head&gt;</span>
                        {"\n"}  <span className="text-pink-400">&lt;body&gt;</span>
                        {"\n"}    <span className="text-pink-400">&lt;h1&gt;</span>Welcome to my website<span className="text-pink-400">&lt;/h1&gt;</span>
                        {"\n"}
                        {"\n"}    <span className="text-gray-500">&lt;!-- AI Agent Widget --&gt;</span>
                        {"\n"}    <span className="text-pink-400">&lt;script</span> <span className="text-green-300">type</span>=<span className="text-yellow-300">"module"</span><span className="text-pink-400">&gt;</span>
                        {"\n"}      <span className="text-purple-400">import</span> Chatbot <span className="text-purple-400">from</span> <span className="text-yellow-300">"https://flowisechatembed-0ozc.onrender.com/web.js?v=1"</span>
                        {"\n"}      Chatbot.<span className="text-blue-400">init</span>({"{"}
                        {"\n"}          chatflowid: <span className="text-yellow-300">"............"</span>,
                        {"\n"}          apiHost: <span className="text-yellow-300">"............"</span>,
                        {"\n"}      {"}"})
                        {"\n"}    <span className="text-pink-400">&lt;/script&gt;</span>
                        {"\n"}  <span className="text-pink-400">&lt;/body&gt;</span>
                        {"\n"}<span className="text-pink-400">&lt;/html&gt;</span>
                      </code>
                    </pre>
                  </section>
                </div>
              )}

              {/* Reviews/Other tab content */}
              {activeTab === "reviews" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
                  </div>

                  {isLoadingReviews ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-5 rounded-lg border border-gray-800 bg-gray-900/50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{review.title}</h4>

                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star}>
                                    {star <= parseFloat(review.rating) ? (
                                      <IconStarFilled size={16} className="text-yellow-400" />
                                    ) : (
                                      <IconStar size={16} className="text-gray-600" />
                                    )}
                                  </span>
                                ))}
                                <span className="text-sm text-gray-400 mt-0.5 ml-1">
                                  by {review.reviewer_name?.split('@')[0] || "Anonymous"}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">
                            {review.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-gray-800 border-dashed rounded-lg">
                      <div className="text-4xl mb-4">⭐</div>
                      <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
                      <p className="text-gray-400 text-sm">
                        Be the first to review this agent after trying it out.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Section - Right sidebar */}
          <div className="lg:col-span-4 order-1 lg:order-2 p-4 lg:p-5 rounded-lg border border-gray-800 h-fit">
            <div className="">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-bold text-white">Pricing Plans</h3>
                </div>

                {/* Dynamic Pricing Plans */}
                {pricingPlans && pricingPlans.length > 0 ? (
                  pricingPlans.map((plan: any) => {
                    // Convert snake_case to camelCase if needed
                    const normalizedPlan: PricingPlan = {
                      id: plan.id,
                      name: plan.name,
                      pricingType: plan.pricing_type || plan.pricingType,
                      price: plan.price,
                      currency: plan.currency,
                      features: plan.features || [],
                      maxMessagesPerMonth:
                        plan.max_messages_per_month ?? plan.maxMessagesPerMonth ?? 0,
                      maxIntegrations: plan.max_integrations ?? plan.maxIntegrations ?? 0,
                      trialDays: plan.trial_days ?? plan.trialDays ?? 0,
                      isActive: plan.is_active ?? plan.isActive ?? true,
                    };
                    return renderPricingPlan(normalizedPlan);
                  })
                ) : (
                  /* Fallback for agents without pricing data */
                  <div className="p-5 rounded-lg border border-gray-800 bg-gray-900/50">
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-white mb-2">Free</h4>
                      <p className="text-sm text-gray-400 mb-3">
                        This agent is available for free.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded mb-4">
                      <span className="text-sm text-green-400 font-medium">Always free</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">$0</span>
                        <span className="text-gray-400">/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm text-gray-300">Unlimited usage</span>
                    </div>

                    {(() => {
                      let isAlreadySubscribed = false;
                      if (isAuthenticated && myAgentsResponse?.data) {
                        const activeSubscription = myAgentsResponse.data.find(
                          (sub) => sub.agent.id === Number(agent.id) && sub.status === "active"
                        );
                        // For fallback free plan, if user has ANY active subscription to this agent, we consider them subscribed
                        if (activeSubscription) {
                          isAlreadySubscribed = true;
                        }
                      }

                      return (
                        <button
                          onClick={() =>
                            handleSubscribe({
                              id: 0,
                              name: "Free",
                              pricingType: "monthly",
                              price: "0",
                              currency: "USD",
                              features: ["Unlimited usage"],
                              maxMessagesPerMonth: -1,
                              maxIntegrations: -1,
                              trialDays: 0,
                              isActive: true,
                            })
                          }
                          disabled={subscribingPlanIds.has(0) || isAlreadySubscribed}
                          className={`cursor-pointer w-full py-2 px-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 rounded-md text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed ${isAlreadySubscribed ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/30 cursor-not-allowed" : ""}`}
                        >
                          {subscribingPlanIds.has(0) ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </div>
                          ) : isAlreadySubscribed ? (
                            "Already Subscribed"
                          ) : (
                            "Get started free"
                          )}
                        </button>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
