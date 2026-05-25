"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitCheckin } from "@/hooks/check-in/use-submit-checkin";
import { useTodayCheckin } from "@/hooks/check-in/use-today-checkin";
import type { CheckInPayload } from "@/lib/api-client";

const simpleStates: Array<NonNullable<CheckInPayload["emotionalState"]>> = [
  "calm",
  "neutral",
  "difficult",
];
const expandedStates: Array<NonNullable<CheckInPayload["completedStatus"]>> = [
  "completed",
  "partial",
  "not_completed",
];

export function CheckInForm() {
  const { data } = useTodayCheckin();
  const submit = useSubmitCheckin();
  const [emotionalState, setEmotionalState] =
    useState<NonNullable<CheckInPayload["emotionalState"]>>("neutral");
  const [completedStatus, setCompletedStatus] =
    useState<NonNullable<CheckInPayload["completedStatus"]>>("completed");
  const [note, setNote] = useState("");
  const expanded = data?.mode === "expanded";

  async function save() {
    const checkinToast = toast.loading("Registrando check-in...");
    const payload: CheckInPayload = expanded
      ? {
          completedStatus,
          ...(note ? { note } : {}),
        }
      : { completedStatus: "completed", emotionalState };

    try {
      await submit.execute(payload);
      toast.success("Check-in registrado.", { id: checkinToast });
    } catch {
      toast.error("Não foi possível registrar o check-in.", { id: checkinToast });
    }
  }

  return (
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
      <CardHeader>
        <CardTitle>Check-in do dia {data?.cycleDay ?? 1}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="rounded-2xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">Micro-meta</p>
          <p className="mt-2 font-semibold">{data?.microGoal ?? "Carregando..."}</p>
          {expanded ? (
            <p className="mt-2 text-sm text-primary">Palavra IM: {data?.imWord ?? "foco"}</p>
          ) : null}
        </div>

        {expanded ? (
          <div className="grid gap-3">
            <p className="text-sm font-medium">Como ficou a execução?</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {expandedStates.map((state) => (
                <ToggleButton
                  active={completedStatus === state}
                  key={state}
                  label={statusLabel(state)}
                  onClick={() => setCompletedStatus(state)}
                />
              ))}
            </div>
            <textarea
              className="min-h-28 rounded-2xl border border-border bg-card p-4 text-card-foreground outline-none focus:border-primary"
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nota opcional"
              value={note}
            />
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm font-medium">Estado emocional</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {simpleStates.map((state) => (
                <ToggleButton
                  active={emotionalState === state}
                  key={state}
                  label={emotionLabel(state)}
                  onClick={() => setEmotionalState(state)}
                />
              ))}
            </div>
          </div>
        )}

        {data?.recalibrationMessages?.map((message) => (
          <p className="rounded-2xl bg-accent p-4 text-sm text-accent-foreground" key={message}>
            {message}
          </p>
        ))}

        <Button className="h-12 rounded-xl font-semibold" disabled={submit.loading} onClick={save}>
          {submit.loading ? "Registrando..." : "Registrar check-in"}
        </Button>
      </CardContent>
    </Card>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function emotionLabel(state: NonNullable<CheckInPayload["emotionalState"]>) {
  return {
    calm: "Calmo",
    neutral: "Neutro",
    difficult: "Difícil",
  }[state];
}

function statusLabel(state: NonNullable<CheckInPayload["completedStatus"]>) {
  return {
    completed: "Concluído",
    partial: "Parcial",
    not_completed: "Não concluído",
  }[state];
}
