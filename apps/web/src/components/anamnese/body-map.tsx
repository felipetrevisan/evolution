"use client";

import { motion } from "motion/react";

const points = [
  { label: "Cintura", x: 50, y: 64 },
  { label: "Quadril", x: 50, y: 79 },
  { label: "Braço", x: 33, y: 70 },
  { label: "Coxa", x: 42, y: 105 },
];

export function BodyMap() {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-muted/70 p-4 sm:grid-cols-[1fr_150px] sm:items-center">
      <svg
        aria-label="Mapa corporal com pontos de referência para medidas opcionais"
        className="h-80 w-full drop-shadow-[0_18px_45px_rgba(107,72,169,0.22)]"
        role="img"
        viewBox="0 0 120 170"
      >
        <defs>
          <linearGradient id="bodyFill" x1="32" x2="88" y1="18" y2="146">
            <stop offset="0" stopColor="var(--primary-fixed)" />
            <stop offset="1" stopColor="var(--secondary-fixed-dim)" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <motion.ellipse
          animate={{ opacity: [0.18, 0.32, 0.18], scale: [0.96, 1.03, 0.96] }}
          cx="60"
          cy="86"
          fill="var(--primary)"
          filter="url(#softGlow)"
          initial={false}
          rx="33"
          ry="55"
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.g
          animate={{ y: [0, -2, 0] }}
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <circle
            cx="60"
            cy="27"
            fill="url(#bodyFill)"
            r="15"
            stroke="var(--ring)"
            strokeWidth="2"
          />
          <path
            d="M38 61c4.5-14 12-22 22-22s17.5 8 22 22l9 31-13 4-8-25v73H63v-48h-6v48H42V71l-8 25-13-4 17-31Z"
            fill="url(#bodyFill)"
            stroke="var(--ring)"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path d="M45 64c8 4 22 4 30 0" fill="none" stroke="var(--primary)" strokeWidth="2" />
          <path d="M43 81c10 5 24 5 34 0" fill="none" stroke="var(--primary)" strokeWidth="2" />
        </motion.g>

        {points.map((point, index) => (
          <motion.g
            animate={{ scale: [1, 1.18, 1] }}
            key={point.label}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            transition={{ delay: index * 0.25, duration: 1.9, repeat: Infinity }}
          >
            <circle cx={point.x} cy={point.y} fill="var(--tertiary)" opacity="0.28" r="7" />
            <circle
              cx={point.x}
              cy={point.y}
              fill="var(--tertiary)"
              r="3.4"
              stroke="var(--background)"
              strokeWidth="1.2"
            />
          </motion.g>
        ))}
      </svg>

      <div className="grid gap-2">
        <p className="font-semibold text-sm">Medidas opcionais</p>
        <p className="text-muted-foreground text-xs leading-5">
          Use os pontos como referência se quiser acompanhar evolução corporal com mais detalhe.
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
