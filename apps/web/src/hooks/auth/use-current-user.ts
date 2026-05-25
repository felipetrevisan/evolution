"use client";

import { useEffect, useState } from "react";
import { api, type CurrentUser } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

export function useCurrentUser() {
  const { authenticated, loading, user } = useAuth();
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileStatus("idle");
      return;
    }

    let active = true;
    setProfileStatus("loading");

    api
      .me()
      .then((currentUser) => {
        if (active) {
          setProfile(currentUser);
          setProfileStatus("ready");
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null);
          setProfileStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  const waitingForProfile =
    Boolean(user) && (profileStatus === "idle" || profileStatus === "loading");

  return { firebaseUser: user, profile, loading: loading || waitingForProfile, authenticated };
}
