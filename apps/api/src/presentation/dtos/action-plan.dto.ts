import { type Static, t } from "elysia";

export const actionPlanBodySchema = t.Object({
  adaptiveProfileId: t.Optional(t.String()),
  startDate: t.Optional(t.String()),
});

export type ActionPlanBodyDto = Static<typeof actionPlanBodySchema>;
