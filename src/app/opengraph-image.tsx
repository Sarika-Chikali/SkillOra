import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SkillOra — your career growth companion";

// Default share card for the app itself (home, login, dashboard links).
export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public/icons/skillora-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2d5b88, #7ba5c9)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", width: 260, height: 260, borderRadius: 60, background: "#ffffff", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={190} height={190} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 108, fontWeight: 800 }}>SkillOra</div>
            <div style={{ display: "flex", fontSize: 38, marginTop: 12, opacity: 0.92 }}>Your career growth companion</div>
            <div style={{ display: "flex", fontSize: 28, marginTop: 28, opacity: 0.8 }}>Resume · Portfolio · Career Vault · Personality Dev</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
