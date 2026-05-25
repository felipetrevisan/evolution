"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/dashboard/use-dashboard";
import { api } from "@/lib/api-client";
import { SectionHeading } from "../shared/section-heading";

export function ReassessmentPanel() {
  const { data } = useDashboard();
  const [starting, setStarting] = useState(false);
  const locked = (data?.daysUntilReassessment ?? 45) > 0;

  async function startNextCycle() {
    setStarting(true);
    const startToast = toast.loading("Iniciando próximo ciclo...");

    try {
      await api.startNextCycle();
      toast.success("Novo ciclo iniciado.", { id: startToast });
    } catch {
      toast.error("Não foi possível iniciar o próximo ciclo.", { id: startToast });
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <SectionHeading
        description="A reavaliação abre quando o ciclo atual chega ao fechamento."
        eyebrow="Reavaliação"
        title="Próxima janela adaptativa"
      />
      <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
        <CardHeader>
          <CardTitle>
            {locked
              ? `${data?.daysUntilReassessment ?? 45} dias até a reavaliação`
              : "Reavaliação liberada"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            O próximo ciclo usa relatório, aderência e evolução vetorial para orientar a nova
            abertura.
          </p>
          <Button
            className="w-fit rounded-xl"
            disabled={locked || starting}
            onClick={startNextCycle}
          >
            {starting ? "Iniciando..." : "Iniciar próximo ciclo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
