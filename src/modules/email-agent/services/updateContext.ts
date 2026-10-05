import { useMutation, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/utils/delay";

import { setEmailContextData } from "./getEmailContext";

import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const DELAY_MEDIUM = 500;

const updateContext = async (context: string): Promise<string> => {
  await delay(DELAY_MEDIUM);
  setEmailContextData(context);
  return context;
};

interface UseUpdateContextOptions {
  config?: MutationConfig<typeof updateContext>;
}

export const useUpdateContext = ({ config }: UseUpdateContextOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<string, AxiosError, string>({
    mutationFn: updateContext,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-agent", "context"] });
    },
    ...config,
  });
};
