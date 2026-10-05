"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { queryClient } from "@/utils";

import {
  useCreateExternalAgent,
  useDeleteExternalAgent,
  useExternalAgentsList,
  useUpdateExternalAgent,
  useVerifyExternalAgent,
} from "./services";

import type { CreateExternalAgentDTO } from "./types";

export const useExternalAgentsData = () => {
  const { data: agents = [], isLoading, error, refetch } = useExternalAgentsList();

  const shouldShowError = error && agents.length === 0;

  return {
    agents,
    isLoading,
    error: shouldShowError ? error : null,
    refetch,
  };
};

export const useCreateExternalAgentFlow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { mutate: createAgent, isPending: isCreating } = useCreateExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent connected successfully!");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
        handleCloseModal();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to connect external agent");
      },
    },
  });

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setCurrentStep(1);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentStep(1);
  }, []);

  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSubmit = useCallback(
    (data: CreateExternalAgentDTO) => {
      createAgent(data);
    },
    [createAgent]
  );

  return {
    isModalOpen,
    currentStep,
    isCreating,
    handleOpenModal,
    handleCloseModal,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
  };
};

// Simplified hook for the connect page (without modal state)
export const useCreateExternalAgentPage = () => {
  const { mutate: createAgent, isPending: isCreating } = useCreateExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent connected successfully!");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to connect external agent");
      },
    },
  });

  const handleSubmit = useCallback(
    (data: CreateExternalAgentDTO) => {
      return new Promise((resolve, reject) => {
        createAgent(data, {
          onSuccess: resolve,
          onError: reject,
        });
      });
    },
    [createAgent]
  );

  return {
    isCreating,
    handleSubmit,
  };
};

export const useDeleteExternalAgentFlow = () => {
  const { mutate: deleteAgent, isPending: isDeleting } = useDeleteExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete external agent");
      },
    },
  });

  const handleDelete = useCallback(
    (id: number) => {
      deleteAgent(id);
    },
    [deleteAgent]
  );

  return { handleDelete, isDeleting };
};

export const useUpdateExternalAgentFlow = () => {
  const { mutate: updateAgent, isPending: isUpdating } = useUpdateExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update external agent");
      },
    },
  });

  return { updateAgent, isUpdating };
};

export const useVerifyExternalAgentFlow = () => {
  const { mutate: verifyAgent, isPending: isVerifying } = useVerifyExternalAgent({
    config: {
      onSuccess: (data) => {
        if (data.isVerified) {
          toast.success("External agent verified successfully!");
        } else {
          toast.warning("Verification completed but agent health check failed");
        }
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to verify external agent");
      },
    },
  });

  const handleVerify = useCallback(
    (id: number) => {
      verifyAgent(id);
    },
    [verifyAgent]
  );

  return { handleVerify, isVerifying };
};
