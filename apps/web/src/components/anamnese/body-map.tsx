"use client";

const points = [
  { label: "Ombros", x: 50, y: 24 },
  { label: "Cintura", x: 50, y: 46 },
  { label: "Quadril", x: 50, y: 58 },
  { label: "Joelhos", x: 50, y: 78 },
];

export function BodyMap() {
  return (
    <div className="rounded-xl bg-muted p-4">
      <svg aria-label="Mapa corporal" className="h-80 w-full" role="img" viewBox="0 0 100 160">
        <path
          d="M50 14c8 0 14 6 14 14S58 42 50 42 36 36 36 28s6-14 14-14Zm-22 48c5-12 13-18 22-18s17 6 22 18l8 26-11 4-7-20v64H52V96h-4v40H38V72l-7 20-11-4 8-26Z"
          fill="var(--primary-fixed)"
          stroke="var(--ring)"
          strokeWidth="1.5"
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} fill="var(--tertiary)" r="3" />
            <text fill="var(--muted-foreground)" fontSize="5" x={point.x + 5} y={point.y + 1}>
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
