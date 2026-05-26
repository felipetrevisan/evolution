"use client";

import { motion } from "motion/react";
import Image from "next/image";

const points = [
  { label: "Cintura", x: 52, y: 46 },
  { label: "Quadril", x: 54, y: 58 },
  { label: "Braço", x: 35, y: 44 },
  { label: "Coxa", x: 55, y: 74 },
];

export function BodyMap() {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-muted/70 p-4 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
      <div className="relative isolate min-h-[360px] overflow-hidden rounded-2xl border border-border bg-surface-container shadow-[0_22px_60px_rgba(38,0,88,0.18)]">
        <Image
          alt="Pessoa usando fita métrica como referência para medidas corporais"
          className="object-cover object-[center_38%]"
          fill
          priority={false}
          sizes="(min-width: 640px) 50vw, 100vw"
          src="/assets/images/body-measurement-reference.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/35 bg-background/80 px-3 py-1 font-medium text-foreground text-xs shadow-sm backdrop-blur">
          Referência visual
        </div>

        {points.map((point, index) => (
          <motion.div
            animate={{ scale: [1, 1.08, 1], y: [0, -2, 0] }}
            className="-translate-x-1/2 -translate-y-1/2 absolute"
            initial={false}
            key={point.label}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            transition={{ delay: index * 0.16, duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="-inset-2 absolute rounded-full bg-tertiary/30 blur-md" />
            <span className="relative grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-tertiary shadow-lg">
              <span className="h-2 w-2 rounded-full bg-on-tertiary" />
            </span>
            <span className="-translate-y-1/2 absolute left-7 top-1/2 hidden whitespace-nowrap rounded-full border border-border bg-background/90 px-2.5 py-1 font-medium text-foreground text-xs shadow-sm backdrop-blur sm:block">
              {point.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-2">
        <p className="font-semibold text-foreground text-sm">Medidas opcionais</p>
        <p className="text-muted-foreground text-xs leading-5">
          Use como guia visual. Peso e altura são os únicos campos obrigatórios.
        </p>
        <div className="grid gap-2">
          {points.map((point) => (
            <div
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
              key={point.label}
            >
              <span className="size-2.5 rounded-full bg-tertiary" />
              {point.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
