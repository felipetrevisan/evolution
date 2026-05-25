export const firestorePaths = {
  users: "users",
  cycles: (userId: string) => `users/${userId}/cycles`,
  bodyMeasurements: (userId: string) => `users/${userId}/bodyMeasurements`,
  triageSessions: (userId: string) => `users/${userId}/triageSessions`,
  investigations: (userId: string) => `users/${userId}/investigations`,
  operationalAssessments: (userId: string) => `users/${userId}/operationalAssessments`,
  adaptiveProfiles: (userId: string) => `users/${userId}/adaptiveProfiles`,
  plans: (userId: string) => `users/${userId}/plans`,
  checkins: (userId: string) => `users/${userId}/checkins`,
  reports: (userId: string) => `users/${userId}/reports`,
} as const;
