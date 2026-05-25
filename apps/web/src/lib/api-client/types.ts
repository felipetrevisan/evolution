export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export type CurrentUser = {
  uid: string;
  email?: string;
  name?: string;
  role?: "user" | "admin";
  profile?: UserProfile;
};

export type UserProfile = {
  uid: string;
  email?: string;
  name?: string;
  photoUrl?: string;
  birthDate?: string;
  gender?: string;
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
};

export type PaymentProviderConfig = {
  provider: "hotmart";
  checkoutUrl: string;
  hottok?: string;
  active: boolean;
  updatedAt?: string;
};

export type SubscriptionAccess = {
  status: "active" | "trialing" | "expiring" | "expired" | "blocked";
  canAccess: boolean;
  daysUntilExpiration: number | null;
  expiresAt: string | null;
  planId: string | null;
};

export type OnboardingStatus = {
  currentStep: string;
  completedSteps: string[];
  currentCycleId: string | null;
  canContinue: boolean;
  nextRoute: string;
  anamneseCompleted: boolean;
  triageCompleted: boolean;
  investigationCompleted: boolean;
  operationalAssessmentCompleted: boolean;
  adaptiveProfileGenerated: boolean;
  actionPlanGenerated: boolean;
};

export type DashboardData = {
  uid: string;
  user: {
    uid: string;
    greetingName: string;
  };
  subscription: SubscriptionAccess;
  currentCycle: {
    id: string | null;
    status: string;
    day: number;
    durationDays: number;
    progressPercent: number;
  };
  daysUntilReassessment: number;
  currentFocusVector: {
    key: string | null;
    label: string;
  };
  adaptiveLevel: string;
  spi: number;
  streak: number;
  weeklyFrequency: {
    completed: number;
    target: number;
  };
  nextMicroGoal: string;
  currentWeek: number;
  checkInStatus: {
    completedToday: boolean;
    mode: "simple" | "expanded";
    imWord: string;
  };
  bodyMeasurementHistory: Array<{
    date: string;
    weightKg: number | null;
    bmi: number | null;
    bmiCategory: string | null;
  }>;
  vectorEvolution: Array<{
    vector: string;
    label: string;
    fva: number;
    im: number;
  }>;
  operationalBlockScores: Array<{
    block: string;
    normalized: number;
    status: string;
  }>;
  adherenceOverTime: Array<{
    date: string;
    adherence: number;
    stability: number;
  }>;
  currentPlanSummary: PlanSummary;
};

export type CheckInPayload = {
  completedStatus?: "completed" | "partial" | "not_completed";
  emotionalState?: "calm" | "neutral" | "difficult";
  energy?: number;
  mood?: number;
  adherence?: number;
  note?: string;
};

export type TodayCheckIn = {
  existing: unknown;
  mode: "simple" | "expanded";
  cycleDay: number;
  domainMode: string;
  imWord: string;
  microGoal: string;
  recalibrationMessages: string[];
};

export type PlanSummary = {
  id: string | null;
  status: string;
  days: number;
  priorityVector: string | null;
  supportVector: string | null;
  regulationVector: string;
  protocolBase: string;
  imWords: string[];
  weeklyObjectives: Array<{ week: number; objective: string; protocol: string }>;
};

export type ActionPlanData = Omit<PlanSummary, "days"> & {
  startDate?: string;
  days: Array<{
    day?: number;
    focus?: string;
    microAction?: string;
    message?: string;
    protocol?: string;
    checkpoint?: boolean;
  }>;
};

export type CycleReportData = {
  id: string;
  cycleId: string;
  summary: string;
  streak: number;
  adherence: number;
  completedGoals: number;
  beforeAfter: { before?: unknown; after?: unknown };
  vectorEvolution: unknown[];
  recommendations: string[];
} | null;

export type AnamnesePayload = {
  fullName?: string;
  age?: number;
  ageRange?: "18_24" | "25_34" | "35_44" | "45_54" | "55_plus";
  biologicalSex?: "feminino" | "masculino" | "outro";
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  hasHealthCondition?: boolean;
  healthConditions?: string[];
  medications?: string[];
  femaleHealth?: {
    cycleRegularity?: string;
    hormonalUse?: string;
    pregnancyOrBreastfeeding?: string;
    pregnancyOrPostpartum?: boolean;
    menopauseSymptoms?: boolean;
  };
  sleepHours?: number;
  activityLevel?: string;
  weeklyAvailability?: string;
  experienceLevel?: string;
  weightHistory?: string;
  routineContext?: string;
  desiredResult?: string;
  motivator?: string;
  mainComplaint?: string;
};

export type InvestigationCurrent = {
  id: string;
  status: "in_progress" | "completed";
  currentQuestion?: {
    id: string;
    block: "X" | "Y" | "Z";
    text: string;
    options: Array<{ id: string; label: string; nextQuestionId?: string }>;
  };
  questionTree: Array<{
    id: string;
    block: "X" | "Y" | "Z";
    text: string;
    options: Array<{ id: string; label: string; nextQuestionId?: string }>;
  }>;
};

export type OperationalCurrent = {
  id: string;
  priorityVector?: string;
  questions: Array<{ id: number; block: string; text: string }>;
  attentionQuestions: Array<{ id: string; text: string }>;
};

export type InvestigationQuestion = NonNullable<InvestigationCurrent["currentQuestion"]>;
export type OperationalQuestion = OperationalCurrent["questions"][number];

export type TriageQuestion = {
  id: number;
  layer: "FVA" | "IM";
  text: string;
  alternatives: Array<{
    id: string;
    questionId: number;
    vector: string;
    label: string;
    weight: 1;
  }>;
};

export type TriageQuestionsResponse = {
  questions: TriageQuestion[];
  maxSelections: number;
  alternativesPerQuestion: number;
};

export type TriageSessionData = {
  id: string;
  status: "in_progress" | "completed";
  answers?: Array<{
    questionId: number;
    alternativeId: string;
    vector: string;
    layer?: "FVA" | "IM";
  }>;
  result?: TriageDiagnosticSummary;
};

export type TriageDiagnosticSummary = {
  fvaPriority: {
    vector?: string;
    tiedVectors: string[];
    requiresUserChoice: boolean;
  };
  imPriority: {
    vector?: string;
    tiedVectors: string[];
    requiresUserChoice: boolean;
  };
  fva: Record<string, { raw: number; normalized: number; classification: string }>;
  im: Record<string, { raw: number; normalized: number; classification: string }>;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  interval: "month" | "year";
  active: boolean;
  features: string[];
};

export type CheckoutData = {
  alreadyActive: boolean;
  checkoutUrl: string | null;
  provider: PaymentProviderConfig | null;
  subscription: SubscriptionAccess;
};
