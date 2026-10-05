/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
"use client";

import {
  ArrowLeft,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Tabs, TabsContent } from "@/shared/ui/tabs";

import {
  type AgentPricingPlan,
  type PricingType,
  useCreatePricingPlan,
  useDeleteAgent,
  useDeletePricingPlan,
  useGetAgentDetail,
  useGetPricingPlans,
  usePublishAgent,
  useUnpublishAgent,
  useUpdatePricingPlan,
} from "./service";

interface AgentSettingsProps {
  agentId: string;
}

export const AgentSettings = ({ agentId }: AgentSettingsProps) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Fetch agent details
  const { data: agent, isLoading: isLoadingAgent } = useGetAgentDetail(agentId);

  // API mutations
  const { mutate: publishAgent, isPending: isPublishing } = usePublishAgent();
  const { mutate: unpublishAgent, isPending: isUnpublishing } = useUnpublishAgent();
  const { mutate: deleteAgent, isPending: isDeleting } = useDeleteAgent();

  // Pricing plans
  const { data: pricingPlans = [] } = useGetPricingPlans(agentId);
  const { mutate: createPlan, isPending: isCreatingPlan } = useCreatePricingPlan();
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdatePricingPlan();
  const { mutate: deletePlan, isPending: isDeletingPlan } = useDeletePricingPlan();

  // Monetization states
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AgentPricingPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "0",
    pricingType: "monthly" as PricingType,
    maxMessagesPerMonth: -1,
    trialDays: 0,
    currency: "USD",
    maxIntegrations: 0,
    isActive: true,
  });

  const breadcrumbItems = [
    { label: "Agent Library", href: "/developer-dashboard/agents" },
    { label: "Settings", isActive: true },
  ];

  const handleDelete = () => {
    deleteAgent(agentId, {
      onSuccess: () => {
        toast.success("Agent deleted successfully");
        router.push("/developer-dashboard/agents");
      },
      onError: () => {
        toast.error("Failed to delete agent");
      },
    });
  };

  const handlePublishToggle = () => {
    // Check if at least one pricing plan exists before publishing
    if (agent?.publishStatus === "draft" && pricingPlans.length === 0) {
      toast.error("Please add at least one pricing plan before publishing");
      setActiveTab("monetization");
      return;
    }

    if (agent?.publishStatus === "draft" || agent?.publishStatus === "pending_review") {
      publishAgent(agentId, {
        onSuccess: () => {
          toast.success("Agent published successfully");
        },
        onError: () => {
          toast.error("Failed to publish agent");
        },
      });
    } else {
      unpublishAgent(agentId, {
        onSuccess: () => {
          toast.success("Agent unpublished successfully");
        },
        onError: () => {
          toast.error("Failed to unpublish agent");
        },
      });
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      price: "0",
      pricingType: "monthly",
      maxMessagesPerMonth: -1,
      trialDays: 0,
      currency: "USD",
      maxIntegrations: 0,
      isActive: true,
    });
    setShowPlanDialog(true);
  };

  const handleEditPlan = (plan: AgentPricingPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price,
      pricingType: plan.pricingType,
      maxMessagesPerMonth: plan.maxMessagesPerMonth,
      trialDays: plan.trialDays,
      currency: plan.currency,
      maxIntegrations: plan.maxIntegrations,
      isActive: plan.isActive,
    });
    setShowPlanDialog(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name) {
      toast.error("Plan name is required");
      return;
    }

    if (editingPlan) {
      // Update existing plan
      updatePlan(
        {
          agentId,
          planId: editingPlan.id,
          payload: planForm,
        },
        {
          onSuccess: () => {
            toast.success("Pricing plan updated successfully");
            setShowPlanDialog(false);
          },
          onError: () => {
            toast.error("Failed to update pricing plan");
          },
        }
      );
    } else {
      // Create new plan
      createPlan(
        {
          agentId,
          payload: planForm,
        },
        {
          onSuccess: () => {
            toast.success("Pricing plan created successfully");
            setShowPlanDialog(false);
          },
          onError: () => {
            toast.error("Failed to create pricing plan");
          },
        }
      );
    }
  };

  const handleDeletePlan = (planId: number) => {
    deletePlan(
      { agentId, planId },
      {
        onSuccess: () => {
          toast.success("Pricing plan deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete pricing plan");
        },
      }
    );
  };

  const getPlanTypeLabel = (pricingType: string) => {
    const labels = {
      free: "Free",
      monthly: "Monthly",
      yearly: "Yearly",
      lifetime: "Lifetime",
    };
    return labels[pricingType as keyof typeof labels] || pricingType;
  };

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agent Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage publishing, monetization, and API access</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${activeTab === "general"
              ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
              : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
              }`}
          >
            <SettingsIcon className="w-4 h-4 mr-2 inline" />
            General
          </button>
          <button
            onClick={() => setActiveTab("monetization")}
            className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${activeTab === "monetization"
              ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
              : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
              }`}
          >
            <DollarSign className="w-4 h-4 mr-2 inline" />
            Monetization
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          {isLoadingAgent ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading agent details...</p>
            </div>
          ) : !agent ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Agent not found</p>
            </div>
          ) : (
            <>
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Publish Status */}
                <div>
                  <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-3">Publish Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800/50">
                      <div className="flex items-center gap-2">
                        {agent.publishStatus === "published" ? (
                          <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : agent.publishStatus === "pending_review" ? (
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                        <div>
                          <h4 className="text-gray-900 dark:text-white text-sm font-medium">
                            {agent.publishStatus === "published"
                              ? "Published"
                              : agent.publishStatus === "pending_review"
                                ? "Pending Review"
                                : "Draft"}
                          </h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {agent.publishStatus === "published"
                              ? "Live"
                              : agent.publishStatus === "pending_review"
                                ? "Waiting for approval"
                                : "Not visible"}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handlePublishToggle}
                        disabled={isPublishing || isUnpublishing || agent.publishStatus === "pending_review"}
                        size="sm"
                        className={`text-white ${agent.publishStatus === "published"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : agent.publishStatus === "pending_review"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {isPublishing || isUnpublishing
                          ? "..."
                          : agent.publishStatus === "published"
                            ? "Unpublish"
                            : agent.publishStatus === "pending_review"
                              ? "In Review"
                              : "Publish"}
                      </Button>
                    </div>

                    {agent.publishStatus === "published" && (
                      <div className="p-2 bg-green-100 dark:bg-green-500/10 border border-green-300 dark:border-green-500/30 rounded-lg">
                        <p className="text-xs text-green-700 dark:text-green-400">✓ Live in marketplace</p>
                      </div>
                    )}
                    {agent.publishStatus === "pending_review" && (
                      <div className="p-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 rounded-lg">
                        <p className="text-xs text-blue-700 dark:text-blue-400">ℹ️ Your agent is currently under review by our team.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visibility Settings */}
                <div>
                  <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-3">Visibility</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800/50">
                      <div className="flex items-center gap-2">
                        {agent.isActive ? (
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                        <div>
                          <h4 className="text-gray-900 dark:text-white text-sm font-medium">Status</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {agent.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <div
                        className="relative inline-flex items-center cursor-pointer opacity-50 cursor-not-allowed"
                        title="Contact support"
                      >
                        <input
                          type="checkbox"
                          checked={agent.isActive}
                          disabled
                          className="sr-only peer"
                          aria-label="Toggle agent visibility"
                        />
                        <div className="w-9 h-5 bg-gray-400 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                      </div>
                    </div>

                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-400">ℹ️ Inactive agents not accessible</p>
                    </div>
                  </div>
                </div>

                {/* Agent Information */}
                <div>
                  <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-3">Information</h3>
                  <div className="space-y-2 p-3 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800/50">
                    <div className="flex justify-between py-1.5 border-b border-gray-300 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Name</span>
                      <span className="text-xs text-gray-900 dark:text-white">{agent.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-300 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">ID</span>
                      <span className="text-xs text-gray-900 dark:text-white font-mono">{agent.id}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-300 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Created</span>
                      <span className="text-xs text-gray-900 dark:text-white">
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Status</span>
                      <span
                        className={`text-xs ${agent.isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-red-600 dark:text-red-400 text-base font-semibold mb-3">Danger Zone</h3>
                  <div className="space-y-2">
                    {!showDeleteConfirm ? (
                      <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800/50">
                        <div>
                          <h4 className="text-gray-900 dark:text-white text-sm font-medium">Delete Agent</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Permanently delete</p>
                        </div>
                        <Button
                          onClick={() => setShowDeleteConfirm(true)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg space-y-2">
                        <div>
                          <h4 className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">⚠️ Confirm</h4>
                          <p className="text-xs text-gray-700 dark:text-gray-300">Cannot be undone</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeleting ? "..." : "Delete"}
                          </Button>
                          <Button
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                            variant="outline"
                            size="sm"
                            className="border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          {/* Pricing Plans */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-white text-base font-semibold">Pricing Plans</h3>
              <button
                onClick={handleCreatePlan}
                className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Plan
              </button>
            </div>
            {pricingPlans.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800/20">
                <DollarSign className="w-12 h-12 text-gray-500 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No pricing plans yet</p>
                <button
                  onClick={handleCreatePlan}
                  className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800/50 hover:border-gray-400 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-gray-900 dark:text-white font-medium">{plan.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
                          {getPlanTypeLabel(plan.pricingType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          ${parseFloat(plan.price).toFixed(2)}
                          {plan.pricingType !== "free" &&
                            plan.pricingType !== "lifetime" &&
                            `/${plan.pricingType}`}
                        </span>
                        <span>•</span>
                        <span>
                          {plan.maxMessagesPerMonth === -1
                            ? "Unlimited"
                            : `${plan.maxMessagesPerMonth} msgs/mo`}
                        </span>
                        {plan.trialDays > 0 && (
                          <>
                            <span>•</span>
                            <span>{plan.trialDays} days trial</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        disabled={isUpdatingPlan}
                        className="px-3 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20 disabled:opacity-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={isDeletingPlan}
                        className="px-3 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monetization Info */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-3">Monetization Info</h3>
            <div className="space-y-2 p-3 bg-gray-200 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-800/50">
              <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</span>
                <span className="text-xs text-gray-900 dark:text-white font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400">Active Subscriptions</span>
                <span className="text-xs text-gray-900 dark:text-white">0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Pending Payout</span>
                <span className="text-xs text-gray-900 dark:text-white">$0.00</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pricing Plan Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Pricing Plan" : "Create Pricing Plan"}</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {editingPlan
                ? "Update your pricing plan details"
                : "Set up a new pricing plan for your agent"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Plan Name *</Label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                className="bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Pro Plan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Plan Type *</Label>
                <select
                  value={planForm.pricingType}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, pricingType: e.target.value as PricingType })
                  }
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="free">Free</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Price ($) *</Label>
                <Input
                  type="number"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  disabled={planForm.pricingType === "free"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Usage Limit (msgs/mo)</Label>
                <Input
                  type="number"
                  value={planForm.maxMessagesPerMonth}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      maxMessagesPerMonth: parseInt(e.target.value) || -1,
                    })
                  }
                  className="bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="-1 for unlimited"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">-1 = unlimited</p>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Trial Days</Label>
                <Input
                  type="number"
                  value={planForm.trialDays}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, trialDays: parseInt(e.target.value) || 0 })
                  }
                  className="bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowPlanDialog(false)}
              disabled={isCreatingPlan || isUpdatingPlan}
              className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePlan}
              disabled={!planForm.name || isCreatingPlan || isUpdatingPlan}
              className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${!planForm.name || isCreatingPlan || isUpdatingPlan
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                : "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
                }`}
            >
              {isCreatingPlan || isUpdatingPlan
                ? "Saving..."
                : editingPlan
                  ? "Update Plan"
                  : "Create Plan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
