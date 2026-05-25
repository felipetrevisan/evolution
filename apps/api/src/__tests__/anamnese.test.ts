import { describe, expect, test } from "bun:test";
import type {
  AnamneseRecord,
  BodyMeasurementRecord,
  CycleRecord,
} from "../application/repositories/domain-repositories";
import { saveAnamnese } from "../application/use-cases/anamnese/save-anamnese";
import { createMemoryRepository } from "./test-repository";

describe("anamnese", () => {
  test("stores BMI measurement and creates current cycle", async () => {
    const anamnese = createMemoryRepository<AnamneseRecord>();
    const bodyMeasurements = createMemoryRepository<BodyMeasurementRecord>();
    const cycles = createMemoryRepository<CycleRecord>();

    const record = await saveAnamnese(
      "user_1",
      {
        age: 33,
        heightCm: 175,
        weightKg: 70,
        biologicalSex: "feminino",
        healthConditions: ["hipertensao"],
      },
      { anamnese, bodyMeasurements, cycles },
    );

    expect(record.bmi).toBe(22.86);
    expect(record.bmiCategory).toBe("Peso normal");
    expect("warnings" in record ? record.warnings : []).toContain("Histórico de saúde informado.");
    expect(await anamnese.getLatest("user_1")).toMatchObject({
      bmi: 22.86,
      bmiCategory: "Peso normal",
      currentCycleId: expect.any(String),
    });
    expect(await cycles.getLatest("user_1")).toMatchObject({ status: "active" });
  });
});
