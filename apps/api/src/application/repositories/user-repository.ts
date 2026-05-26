export type UserProfileRecord = {
  uid: string;
  email?: string;
  name?: string;
  photoUrl?: string;
  birthDate?: string;
  gender?: string;
  goals?: string[];
  role?: "user" | "admin";
  subscription?: {
    status?: "free" | "trialing" | "active" | "past_due" | "canceled";
    planId?: string;
    currentPeriodEnd?: string;
    provider?: "hotmart";
    providerSubscriptionId?: string;
    providerTransactionId?: string;
    updatedAt?: string;
  };
  onboarding?: {
    anamneseCompletedAt?: string;
    currentCycleId?: string;
  };
  updatedAt: string;
};

export type UserRepository = {
  clearOnboardingProgress(uid: string): Promise<UserProfileRecord | null>;
  get(uid: string): Promise<UserProfileRecord | null>;
  getByEmail(email: string): Promise<UserProfileRecord | null>;
  list(limit?: number): Promise<UserProfileRecord[]>;
  upsert(uid: string, profile: Partial<UserProfileRecord>): Promise<UserProfileRecord>;
};
