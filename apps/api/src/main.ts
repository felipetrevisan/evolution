import app from "./app";
import { loadApiEnv } from "./infrastructure/env/api-env";

if (!isVercelRuntime()) {
  const env = loadApiEnv();
  const server = app.listen(env.port);

  console.log(`Evolua API listening on http://localhost:${server.server?.port}`);
}

export default app;

function isVercelRuntime() {
  const runtime = globalThis as typeof globalThis & {
    Bun?: { env: Record<string, string | undefined> };
    process?: { env: Record<string, string | undefined> };
  };

  const env = runtime.Bun?.env ?? runtime.process?.env ?? {};
  return env.VERCEL === "1";
}
