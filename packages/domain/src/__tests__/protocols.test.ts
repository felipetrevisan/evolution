import { describe, expect, test } from "bun:test";
import { generateActionPlan } from "../plan";
import { selectBaseProtocol, selectSupportVector, shouldRecalibrate } from "../protocols";

describe("protocols", () => {
  test("selects base protocol", () => {
    expect(selectBaseProtocol("constancia", "Nível 2 — Estruturação")).toBe(
      "Continuidade Resiliente · Nível 2 — Estruturação",
    );
  });

  test("selects support vector by highest IM and lowest FVA", () => {
    expect(
      selectSupportVector("comportamento", {
        fva: {
          comportamento: 90,
          constancia: 50,
          gestao_pessoal: 30,
          controle_emocional: 20,
        },
        im: {
          comportamento: 80,
          constancia: 70,
          gestao_pessoal: 70,
          controle_emocional: 40,
        },
      }),
    ).toBe("gestao_pessoal");
  });

  test("applies recalibration rule", () => {
    expect(shouldRecalibrate({ missedCheckIns: 3, averageStability: 90 })).toBe(true);
    expect(shouldRecalibrate({ missedCheckIns: 0, averageStability: 44 })).toBe(true);
  });

  test("generates actionable weeks with base, support and regulation actions", () => {
    const plan = generateActionPlan("constancia", "Nível 3 — Construção", {
      supportVector: "gestao_pessoal",
    });

    expect(plan.weeks).toHaveLength(6);
    expect(plan.weeks[0]?.base.action).toBe("3 presenças na semana");
    expect(plan.weeks[0]?.support.vector).toBe("gestao_pessoal");
    expect(plan.days[0]?.supportAction).toBe("3 blocos fixos no dia");
    expect(plan.days[0]?.regulationAction).toBe("Check-in de domingo por 5 minutos");
  });
});
