import { type App, cert, getApps, initializeApp } from "firebase-admin/app";
import { type Auth, getAuth } from "firebase-admin/auth";
import { type Firestore, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

export type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
};

export function getFirebaseAdmin(config: FirebaseAdminConfig): App {
  const options = {
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey.replace(/\\n/g, "\n"),
    }),
    ...(config.databaseURL ? { databaseURL: config.databaseURL } : {}),
    ...(config.storageBucket ? { storageBucket: config.storageBucket } : {}),
  };

  return getApps()[0] ?? initializeApp(options);
}

export function getAdminAuth(config: FirebaseAdminConfig): Auth {
  return getAuth(getFirebaseAdmin(config));
}

export function getAdminFirestore(config: FirebaseAdminConfig): Firestore {
  return config.firestoreDatabaseId
    ? getFirestore(getFirebaseAdmin(config), config.firestoreDatabaseId)
    : getFirestore(getFirebaseAdmin(config));
}

export function getAdminStorageBucket(config: FirebaseAdminConfig) {
  return getStorage(getFirebaseAdmin(config)).bucket(config.storageBucket);
}
