"use client";

import { useRef, useState } from "react";
import { X, Loader2, ImagePlus, Star, Trash2 } from "lucide-react";
import { newProjectId, uploadProjectImage, type Project } from "@/lib/portfolio";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function ProjectForm({
  uid,
  initial,
  onClose,
  onSave,
}: {
  uid: string;
  initial: Project | null;
  onClose: () => void;
  onSave: (project: Project) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [highlights, setHighlights] = useState(initial?.highlights || "");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>(initial?.technologies || []);
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || "");
  const [codeUrl, setCodeUrl] = useState(initial?.codeUrl || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [status, setStatus] = useState<Project["status"]>(initial?.status || "live");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addTech() {
    const t = techInput.trim();
    if (!t || technologies.includes(t)) return;
    setTechnologies((arr) => [...arr, t]);
    setTechInput("");
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadProjectImage(file, uid);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Give your project a title.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const project: Project = {
        id: initial?.id || newProjectId(),
        title: title.trim(),
        description: description.trim(),
        highlights,
        technologies,
        liveUrl: liveUrl.trim(),
        codeUrl: codeUrl.trim(),
        imageUrl,
        featured,
        status,
        createdAt: initial?.createdAt ?? null,
      };
      await onSave(project);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save this project. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-primary-0 rounded-t-3xl sm:rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900">{initial ? "Edit project" : "Add a project"}</h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Cover image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden h-32 bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-24 rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 text-neutral-500 hover:border-primary-400"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                <span className="text-xs">{uploading ? "Uploading…" : "Tap to add an image (optional)"}</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E-commerce Website" className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Short description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="A full-stack e-commerce platform with payment gateway integration"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Highlights</label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={3}
              placeholder={"One highlight per line, e.g.\nHandled 200+ concurrent checkouts\nIntegrated Razorpay and Stripe"}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Technologies used</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {technologies.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                  {t}
                  <button onClick={() => setTechnologies((arr) => arr.filter((x) => x !== t))}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="React, Node.js, MongoDB…"
                className={inputClass}
              />
              <button onClick={addTech} className="shrink-0 px-3 rounded-lg bg-primary-700 text-white text-sm font-medium">
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Live demo link</label>
              <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://…" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Code link</label>
              <input value={codeUrl} onChange={(e) => setCodeUrl(e.target.value)} placeholder="https://github.com/…" className={inputClass} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setFeatured((f) => !f)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                featured ? "bg-accent-amber/20 text-accent-amber" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              <Star size={13} fill={featured ? "currentColor" : "none"} /> {featured ? "Featured" : "Mark as featured"}
            </button>

            <div className="flex items-center gap-1 text-xs bg-neutral-100 rounded-full p-1">
              <button
                onClick={() => setStatus("live")}
                className={`px-2.5 py-1 rounded-full font-medium ${status === "live" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"}`}
              >
                Live
              </button>
              <button
                onClick={() => setStatus("draft")}
                className={`px-2.5 py-1 rounded-full font-medium ${status === "draft" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"}`}
              >
                Draft
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-accent-rose">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-primary-700 text-white disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving…" : initial ? "Save changes" : "Add project"}
          </button>
        </div>
      </div>
    </div>
  );
}
