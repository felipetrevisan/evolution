import type { Firestore } from "firebase-admin/firestore";
import type {
  UserScopedRecord,
  UserScopedRepository,
} from "../../application/repositories/base-repository";

export type UserScopedCollection =
  | "cycles"
  | "anamnese"
  | "bodyMeasurements"
  | "triageSessions"
  | "investigations"
  | "operationalAssessments"
  | "adaptiveProfiles"
  | "plans"
  | "checkins"
  | "reports";

export function createUserScopedRepository<TRecord extends UserScopedRecord>(
  db: Firestore,
  collection: UserScopedCollection,
): UserScopedRepository<TRecord> {
  const ref = (uid: string) => db.collection(`users/${uid}/${collection}`);

  return {
    async deleteAll(uid) {
      const snapshot = await ref(uid).get();
      const batch = db.batch();

      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
      }

      await batch.commit();
      return snapshot.size;
    },
    async get(uid, id) {
      const snapshot = await ref(uid).doc(id).get();
      return snapshot.exists ? (snapshot.data() as TRecord) : null;
    },
    async getLatest(uid) {
      const snapshot = await ref(uid).orderBy("createdAt", "desc").limit(1).get();
      return snapshot.empty ? null : (snapshot.docs[0]?.data() as TRecord);
    },
    async list(uid, limit = 30) {
      const snapshot = await ref(uid).orderBy("createdAt", "desc").limit(limit).get();
      return snapshot.docs.map((doc) => doc.data() as TRecord);
    },
    async save(uid, id, record) {
      await ref(uid).doc(id).set(record, { merge: true });
      return record;
    },
  };
}
