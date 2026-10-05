"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConnectExternalAgent } from "@/modules/studio/ai-studio/external-agents/components/ConnectExternalAgent";
import { useCreateExternalAgentPage } from "@/modules/studio/ai-studio/external-agents/hooks";

const ConnectExternalAgentPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const { isCreating, handleSubmit } = useCreateExternalAgentPage();

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/ai-studio/external-agents");
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await handleSubmit(data);
      // Redirect to external agents page after successful creation
      router.push("/dashboard/ai-studio/external-agents");
    } catch (error) {
      console.error("Failed to create external agent:", error);
    }
  };

  return (
    <ConnectExternalAgent
      currentStep={currentStep}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      onSubmit={handleFormSubmit}
      isSubmitting={isCreating}
      onCancel={handleCancel}
    />
  );
};

export default ConnectExternalAgentPage;
