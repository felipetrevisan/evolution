import { describe, expect, test } from "bun:test";
import { OPERATIONAL_QUESTIONS } from "@evolution/domain";
import type { AdminConfigRepository } from "../application/repositories/admin-config-repository";
import { completeOperationalAssessment } from "../application/use-cases/operational-assessment/complete-operational-assessment";
import type { OperationalAssessmentRecord } from "../application/use-cases/operational-assessment/record-operational-answer";
import { ApiError } from "../shared/errors/api-error";
import { createMemoryRepository } from "./test-repository";

const adminConfig = {
  getOperationalQuestions: async () => OPERATIONAL_QUESTIONS,
} as AdminConfigRepository;

describe("operational assessment", () => {
  test("rejects incomplete assessment", async () => {
    const repository = createMemoryRepository<OperationalAssessmentRecord>([
      {
        id: "operational_1",
        uid: "user_1",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        status: "in_progress",
        values: [{ questionId: 1, value: 6 }],
      },
    ]);

    await expect(
      completeOperationalAssessment("user_1", { assessments: repository, adminConfig }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  test("completes assessment with total and block scores", async () => {
    const repository = createMemoryRepository<OperationalAssessmentRecord>([
      {
        id: "operational_1",
        uid: "user_1",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        status: "in_progress",
        values: Array.from({ length: 12 }, (_, index) => ({
          questionId: index + 1,
          value: 6 as const,
        })),
      },
    ]);

    const completed = await completeOperationalAssessment("user_1", {
      assessments: repository,
      adminConfig,
    });

    expect(completed.status).toBe("completed");
    expect(completed.result).toMatchObject({
      score: { raw: 72, normalized: 100 },
      blocks: {
        X: { raw: 24, normalized: 100 },
        Y: { raw: 24, normalized: 100 },
        Z: { raw: 24, normalized: 100 },
      },
    });
  });
});
