"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@evolution/ui";
import type { ReactNode } from "react";
import { useState } from "react";
import { CheckInPanel } from "./check-in-form";

type CheckInQuickDialogProps = {
  children?: ReactNode;
  triggerLabel?: string;
};

export function CheckInQuickDialog({
  children,
  triggerLabel = "Fazer check-in",
}: CheckInQuickDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="h-12 rounded-xl px-6 font-bold" type="button">
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Check-in de hoje</DialogTitle>
          <DialogDescription>
            Registre sua presença em poucos segundos, sem sair da tela atual.
          </DialogDescription>
        </DialogHeader>
        <CheckInPanel compact onSaved={() => setOpen(false)} showTitle={false} />
      </DialogContent>
    </Dialog>
  );
}
