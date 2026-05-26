"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { ArrowRight, Compass, Heart, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  const [localResult, setLocalResult] = useState(result);
  const needsFvaChoice = localResult.fvaPriority.requiresUserChoice;
  const needsImChoice = localResult.imPriority.requiresUserChoice;
  const canContinue = !needsFvaChoice && !needsImChoice && Boolean(localResult.fvaPriority.vector);

  async function chooseTieBreak(layer: "FVA" | "IM", vector: string) {
    const tieToast = toast.loading("Salvando escolha...");

    try {
      const session = await api.triageTieBreak({ layer, vector });
      const nextResult = (session as TriageSessionData).result;

      if (nextResult) {
        setLocalResult(nextResult);
      }

      toast.success("Escolha salva.", { id: tieToast });
    } catch {
      toast.error("Não foi possível salvar sua escolha.", { id: tieToast });
    }
  }

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
          {canContinue ? (
            <Button asChild className="h-12 rounded-xl bg-white text-primary hover:bg-white/90">
              <Link href={routes.investigation}>
                Continuar investigação
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {needsFvaChoice ? (
        <TieBreakCard
          description="Duas ou mais áreas apareceram com a mesma intensidade. Escolha qual delas parece mais importante trabalhar primeiro."
          layer="FVA"
          onChoose={chooseTieBreak}
          title="Escolha sua prioridade inicial"
          vectors={localResult.fvaPriority.tiedVectors}
        />
      ) : null}

      {!needsFvaChoice && needsImChoice ? (
        <TieBreakCard
          description="Essa escolha ajusta a linguagem do seu plano para ficar mais próxima do que te move hoje."
          layer="IM"
          onChoose={chooseTieBreak}
          title="Escolha o foco de motivação"
          vectors={localResult.imPriority.tiedVectors}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <ResultHighlight
          description="É o vetor que pede mais atenção na abertura operacional."
          icon={Target}
          label="Vetor prioritário"
          value={formatVectorLabel(localResult.fvaPriority.vector)}
        />
        <ResultHighlight
          description="É o vetor que ajuda a linguagem e motivação do plano."
          icon={Heart}
          label="Intenção dominante"
          value={formatVectorLabel(localResult.imPriority.vector)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <VectorGroup icon={Compass} title="Fragilidade vetorial atual" values={localResult.fva} />
        <VectorGroup icon={Sparkles} title="Intenção de movimento" values={localResult.im} />
      </div>
    </section>
  );
}

function TieBreakCard({
  description,
  layer,
  onChoose,
  title,
  vectors,
}: {
  description: string;
  layer: "FVA" | "IM";
  onChoose: (layer: "FVA" | "IM", vector: string) => void;
  title: string;
  vectors: string[];
}) {
  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/10">
      <CardContent className="grid gap-4 p-5">
        <div>
          <p className="font-semibold text-lg">{title}</p>
          <p className="mt-1 text-muted-foreground text-sm leading-6">{description}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {vectors.map((vector) => (
            <Button
              className="h-auto min-h-12 cursor-pointer justify-start rounded-xl py-3"
              key={vector}
              onClick={() => onChoose(layer, vector)}
              type="button"
              variant="outline"
            >
              {formatVectorLabel(vector)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
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
