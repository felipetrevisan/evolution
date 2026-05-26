import type {
  InvestigationQuestion,
  OperationalQuestion,
  TriageQuestion,
  VectorKey,
} from "../../../../../packages/domain/src/index.ts";

export type SubscriptionPlanRecord = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  interval: "month" | "year";
  active: boolean;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type PaymentProviderConfig = {
  provider: "hotmart";
  checkoutUrl: string;
  hottok?: string;
  active: boolean;
  updatedAt?: string;
};

export type PaymentEventRecord = {
  id: string;
  provider: "hotmart";
  email: string | null;
  event: string;
  status: "processed" | "ignored" | "unmatched";
  action: "activate" | "past_due" | "cancel" | "ignore";
  receivedAt: string;
  payload: unknown;
};

export type AdminConfigRepository = {
  getTriageQuestions(): Promise<TriageQuestion[] | null>;
  saveTriageQuestions(questions: TriageQuestion[]): Promise<TriageQuestion[]>;
  getInvestigationQuestions(priorityVector: VectorKey): Promise<InvestigationQuestion[] | null>;
  saveInvestigationQuestions(
    questionsByVector: Record<VectorKey, InvestigationQuestion[]>,
  ): Promise<Record<VectorKey, InvestigationQuestion[]>>;
  getOperationalQuestions(): Promise<OperationalQuestion[] | null>;
  saveOperationalQuestions(questions: OperationalQuestion[]): Promise<OperationalQuestion[]>;
  listSubscriptionPlans(): Promise<SubscriptionPlanRecord[]>;
  saveSubscriptionPlan(plan: SubscriptionPlanRecord): Promise<SubscriptionPlanRecord>;
  deleteSubscriptionPlan(planId: string): Promise<{ id: string }>;
  getPaymentProvider(): Promise<PaymentProviderConfig | null>;
  savePaymentProvider(config: PaymentProviderConfig): Promise<PaymentProviderConfig>;
  savePaymentEvent(event: PaymentEventRecord): Promise<PaymentEventRecord>;
};
