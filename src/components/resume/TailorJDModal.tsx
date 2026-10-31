"use client";

import { useState } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import type { ResumeData } from "@/lib/resume";
import type { ResumeCertification } from "./templates";

export type TailorResult = {
  jobTitle: string;
  company: string;
  tailoredSummary: string;
  highlightedSkills: string[];
  matchNotes: string[];
};

export function TailorJDModal({
  resumeData,
  certifications,
  onClose,
  onResult,
}: {
  resumeData: ResumeData;
  certifications: ResumeCertification[];
  onClose: () => void;
  onResult: (result: TailorResult) => void | Promise<void>;
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          certifications: certifications.map((c) => c.name),
          jobDescription,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body) throw new Error(body?.error || "The tailoring service didn't respond in time. Please try again.");
      // Wait for the save so a failure shows here instead of the dialog just vanishing.
      await onResult(body as TailorResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-primary-0 rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-1.5">
            <Sparkles size={16} className="text-primary-700" /> Tailor to a job description
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-3">
          We&apos;ll rephrase and reorder your real resume content to match this job — never invent experience you
          don&apos;t have.
        </p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the job description here…"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />

        {jobDescription.trim().length > 0 && jobDescription.trim().length < 20 && (
          <p className="text-xs text-neutral-500 mt-2">Add a little more — at least 20 characters — to enable Generate.</p>
        )}
        {error && <p className="text-sm text-accent-rose mt-2">{error}</p>}

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 text-sm font-medium px-3 py-2 rounded-full bg-neutral-300/50 text-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || jobDescription.trim().length < 20}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full bg-primary-700 text-white disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
