"use client";

import { useEffect, useState } from "react";
import { Pencil, Check, X, Bold, Italic } from "lucide-react";
import type { BioStyle } from "@/lib/auth-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DEFAULT_BIO = "Never Give Up";
const MAX = 80;
const DEFAULT_STYLE: BioStyle = { color: "#ffffff", font: "default", bold: false, italic: false };
const COLORS = ["#ffffff", "#fde68a", "#bbf7d0", "#fbcfe8", "#bae6fd", "#fdba74", "#1e293b"];
const FONTS: { id: string; label: string; family: string }[] = [
  { id: "default", label: "Classic", family: "inherit" },
  { id: "elegant", label: "Elegant", family: "'Playfair Display', Georgia, serif" },
  { id: "hand", label: "Handwritten", family: "'Caveat', cursive" },
  { id: "script", label: "Script", family: "'Pacifico', cursive" },
  { id: "mono", label: "Typewriter", family: "'Courier New', ui-monospace, monospace" },
];
const familyOf = (id: string) => FONTS.find((f) => f.id === id)?.family ?? "inherit";
const styleCss = (st: BioStyle) => ({ color: st.color, fontFamily: familyOf(st.font), fontWeight: st.bold ? 800 : 500, fontStyle: st.italic ? "italic" : "normal" }) as const;

const SUGGESTIONS = ["Learn. Build. Repeat.", "Small steps, big goals.", "Progress over perfection.", "Dream it. Work for it. Get it."];

export function EditableBio({
  uid,
  bio,
  bioStyle,
  variant = "quote",
}: {
  uid: string;
  bio: string;
  bioStyle?: BioStyle;
  variant?: "quote" | "inline";
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(bio);
  const [shown, setShown] = useState(bio);
  const [saving, setSaving] = useState(false);
  const [style, setStyle] = useState<BioStyle>({ ...DEFAULT_STYLE, ...bioStyle });
  const [shownStyle, setShownStyle] = useState<BioStyle>({ ...DEFAULT_STYLE, ...bioStyle });

  // The profile can arrive after first render; keep the display in step with it.
  useEffect(() => {
    if (!editing) {
      setShown(bio);
      setValue(bio);
      setStyle({ ...DEFAULT_STYLE, ...bioStyle });
      setShownStyle({ ...DEFAULT_STYLE, ...bioStyle });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bio, bioStyle?.color, bioStyle?.font, bioStyle?.bold, bioStyle?.italic, editing]);

  async function save() {
    const trimmed = value.trim().slice(0, MAX) || DEFAULT_BIO;
    setSaving(true);
    try {
      await updateDoc(doc(db, "profiles", uid), { bio: trimmed, bioStyle: style });
      setValue(trimmed);
      setShown(trimmed);
      setShownStyle(style);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setValue(shown);
    setStyle(shownStyle);
    setEditing(false);
  }

  const fontLink = (
    // eslint-disable-next-line @next/next/no-page-custom-font
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Pacifico&family=Playfair+Display:ital,wght@0,500;0,800;1,500&display=swap" precedence="default" />
  );

  if (variant === "inline") {
    return (
      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white group">
        <span className="italic">&ldquo;{shown}&rdquo;</span>
        <Pencil size={12} className="opacity-60 group-hover:opacity-100" />
      </button>
    );
  }

  if (editing) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl bg-white/15 border border-white/30 p-4 text-white">
        {fontLink}
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Your motto</p>
        <p className="text-xs text-white/70 mt-0.5">A short line that shows on your dashboard — write anything that motivates you.</p>
        <textarea
          autoFocus
          rows={2}
          value={value}
          maxLength={MAX}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") cancel();
          }}
          placeholder="Type your motto here…"
          className="mt-3 w-full resize-none rounded-xl bg-white text-neutral-900 text-sm px-3 py-2 outline-none"
        />
        <div className="mt-3 rounded-xl px-3 py-3 text-center" style={{ background: style.color.toLowerCase() === "#1e293b" ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.18)" }}>
          <span className="text-base leading-snug" style={styleCss(style)}>
            &ldquo;{value.trim() || DEFAULT_BIO}&rdquo;
          </span>
        </div>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-white/70 w-10">Color</span>
            {COLORS.map((c) => (
              <button
                key={c}
                aria-label={"Text color " + c}
                onClick={() => setStyle((st) => ({ ...st, color: c }))}
                className={"h-6 w-6 rounded-full border-2 " + (style.color === c ? "border-white scale-110" : "border-white/30")}
                style={{ background: c }}
              />
            ))}
            <label className="h-6 w-6 rounded-full border-2 border-white/30 overflow-hidden relative cursor-pointer" title="Pick any color" style={{ background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)" }}>
              <input type="color" value={style.color} onChange={(e) => setStyle((st) => ({ ...st, color: e.target.value }))} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-white/70 w-10">Font</span>
            {FONTS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStyle((st) => ({ ...st, font: f.id }))}
                className={"text-xs px-2.5 py-1 rounded-full " + (style.font === f.id ? "bg-white text-primary-700" : "bg-white/20 hover:bg-white/30")}
                style={{ fontFamily: f.family }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/70 w-10">Style</span>
            <button aria-label="Bold" onClick={() => setStyle((st) => ({ ...st, bold: !st.bold }))} className={"h-7 w-7 rounded-lg flex items-center justify-center " + (style.bold ? "bg-white text-primary-700" : "bg-white/20")}>
              <Bold size={14} />
            </button>
            <button aria-label="Italic" onClick={() => setStyle((st) => ({ ...st, italic: !st.italic }))} className={"h-7 w-7 rounded-lg flex items-center justify-center " + (style.italic ? "bg-white text-primary-700" : "bg-white/20")}>
              <Italic size={14} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-white/70 mt-3">Or start from an idea:</p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => setValue(s)} className="text-[11px] px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30">
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] text-white/70">
            {value.length}/{MAX}
          </span>
          <div className="flex gap-2">
            <button onClick={cancel} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25">
              <X size={13} /> Cancel
            </button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1 text-xs font-semibold px-4 py-1.5 rounded-full bg-white text-primary-700 disabled:opacity-60">
              <Check size={13} /> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDefault = !shown || shown === DEFAULT_BIO;

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {fontLink}
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">My motto</p>
      <button
        onClick={() => setEditing(true)}
        aria-label="Edit your motto"
        className="group mt-2 w-full rounded-2xl border-2 border-dashed border-white/40 hover:border-white/80 bg-white/10 hover:bg-white/15 px-4 py-3 transition"
      >
        <span className="block text-lg leading-snug" style={styleCss(shownStyle)}>{isDefault ? `“${DEFAULT_BIO}”` : `“${shown}”`}</span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-white/20 group-hover:bg-white/30 rounded-full px-3 py-1">
          <Pencil size={11} /> {isDefault ? "Tap to write your own motto" : "Tap to change"}
        </span>
      </button>
    </div>
  );
}
