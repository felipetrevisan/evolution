import { describe, expect, test } from "bun:test";
import type {
  AdminConfigRepository,
  PaymentEventRecord,
  PaymentProviderConfig,
  SubscriptionPlanRecord,
} from "../application/repositories/admin-config-repository";
import type {
  UserProfileRecord,
  UserRepository,
} from "../application/repositories/user-repository";
import { processHotmartWebhook } from "../application/use-cases/payment/process-hotmart-webhook";

describe("payment webhook", () => {
  test("activates user subscription on approved Hotmart purchase", async () => {
    const users = createUserRepository([
      {
        uid: "user_1",
        email: "buyer@example.com",
        role: "user",
        updatedAt: new Date().toISOString(),
      },
    ]);
    const adminConfig = createAdminConfigRepository({ hottok: "secret" });

    const result = await processHotmartWebhook(
      {
        headers: { "x-hotmart-hottok": "secret" },
        body: {
          event: "PURCHASE_APPROVED",
          data: {
            buyer: { email: "buyer@example.com" },
            purchase: { status: "APPROVED", transaction: "HP123" },
            subscription: { id: 123, plan: { id: 456 } },
          },
        },
      },
      { adminConfig, users },
    );

    const user = await users.get("user_1");
    expect(result.status).toBe("processed");
    expect(user?.subscription?.status).toBe("active");
    expect(user?.subscription?.provider).toBe("hotmart");
    expect(user?.subscription?.providerTransactionId).toBe("HP123");
  });

  test("ignores webhook with invalid Hottok", async () => {
    const users = createUserRepository([]);
    const adminConfig = createAdminConfigRepository({ hottok: "secret" });

    const result = await processHotmartWebhook(
      {
        headers: { "x-hotmart-hottok": "wrong" },
        body: { event: "PURCHASE_APPROVED", data: { buyer: { email: "buyer@example.com" } } },
      },
      { adminConfig, users },
    );

    expect(result.status).toBe("ignored");
    expect(result.event).toBe("invalid_hottok");
  });
});

function createUserRepository(initial: UserProfileRecord[]): UserRepository {
  const records = new Map(initial.map((record) => [record.uid, record]));

  return {
    async clearOnboardingProgress(uid) {
      const record = records.get(uid) ?? null;

      if (record) {
        records.set(uid, { ...record, onboarding: {}, updatedAt: new Date().toISOString() });
      }

      return records.get(uid) ?? null;
    },
    async get(uid) {
      return records.get(uid) ?? null;
    },
    async getByEmail(email) {
      return (
        [...records.values()].find(
          (record) => record.email?.toLowerCase() === email.toLowerCase(),
        ) ?? null
      );
    },
    async list(limit = 100) {
      return [...records.values()].slice(0, limit);
    },
    async upsert(uid, profile) {
      const record = {
        uid,
        role: "user" as const,
        ...records.get(uid),
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      records.set(uid, record);
      return record;
    },
  };
}

function createAdminConfigRepository(
  provider: Pick<PaymentProviderConfig, "hottok">,
): AdminConfigRepository {
  const events = new Map<string, PaymentEventRecord>();

  return {
    async getTriageQuestions() {
      return null;
    },
    async saveTriageQuestions(questions) {
      return questions;
    },
    async getInvestigationQuestions() {
      return null;
    },
    async saveInvestigationQuestions(questionsByVector) {
      return questionsByVector;
    },
    async getOperationalQuestions() {
      return null;
    },
    async saveOperationalQuestions(questions) {
      return questions;
    },
    async listSubscriptionPlans(): Promise<SubscriptionPlanRecord[]> {
      return [];
    },
    async saveSubscriptionPlan(plan) {
      return plan;
    },
    async deleteSubscriptionPlan(planId) {
      return { id: planId };
    },
    async getPaymentProvider() {
      return {
        active: true,
        checkoutUrl: "https://pay.hotmart.com/example",
        provider: "hotmart",
        ...provider,
      };
    },
    async savePaymentProvider(config) {
      return config;
    },
    async savePaymentEvent(event) {
      events.set(event.id, event);
      return event;
    },
  };
}
