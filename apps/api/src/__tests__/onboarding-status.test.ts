import { describe, expect, test } from "bun:test";
import { getOnboardingStatus } from "../application/use-cases/onboarding/get-onboarding-status";
import { createMemoryRepository } from "./test-repository";

describe("onboarding status", () => {
  test("returns the next route from persisted progress", async () => {
    const status = await getOnboardingStatus("user_1", {
      cycles: createMemoryRepository([{ id: "cycle_1", uid: "user_1", createdAt: "2026-01-01" }]),
      bodyMeasurements: createMemoryRepository([
        { id: "body_1", uid: "user_1", createdAt: "2026-01-01" },
      ]),
      triageSessions: createMemoryRepository([
        {
          id: "triage_1",
          uid: "user_1",
          createdAt: "2026-01-02",
          status: "completed",
          result: {
            fvaPriority: { vector: "constancia", requiresUserChoice: false },
            imPriority: { vector: "comportamento", requiresUserChoice: false },
          },
        },
      ]),
      investigations: createMemoryRepository([]),
      operationalAssessments: createMemoryRepository([]),
      adaptiveProfiles: createMemoryRepository([]),
      plans: createMemoryRepository([]),
    });

    expect(status.currentStep).toBe("investigacao");
    expect(status.completedSteps).toContain("resultado-triagem");
    expect(status.nextRoute).toBe("/onboarding/investigation");
  });
});
