import { createApp } from "./app";
import { loadApiEnv } from "./infrastructure/env/api-env";

const env = loadApiEnv();
const app = createApp().listen(env.port);

console.log(`Evolua API listening on http://localhost:${app.server?.port}`);
