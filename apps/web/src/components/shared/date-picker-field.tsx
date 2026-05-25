"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@evolution/ui";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const weekDays = [
  { key: "sun", label: "D" },
  { key: "mon", label: "S" },
  { key: "tue", label: "T" },
  { key: "wed", label: "Q" },
  { key: "thu", label: "Q" },
  { key: "fri", label: "S" },
  { key: "sat", label: "S" },
];
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function DatePickerField({ label, onChange, value }: DatePickerFieldProps) {
  const selectedDate = parseIsoDate(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? new Date());
  const days = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);

  function moveMonth(direction: -1 | 1) {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1));
  }

  function selectDate(date: Date) {
    onChange(toIsoDate(date));
    setVisibleMonth(date);
    setOpen(false);
  }

  return (
    <div className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="w-full justify-start border-border bg-muted px-4 py-3 font-normal text-foreground hover:bg-muted/80"
            type="button"
            variant="outline"
          >
            <CalendarDays className="size-4 text-muted-foreground" />
            {selectedDate ? formatDate(selectedDate) : "Selecionar data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Button onClick={() => moveMonth(-1)} size="icon" type="button" variant="ghost">
                <ChevronLeft className="size-4" />
              </Button>
              <p className="font-semibold text-sm">
                {months[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </p>
              <Button onClick={() => moveMonth(1)} size="icon" type="button" variant="ghost">
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day) => (
                <span className="py-1 text-muted-foreground text-xs" key={day.key}>
                  {day.label}
                </span>
              ))}
              {days.map((day) => {
                const currentDate = day.date;

                return currentDate ? (
                  <button
                    className={`grid size-9 cursor-pointer place-items-center rounded-lg text-sm transition hover:bg-muted ${
                      isSameDay(currentDate, selectedDate)
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    key={day.key}
                    onClick={() => selectDate(currentDate)}
                    type="button"
                  >
                    {currentDate.getDate()}
                  </button>
                ) : (
                  <span aria-hidden className="size-9" key={day.key} />
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function buildMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Array<{ key: string; date: Date | null }> = Array.from(
    { length: firstDay.getDay() },
    (_, index) => ({ date: null, key: `pad-${year}-${month}-${index}` }),
  );

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push({ date: new Date(year, month, day), key: `day-${year}-${month}-${day}` });
  }

  return days;
}

function parseIsoDate(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function isSameDay(left: Date, right: Date | null) {
  return (
    Boolean(right) &&
    left.getFullYear() === right?.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
