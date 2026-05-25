import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@evolution/ui";
import { Copy, Save, Trash2 } from "lucide-react";
import type { TriageQuestion } from "@/lib/api-client";
import { DropdownSelect } from "../shared/dropdown-select";
import { layerOptions, type VectorKey, vectorOptions } from "./triage-admin.types";

type TriageEditorProps = {
  onDuplicate: (question: TriageQuestion) => void;
  onRemove: (questionId: number) => void;
  onSave: () => void;
  onUpdateAlternative: (
    questionId: number,
    alternativeId: string,
    patch: { label?: string; vector?: VectorKey },
  ) => void;
  onUpdateQuestion: (questionId: number, patch: Partial<TriageQuestion>) => void;
  question: TriageQuestion | null;
  saving: boolean;
};

export function TriageEditor({
  onDuplicate,
  onRemove,
  onSave,
  onUpdateAlternative,
  onUpdateQuestion,
  question,
  saving,
}: TriageEditorProps) {
  if (!question) {
    return (
      <div className="rounded-xl border border-border bg-background p-6 text-muted-foreground text-sm">
        Selecione ou crie uma pergunta para editar.
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-background p-4">
        <div>
          <p className="font-semibold">Pergunta #{question.id}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Edite o texto principal e revise as alternativas vinculadas aos vetores.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onDuplicate(question)} type="button" variant="outline">
            <Copy className="size-4" />
            Duplicar
          </Button>
          <Button onClick={() => onRemove(question.id)} type="button" variant="outline">
            <Trash2 className="size-4" />
            Excluir
          </Button>
          <Button disabled={saving} onClick={onSave} type="button">
            <Save className="size-4" />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-background p-4 lg:grid-cols-[180px_1fr]">
        <DropdownSelect
          label="Camada"
          onChange={(layer) => onUpdateQuestion(question.id, { layer })}
          options={layerOptions}
          value={question.layer}
        />
        <label className="grid gap-2 text-sm font-medium">
          Texto da pergunta
          <textarea
            className="min-h-24 rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            onChange={(event) => onUpdateQuestion(question.id, { text: event.target.value })}
            value={question.text}
          />
        </label>
      </div>

      <AlternativesTable
        alternatives={question.alternatives}
        onUpdateAlternative={onUpdateAlternative}
        questionId={question.id}
      />
    </div>
  );
}

function AlternativesTable({
  alternatives,
  onUpdateAlternative,
  questionId,
}: {
  alternatives: TriageQuestion["alternatives"];
  onUpdateAlternative: (
    questionId: number,
    alternativeId: string,
    patch: { label?: string; vector?: VectorKey },
  ) => void;
  questionId: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/70 hover:bg-muted/70">
            <TableHead className="w-44">ID</TableHead>
            <TableHead>Alternativa</TableHead>
            <TableHead className="w-72">Vetor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alternatives.map((alternative) => (
            <TableRow key={alternative.id}>
              <TableCell className="font-medium text-muted-foreground text-xs">
                {alternative.id}
              </TableCell>
              <TableCell>
                <input
                  className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  onChange={(event) =>
                    onUpdateAlternative(questionId, alternative.id, { label: event.target.value })
                  }
                  value={alternative.label}
                />
              </TableCell>
              <TableCell>
                <DropdownSelect
                  onChange={(vector) => onUpdateAlternative(questionId, alternative.id, { vector })}
                  options={vectorOptions}
                  value={alternative.vector}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
