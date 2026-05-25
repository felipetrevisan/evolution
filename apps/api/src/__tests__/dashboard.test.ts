import { describe, expect, test } from "bun:test";
import { getDashboard } from "../application/use-cases/dashboard/get-dashboard";
import { createMemoryRepository } from "./test-repository";

describe("dashboard aggregation", () => {
  test("aggregates cycle, plan, check-ins and assessment data", async () => {
    const dashboard = await getDashboard("user_1", {
      cycles: createMemoryRepository([
        {
          id: "cycle_1",
          uid: "user_1",
          createdAt: "2026-01-01",
          startedAt: new Date().toISOString(),
          status: "active",
        },
      ]),
      plans: createMemoryRepository([
        {
          id: "plan_1",
          uid: "user_1",
          createdAt: "2026-01-02",
          status: "active",
          startDate: "2026-01-02",
          priorityVector: "constancia",
          supportVector: "controle_emocional",
          regulationVector: "gestao_pessoal",
          protocolBase: "protocolo-base",
          imWords: ["foco"],
          weeklyObjectives: [],
          days: [{ focus: "Micro-meta do dia", protocol: "protocolo" }],
        },
      ]),
      checkins: createMemoryRepository([
        {
          id: "check_1",
          uid: "user_1",
          createdAt: "2026-01-03",
          date: new Date().toISOString().slice(0, 10),
          completedStatus: "completed",
          energy: 80,
          mood: 70,
          adherence: 90,
          stability: 82,
        },
      ]),
      profiles: createMemoryRepository([
        {
          id: "profile_1",
          uid: "user_1",
          createdAt: "2026-01-03",
          dominantVector: "constancia",
          adaptiveLevel: "Nível 3 — Construção",
          protocols: ["protocolo-base"],
          source: "test",
        },
      ]),
      bodyMeasurements: createMemoryRepository([
        {
          id: "body_1",
          uid: "user_1",
          createdAt: "2026-01-01",
          bmi: 22.86,
          bmiCategory: "Peso normal",
          payload: { fullName: "Maria Silva", weightKg: 70 },
        },
      ]),
      triageSessions: createMemoryRepository([]),
      operationalAssessments: createMemoryRepository([
        {
          id: "operational_1",
          uid: "user_1",
          createdAt: "2026-01-04",
          result: {
            total: { normalized: 56 },
            blocks: { X: { normalized: 40, status: "Moderado" } },
          },
        },
      ]),
      users: {
        async get() {
          return {
            uid: "user_1",
            email: "maria@example.com",
            name: "Maria Oliveira",
            role: "user" as const,
            updatedAt: "2026-01-01",
          };
        },
        async getByEmail() {
          return null;
        },
        async list() {
          return [];
        },
        async upsert() {
          throw new Error("not used");
        },
      },
    });

    expect(dashboard.user.greetingName).toBe("Maria");
    expect(dashboard.currentCycle.day).toBe(1);
    expect(dashboard.weeklyFrequency.completed).toBe(1);
    expect(dashboard.currentFocusVector.label).toBe("Constância");
    expect(dashboard.nextMicroGoal).toBe("Micro-meta do dia");
    expect(dashboard.operationalBlockScores[0]).toMatchObject({ block: "X", normalized: 40 });
  });
});
