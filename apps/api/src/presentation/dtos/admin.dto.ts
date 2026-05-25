import { type Static, t } from "elysia";
import { vectorSchema } from "./triage.dto";

export const userRoleSchema = t.Union([t.Literal("user"), t.Literal("admin")]);

export const subscriptionStatusSchema = t.Union([
  t.Literal("free"),
  t.Literal("trialing"),
  t.Literal("active"),
  t.Literal("past_due"),
  t.Literal("canceled"),
]);

export const updateUserAdminBodySchema = t.Object({
  role: t.Optional(userRoleSchema),
  subscription: t.Optional(
    t.Object({
      status: t.Optional(subscriptionStatusSchema),
      planId: t.Optional(t.String()),
      currentPeriodEnd: t.Optional(t.String()),
    }),
  ),
});

export type UpdateUserAdminBodyDto = Static<typeof updateUserAdminBodySchema>;

export const subscriptionPlanBodySchema = t.Object({
  id: t.String({ minLength: 2 }),
  name: t.String({ minLength: 2 }),
  priceCents: t.Number({ minimum: 0 }),
  currency: t.String({ minLength: 3, maxLength: 3 }),
  interval: t.Union([t.Literal("month"), t.Literal("year")]),
  active: t.Boolean(),
  features: t.Array(t.String()),
});

export type SubscriptionPlanBodyDto = Static<typeof subscriptionPlanBodySchema>;

export const paymentProviderBodySchema = t.Object({
  provider: t.Literal("hotmart"),
  checkoutUrl: t.String({ minLength: 8 }),
  hottok: t.Optional(t.String()),
  active: t.Boolean(),
});

export type PaymentProviderBodyDto = Static<typeof paymentProviderBodySchema>;

export const adminTriageQuestionsBodySchema = t.Object({
  questions: t.Array(
    t.Object({
      id: t.Number({ minimum: 1 }),
      layer: t.Union([t.Literal("FVA"), t.Literal("IM")]),
      text: t.String({ minLength: 3 }),
      alternatives: t.Array(
        t.Object({
          id: t.String(),
          questionId: t.Number({ minimum: 1 }),
          vector: vectorSchema,
          label: t.String({ minLength: 1 }),
          weight: t.Literal(1),
        }),
        { minItems: 12, maxItems: 12 },
      ),
    }),
    { minItems: 1 },
  ),
});

export type AdminTriageQuestionsBodyDto = Static<typeof adminTriageQuestionsBodySchema>;

const investigationOptionSchema = t.Object({
  id: t.String(),
  label: t.String(),
  nextQuestionId: t.Optional(t.String()),
});

const investigationQuestionSchema = t.Object({
  id: t.String(),
  block: t.Union([t.Literal("X"), t.Literal("Y"), t.Literal("Z")]),
  text: t.String(),
  options: t.Array(investigationOptionSchema),
});

export const adminInvestigationQuestionsBodySchema = t.Object({
  questionsByVector: t.Record(t.String(), t.Array(investigationQuestionSchema)),
});

export type AdminInvestigationQuestionsBodyDto = Static<
  typeof adminInvestigationQuestionsBodySchema
>;

export const adminOperationalQuestionsBodySchema = t.Object({
  questions: t.Array(
    t.Object({
      id: t.Number({ minimum: 1 }),
      block: t.Union([t.Literal("X"), t.Literal("Y"), t.Literal("Z")]),
      text: t.String({ minLength: 1 }),
    }),
    { minItems: 12, maxItems: 12 },
  ),
});

export type AdminOperationalQuestionsBodyDto = Static<typeof adminOperationalQuestionsBodySchema>;
