"use client";

import { Button, Card, CardContent } from "@evolution/ui";
import { ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCompleteTriage } from "@/hooks/onboarding/use-complete-triage";
import { useSubmitTriageAnswer } from "@/hooks/onboarding/use-submit-triage-answer";
import { useTriageSession } from "@/hooks/onboarding/use-triage-session";
import { routes } from "@/lib/routes/routes";

const optionBorderStyles = [
  "border-sky-300/45 hover:border-sky-300 data-[selected=true]:border-sky-300 data-[selected=true]:bg-sky-500/10 data-[selected=true]:ring-sky-300/25",
  "border-orange-300/45 hover:border-orange-300 data-[selected=true]:border-orange-300 data-[selected=true]:bg-orange-500/10 data-[selected=true]:ring-orange-300/25",
  "border-pink-300/45 hover:border-pink-300 data-[selected=true]:border-pink-300 data-[selected=true]:bg-pink-500/10 data-[selected=true]:ring-pink-300/25",
  "border-emerald-300/45 hover:border-emerald-300 data-[selected=true]:border-emerald-300 data-[selected=true]:bg-emerald-500/10 data-[selected=true]:ring-emerald-300/25",
  "border-violet-300/45 hover:border-violet-300 data-[selected=true]:border-violet-300 data-[selected=true]:bg-violet-500/10 data-[selected=true]:ring-violet-300/25",
  "border-rose-300/45 hover:border-rose-300 data-[selected=true]:border-rose-300 data-[selected=true]:bg-rose-500/10 data-[selected=true]:ring-rose-300/25",
];

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
        <div className="grid gap-8">
          <div className="stitch-page-card flex items-center gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <p className="text-muted-foreground text-sm italic leading-6">
              Este espaço foi criado para você com segurança, privacidade e respeito à sua
              individualidade.
            </p>
          </div>

          <section className="grid gap-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
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
              <span className="text-sm text-muted-foreground">IM: Intenção de Mudança</span>
            </div>

            <header className="mx-auto grid max-w-3xl gap-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Pergunta {session.questionIndex + 1} de {session.totalQuestions}
              </p>
              <h2 className="text-[32px] font-semibold leading-tight text-foreground">
                {session.question.text}
              </h2>
              <p className="text-sm text-muted-foreground">
                {session.selectedIds.length} de {session.maxSelections} selecionadas
              </p>
            </header>

            <motion.div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" layout>
              {session.question.alternatives.map((alternative, index) => {
                const selected = session.selectedIds.includes(alternative.id);
                return (
                  <motion.button
                    animate={{ opacity: 1, y: 0 }}
                    className={`group flex min-h-32 cursor-pointer items-center justify-center rounded-xl border bg-card p-6 text-center font-semibold text-base text-foreground leading-snug transition hover:-translate-y-0.5 hover:bg-card/95 data-[selected=true]:text-foreground data-[selected=true]:shadow-[0_16px_40px_rgba(38,0,88,0.14)] data-[selected=true]:ring-2 ${optionBorderStyles[index % optionBorderStyles.length]}`}
                    data-selected={selected}
                    initial={{ opacity: 0, y: 10 }}
                    key={alternative.id}
                    onClick={() => session.toggle(alternative.id)}
                    transition={{ delay: index * 0.025, duration: 0.18 }}
                    type="button"
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {alternative.label}
                  </motion.button>
                );
              })}
            </motion.div>
            <Button
              className="ml-auto h-12 rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
              disabled={!session.canContinue || saving}
              onClick={continueFlow}
            >
              {saving ? "Salvando..." : session.isLastQuestion ? "Finalizar triagem" : "Continuar"}
            </Button>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
