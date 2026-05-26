import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import {
  getAdminAuth,
  getAdminFirestore,
  getAdminStorageBucket,
} from "../../../../../packages/firebase/src/index.ts";
import { ConfigurationError } from "../../shared/errors/api-error";
import { loadApiEnv } from "../env/api-env";

let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storageBucket: ReturnType<typeof getAdminStorageBucket> | null = null;

export function getFirebaseAuth(): Auth {
  const env = loadApiEnv();

  if (!env.firebase) {
    throw new ConfigurationError("Credenciais do Firebase Admin não foram configuradas.");
  }

  auth ??= getAdminAuth(env.firebase);
  return auth;
}

export function getFirestoreDb(): Firestore {
  const env = loadApiEnv();

  if (!env.firebase) {
    throw new ConfigurationError("Credenciais do Firestore não foram configuradas.");
  }

  firestore ??= getAdminFirestore(env.firebase);
  return firestore;
}

export function getStorageBucket() {
  const env = loadApiEnv();

  if (!env.firebase?.storageBucket) {
    throw new ConfigurationError("Bucket do Firebase Storage não foi configurado.");
  }

  storageBucket ??= getAdminStorageBucket(env.firebase);
  return storageBucket;
}
