import type {
  UserProfileRecord,
  UserRepository,
} from "../../../application/repositories/user-repository";
import type { SqlClient } from "../../database/sql-client";

export function createSqlUserRepository(sql: SqlClient): UserRepository {
  return {
    async get(uid) {
      const rows = await sql`
        select data
        from users
        where uid = ${uid}
        limit 1
      `;

      return (rows[0]?.data as UserProfileRecord | undefined) ?? null;
    },
    async getByEmail(email) {
      const rows = await sql`
        select data
        from users
        where lower(data->>'email') = ${email.toLowerCase()}
        limit 1
      `;

      return (rows[0]?.data as UserProfileRecord | undefined) ?? null;
    },
    async list(limit = 100) {
      const rows = await sql`
        select data
        from users
        order by updated_at desc
        limit ${limit}
      `;

      return rows.map((row) => row.data as UserProfileRecord);
    },
    async upsert(uid, profile) {
      const existing = await this.get(uid);
      const record: UserProfileRecord = {
        uid,
        role: "user",
        ...existing,
        ...profile,
        updatedAt: new Date().toISOString(),
      };

      await sql`
        insert into users (uid, updated_at, data)
        values (${uid}, ${record.updatedAt}, ${sql.json(record)})
        on conflict (uid)
        do update set
          updated_at = excluded.updated_at,
          data = excluded.data
      `;

      return record;
    },
  };
}
