import {
  useConnectAccount,
  useConnectedAccounts,
  useDisconnectAccount,
  useEmailContext,
  useSendEmail,
  useUpdateContext,
} from "./services";

import type { ConnectedAccount } from "./services";

export const useAccountConnection = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useConnectedAccounts();
  const { mutate: connectAccount, isPending: isConnecting } = useConnectAccount();
  const { mutate: disconnectAccount, isPending: isDisconnecting } = useDisconnectAccount();

  const handleConnect = (email: string, onSuccess?: () => void) => {
    connectAccount(email, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const handleDisconnect = (accountId: string, onSuccess?: () => void) => {
    disconnectAccount(accountId, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return {
    accounts,
    isLoadingAccounts,
    isConnecting,
    isDisconnecting,
    handleConnect,
    handleDisconnect,
  };
};

export const useEmailContextManagement = () => {
  const { data: context = "", isLoading: isLoadingContext } = useEmailContext();
  const { mutate: updateContext, isPending: isUpdating } = useUpdateContext();

  const handleUpdateContext = (newContext: string, onSuccess?: () => void) => {
    updateContext(newContext, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return {
    context,
    isLoadingContext,
    isUpdating,
    handleUpdateContext,
  };
};

export const useEmailSending = () => {
  const { mutate: sendEmail, isPending: isSending, isSuccess, isError } = useSendEmail();

  const handleSendEmail = (
    accountId: string,
    context: string,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    sendEmail(
      { accountId, context },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: () => {
          onError?.();
        },
      }
    );
  };

  return {
    isSending,
    isSuccess,
    isError,
    handleSendEmail,
  };
};

// Re-export types for convenience
export type { ConnectedAccount };
