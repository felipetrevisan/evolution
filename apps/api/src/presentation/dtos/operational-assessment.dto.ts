import { type Static, t } from "elysia";

export const operationalAnswerBodySchema = t.Object({
  assessmentId: t.Optional(t.String()),
  questionId: t.Optional(t.Number({ minimum: 1, maximum: 12 })),
  value: t.Optional(
    t.Union([t.Literal(1), t.Literal(2), t.Literal(3), t.Literal(4), t.Literal(5), t.Literal(6)]),
  ),
  attentionQuestionId: t.Optional(t.String()),
  attentionValue: t.Optional(t.Boolean()),
});

export type OperationalAnswerBodyDto = Static<typeof operationalAnswerBodySchema>;
