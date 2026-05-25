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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@evolution/ui";
import { Edit3, MessageSquareText, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, type InvestigationQuestion } from "@/lib/api-client";
import { formatBlockLabel, formatVectorLabel } from "@/lib/utils/domain-labels";
import { DropdownSelect } from "../shared/dropdown-select";
import { vectorOptions } from "./triage-admin.types";

type VectorValue = (typeof vectorOptions)[number]["value"];
type Draft = InvestigationQuestion & { vector: VectorValue };

const blockOptions = [
  { label: "Base de origem", value: "X" },
  { label: "Gatilhos e contexto", value: "Y" },
  { label: "Histórico e sustentação", value: "Z" },
] as const;

export function InvestigationAdmin() {
  const [questionsByVector, setQuestionsByVector] = useState<
    Record<string, InvestigationQuestion[]>
  >({});
  const [activeVector, setActiveVector] = useState<VectorValue>("comportamento");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all(
      vectorOptions.map(async (vector) => {
        const response = await api.adminInvestigationQuestions(vector.value);
        return [vector.value, response.questions] as const;
      }),
    )
      .then((entries) => setQuestionsByVector(Object.fromEntries(entries)))
      .catch(() => toast.error("Não foi possível carregar a investigação."));
  }, []);

  async function save() {
    setSaving(true);
    const notification = toast.loading("Salvando investigação...");

    try {
      const response = await api.adminSaveInvestigationQuestions({ questionsByVector });
      setQuestionsByVector(response.questionsByVector);
      setDraft(null);
      toast.success("Investigação atualizada.", { id: notification });
    } catch {
      toast.error("Não foi possível salvar a investigação.", { id: notification });
    } finally {
      setSaving(false);
    }
  }

  function upsertDraft(nextDraft: Draft) {
    setQuestionsByVector((current) => {
      const questions = current[nextDraft.vector] ?? [];
      const nextQuestions = questions.some((question) => question.id === nextDraft.id)
        ? questions.map((question) =>
            question.id === nextDraft.id ? stripVector(nextDraft) : question,
          )
        : [...questions, stripVector(nextDraft)];

      return { ...current, [nextDraft.vector]: nextQuestions };
    });
    setDraft(null);
  }

  function removeQuestion(vector: VectorValue, questionId: string) {
    setQuestionsByVector((current) => ({
      ...current,
      [vector]: (current[vector] ?? []).filter((question) => question.id !== questionId),
    }));
  }

  return (
    <section className="grid gap-6">
      <Card className="border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="size-5 text-primary" />
                Investigação adaptativa
              </CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Configure as perguntas que aprofundam cada vetor da jornada.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setDraft(newQuestion(activeVector))} size="sm" type="button">
                <Plus className="size-4" />
                Nova pergunta
              </Button>
              <Button disabled={saving} onClick={save} size="sm" type="button" variant="outline">
                <Save className="size-4" />
                Salvar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            onValueChange={(value) => setActiveVector(value as VectorValue)}
            value={activeVector}
          >
            <TabsList className="flex flex-wrap">
              {vectorOptions.map((vector) => (
                <TabsTrigger key={vector.value} value={vector.value}>
                  {vector.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {vectorOptions.map((vector) => (
              <TabsContent className="grid gap-3" key={vector.value} value={vector.value}>
                {(questionsByVector[vector.value] ?? []).map((question) => (
                  <QuestionRow
                    key={question.id}
                    onEdit={() => setDraft({ ...question, vector: vector.value })}
                    onRemove={() => removeQuestion(vector.value, question.id)}
                    question={question}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog onOpenChange={(open) => !open && setDraft(null)} open={!!draft}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar pergunta da investigação</DialogTitle>
            <DialogDescription>
              Use opções curtas e claras para guiar o próximo passo.
            </DialogDescription>
          </DialogHeader>
          {draft ? <QuestionEditor draft={draft} onSave={upsertDraft} /> : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function QuestionRow({
  onEdit,
  onRemove,
  question,
}: {
  onEdit: () => void;
  onRemove: () => void;
  question: InvestigationQuestion;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-muted p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-xs font-semibold text-primary">{formatBlockLabel(question.block)}</p>
        <p className="mt-1 font-medium">{question.text}</p>
        <p className="mt-1 text-muted-foreground text-sm">{question.options.length} opções</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onEdit} size="sm" type="button" variant="outline">
          <Edit3 className="size-4" />
          Editar
        </Button>
        <Button onClick={onRemove} size="sm" type="button" variant="outline">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function QuestionEditor({ draft, onSave }: { draft: Draft; onSave: (draft: Draft) => void }) {
  const [value, setValue] = useState(draft);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DropdownSelect
          label="Vetor"
          onChange={(vector) => setValue((current) => ({ ...current, vector }))}
          options={vectorOptions}
          value={value.vector}
        />
        <DropdownSelect
          label="Área investigada"
          onChange={(block) => setValue((current) => ({ ...current, block }))}
          options={blockOptions}
          value={value.block}
        />
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Pergunta
        <textarea
          className="min-h-24 rounded-xl border border-border bg-muted p-3 outline-none focus:ring-2 focus:ring-primary"
          onChange={(event) => setValue((current) => ({ ...current, text: event.target.value }))}
          value={value.text}
        />
      </label>
      <div className="grid gap-2">
        <p className="text-sm font-medium">Opções</p>
        {value.options.map((option, index) => (
          <input
            className="rounded-xl border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            key={option.id}
            onChange={(event) =>
              setValue((current) => ({
                ...current,
                options: current.options.map((item) =>
                  item.id === option.id ? { ...item, label: event.target.value } : item,
                ),
              }))
            }
            placeholder={`Opção ${index + 1}`}
            value={option.label}
          />
        ))}
      </div>
      <Button onClick={() => onSave(value)} type="button">
        Salvar pergunta
      </Button>
    </div>
  );
}

function newQuestion(vector: VectorValue): Draft {
  const id = `Q${Date.now()}`;
  return {
    block: "X",
    id,
    options: [
      { id: `${id}_1`, label: "Opção 1" },
      { id: `${id}_2`, label: "Opção 2" },
    ],
    text: `Nova pergunta para ${formatVectorLabel(vector)}`,
    vector,
  };
}

function stripVector(draft: Draft): InvestigationQuestion {
  const { vector: _vector, ...question } = draft;
  return question;
}
