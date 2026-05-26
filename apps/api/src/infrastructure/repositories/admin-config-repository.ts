import type { Firestore } from "firebase-admin/firestore";
import type {
  InvestigationQuestion,
  OperationalQuestion,
  TriageQuestion,
  VectorKey,
} from "../../../../../packages/domain/src/index.ts";
import type {
  AdminConfigRepository,
  PaymentEventRecord,
  PaymentProviderConfig,
  SubscriptionPlanRecord,
} from "../../application/repositories/admin-config-repository";

export function createAdminConfigRepository(db: Firestore): AdminConfigRepository {
  return {
    async getTriageQuestions() {
      const snapshot = await db.doc("adminConfig/triageQuestions").get();
      const data = snapshot.data() as { questions?: unknown[] } | undefined;
      return Array.isArray(data?.questions) ? (data.questions as TriageQuestion[]) : null;
    },
    async saveTriageQuestions(questions) {
      await db.doc("adminConfig/triageQuestions").set(
        {
          questions,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      return questions;
    },
    async getInvestigationQuestions(priorityVector) {
      const snapshot = await db.doc("adminConfig/investigationQuestions").get();
      const data = snapshot.data() as
        | { questionsByVector?: Partial<Record<VectorKey, unknown[]>> }
        | undefined;
      const questions = data?.questionsByVector?.[priorityVector];
      return Array.isArray(questions) ? (questions as InvestigationQuestion[]) : null;
    },
    async saveInvestigationQuestions(questionsByVector) {
      await db.doc("adminConfig/investigationQuestions").set(
        {
          questionsByVector,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      return questionsByVector;
    },
    async getOperationalQuestions() {
      const snapshot = await db.doc("adminConfig/operationalQuestions").get();
      const data = snapshot.data() as { questions?: unknown[] } | undefined;
      return Array.isArray(data?.questions) ? (data.questions as OperationalQuestion[]) : null;
    },
    async saveOperationalQuestions(questions) {
      await db.doc("adminConfig/operationalQuestions").set(
        {
          questions,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      return questions;
    },
    async listSubscriptionPlans() {
      const snapshot = await db.collection("subscriptionPlans").orderBy("createdAt", "desc").get();
      return snapshot.docs.map((doc) => doc.data() as SubscriptionPlanRecord);
    },
    async saveSubscriptionPlan(plan) {
      const now = new Date().toISOString();
      const record = {
        ...plan,
        createdAt: plan.createdAt ?? now,
        updatedAt: now,
      };
      await db.doc(`subscriptionPlans/${plan.id}`).set(record, { merge: true });
      return record;
    },
    async deleteSubscriptionPlan(planId) {
      await db.doc(`subscriptionPlans/${planId}`).delete();
      return { id: planId };
    },
    async getPaymentProvider() {
      const snapshot = await db.doc("adminConfig/paymentProvider").get();
      return snapshot.exists ? (snapshot.data() as PaymentProviderConfig) : null;
    },
    async savePaymentProvider(config) {
      const record = {
        ...config,
        updatedAt: new Date().toISOString(),
      };
      await db.doc("adminConfig/paymentProvider").set(record, { merge: true });
      return record;
    },
    async savePaymentEvent(event: PaymentEventRecord) {
      await db.doc(`paymentEvents/${event.id}`).set(event, { merge: true });
      return event;
    },
  };
}
