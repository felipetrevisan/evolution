import {
  CICLO_PADRAO_DIAS,
  selectImWordOfDay,
  VECTOR_DEFINITIONS,
  type VectorKey,
} from "@evolution/domain";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { UserProfileRecord, UserRepository } from "../../repositories/user-repository";
import type { ActionPlanRecord } from "../action-plan/generate-action-plan";
import type { AdaptiveProfileRecord } from "../adaptive-engine/generate-adaptive-profile";
import type { CheckInRecord } from "../check-in/save-check-in";
import type { CycleRecord } from "../cycle/get-current-cycle";
import { getSubscriptionAccess } from "../subscription/subscription-access";

type BodyMeasurement = {
  id: string;
  uid: string;
  createdAt: string;
  bmi?: number;
  bmiCategory?: string;
  payload?: { weightKg?: number; heightCm?: number; fullName?: string };
};

type TriageSession = {
  id: string;
  uid: string;
  createdAt: string;
  result?: {
    fvaPriority?: { vector?: VectorKey };
    imPriority?: { vector?: VectorKey };
    fva?: Record<VectorKey, { normalized?: number }>;
    im?: Record<VectorKey, { normalized?: number }>;
  };
};

type OperationalAssessment = {
  id: string;
  uid: string;
  createdAt: string;
  result?: {
    total?: { normalized?: number };
    blocks?: Record<string, { normalized?: number; status?: string }>;
  };
};

export async function getDashboard(
  uid: string,
  repositories: {
    cycles: UserScopedRepository<CycleRecord>;
    plans: UserScopedRepository<ActionPlanRecord>;
    checkins: UserScopedRepository<CheckInRecord>;
    profiles: UserScopedRepository<AdaptiveProfileRecord>;
    bodyMeasurements: UserScopedRepository<BodyMeasurement>;
    triageSessions: UserScopedRepository<TriageSession>;
    operationalAssessments: UserScopedRepository<OperationalAssessment>;
    users: UserRepository;
  },
) {
  const [cycle, plan, checkins, profile, bodyMeasurements, triage, operational, userProfile] =
    await Promise.all([
      repositories.cycles.getLatest(uid),
      repositories.plans.getLatest(uid),
      repositories.checkins.list(uid, CICLO_PADRAO_DIAS),
      repositories.profiles.getLatest(uid),
      repositories.bodyMeasurements.list(uid, CICLO_PADRAO_DIAS),
      repositories.triageSessions.getLatest(uid),
      repositories.operationalAssessments.getLatest(uid),
      repositories.users.get(uid),
    ]);
  const cycleDay = getCycleDay(cycle);
  const priorityVector = profile?.dominantVector ?? triage?.result?.fvaPriority?.vector;
  const vectorLabel = priorityVector ? VECTOR_DEFINITIONS[priorityVector].label : "Em definição";
  const subscription = getSubscriptionAccess(userProfile);

  return {
    uid,
    user: {
      uid,
      greetingName: getGreetingName(userProfile, bodyMeasurements),
    },
    subscription,
    currentCycle: {
      id: cycle?.id ?? null,
      status: cycle?.status ?? "not_started",
      day: cycleDay,
      durationDays: CICLO_PADRAO_DIAS,
      progressPercent: Math.round((cycleDay / CICLO_PADRAO_DIAS) * 100),
    },
    daysUntilReassessment: Math.max(0, CICLO_PADRAO_DIAS - cycleDay),
    currentFocusVector: {
      key: priorityVector ?? null,
      label: vectorLabel,
    },
    adaptiveLevel: profile?.adaptiveLevel ?? "Pendente",
    spi: operational?.result?.total?.normalized ?? 0,
    streak: countStreak(checkins),
    weeklyFrequency: {
      completed: checkins.slice(0, 7).filter((entry) => entry.completedStatus !== "not_completed")
        .length,
      target: 7,
    },
    nextMicroGoal: getMicroGoal(plan, cycleDay),
    currentWeek: Math.ceil(cycleDay / 7),
    checkInStatus: {
      completedToday: checkins.some((entry) => entry.date === todayIso()),
      mode: cycleDay <= 14 ? "simple" : "expanded",
      imWord: selectImWordOfDay(cycleDay),
    },
    bodyMeasurementHistory: bodyMeasurements.reverse().map((entry) => ({
      date: entry.createdAt.slice(0, 10),
      weightKg: entry.payload?.weightKg ?? null,
      bmi: entry.bmi ?? null,
      bmiCategory: entry.bmiCategory ?? null,
    })),
    vectorEvolution: buildVectorEvolution(triage),
    operationalBlockScores: Object.entries(operational?.result?.blocks ?? {}).map(
      ([block, score]) => ({
        block,
        normalized: score.normalized ?? 0,
        status: score.status ?? "Pendente",
      }),
    ),
    adherenceOverTime: checkins.reverse().map((entry) => ({
      date: entry.date,
      adherence: entry.adherence,
      stability: entry.stability,
    })),
    currentPlanSummary: {
      id: plan?.id ?? null,
      status: plan?.status ?? "not_generated",
      days: plan?.days?.length ?? 0,
      priorityVector: priorityVector ?? null,
      supportVector: triage?.result?.imPriority?.vector ?? null,
      regulationVector: "controle_emocional",
      protocolBase: profile?.protocols?.[0] ?? "Aguardando perfil adaptativo",
      imWords: Array.from({ length: 6 }, (_, index) => selectImWordOfDay(index + 1)),
      weeklyObjectives: buildWeeklyObjectives(plan),
    },
  };
}

function getCycleDay(cycle: CycleRecord | null): number {
  const startedAt = cycle?.startedAt ?? cycle?.createdAt;

  if (!startedAt) {
    return 1;
  }

  return Math.min(
    45,
    Math.max(1, Math.floor((Date.now() - new Date(startedAt).getTime()) / 86_400_000) + 1),
  );
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function countStreak(entries: CheckInRecord[]): number {
  let streak = 0;

  for (const entry of entries) {
    if (entry.completedStatus === "not_completed") {
      break;
    }
    streak += 1;
  }

  return streak;
}

function getGreetingName(profile: UserProfileRecord | null, entries: BodyMeasurement[]): string {
  if (profile?.name) {
    return profile.name.split(" ")[0] ?? profile.name;
  }

  if (profile?.email) {
    return profile.email.split("@")[0] ?? profile.email;
  }

  const latestWithName = entries.find((entry) => entry.payload?.fullName);
  return latestWithName?.payload?.fullName?.split(" ")[0] ?? "Você";
}

function getMicroGoal(plan: ActionPlanRecord | null, day: number): string {
  const dayPlan = plan?.days?.[day - 1] as { focus?: string } | undefined;
  return dayPlan?.focus ?? "Registrar presença e manter uma ação pequena hoje.";
}

function buildVectorEvolution(triage: TriageSession | null) {
  return Object.entries(VECTOR_DEFINITIONS).map(([key, definition]) => ({
    vector: key,
    label: definition.label,
    fva: triage?.result?.fva?.[key as VectorKey]?.normalized ?? 0,
    im: triage?.result?.im?.[key as VectorKey]?.normalized ?? 0,
  }));
}

function buildWeeklyObjectives(plan: ActionPlanRecord | null) {
  return Array.from({ length: 6 }, (_, index) => {
    const week = index + 1;
    const day =
      (plan?.days?.[index * 7] as { focus?: string; protocol?: string } | undefined) ?? {};

    return {
      week,
      objective: day.focus ?? `Consolidar o ritmo da semana ${week}.`,
      protocol: day.protocol ?? `Protocolo adaptativo: semana ${week}`,
    };
  });
}
