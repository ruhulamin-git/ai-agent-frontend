import type { ConnectedAccount, SendEmailPayload } from "./services";

export type { ConnectedAccount, SendEmailPayload };

export interface EmailContextValues {
  context: string;
}

export interface EmailAgentState {
  currentStep: number;
  selectedAccountId: string | null;
}
