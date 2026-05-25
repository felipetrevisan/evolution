"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { Brain, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCompleteTriage } from "@/hooks/onboarding/use-complete-triage";
import { useSubmitTriageAnswer } from "@/hooks/onboarding/use-submit-triage-answer";
import { useTriageSession } from "@/hooks/onboarding/use-triage-session";
import { routes } from "@/lib/routes/routes";

export function TriageQuestionScreen() {
  const router = useRouter();
  const session = useTriageSession();
  const submitAnswer = useSubmitTriageAnswer();
  const complete = useCompleteTriage();
  const saving = submitAnswer.loading || complete.loading;

  async function continueFlow() {
    if (!session.question || saving) {
      return;
    }

    const toastId = toast.loading(
      session.isLastQuestion ? "Finalizando triagem..." : "Salvando resposta...",
    );

    try {
      const savedSession = await submitAnswer.execute({
        questionId: session.question.id,
        layer: session.question.layer,
        ...(session.sessionId ? { sessionId: session.sessionId } : {}),
        selections: session.selectedIds.flatMap((alternativeId) => {
          const alternative = session.question?.alternatives.find(
            (item) => item.id === alternativeId,
          );
          return alternative ? [{ alternativeId: alternative.id, vector: alternative.vector }] : [];
        }),
      });
      session.setSessionId(savedSession.id);

      if (session.isLastQuestion) {
        await complete.execute();
        toast.success("Triagem concluída.", { id: toastId });
        router.push(routes.triageResult);
        return;
      }

      toast.success("Resposta salva.", { id: toastId });
      session.next();
    } catch {
      toast.error("Não foi possível salvar sua resposta. Tente novamente.", { id: toastId });
    }
  }

  if (session.loading) {
    return (
      <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Carregando triagem...
        </CardContent>
      </Card>
    );
  }

  if (session.error || !session.question) {
    return (
      <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
        <CardContent className="p-6 text-sm text-destructive">
          {session.error ?? "Triagem indisponível."}
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -20, y: 4 }}
        initial={{ opacity: 0, x: 24, y: 8 }}
        key={session.question.id}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
          <CardHeader className="items-center text-center">
            <div className="mb-2 rounded-xl bg-muted px-6 py-4 text-sm italic text-muted-foreground">
              Responda de forma espontânea. Não há resposta certa ou errada.
            </div>
            <div className="flex items-center gap-4">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                1
              </span>
              <span className="text-sm font-bold text-primary">
                FVA: Fragilidade Vetorial Atual
              </span>
              <span className="h-px w-16 bg-border" />
              <span className="grid size-8 place-items-center rounded-full bg-muted-foreground text-sm font-bold text-background">
                2
              </span>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Pergunta {session.questionIndex + 1} de {session.totalQuestions}
            </p>
            <CardTitle className="max-w-2xl text-[32px] leading-tight">
              {session.question.text}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {session.selectedIds.length} de {session.maxSelections} selecionadas
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <motion.div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" layout>
              {session.question.alternatives.map((alternative, index) => {
                const selected = session.selectedIds.includes(alternative.id);
                return (
                  <motion.button
                    animate={{ opacity: 1, y: 0 }}
                    className={`group flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border p-5 text-center text-sm font-semibold transition ${
                      selected
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card hover:border-primary"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    key={alternative.id}
                    onClick={() => session.toggle(alternative.id)}
                    transition={{ delay: index * 0.025, duration: 0.18 }}
                    type="button"
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary transition group-hover:scale-110">
                      {selected ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        <Brain className="size-6" />
                      )}
                    </span>
                    {alternative.label}
                  </motion.button>
                );
              })}
            </motion.div>
            <Button
              className="ml-auto h-12 rounded-xl px-8 font-semibold"
              disabled={!session.canContinue || saving}
              onClick={continueFlow}
            >
              {saving ? "Salvando..." : session.isLastQuestion ? "Finalizar triagem" : "Continuar"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
