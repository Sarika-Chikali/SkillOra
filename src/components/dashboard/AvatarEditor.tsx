"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Palette, Trash2, Loader2 } from "lucide-react";
import { ProfileAvatar, AVATAR_COLORS } from "./ProfileAvatar";
import { AvatarCropModal } from "./AvatarCropModal";
import { uploadProfilePhoto, setProfilePhoto, setProfileAvatarColor, removeProfilePhoto } from "@/lib/profilePhoto";

export function AvatarEditor({
  uid,
  name,
  photoURL,
  avatarColor,
  menuAlign = "right",
}: {
  uid: string;
  name?: string | null;
  photoURL?: string | null;
  avatarColor?: string | null;
  // Which edge of the avatar the menu lines up with, so it opens toward the screen's middle.
  menuAlign?: "left" | "right";
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  async function handleColorPick(color: string) {
    setBusy(true);
    try {
      await setProfileAvatarColor(uid, color);
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }

  async function handleRemove() {
    setBusy(true);
    try {
      await removeProfilePhoto(uid);
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }

  async function handleCropSave(blob: Blob) {
    const url = await uploadProfilePhoto(blob, uid);
    await setProfilePhoto(uid, url);
    setPendingFile(null);
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPendingFile(file);
          e.target.value = "";
          setMenuOpen(false);
        }}
      />

      <button onClick={() => setMenuOpen((v) => !v)} className="relative block shrink-0" aria-label="Edit profile photo">
        <ProfileAvatar photoURL={photoURL} avatarColor={avatarColor} name={name} size={56} />
        <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary-700 border-2 border-white flex items-center justify-center">
          <Camera size={10} className="text-white" />
        </span>
      </button>

      {menuOpen && (
        <div className={`absolute ${menuAlign === "left" ? "left-0" : "right-0"} top-full mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-xl bg-primary-0 shadow-xl border border-neutral-300/60 p-2 z-20`}>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center gap-2 text-sm text-neutral-700 px-2 py-2 rounded-lg hover:bg-neutral-100"
          >
            <Upload size={15} /> Upload a photo
          </button>

          <div className="px-2 py-1.5">
            <p className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
              <Palette size={12} /> Or pick a color avatar
            </p>
            <div className="flex gap-1.5">
              {Object.keys(AVATAR_COLORS).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorPick(color)}
                  disabled={busy}
                  aria-label={`Use ${color} avatar`}
                  className="h-6 w-6 rounded-full border-2 border-white shadow-sm disabled:opacity-50"
                  style={{ backgroundImage: AVATAR_COLORS[color] }}
                />
              ))}
            </div>
          </div>

          {(photoURL || avatarColor) && (
            <button
              onClick={handleRemove}
              disabled={busy}
              className="w-full flex items-center gap-2 text-sm text-accent-rose px-2 py-2 rounded-lg hover:bg-accent-rose/10 disabled:opacity-50"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              Remove &amp; use default icon
            </button>
          )}
        </div>
      )}

      {pendingFile && (
        <AvatarCropModal file={pendingFile} onCancel={() => setPendingFile(null)} onSave={handleCropSave} />
      )}
    </div>
  );
}
