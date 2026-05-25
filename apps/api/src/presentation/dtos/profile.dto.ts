import { type Static, t } from "elysia";

export const profileBodySchema = t.Object({
  name: t.Optional(t.String()),
  photoUrl: t.Optional(t.String()),
  birthDate: t.Optional(t.String()),
  gender: t.Optional(t.String()),
  goals: t.Optional(t.Array(t.String())),
});

export type ProfileBodyDto = Static<typeof profileBodySchema>;
