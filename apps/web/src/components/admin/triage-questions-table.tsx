import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@evolution/ui";
import { Copy, Edit3, Search, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import type { TriageQuestion } from "@/lib/api-client";
import { DropdownSelect } from "../shared/dropdown-select";
import { layerFilterOptions, type TriageLayerFilter } from "./triage-admin.types";

type QuestionsTableProps = {
  filteredQuestions: TriageQuestion[];
  layerFilter: TriageLayerFilter;
  onDuplicate: (question: TriageQuestion) => void;
  onLayerFilterChange: (value: TriageLayerFilter) => void;
  onQueryChange: (value: string) => void;
  onRemove: (questionId: number) => void;
  onSelectQuestion: (questionId: number) => void;
  query: string;
  selectedQuestionId: number | null;
};

export function QuestionsTable({
  filteredQuestions,
  layerFilter,
  onDuplicate,
  onLayerFilterChange,
  onQueryChange,
  onRemove,
  onSelectQuestion,
  query,
  selectedQuestionId,
}: QuestionsTableProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <label className="grid gap-2 text-sm font-medium">
          Buscar pergunta
          <span className="flex h-10 items-center gap-2 rounded-md border border-border bg-muted px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Texto ou ID"
              type="search"
              value={query}
            />
          </span>
        </label>
        <DropdownSelect
          label="Camada"
          onChange={onLayerFilterChange}
          options={layerFilterOptions}
          value={layerFilter}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="w-28">Camada</TableHead>
              <TableHead>Pergunta</TableHead>
              <TableHead className="w-28 text-center">Alternativas</TableHead>
              <TableHead className="w-44 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow
                className="cursor-pointer data-[selected=true]:bg-primary/10"
                data-selected={question.id === selectedQuestionId}
                key={question.id}
                onClick={() => onSelectQuestion(question.id)}
              >
                <TableCell className="font-semibold">#{question.id}</TableCell>
                <TableCell>
                  <Badge>{question.layer}</Badge>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 font-medium">{question.text}</p>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {question.alternatives.length}
                </TableCell>
                <TableCell>
                  <QuestionActions
                    onDuplicate={() => onDuplicate(question)}
                    onRemove={() => onRemove(question.id)}
                    onSelect={() => onSelectQuestion(question.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredQuestions.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground text-sm">
            Nenhuma pergunta encontrada.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function QuestionActions({
  onDuplicate,
  onRemove,
  onSelect,
}: {
  onDuplicate: () => void;
  onRemove: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <IconAction
        ariaLabel="Editar pergunta"
        icon={<Edit3 className="size-4" />}
        onClick={onSelect}
      />
      <IconAction
        ariaLabel="Duplicar pergunta"
        icon={<Copy className="size-4" />}
        onClick={onDuplicate}
      />
      <IconAction
        ariaLabel="Excluir pergunta"
        icon={<Trash2 className="size-4" />}
        onClick={onRemove}
      />
    </div>
  );
}

function IconAction({
  ariaLabel,
  icon,
  onClick,
}: {
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      size="icon"
      type="button"
      variant="ghost"
    >
      {icon}
    </Button>
  );
}
