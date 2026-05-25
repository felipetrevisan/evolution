import { type Static, t } from "elysia";

export const anamneseBodySchema = t.Object({
  fullName: t.Optional(t.String()),
  age: t.Optional(t.Number({ minimum: 1 })),
  ageRange: t.Optional(
    t.Union([
      t.Literal("18_24"),
      t.Literal("25_34"),
      t.Literal("35_44"),
      t.Literal("45_54"),
      t.Literal("55_plus"),
    ]),
  ),
  biologicalSex: t.Optional(
    t.Union([t.Literal("feminino"), t.Literal("masculino"), t.Literal("outro")]),
  ),
  heightCm: t.Number({ minimum: 1 }),
  weightKg: t.Number({ minimum: 1 }),
  waistCm: t.Optional(t.Number({ minimum: 1 })),
  hipCm: t.Optional(t.Number({ minimum: 1 })),
  armCm: t.Optional(t.Number({ minimum: 1 })),
  thighCm: t.Optional(t.Number({ minimum: 1 })),
  hasHealthCondition: t.Optional(t.Boolean()),
  healthConditions: t.Optional(t.Array(t.String())),
  medications: t.Optional(t.Array(t.String())),
  femaleHealth: t.Optional(
    t.Object({
      cycleRegularity: t.Optional(
        t.Union([
          t.Literal("regular"),
          t.Literal("irregular"),
          t.Literal("ausente"),
          t.Literal("nao_se_aplica"),
        ]),
      ),
      hormonalUse: t.Optional(
        t.Union([
          t.Literal("nao"),
          t.Literal("anticoncepcional_oral"),
          t.Literal("diu_hormonal"),
          t.Literal("trh"),
          t.Literal("outro"),
        ]),
      ),
      pregnancyOrBreastfeeding: t.Optional(
        t.Union([t.Literal("nao"), t.Literal("gestante"), t.Literal("amamentando")]),
      ),
      pregnancyOrPostpartum: t.Optional(t.Boolean()),
      menopauseSymptoms: t.Optional(t.Boolean()),
    }),
  ),
  sleepHours: t.Optional(t.Number({ minimum: 0, maximum: 24 })),
  activityLevel: t.Optional(t.String()),
  weeklyAvailability: t.Optional(
    t.Union([t.Literal("menos_2h"), t.Literal("2_3h"), t.Literal("4_5h"), t.Literal("6h_mais")]),
  ),
  experienceLevel: t.Optional(
    t.Union([
      t.Literal("nunca"),
      t.Literal("iniciante"),
      t.Literal("intermediario"),
      t.Literal("avancado"),
    ]),
  ),
  weightHistory: t.Optional(
    t.Union([
      t.Literal("estavel"),
      t.Literal("ganhei_peso"),
      t.Literal("perdi_peso"),
      t.Literal("oscilacao_frequente"),
    ]),
  ),
  routineContext: t.Optional(t.String()),
  desiredResult: t.Optional(
    t.Union([
      t.Literal("perda_gordura"),
      t.Literal("ganho_massa"),
      t.Literal("mais_energia"),
      t.Literal("melhorar_sono"),
      t.Literal("reduzir_estresse"),
      t.Literal("criar_consistencia"),
    ]),
  ),
  motivator: t.Optional(
    t.Union([
      t.Literal("saude_longevidade"),
      t.Literal("aparencia_autoestima"),
      t.Literal("performance_energia"),
      t.Literal("exemplo_familia"),
      t.Literal("superacao_pessoal"),
      t.Literal("qualidade_vida"),
    ]),
  ),
  mainComplaint: t.Optional(t.String()),
});

export type AnamneseBodyDto = Static<typeof anamneseBodySchema>;
