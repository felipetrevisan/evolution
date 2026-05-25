import { Elysia } from "elysia";
import { ok } from "../../shared/http/api-response";

export const healthRoutes = new Elysia().get("/health", () =>
  ok({
    service: "evolua-api",
    status: "ok",
  }),
);
