"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Switch } from "@evolution/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useOperationalAssessment } from "@/hooks/onboarding/use-operational-assessment";
import { ApiClientError } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";
import {
  formatBlockDescription,
  formatBlockLabel,
  formatVectorLabel,
} from "@/lib/utils/domain-labels";

export function OperationalAssessmentForm() {
  const router = useRouter();
  const assessment = useOperationalAssessment();
  const [values, setValues] = useState<Record<number, number>>({});
  const [attentionValues, setAttentionValues] = useState<Record<string, boolean>>({});
  const questions = assessment.current?.questions ?? [];
  const attentionQuestions = assessment.current?.attentionQuestions ?? [];
  const saving =
    assessment.answer.loading ||
    assessment.complete.loading ||
    assessment.generateProfile.loading ||
    assessment.generatePlan.loading;
  const isComplete = questions.length > 0 && Object.keys(values).length === questions.length;

  async function submit() {
    const submitToast = toast.loading("Gerando perfil e plano...");
    try {
      for (const [questionId, value] of Object.entries(values)) {
        await assessment.answer.execute({
          assessmentId: assessment.current?.id,
          questionId: Number(questionId),
          value,
        });
      }
      for (const question of attentionQuestions) {
        await assessment.answer.execute({
          assessmentId: assessment.current?.id,
          attentionQuestionId: question.id,
          attentionValue: attentionValues[question.id] ?? false,
        });
      }
      await assessment.complete.execute();
      await assessment.generateProfile.execute();
      await assessment.generatePlan.execute();
      toast.success("Perfil e plano inicial criados.", { id: submitToast });
      router.push(routes.initialPlan);
    } catch (error) {
      toast.error(readErrorMessage(error), { id: submitToast });
    }
  }

  return (
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
      <CardHeader>
        <CardTitle>Autoavaliação operacional</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="rounded-2xl bg-secondary p-4 text-sm font-medium text-secondary-foreground">
          Foco desta etapa: {formatVectorLabel(assessment.current?.priorityVector)}
        </div>
        {["X", "Y", "Z"].map((block) => (
          <section className="rounded-2xl bg-muted p-4" key={block}>
            <h2 className="font-semibold">{formatBlockLabel(block)}</h2>
            <p className="mt-1 text-muted-foreground text-sm">{formatBlockDescription(block)}</p>
            <div className="mt-3 grid gap-3">
              {questions
                .filter((question) => question.block === block)
                .map((question) => (
                  <div className="grid gap-2" key={question.id}>
                    <span className="text-sm">{question.text}</span>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((option) => (
                        <button
                          aria-pressed={values[question.id] === option}
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            values[question.id] === option
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-card-foreground hover:border-primary/40"
                          }`}
                          key={option}
                          onClick={() =>
                            setValues((current) => ({
                              ...current,
                              [question.id]: option,
                            }))
                          }
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
        <section className="grid gap-3 rounded-2xl bg-muted p-4">
          <h2 className="font-semibold">Pontos de atenção</h2>
          {attentionQuestions.map((question) => (
            <div
              className="grid gap-3 rounded-2xl bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              key={question.id}
            >
              <label className="text-sm" htmlFor={`attention-${question.id}`}>
                {question.text}
              </label>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm">
                  {attentionValues[question.id] ? "Sim" : "Não"}
                </span>
                <Switch
                  checked={attentionValues[question.id] ?? false}
                  id={`attention-${question.id}`}
                  onCheckedChange={(value) =>
                    setAttentionValues((current) => ({
                      ...current,
                      [question.id]: value,
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </section>
        <Button
          className="h-12 rounded-xl font-semibold"
          disabled={!isComplete || saving}
          onClick={submit}
        >
          {saving ? "Gerando..." : "Gerar perfil e plano inicial"}
        </Button>
      </CardContent>
    </Card>
  );
}

function readErrorMessage(error: unknown) {
  return error instanceof ApiClientError
    ? error.message
    : "Não foi possível gerar seu plano agora.";
}
