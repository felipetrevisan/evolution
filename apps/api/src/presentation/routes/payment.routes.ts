import { Elysia, t } from "elysia";
import { ok } from "../../shared/http/api-response";
import { hotmartWebhookController } from "../controllers/payment.controller";

export const paymentRoutes = new Elysia().post(
  "/webhooks/hotmart",
  async ({ headers, body }) => ok(await hotmartWebhookController(headers, body)),
  {
    body: t.Unknown(),
  },
);
