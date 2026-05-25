import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function getFirebaseClient(config: FirebaseClientConfig): FirebaseApp {
  return getApps()[0] ?? initializeApp(config);
}

export function getFirebaseAuth(config: FirebaseClientConfig): Auth {
  return getAuth(getFirebaseClient(config));
}

export function getFirebaseFirestore(config: FirebaseClientConfig): Firestore {
  return getFirestore(getFirebaseClient(config));
}
