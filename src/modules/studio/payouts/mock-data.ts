export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "rejected";
  method: "paypal" | "bank_transfer";
  destination: string;
}

export const MOCK_PAYOUT_METRICS = {
  availableBalance: 1250.5,
  pendingPayouts: 300.0,
  lifetimeEarnings: 4500.75,
  lastPayoutDate: "2026-02-15T10:00:00Z",
};

export const MOCK_PAYOUT_HISTORY: PayoutRecord[] = [
  {
    id: "po_1a2b3c4d5e",
    date: "2026-02-15T10:00:00Z",
    amount: 850.25,
    status: "completed",
    method: "paypal",
    destination: "creator@example.com",
  },
  {
    id: "po_9f8e7d6c5b",
    date: "2026-01-10T14:30:00Z",
    amount: 1100.0,
    status: "completed",
    method: "bank_transfer",
    destination: "**** 4582",
  },
  {
    id: "po_5a6b7c8d9e",
    date: "2025-12-05T09:15:00Z",
    amount: 500.0,
    status: "rejected",
    method: "paypal",
    destination: "oldemail@example.com",
  },
  {
    id: "po_1z2y3x4w5v",
    date: "2025-11-01T11:45:00Z",
    amount: 800.0,
    status: "completed",
    method: "paypal",
    destination: "creator@example.com",
  },
];
