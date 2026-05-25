"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { ArrowRight, BarChart3, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCycleReport } from "@/hooks/dashboard/use-cycle-report";
import { api, type CycleReportData } from "@/lib/api-client";
import { SectionHeading } from "../shared/section-heading";

export function CycleReport() {
  const { data } = useCycleReport();
  const [starting, setStarting] = useState(false);

  async function startNextCycle() {
    const notification = toast.loading("Preparando o próximo ciclo...");
    setStarting(true);

    try {
      await api.startNextCycle();
      toast.success("Próximo ciclo iniciado.", { id: notification });
    } catch {
      toast.error("Não foi possível iniciar o próximo ciclo.", { id: notification });
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="grid gap-6 pb-24 md:pb-8">
      <SectionHeading
        description="Disponível ao final do ciclo, quando seu fechamento estiver pronto."
        eyebrow="Relatório"
        title="Fechamento do ciclo"
      />
      {!data ? (
        <Card className="stitch-glass-card stitch-soft-shadow rounded-[24px] border-0">
          <CardContent className="grid gap-4 p-6 md:grid-cols-[auto_1fr] md:items-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-7" />
            </span>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Seu fechamento ainda não está pronto
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Ele será liberado ao final do ciclo, reunindo presença, evolução e recomendações
                para o próximo período.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
          <CardHeader>
            <CardTitle>{data.summary}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-3">
              <ReportMetric label="Streak" value={`${data.streak} dias`} />
              <ReportMetric label="Aderência" value={`${data.adherence}%`} />
              <ReportMetric label="Metas concluídas" value={`${data.completedGoals}`} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <BeforeAfterPanel report={data} />
              <VectorEvolutionPanel report={data} />
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="font-semibold">Recomendação para o próximo ciclo</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {data.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      <Button className="w-fit rounded-full" disabled={starting} onClick={startNextCycle}>
        {starting ? "Iniciando..." : "Iniciar próximo ciclo"}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function BeforeAfterPanel({ report }: { report: NonNullable<CycleReportData> }) {
  const before = summarizeMeasurement(report.beforeAfter.before, "Início do ciclo");
  const after = summarizeMeasurement(report.beforeAfter.after, "Fechamento");

  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="mb-4 flex items-center gap-2">
        <Scale className="size-5 text-primary" />
        <p className="font-semibold">Antes e depois</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ReportSnapshot title="Início" values={before} />
        <ReportSnapshot title="Agora" values={after} />
      </div>
    </div>
  );
}

function VectorEvolutionPanel({ report }: { report: NonNullable<CycleReportData> }) {
  const summaries = summarizeVectorEvolution(report.vectorEvolution);

  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="size-5 text-primary" />
        <p className="font-semibold">Evolução vetorial</p>
      </div>
      <div className="grid gap-2">
        {summaries.map((summary) => (
          <p className="rounded-xl bg-card p-3 text-sm text-muted-foreground" key={summary}>
            {summary}
          </p>
        ))}
      </div>
    </div>
  );
}

function ReportSnapshot({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-xl bg-card p-3">
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      <div className="grid gap-1">
        {values.map((value) => (
          <p className="text-sm text-muted-foreground" key={value}>
            {value}
          </p>
        ))}
      </div>
    </div>
  );
}

function summarizeMeasurement(value: unknown, fallback: string) {
  const record = toRecord(value);

  if (!record) {
    return [`${fallback}: sem registro disponível`];
  }

  const items = [
    formatField(record.createdAt, "Data", formatDate),
    formatField(record.weightKg, "Peso", (item) => `${item} kg`),
    formatField(record.bmi, "IMC", String),
    formatField(record.bmiCategory, "Classificação", String),
  ].filter(isString);

  return items.length > 0 ? items : [`${fallback}: registro sem detalhes`];
}

function summarizeVectorEvolution(values: unknown[]) {
  if (values.length === 0) {
    return ["A evolução será exibida quando houver dados suficientes no ciclo."];
  }

  return values.flatMap((value) => {
    const record = toRecord(value);
    const priorityFva = toRecord(record?.priorityFvaVector);
    const priorityIm = toRecord(record?.priorityImVector);
    const diagnosticSummary = record?.diagnosticSummary ?? record?.summary;

    return [
      formatField(priorityFva?.label, "Foco de abertura", String),
      formatField(priorityIm?.label, "Intenção predominante", String),
      typeof diagnosticSummary === "string" ? diagnosticSummary : null,
    ].filter(isString);
  });
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function formatField<T>(value: unknown, label: string, formatter: (value: T) => string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return `${label}: ${formatter(value as T)}`;
}

function isString(value: string | null): value is string {
  return typeof value === "string";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
