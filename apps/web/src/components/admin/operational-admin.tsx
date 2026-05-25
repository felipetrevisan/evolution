"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@evolution/ui";
import { Edit3, Save, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, type OperationalQuestion } from "@/lib/api-client";
import { formatBlockDescription, formatBlockLabel } from "@/lib/utils/domain-labels";
import { DropdownSelect } from "../shared/dropdown-select";

const blockOptions = [
  { label: "Base de execução", value: "X" },
  { label: "Rotina e continuidade", value: "Y" },
  { label: "Autogestão e ajustes", value: "Z" },
] as const;

export function OperationalAdmin() {
  const [questions, setQuestions] = useState<OperationalQuestion[]>([]);
  const [draft, setDraft] = useState<OperationalQuestion | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .adminOperationalQuestions()
      .then((response) => setQuestions(response.questions))
      .catch(() => toast.error("Não foi possível carregar a autoavaliação."));
  }, []);

  async function save() {
    setSaving(true);
    const notification = toast.loading("Salvando autoavaliação...");

    try {
      const response = await api.adminSaveOperationalQuestions({ questions });
      setQuestions(response.questions);
      toast.success("Autoavaliação atualizada.", { id: notification });
    } catch {
      toast.error("Não foi possível salvar a autoavaliação.", { id: notification });
    } finally {
      setSaving(false);
    }
  }

  function updateQuestion(question: OperationalQuestion) {
    setQuestions((current) => current.map((item) => (item.id === question.id ? question : item)));
    setDraft(null);
  }

  return (
    <section className="grid gap-6">
      <Card className="border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" />
                Autoavaliação operacional
              </CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Configure as perguntas práticas avaliadas no onboarding.
              </p>
            </div>
            <Button disabled={saving} onClick={save} size="sm" type="button">
              <Save className="size-4" />
              Salvar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {blockOptions.map((block) => (
            <section className="grid gap-3 rounded-2xl bg-muted p-4" key={block.value}>
              <div>
                <h2 className="font-semibold">{formatBlockLabel(block.value)}</h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {formatBlockDescription(block.value)}
                </p>
              </div>
              {questions
                .filter((question) => question.block === block.value)
                .map((question) => (
                  <div
                    className="grid gap-3 rounded-xl bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    key={question.id}
                  >
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold">
                        Pergunta {question.id}
                      </p>
                      <p className="mt-1 text-sm">{question.text}</p>
                    </div>
                    <Button
                      onClick={() => setDraft(question)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Edit3 className="size-4" />
                      Editar
                    </Button>
                  </div>
                ))}
            </section>
          ))}
        </CardContent>
      </Card>

      <Dialog onOpenChange={(open) => !open && setDraft(null)} open={!!draft}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar pergunta</DialogTitle>
            <DialogDescription>Use uma pergunta objetiva e fácil de responder.</DialogDescription>
          </DialogHeader>
          {draft ? <QuestionEditor draft={draft} onSave={updateQuestion} /> : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function QuestionEditor({
  draft,
  onSave,
}: {
  draft: OperationalQuestion;
  onSave: (question: OperationalQuestion) => void;
}) {
  const [value, setValue] = useState(draft);

  return (
    <div className="grid gap-4">
      <DropdownSelect
        label="Área"
        onChange={(block) => setValue((current) => ({ ...current, block }))}
        options={blockOptions}
        value={value.block as "X" | "Y" | "Z"}
      />
      <label className="grid gap-2 text-sm font-medium">
        Pergunta
        <textarea
          className="min-h-28 rounded-xl border border-border bg-muted p-3 outline-none focus:ring-2 focus:ring-primary"
          onChange={(event) => setValue((current) => ({ ...current, text: event.target.value }))}
          value={value.text}
        />
      </label>
      <Button onClick={() => onSave(value)} type="button">
        Salvar pergunta
      </Button>
    </div>
  );
}
