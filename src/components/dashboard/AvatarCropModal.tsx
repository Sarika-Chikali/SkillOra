"use client";

import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, Check, Loader2 } from "lucide-react";

const FRAME = 260;
const OUTPUT_SIZE = 480;

export function AvatarCropModal({
  file,
  onCancel,
  onSave,
}: {
  file: File;
  onCancel: () => void;
  onSave: (blob: Blob) => Promise<void>;
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; startOffset: { x: number; y: number } } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale = naturalSize.w && naturalSize.h ? FRAME / Math.min(naturalSize.w, naturalSize.h) : 1;
  const totalScale = baseScale * zoom;
  const dispW = naturalSize.w * totalScale;
  const dispH = naturalSize.h * totalScale;

  function clampOffset(x: number, y: number) {
    const maxX = Math.max(0, (dispW - FRAME) / 2);
    const maxY = Math.max(0, (dispH - FRAME) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, startOffset: offset };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset(clampOffset(dragState.current.startOffset.x + dx, dragState.current.startOffset.y + dy));
  }

  function onPointerUp() {
    dragState.current = null;
  }

  function handleZoomChange(newZoom: number) {
    setZoom(newZoom);
    setOffset((o) => {
      const scale = baseScale * newZoom;
      const w = naturalSize.w * scale;
      const h = naturalSize.h * scale;
      const maxX = Math.max(0, (w - FRAME) / 2);
      const maxY = Math.max(0, (h - FRAME) / 2);
      return { x: Math.min(maxX, Math.max(-maxX, o.x)), y: Math.min(maxY, Math.max(-maxY, o.y)) };
    });
  }

  async function handleSave() {
    if (!imgRef.current) return;
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d")!;

      const sx = naturalSize.w / 2 - (FRAME / 2 + offset.x) / totalScale;
      const sy = naturalSize.h / 2 - (FRAME / 2 + offset.y) / totalScale;
      const sSize = FRAME / totalScale;

      ctx.drawImage(imgRef.current, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (blob) await onSave(blob);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-primary-0 rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900">Adjust your photo</h2>
          <button onClick={onCancel} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
            <X size={18} />
          </button>
        </div>

        <div
          className="relative mx-auto rounded-full overflow-hidden bg-neutral-900 touch-none select-none cursor-move"
          style={{ width: FRAME, height: FRAME }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Selected"
              draggable={false}
              onLoad={(e) => {
                const el = e.currentTarget;
                setNaturalSize({ w: el.naturalWidth, h: el.naturalHeight });
              }}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                width: dispW || undefined,
                height: dispH || undefined,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
          )}
          {/* subtle ring to show the exact crop edge clearly */}
          <div className="absolute inset-0 rounded-full ring-2 ring-inset ring-white/40 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 mt-5">
          <ZoomIn size={16} className="text-neutral-500 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => handleZoomChange(Number(e.target.value))}
            className="w-full accent-primary-700"
          />
        </div>

        <p className="text-xs text-neutral-500 text-center mt-2">Drag to reposition, use the slider to zoom</p>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex-1 text-sm font-medium px-3 py-2 rounded-full bg-neutral-300/50 text-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !naturalSize.w}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full bg-primary-700 text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
