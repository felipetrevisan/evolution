import { type Static, t } from "elysia";

export const genericAnswerBodySchema = t.Object({
  sessionId: t.Optional(t.String()),
  questionId: t.String(),
  answer: t.Union([t.String(), t.Number(), t.Boolean()]),
  score: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
});

export type GenericAnswerBodyDto = Static<typeof genericAnswerBodySchema>;
