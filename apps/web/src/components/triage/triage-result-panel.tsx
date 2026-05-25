"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { ArrowRight, Compass, Heart, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type TriageDiagnosticSummary, type TriageSessionData } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";
import { formatVectorLabel } from "@/lib/utils/domain-labels";

export function TriageResultPanel() {
  const [session, setSession] = useState<TriageSessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .currentTriageResult()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
        <CardContent className="p-6 text-muted-foreground text-sm">
          Preparando seu resultado...
        </CardContent>
      </Card>
    );
  }

  if (!session?.result) {
    return <PendingResult />;
  }

  return <TriageResult result={session.result} />;
}

function TriageResult({ result }: { result: TriageDiagnosticSummary }) {
  const fvaVector = result.fvaPriority.vector;
  const imVector = result.imPriority.vector;
  const fvaLabel = formatVectorLabel(fvaVector);
  const imLabel = formatVectorLabel(imVector);

  return (
    <section className="grid gap-6 pb-24 md:pb-8">
      <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-primary-container to-primary text-primary-foreground shadow-xl shadow-primary/20">
        <CardContent className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-3">
            <Badge className="w-fit bg-white/15 text-primary-foreground">Triagem concluída</Badge>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight">
              Seu mapa inicial está pronto.
            </h1>
            <p className="max-w-2xl text-primary-foreground/85 leading-7">
              A próxima etapa aprofunda o que apareceu aqui para entender origem, gatilhos e padrões
              que sustentam o seu comportamento atual.
            </p>
          </div>
          <Button asChild className="h-12 rounded-xl bg-white text-primary hover:bg-white/90">
            <Link href={routes.investigation}>
              Continuar investigação
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultHighlight
          description="É o vetor que pede mais atenção na abertura operacional."
          icon={Target}
          label="Vetor prioritário"
          value={fvaLabel}
        />
        <ResultHighlight
          description="É o vetor que ajuda a linguagem e motivação do plano."
          icon={Heart}
          label="Intenção dominante"
          value={imLabel}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <VectorGroup icon={Compass} title="Fragilidade vetorial atual" values={result.fva} />
        <VectorGroup icon={Sparkles} title="Intenção de movimento" values={result.im} />
      </div>
    </section>
  );
}

function PendingResult() {
  return (
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
      <CardContent className="grid gap-4 p-6">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <Compass className="size-6" />
        </span>
        <div>
          <h2 className="font-semibold text-xl">Resultado ainda não disponível</h2>
          <p className="mt-2 text-muted-foreground text-sm leading-6">
            Finalize a triagem para liberar seu mapa inicial e seguir para a investigação.
          </p>
        </div>
        <Button asChild className="w-fit rounded-xl">
          <Link href={routes.triage}>Voltar para triagem</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ResultHighlight({
  description,
  icon: Icon,
  label,
  value,
}: {
  description: string;
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardContent className="flex gap-4 p-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <Icon className="size-6" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          <p className="mt-2 text-muted-foreground text-sm leading-6">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function VectorGroup({
  icon: Icon,
  title,
  values,
}: {
  icon: typeof Compass;
  title: string;
  values: TriageDiagnosticSummary["fva"];
}) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {Object.entries(values).map(([vector, score]) => (
          <div className="rounded-2xl border border-border bg-muted p-4" key={vector}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{formatVectorLabel(vector)}</p>
              <Badge className="bg-card text-muted-foreground">{score.classification}</Badge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-card">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, score.normalized))}%` }}
              />
            </div>
            <p className="mt-2 text-muted-foreground text-xs">
              {Math.round(score.normalized)}% de intensidade
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
