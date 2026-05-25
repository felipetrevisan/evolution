"use client";

import { getFirebaseAuth } from "@evolution/firebase/client";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  updateProfile,
} from "firebase/auth";
import { getFirebaseConfig } from "./config";

export function getClientAuth() {
  return getFirebaseAuth(getFirebaseConfig());
}

export async function configureAuthPersistence() {
  await setPersistence(getClientAuth(), browserLocalPersistence);
}

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getClientAuth(), callback);
}

export async function getIdToken(): Promise<string | null> {
  return getClientAuth().currentUser?.getIdToken() ?? null;
}

export function loginWithEmail(email: string, password: string) {
  return configureAuthPersistence().then(() =>
    signInWithEmailAndPassword(getClientAuth(), email, password),
  );
}

export function signupWithEmail(email: string, password: string) {
  return configureAuthPersistence().then(() =>
    createUserWithEmailAndPassword(getClientAuth(), email, password),
  );
}

export async function loginWithGoogle() {
  await configureAuthPersistence();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(getClientAuth(), provider);
}

export function logout() {
  return signOut(getClientAuth());
}

export async function updateFirebaseProfile(input: { displayName?: string; photoURL?: string }) {
  const user = getClientAuth().currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  await updateProfile(user, input);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(getClientAuth(), email);
}
