"use client";

import { TRAIT_KEYS, TRAIT_LABELS, type Traits } from "@/lib/personality";

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 95;
const SIDES = TRAIT_KEYS.length;

function pointFor(index: number, value: number) {
  const angle = (Math.PI * 2 * index) / SIDES - Math.PI / 2;
  const r = (value / 100) * RADIUS;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function labelPointFor(index: number) {
  const angle = (Math.PI * 2 * index) / SIDES - Math.PI / 2;
  const r = RADIUS + 34;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

export function TraitRadarChart({ traits }: { traits: Traits }) {
  const ringLevels = [25, 50, 75, 100];
  const dataPoints = TRAIT_KEYS.map((k, i) => pointFor(i, traits[k]));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-xs mx-auto">
      {ringLevels.map((level) => {
        const pts = TRAIT_KEYS.map((_, i) => pointFor(i, level))
          .map((p) => `${p.x},${p.y}`)
          .join(" ");
        return <polygon key={level} points={pts} fill="none" stroke="var(--color-neutral-300)" strokeWidth="1" />;
      })}

      {TRAIT_KEYS.map((_, i) => {
        const outer = pointFor(i, 100);
        return <line key={i} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} stroke="var(--color-neutral-300)" strokeWidth="1" />;
      })}

      <polygon points={dataPath} fill="var(--color-primary-500)" fillOpacity="0.25" stroke="var(--color-primary-700)" strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-primary-700)" />
      ))}

      {TRAIT_KEYS.map((k, i) => {
        const p = labelPointFor(i);
        return (
          <text
            key={k}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="600"
            fill="var(--color-neutral-700)"
          >
            <tspan x={p.x} dy="-5">
              {TRAIT_LABELS[k]}
            </tspan>
            <tspan x={p.x} dy="12" fill="var(--color-primary-700)">
              {traits[k]}%
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
