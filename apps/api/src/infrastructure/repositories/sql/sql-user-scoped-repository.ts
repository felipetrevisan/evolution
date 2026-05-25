import type {
  UserScopedRecord,
  UserScopedRepository,
} from "../../../application/repositories/base-repository";
import type { SqlClient } from "../../database/sql-client";
import type { UserScopedCollection } from "../user-scoped-repository";
import { scopedTableByCollection } from "./table-names";

export function createSqlUserScopedRepository<TRecord extends UserScopedRecord>(
  sql: SqlClient,
  collection: UserScopedCollection,
): UserScopedRepository<TRecord> {
  const table = scopedTableByCollection[collection];

  return {
    async get(uid, id) {
      const rows = await sql`
        select data
        from ${sql(table)}
        where uid = ${uid} and id = ${id}
        limit 1
      `;

      return (rows[0]?.data as TRecord | undefined) ?? null;
    },
    async getLatest(uid) {
      const rows = await sql`
        select data
        from ${sql(table)}
        where uid = ${uid}
        order by created_at desc
        limit 1
      `;

      return (rows[0]?.data as TRecord | undefined) ?? null;
    },
    async list(uid, limit = 30) {
      const rows = await sql`
        select data
        from ${sql(table)}
        where uid = ${uid}
        order by created_at desc
        limit ${limit}
      `;

      return rows.map((row) => row.data as TRecord);
    },
    async save(uid, id, record) {
      await sql`
        insert into users (uid, updated_at, data)
        values (
          ${uid},
          ${new Date().toISOString()},
          ${sql.json({ uid, updatedAt: new Date().toISOString() })}
        )
        on conflict (uid) do nothing
      `;

      await sql`
        insert into ${sql(table)} (id, uid, created_at, updated_at, data)
        values (
          ${id},
          ${uid},
          ${record.createdAt},
          ${record.updatedAt ?? record.createdAt},
          ${sql.json(record)}
        )
        on conflict (id)
        do update set
          uid = excluded.uid,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          data = excluded.data
      `;

      return record;
    },
  };
}
