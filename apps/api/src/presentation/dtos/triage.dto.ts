import { type Static, t } from "elysia";

export const vectorSchema = t.Union([
  t.Literal("comportamento"),
  t.Literal("constancia"),
  t.Literal("gestao_pessoal"),
  t.Literal("controle_emocional"),
]);

export const triageAnswerBodySchema = t.Object({
  sessionId: t.Optional(t.String()),
  questionId: t.Number({ minimum: 1 }),
  layer: t.Optional(t.Union([t.Literal("FVA"), t.Literal("IM")])),
  selections: t.Array(
    t.Object({
      alternativeId: t.String(),
      vector: vectorSchema,
    }),
    { minItems: 6, maxItems: 6 },
  ),
});

export type TriageAnswerBodyDto = Static<typeof triageAnswerBodySchema>;

export const triageTieBreakBodySchema = t.Object({
  layer: t.Union([t.Literal("FVA"), t.Literal("IM")]),
  vector: vectorSchema,
});

export type TriageTieBreakBodyDto = Static<typeof triageTieBreakBodySchema>;
