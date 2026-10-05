export interface ConnectedAccount {
  id: string;
  email: string;
  provider: "gmail" | "outlook";
  connectedAt: string;
}

export interface SendEmailPayload {
  accountId: string;
  context: string;
}
