interface PlanCycle {
  id: number;
  name: string;
  durationDays: number;
}

interface PlanPricing {
  id: number;
  priceId: string | null;
  currency: string;
  price: string;
  planCycle: PlanCycle;
  createdAt: string;
  updatedAt: string;
}

interface PlanPoint {
  id: number;
  order: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FeatureCheckbox {
  id: number;
  code: string;
  dataType: "boolean";
  value: boolean;
  title: string;
}

interface FeatureLimit {
  id: number;
  code: string;
  dataType: "integer";
  limit: number;
  title: string;
}

interface PlanFeatures {
  featureCheckbox: FeatureCheckbox[];
  featureLimit: FeatureLimit[];
}

interface PublicPlan {
  id: number;
  name: string;
  code: string;
  pricing: PlanPricing | null;
  description: string;
  isActive: boolean;
  planPoints: PlanPoint[];
  isPopular: boolean;
  isFreeTrial: boolean;
  isCurrentPlan: boolean;
}

interface AuthenticatedPlan extends PublicPlan {
  features: PlanFeatures;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionStatus {
  id: number;
  company: {
    id: number;
    name: string;
  };
  subscription: {
    id: number;
    details: string;
  };
  status: "active" | "inactive" | "cancelled" | "expired";
  effectiveDate: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

interface CurrentSubscription {
  id: number;
  company: {
    id: number;
    name: string;
  };
  plan: {
    id: number;
    name: string;
    code: string;
  };
  startDate: string;
  status: SubscriptionStatus;
  endDate: string;
  trialEndDate: string | null;
  cancelAtPeriodEnd: boolean;
  isActive: boolean;
  daysRemaining: number;
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
}

export type {
  AuthenticatedPlan,
  CurrentSubscription,
  FeatureCheckbox,
  FeatureLimit,
  PlanCycle,
  PlanFeatures,
  PlanPoint,
  PlanPricing,
  PublicPlan,
  SubscriptionStatus,
};
