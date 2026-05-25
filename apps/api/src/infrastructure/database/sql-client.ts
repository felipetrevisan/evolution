import postgres from "postgres";
import { ConfigurationError } from "../../shared/errors/api-error";
import { loadApiEnv } from "../env/api-env";

export type SqlClient = postgres.Sql;

let client: SqlClient | null = null;

export function getSqlClient(): SqlClient {
  const env = loadApiEnv();

  if (!env.persistence.databaseUrl) {
    throw new ConfigurationError("SQL Connect/PostgreSQL não foi configurado.");
  }

  client ??= postgres(env.persistence.databaseUrl, {
    max: 10,
    prepare: false,
  });

  return client;
}
