"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="min-w-0"
        exit={{ opacity: 0, scale: 0.99, y: -8 }}
        initial={{ opacity: 0, scale: 0.99, y: 12 }}
        key={pathname}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
