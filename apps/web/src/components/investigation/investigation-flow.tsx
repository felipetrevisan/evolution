"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { GitBranch } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useInvestigationFlow } from "@/hooks/onboarding/use-investigation-flow";
import { routes } from "@/lib/routes/routes";

export function InvestigationFlow() {
  const router = useRouter();
  const flow = useInvestigationFlow();
  const [selectedOption, setSelectedOption] = useState("");
  const question = flow.current?.currentQuestion;
  const step = getInvestigationStep(question?.block);
  const finished = flow.current?.status === "completed";

  async function next() {
    if (!question || !selectedOption) return;

    const answerToast = toast.loading("Salvando resposta...");
    try {
      await flow.answer.execute({
        sessionId: flow.current?.id,
        questionId: question.id,
        answer: selectedOption,
      });
      setSelectedOption("");
      await flow.refresh();
      toast.success("Resposta salva.", { id: answerToast });
    } catch {
      toast.error("Não foi possível salvar sua resposta.", { id: answerToast });
    }
  }

  async function complete() {
    if (finished) {
      router.push(routes.operationalAssessment);
      return;
    }

    const completeToast = toast.loading("Concluindo investigação...");
    try {
      await flow.complete.execute();
      toast.success("Investigação concluída.", { id: completeToast });
      router.push(routes.operationalAssessment);
    } catch {
      toast.error("Responda todas as perguntas antes de concluir.", { id: completeToast });
    }
  }

  if (flow.loading) {
    return (
      <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
        <CardContent className="p-6 text-muted-foreground text-sm">
          Carregando investigação...
        </CardContent>
      </Card>
    );
  }

  if (flow.error || !flow.current) {
    return (
      <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
        <CardContent className="p-6 text-destructive text-sm">
          {flow.error ?? "Investigação indisponível."}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="size-5 text-primary" />
          Investigação adaptativa
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {question ? (
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="rounded-2xl bg-muted p-5"
              exit={{ opacity: 0, x: -18, y: 4 }}
              initial={{ opacity: 0, x: 20, y: 8 }}
              key={question.id}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                {step.prefix} {step.title}
              </p>
              <p className="text-lg font-semibold">{question.text}</p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="rounded-2xl bg-muted p-5">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {finished ? "Investigação concluída" : "Perguntas respondidas"}
            </p>
            <p className="text-lg font-semibold">
              {finished
                ? "Sua investigação já foi concluída. Continue para a autoavaliação operacional."
                : "Todas as perguntas desta etapa foram respondidas. Conclua para avançar."}
            </p>
          </div>
        )}

        {question ? (
          <motion.div className="grid gap-3" layout>
            {question.options.map((option, index) => (
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="cursor-pointer rounded-2xl border border-border bg-card p-4 text-left text-card-foreground transition hover:border-primary hover:bg-primary/5 data-[selected=true]:border-primary data-[selected=true]:bg-primary/10"
                data-selected={selectedOption === option.id}
                initial={{ opacity: 0, y: 10 }}
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                transition={{ delay: index * 0.035, duration: 0.18 }}
                type="button"
                whileHover={{ scale: 1.01, x: 3 }}
                whileTap={{ scale: 0.985 }}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="cursor-pointer rounded-xl"
            disabled={!question || !selectedOption || flow.answer.loading}
            onClick={next}
          >
            {flow.answer.loading ? "Salvando..." : "Responder"}
          </Button>
          <Button
            className="cursor-pointer rounded-xl"
            disabled={flow.complete.loading}
            onClick={complete}
            type="button"
            variant="secondary"
          >
            {finished
              ? "Ir para autoavaliação"
              : flow.complete.loading
                ? "Concluindo..."
                : "Concluir etapa"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getInvestigationStep(block?: string) {
  const steps: Record<string, { prefix: string; title: string }> = {
    X: { prefix: "Etapa 1 de 3 ·", title: "Origem do padrão" },
    Y: { prefix: "Etapa 2 de 3 ·", title: "Gatilhos e contexto" },
    Z: { prefix: "Etapa 3 de 3 ·", title: "Padrões que mantêm" },
  };

  return steps[block ?? ""] ?? { prefix: "Investigação ·", title: "Entendendo seu padrão" };
}
