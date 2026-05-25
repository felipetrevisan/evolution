import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

const databaseUrl = Bun.env.SQL_CONNECT_DATABASE_URL ?? Bun.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("SQL_CONNECT_DATABASE_URL ou DATABASE_URL deve estar configurado.");
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
const migrationsDir = join(import.meta.dir, "../migrations");

await sql`
  create table if not exists schema_migrations (
    version text primary key,
    applied_at timestamptz not null default now()
  )
`;

const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

for (const file of files) {
  const applied = await sql`
    select version
    from schema_migrations
    where version = ${file}
    limit 1
  `;

  if (applied.length > 0) {
    continue;
  }

  const migration = await readFile(join(migrationsDir, file), "utf8");

  await sql.begin(async (transaction) => {
    await transaction.unsafe(migration);
    await transaction`
      insert into schema_migrations (version)
      values (${file})
    `;
  });

  console.log(`Applied ${file}`);
}

await sql.end();
