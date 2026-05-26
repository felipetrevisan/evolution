import type { FirebaseAdminConfig } from "../../../../../packages/firebase/src/admin/app.ts";

type EnvSource = Record<string, string | undefined>;

export type ApiEnv = {
  port: number;
  corsOrigins: string[];
  adminEmails: string[];
  firebase: FirebaseAdminConfig | null;
  persistence: {
    driver: "sql" | "firestore";
    databaseUrl?: string;
    sqlConnectServiceId?: string;
    sqlConnectLocation?: string;
  };
};

export function loadApiEnv(source = getRuntimeEnv()): ApiEnv {
  const projectId = source.FIREBASE_PROJECT_ID;
  const clientEmail = source.FIREBASE_CLIENT_EMAIL;
  const privateKey = source.FIREBASE_PRIVATE_KEY;
  const databaseUrl = source.SQL_CONNECT_DATABASE_URL ?? source.DATABASE_URL;

  return {
    port: Number(source.PORT ?? 4000),
    corsOrigins: parseCsv(
      source.CORS_ORIGIN ?? "http://localhost:3000,https://evolution.institutoez.com.br",
    ),
    adminEmails: parseCsv(source.ADMIN_EMAILS),
    persistence: {
      driver:
        source.PERSISTENCE_DRIVER === "firestore" || source.PERSISTENCE_DRIVER === "sql"
          ? source.PERSISTENCE_DRIVER
          : databaseUrl
            ? "sql"
            : "firestore",
      ...(databaseUrl ? { databaseUrl } : {}),
      ...(source.SQL_CONNECT_SERVICE_ID
        ? { sqlConnectServiceId: source.SQL_CONNECT_SERVICE_ID }
        : {}),
      ...(source.SQL_CONNECT_LOCATION ? { sqlConnectLocation: source.SQL_CONNECT_LOCATION } : {}),
    },
    firebase:
      projectId && clientEmail && privateKey
        ? {
            projectId,
            clientEmail,
            privateKey,
            ...(source.FIREBASE_DATABASE_URL ? { databaseURL: source.FIREBASE_DATABASE_URL } : {}),
            ...(source.FIRESTORE_DATABASE_ID
              ? { firestoreDatabaseId: source.FIRESTORE_DATABASE_ID }
              : {}),
            ...(source.FIREBASE_STORAGE_BUCKET
              ? { storageBucket: source.FIREBASE_STORAGE_BUCKET }
              : {}),
          }
        : null,
  };
}

function getRuntimeEnv(): EnvSource {
  const runtime = globalThis as typeof globalThis & {
    Bun?: { env: EnvSource };
    process?: { env: EnvSource };
  };

  return runtime.Bun?.env ?? runtime.process?.env ?? {};
}

function parseCsv(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}
