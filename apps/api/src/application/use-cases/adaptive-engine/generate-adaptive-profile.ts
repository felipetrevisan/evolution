import {
  calculateGapC,
  calculateGapE,
  calculateGapP,
  calculateSpi,
  calculateSvc,
  classifySvc,
  selectAdaptiveLevel,
  selectBaseProtocol,
  selectSupportVector,
  VECTOR_KEYS,
  type VectorKey,
} from "../../../../../../packages/domain/src/index.ts";
import { NotFoundError } from "../../../shared/errors/api-error";
import { createId } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { AnamneseRecord } from "../../repositories/domain-repositories";
import type { InvestigationRecord } from "../investigation/record-investigation-answer";
import type { OperationalAssessmentRecord } from "../operational-assessment/record-operational-answer";
import type { TriageSessionRecord } from "../triage/record-triage-answer";

type TriageResult = {
  fvaPriority?: { vector?: VectorKey };
  imPriority?: { vector?: VectorKey };
  fva?: Record<VectorKey, { normalized: number }>;
  im?: Record<VectorKey, { normalized: number }>;
};

type OperationalResult = {
  score?: { normalized?: number };
  total?: { normalized?: number };
};

type AnamnesePayload = {
  weeklyAvailability?: "menos_2h" | "2_3h" | "4_5h" | "6h_mais";
  experienceLevel?: "nunca" | "iniciante" | "intermediario" | "avancado";
  weightHistory?: string;
  hasHealthCondition?: boolean;
  healthConditions?: string[];
};

export type AdaptiveProfileRecord = {
  id: string;
  uid: string;
  createdAt: string;
  dominantVector: VectorKey;
  supportVector?: VectorKey;
  adaptiveLevel: string;
  spi?: number;
  svcScores?: Record<VectorKey, number>;
  gaps?: {
    gapP: number;
    gapE: number;
    gapC: number;
  };
  classifications?: Record<VectorKey, string>;
  protocols: string[];
  source: string;
};

export async function generateAdaptiveProfile(
  uid: string,
  repositories: {
    profiles: UserScopedRepository<AdaptiveProfileRecord>;
    triageSessions: UserScopedRepository<TriageSessionRecord>;
    investigations: UserScopedRepository<InvestigationRecord>;
    operationalAssessments: UserScopedRepository<OperationalAssessmentRecord>;
    anamnese: UserScopedRepository<AnamneseRecord>;
  },
) {
  const [triage, investigation, operational, anamnese] = await Promise.all([
    repositories.triageSessions.getLatest(uid),
    repositories.investigations.getLatest(uid),
    repositories.operationalAssessments.getLatest(uid),
    repositories.anamnese.getLatest(uid),
  ]);
  const triageResult = triage?.result as TriageResult | undefined;
  const priorityVector = triageResult?.fvaPriority?.vector;

  if (!priorityVector || !triageResult?.fva || !triageResult.im) {
    throw new NotFoundError("Conclua a triagem antes de gerar o perfil adaptativo.");
  }

  const operationalNorm = getOperationalScore(operational?.result as OperationalResult | undefined);
  const svcScores = Object.fromEntries(
    VECTOR_KEYS.map((vector) => [
      vector,
      calculateSvc({
        vector,
        priorityVector,
        fvaNorm: triageResult.fva?.[vector]?.normalized ?? 0,
        imNorm: triageResult.im?.[vector]?.normalized ?? 0,
        ...(vector === priorityVector ? { operationalScoreNorm: operationalNorm } : {}),
        ...(vector === priorityVector && investigation?.output
          ? { investigation: investigation.output }
          : {}),
      }),
    ]),
  ) as Record<VectorKey, number>;
  const gapP = calculateGapP(priorityVector, svcScores);
  const gapE = calculateGapE(triageResult.im[priorityVector].normalized, operationalNorm);
  const gapC = calculateGapC(getGapCInput(anamnese));
  const spi = calculateSpi(svcScores[priorityVector], gapP, gapE, gapC);
  const adaptiveLevel = selectAdaptiveLevel(spi);
  const supportVector = selectSupportVector(priorityVector, svcScores);
  const protocols = [selectBaseProtocol(priorityVector, adaptiveLevel)];
  const record: AdaptiveProfileRecord = {
    id: createId("adaptive"),
    uid,
    createdAt: new Date().toISOString(),
    dominantVector: priorityVector,
    supportVector,
    adaptiveLevel,
    spi,
    svcScores,
    gaps: { gapP, gapE, gapC },
    classifications: Object.fromEntries(
      VECTOR_KEYS.map((vector) => [vector, classifySvc(svcScores[vector])]),
    ) as Record<VectorKey, string>,
    protocols,
    source: "triage-investigation-operational-anamnese",
  };

  return repositories.profiles.save(uid, record.id, record);
}

function getOperationalScore(result?: OperationalResult) {
  return result?.score?.normalized ?? result?.total?.normalized ?? 0;
}

function getGapCInput(anamnese: AnamneseRecord | null) {
  const payload = (anamnese?.payload ?? {}) as AnamnesePayload;
  const flags = anamnese?.flags ?? [];

  return {
    weeklyAvailability: payload.weeklyAvailability ?? "2_3h",
    experienceLevel: payload.experienceLevel ?? "iniciante",
    hasWeightOscillation:
      payload.weightHistory === "oscilacao_frequente" || flags.includes("weight_oscillation"),
    hasHealthCondition:
      payload.hasHealthCondition ||
      (payload.healthConditions?.length ?? 0) > 0 ||
      flags.includes("health_condition"),
    hasSystemicImpactB02: flags.includes("systemic_impact_b02"),
  };
}
