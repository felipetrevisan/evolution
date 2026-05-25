import { type Static, t } from "elysia";

export const checkInBodySchema = t.Object({
  date: t.Optional(t.String()),
  completedStatus: t.Optional(
    t.Union([t.Literal("completed"), t.Literal("partial"), t.Literal("not_completed")]),
  ),
  emotionalState: t.Optional(
    t.Union([t.Literal("calm"), t.Literal("neutral"), t.Literal("difficult")]),
  ),
  energy: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  mood: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  adherence: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  note: t.Optional(t.String()),
});

export type CheckInBodyDto = Static<typeof checkInBodySchema>;
