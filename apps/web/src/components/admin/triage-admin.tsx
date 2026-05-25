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
import { ListChecks, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, type TriageQuestion } from "@/lib/api-client";
import {
  createQuestion,
  filterQuestions,
  nextQuestionId,
  orderQuestions,
} from "./triage-admin.helpers";
import type { TriageLayerFilter, VectorKey } from "./triage-admin.types";
import { TriageEditor } from "./triage-editor";
import { TriageMetric } from "./triage-metric";
import { QuestionsTable } from "./triage-questions-table";

export function TriageAdmin() {
  const [questions, setQuestions] = useState<TriageQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [layerFilter, setLayerFilter] = useState<TriageLayerFilter>("all");
  const [saving, setSaving] = useState(false);

  const selected = questions.find((question) => question.id === selectedQuestionId) ?? null;
  const filteredQuestions = useMemo(
    () => filterQuestions(questions, query, layerFilter),
    [layerFilter, query, questions],
  );

  useEffect(() => {
    api
      .adminTriageQuestions()
      .then((response) => {
        const ordered = orderQuestions(response.questions);
        setQuestions(ordered);
        setSelectedQuestionId(ordered[0]?.id ?? null);
      })
      .catch(() => toast.error("Não foi possível carregar a triagem."));
  }, []);

  async function save() {
    setSaving(true);
    const saveToast = toast.loading("Salvando triagem...");

    try {
      const response = await api.adminSaveTriageQuestions({ questions: orderQuestions(questions) });
      const ordered = orderQuestions(response.questions);
      setQuestions(ordered);
      setSelectedQuestionId((current) => current ?? ordered[0]?.id ?? null);
      setEditorOpen(false);
      toast.success("Triagem atualizada.", { id: saveToast });
    } catch {
      toast.error("Não foi possível salvar a triagem.", { id: saveToast });
    } finally {
      setSaving(false);
    }
  }

  function addQuestion(layer: "FVA" | "IM") {
    const nextQuestion = createQuestion(nextQuestionId(questions), layer);
    setQuestions((current) => orderQuestions([...current, nextQuestion]));
    setSelectedQuestionId(nextQuestion.id);
    setEditorOpen(true);
  }

  function duplicateQuestion(question: TriageQuestion) {
    const nextId = nextQuestionId(questions);
    const copyQuestion: TriageQuestion = {
      ...question,
      id: nextId,
      text: `${question.text} (cópia)`,
      alternatives: question.alternatives.map((alternative, index) => ({
        ...alternative,
        id: `Q${String(nextId).padStart(2, "0")}_${index + 1}`,
        questionId: nextId,
      })),
    };
    setQuestions((current) => orderQuestions([...current, copyQuestion]));
    setSelectedQuestionId(copyQuestion.id);
    setEditorOpen(true);
  }

  function removeQuestion(questionId: number) {
    setQuestions((current) => {
      const nextQuestions = current.filter((question) => question.id !== questionId);
      setSelectedQuestionId((selectedId) =>
        selectedId === questionId ? (nextQuestions[0]?.id ?? null) : selectedId,
      );
      return nextQuestions;
    });
  }

  function selectQuestion(questionId: number) {
    setSelectedQuestionId(questionId);
    setEditorOpen(true);
  }

  function updateQuestion(questionId: number, patch: Partial<TriageQuestion>) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    );
  }

  function updateAlternative(
    questionId: number,
    alternativeId: string,
    patch: { label?: string; vector?: VectorKey },
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              alternatives: question.alternatives.map((alternative) =>
                alternative.id === alternativeId ? { ...alternative, ...patch } : alternative,
              ),
            }
          : question,
      ),
    );
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <TriageMetric label="Perguntas" value={String(questions.length)} />
        <TriageMetric
          label="FVA"
          value={String(questions.filter((question) => question.layer === "FVA").length)}
        />
        <TriageMetric
          label="IM"
          value={String(questions.filter((question) => question.layer === "IM").length)}
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="size-5 text-primary" />
                Triagem
              </CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Gerencie perguntas, camada e alternativas em um fluxo único.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => addQuestion("FVA")} size="sm" type="button" variant="outline">
                <Plus className="size-4" />
                Nova FVA
              </Button>
              <Button onClick={() => addQuestion("IM")} size="sm" type="button" variant="outline">
                <Plus className="size-4" />
                Nova IM
              </Button>
              <Button disabled={saving} onClick={save} size="sm" type="button">
                <Save className="size-4" />
                Salvar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QuestionsTable
            filteredQuestions={filteredQuestions}
            layerFilter={layerFilter}
            onDuplicate={duplicateQuestion}
            onLayerFilterChange={setLayerFilter}
            onQueryChange={setQuery}
            onRemove={removeQuestion}
            onSelectQuestion={selectQuestion}
            query={query}
            selectedQuestionId={selectedQuestionId}
          />
        </CardContent>
      </Card>

      <Dialog onOpenChange={setEditorOpen} open={editorOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-auto">
          <DialogHeader>
            <DialogTitle>Editar pergunta</DialogTitle>
            <DialogDescription>
              Ajuste a camada, o texto e as alternativas desta pergunta.
            </DialogDescription>
          </DialogHeader>
          <TriageEditor
            onDuplicate={duplicateQuestion}
            onRemove={removeQuestion}
            onSave={save}
            onUpdateAlternative={updateAlternative}
            onUpdateQuestion={updateQuestion}
            question={selected}
            saving={saving}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
