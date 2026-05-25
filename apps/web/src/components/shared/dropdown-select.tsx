"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@evolution/ui";
import { Check, ChevronDown } from "lucide-react";

type DropdownSelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type DropdownSelectProps<TValue extends string> = {
  label?: string;
  options: ReadonlyArray<DropdownSelectOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
};

export function DropdownSelect<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: DropdownSelectProps<TValue>) {
  const selected = options.find((option) => option.value === value);
  const trigger = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full justify-between border-border bg-muted px-4 py-3 font-normal text-foreground hover:bg-muted/80"
          type="button"
          variant="outline"
        >
          {selected?.label ?? "Selecionar"}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => onChange(option.value)}>
            <span className="flex-1">{option.label}</span>
            {option.value === value ? <Check className="size-4 text-primary" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (!label) return trigger;

  return (
    <div className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {trigger}
    </div>
  );
}
