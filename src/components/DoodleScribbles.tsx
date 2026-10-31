// Education-themed line doodles (book, resume, graduation cap, pencil, certificate)
// with dotted arrows between them. They drift slowly via CSS only (see .doodle-*
// in globals.css), and stay still for people who prefer reduced motion.
const stroke = { stroke: "#0f172a", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Book() {
  return (
    <g {...stroke}>
      <path d="M0 8 Q10 2 20 8 Q30 2 40 8 V34 Q30 28 20 34 Q10 28 0 34 Z" />
      <path d="M20 8 V34" />
      <path d="M6 15 Q11 13 15 15 M6 21 Q11 19 15 21 M25 15 Q29 13 34 15 M25 21 Q29 19 34 21" />
    </g>
  );
}

function ResumeDoc() {
  return (
    <g {...stroke}>
      <rect x="0" y="0" width="30" height="40" rx="3" />
      <circle cx="10" cy="10" r="4" />
      <path d="M18 8 H25 M18 13 H23 M5 22 H25 M5 28 H25 M5 34 H18" />
    </g>
  );
}

function GradCap() {
  return (
    <g {...stroke}>
      <path d="M22 4 L44 14 L22 24 L0 14 Z" />
      <path d="M9 19 V29 Q22 37 35 29 V19" />
      <path d="M40 16 V30" />
      <circle cx="40" cy="32" r="2" />
    </g>
  );
}

function Pencil() {
  return (
    <g {...stroke}>
      <path d="M4 36 L8 25 L29 4 L36 11 L15 32 Z" />
      <path d="M25 8 L32 15 M4 36 L11 33" />
    </g>
  );
}

function Certificate() {
  return (
    <g {...stroke}>
      <rect x="0" y="0" width="44" height="30" rx="3" />
      <path d="M8 9 H30 M8 15 H26" />
      <circle cx="34" cy="22" r="5" />
      <path d="M31 26 L30 34 L34 32 L38 34 L37 26" />
    </g>
  );
}

// Each icon sits at its own spot; the inner <g> is what floats.
function Spot({ x, y, scale = 1, variant, opacity = 0.3, children }: { x: number; y: number; scale?: number; variant: string; opacity?: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <g className={`doodle ${variant}`}>{children}</g>
    </g>
  );
}

type Pt = [number, number];

// A dotted curve whose arrowhead is aligned to the curve's exact direction at its
// end (the tangent from the last control point to the end point).
function DottedArrow({ from, c1, c2, to }: { from: Pt; c1: Pt; c2: Pt; to: Pt }) {
  const angle = Math.atan2(to[1] - c2[1], to[0] - c2[0]);
  const len = 10;
  const spread = (28 * Math.PI) / 180;
  const wing = (sign: number): Pt => [to[0] - len * Math.cos(angle + sign * spread), to[1] - len * Math.sin(angle + sign * spread)];
  const [l, r] = [wing(1), wing(-1)];
  // Stop the dots just short of the tip so the head reads clearly.
  return (
    <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${from[0]} ${from[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${to[0]} ${to[1]}`} strokeDasharray="6 6" />
      <path d={`M${l[0].toFixed(1)} ${l[1].toFixed(1)} L${to[0]} ${to[1]} L${r[0].toFixed(1)} ${r[1].toFixed(1)}`} />
    </g>
  );
}

export function DoodleScribbles({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
      <Spot x={22} y={22} scale={1} variant="doodle-a" opacity={0.32}>
        <GradCap />
      </Spot>
      <Spot x={318} y={26} scale={0.9} variant="doodle-b" opacity={0.3}>
        <Book />
      </Spot>
      <Spot x={345} y={210} scale={0.9} variant="doodle-c" opacity={0.28}>
        <ResumeDoc />
      </Spot>
      <Spot x={150} y={240} scale={0.85} variant="doodle-d" opacity={0.28}>
        <Certificate />
      </Spot>
      <Spot x={250} y={120} scale={0.75} variant="doodle-e" opacity={0.22}>
        <Pencil />
      </Spot>
      <Spot x={30} y={150} scale={0.7} variant="doodle-b" opacity={0.22}>
        <Book />
      </Spot>

      {/* dotted arrows */}
      <Spot x={0} y={0} variant="doodle-c" opacity={0.28}>
        <DottedArrow from={[20, 200]} c1={[60, 180]} c2={[90, 220]} to={[130, 200]} />
      </Spot>
      <Spot x={0} y={0} variant="doodle-a" opacity={0.25}>
        <DottedArrow from={[110, 60]} c1={[150, 40]} c2={[190, 80]} to={[240, 55]} />
      </Spot>
      <Spot x={0} y={0} variant="doodle-e" opacity={0.22}>
        <DottedArrow from={[280, 275]} c1={[300, 250]} c2={[330, 285]} to={[375, 262]} />
      </Spot>
    </svg>
  );
}
