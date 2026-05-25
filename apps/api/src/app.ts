import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { loadApiEnv } from "./infrastructure/env/api-env";
import { healthRoutes } from "./presentation/routes/health.routes";
import { paymentRoutes } from "./presentation/routes/payment.routes";
import { protectedRoutes } from "./presentation/routes/protected.routes";
import { handleError } from "./shared/errors/error-handler";

export function createApp() {
  const env = loadApiEnv();

  return new Elysia()
    .use(
      cors({
        origin: env.corsOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        preflight: true,
      }),
    )
    .onError(({ error, status }) => handleError(error, status))
    .use(healthRoutes)
    .use(paymentRoutes)
    .use(protectedRoutes);
}
