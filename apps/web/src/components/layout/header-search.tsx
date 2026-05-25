"use client";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const suggestions = ["Dashboard", "Plano atual", "Check-in", "Progresso", "Relatório do ciclo"];

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  return (
    <>
      <motion.button
        aria-label="Buscar"
        className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-primary"
        onClick={() => setOpen(true)}
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <Search className="size-5" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 grid place-items-start bg-background/45 px-4 pt-[18vh] backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onMouseDown={() => setOpen(false)}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl shadow-primary/15"
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              initial={{ opacity: 0, scale: 0.96, y: -18 }}
              onMouseDown={(event) => event.stopPropagation()}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <Search className="size-5 shrink-0 text-primary" />
                <input
                  aria-label="Buscar"
                  className="h-10 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  placeholder="Buscar na jornada..."
                  ref={inputRef}
                  type="search"
                />
                <button
                  aria-label="Fechar busca"
                  className="grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid gap-2 p-3">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    animate={{ opacity: 1, x: 0 }}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-primary"
                    initial={{ opacity: 0, x: -8 }}
                    key={suggestion}
                    onClick={() => setOpen(false)}
                    transition={{ delay: 0.03 * index, duration: 0.16 }}
                    type="button"
                  >
                    <Search className="size-4" />
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
