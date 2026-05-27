import type { Firestore } from "firebase-admin/firestore";
import type {
  UserProfileRecord,
  UserRepository,
} from "../../application/repositories/user-repository";
import { sanitizeForFirestore } from "./firestore-sanitizer";

export function createUserRepository(db: Firestore): UserRepository {
  return {
    async clearOnboardingProgress(uid) {
      const existing = await this.get(uid);

      if (!existing) {
        return null;
      }

      const record = {
        ...existing,
        onboarding: {},
        updatedAt: new Date().toISOString(),
      };

      const sanitizedRecord = sanitizeForFirestore(record);
      await db.doc(`users/${uid}`).set(sanitizedRecord);
      return sanitizedRecord;
    },
    async get(uid) {
      const snapshot = await db.doc(`users/${uid}`).get();
      return snapshot.exists ? (snapshot.data() as UserProfileRecord) : null;
    },
    async getByEmail(email) {
      const snapshot = await db
        .collection("users")
        .where("email", "==", email.toLowerCase())
        .limit(1)
        .get();
      return (snapshot.docs[0]?.data() as UserProfileRecord | undefined) ?? null;
    },
    async list(limit = 100) {
      const snapshot = await db.collection("users").orderBy("updatedAt", "desc").limit(limit).get();
      return snapshot.docs.map((doc) => doc.data() as UserProfileRecord);
    },
    async upsert(uid, profile) {
      const existing = await this.get(uid);
      const record = {
        uid,
        role: "user" as const,
        ...existing,
        ...profile,
        updatedAt: new Date().toISOString(),
      };

      const sanitizedRecord = sanitizeForFirestore(record);
      await db.doc(`users/${uid}`).set(sanitizedRecord, { merge: true });
      return sanitizedRecord;
    },
  };
}
