import { CICLO_PADRAO_DIAS, calculateBmi, classifyBmi, validateBmi } from "@evolution/domain";
import type { AnamneseBodyDto } from "../../../presentation/dtos/anamnese.dto";
import { createId } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type {
  AnamneseRecord,
  BodyMeasurementRecord,
  CycleRecord,
} from "../../repositories/domain-repositories";
import type { UserRepository } from "../../repositories/user-repository";

export async function saveAnamnese(
  uid: string,
  dto: AnamneseBodyDto,
  repositories: {
    anamnese: UserScopedRepository<AnamneseRecord>;
    bodyMeasurements: UserScopedRepository<BodyMeasurementRecord>;
    cycles: UserScopedRepository<CycleRecord>;
    users?: UserRepository;
  },
) {
  const now = new Date().toISOString();
  const bmi = calculateBmi(dto.weightKg, dto.heightCm);
  const activeCycle = await getOrCreateActiveCycle(uid, now, repositories.cycles);
  const warnings = buildAnamneseWarnings(dto);
  const flags = buildAnamneseFlags(dto);

  if (repositories.users) {
    await repositories.users.upsert(uid, {
      ...(dto.fullName ? { name: dto.fullName } : {}),
      ...(dto.biologicalSex ? { gender: dto.biologicalSex } : {}),
      goals: [dto.desiredResult, dto.motivator].filter(Boolean).map(String),
      onboarding: {
        anamneseCompletedAt: now,
        currentCycleId: activeCycle.id,
      },
    });
  }

  const anamneseRecord: AnamneseRecord = {
    id: createId("anamnese"),
    uid,
    createdAt: now,
    currentCycleId: activeCycle.id,
    payload: dto,
    bmi,
    bmiCategory: classifyBmi(bmi),
    flags,
  };
  await repositories.anamnese.save(uid, anamneseRecord.id, anamneseRecord);

  const record = {
    id: createId("body"),
    uid,
    createdAt: now,
    cycleId: activeCycle.id,
    payload: {
      weightKg: dto.weightKg,
      heightCm: dto.heightCm,
      waistCm: dto.waistCm,
      hipCm: dto.hipCm,
      armCm: dto.armCm,
      thighCm: dto.thighCm,
    },
    bmi,
    bmiCategory: classifyBmi(bmi),
    warnings,
  };

  return repositories.bodyMeasurements.save(uid, record.id, record);
}

async function getOrCreateActiveCycle(
  uid: string,
  now: string,
  cycles: UserScopedRepository<CycleRecord>,
) {
  const latestCycle = await cycles.getLatest(uid);

  if (latestCycle?.status === "active") {
    return latestCycle;
  }

  const cycle: CycleRecord = {
    id: createId("cycle"),
    uid,
    createdAt: now,
    startedAt: now,
    durationDays: CICLO_PADRAO_DIAS,
    status: "active",
  };
  await cycles.save(uid, cycle.id, cycle);
  return cycle;
}

function buildAnamneseWarnings(dto: AnamneseBodyDto) {
  return [
    ...validateBmi(dto.weightKg, dto.heightCm).warnings,
    ...(dto.hasHealthCondition || (dto.healthConditions?.length ?? 0) > 0
      ? ["Histórico de saúde informado."]
      : []),
    ...(dto.femaleHealth?.pregnancyOrPostpartum ||
    dto.femaleHealth?.pregnancyOrBreastfeeding === "gestante" ||
    dto.femaleHealth?.pregnancyOrBreastfeeding === "amamentando"
      ? ["Bloco feminino requer atenção contextual."]
      : []),
  ];
}

function buildAnamneseFlags(dto: AnamneseBodyDto) {
  return [
    ...(dto.hasHealthCondition || (dto.healthConditions?.length ?? 0) > 0
      ? ["health_condition"]
      : []),
    ...(dto.weightHistory === "oscilacao_frequente" ? ["weight_oscillation"] : []),
    ...(dto.femaleHealth?.pregnancyOrBreastfeeding === "gestante" ? ["pregnancy"] : []),
    ...(dto.femaleHealth?.pregnancyOrBreastfeeding === "amamentando" ? ["breastfeeding"] : []),
  ];
}
