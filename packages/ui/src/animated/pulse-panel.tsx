"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type PulsePanelProps = {
  children: ReactNode;
  className?: string;
};

export function PulsePanel({ children, className }: PulsePanelProps) {
  return (
    <motion.div
      animate={{ opacity: [0.92, 1, 0.92] }}
      className={cn("rounded-lg border border-border bg-card", className)}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
    >
      {children}
    </motion.div>
  );
}
