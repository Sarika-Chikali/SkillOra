import { ImageResponse } from "next/og";
import { getPublicPortfolioServer } from "@/lib/portfolioServer";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per-template palette so the share card matches the template the user picked.
const THEMES: Record<string, { bg: string; text: string; sub: string; accent: string; label: string }> = {
  uzairDev: { bg: "linear-gradient(135deg, #06060e, #2a1650 70%, #3b1d6e)", text: "#ffffff", sub: "#b9a3e8", accent: "#ba80ff", label: "Developer 3D" },
  tanishDev: { bg: "linear-gradient(135deg, #000000, #001a4d 80%)", text: "#f0f0f0", sub: "#7aa7ff", accent: "#0066ff", label: "Bento Blue" },
  devPc3d: { bg: "linear-gradient(135deg, #050816, #151030 70%, #2a1d5e)", text: "#ffffff", sub: "#dfd9ff", accent: "#915eff", label: "Developer PC" },
  char3d: { bg: "linear-gradient(135deg, #0a0e17, #0d3b3a 90%)", text: "#eae5ec", sub: "#5eead4", accent: "#5eead4", label: "Character 3D" },
  devBento: { bg: "linear-gradient(135deg, #09090b, #1e1b4b 70%, #4c1d95)", text: "#f4f4f5", sub: "#a5b4fc", accent: "#818cf8", label: "Bento Light/Dark" },
  sidebarApp: { bg: "linear-gradient(135deg, #0c0c0c, #16301a 90%)", text: "#eeeeee", sub: "#a4afb5", accent: "#9dff8e", label: "Sidebar Console" },
  cinematic: { bg: "linear-gradient(135deg, #080808, #3a1503 95%)", text: "#ffffff", sub: "#ffb98a", accent: "#ff6b1a", label: "Cinematic Scroll" },
  awwwards: { bg: "linear-gradient(135deg, #e4e4de, #d6d3c4)", text: "#0b0b0b", sub: "#57534e", accent: "#b8871f", label: "Awwwards Planet" },
  room3d: { bg: "linear-gradient(135deg, #111827, #3b1a6b)", text: "#ffffff", sub: "#c4b5fd", accent: "#ff6b81", label: "3D Room Finder" },
  retroIsland: { bg: "linear-gradient(135deg, #9fd5ff, #d8f0ff)", text: "#33452c", sub: "#6e4726", accent: "#d97a2d", label: "Retro Island" },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicPortfolioServer(slug);

  const logoBuf = await readFile(path.join(process.cwd(), "public/icons/skillora-logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;
  const theme = THEMES[result?.data.template ?? ""] ?? THEMES.uzairDev;
  const name = result?.data.displayName || "SkillOra Portfolio";
  const headline = result?.data.headline || "";
  const tagline = result?.data.tagline || "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: theme.bg,
          color: theme.text,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 60,
            background: theme.accent,
            color: theme.bg.includes("#e4e4de") || theme.bg.includes("#9fd5ff") ? "#ffffff" : "#0b0b0b",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          {initials}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800 }}>{name}</div>
        {headline && (
          <div style={{ display: "flex", fontSize: 32, color: theme.sub, marginTop: 12, fontWeight: 600 }}>{headline}</div>
        )}
        {tagline && (
          <div style={{ display: "flex", fontSize: 24, color: theme.sub, opacity: 0.85, marginTop: 20, maxWidth: 900 }}>{tagline}</div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 48 }}>
          <div style={{ display: "flex", width: 52, height: 52, borderRadius: 14, background: "#ffffff", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={38} height={38} alt="" />
          </div>
          <div style={{ display: "flex", fontSize: 24, color: theme.accent, fontWeight: 700 }}>SkillOra · {theme.label}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
