import type {
  UserScopedRecord,
  UserScopedRepository,
} from "../application/repositories/base-repository";

export function createMemoryRepository<TRecord extends UserScopedRecord>(
  initial: TRecord[] = [],
): UserScopedRepository<TRecord> & { records: Map<string, TRecord> } {
  const records = new Map(initial.map((record) => [`${record.uid}:${record.id}`, record]));

  return {
    records,
    async deleteAll(uid) {
      const keys = [...records.entries()]
        .filter(([, record]) => record.uid === uid)
        .map(([key]) => key);

      for (const key of keys) {
        records.delete(key);
      }

      return keys.length;
    },
    async get(uid, id) {
      return records.get(`${uid}:${id}`) ?? null;
    },
    async getLatest(uid) {
      return (
        [...records.values()]
          .filter((record) => record.uid === uid)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
      );
    },
    async list(uid, limit = 30) {
      return [...records.values()]
        .filter((record) => record.uid === uid)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, limit);
    },
    async save(uid, id, record) {
      records.set(`${uid}:${id}`, record);
      return record;
    },
  };
}
