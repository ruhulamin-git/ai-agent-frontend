export interface PaymentHistory {
  id: number;
  agent: {
    id: number;
    name: string;
    displayTitle: string;
    agentType: string;
    sourceType: string;
    iconUrl: string | null;
    isPublished: boolean;
  };
  pricingPlan: {
    id: number;
    name: string;
    pricingType: string;
    price: string;
    currency: string;
    trialDays: number;
  };
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  isLifetime: boolean;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  invoices: Array<{
    id: number;
    invoiceNumber: string;
    status: string;
    issueDate: string;
    dueDate: string;
    currencyCode: string;
    subtotal: string;
    taxTotal: string;
    totalAmount: string;
  }>;
  createdAt: string;
}

export interface PaymentHistoryResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: PaymentHistory[];
  errors: unknown;
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    numPages: number;
  };
}
