"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { saveResumeData, type TemplateId } from "@/lib/resume";
import { TEMPLATES } from "@/components/resume/templates";
import { SAMPLE } from "@/components/resume/TemplatePicker";

export default function ResumeTemplatePreviewPage() {
  const router = useRouter();
  const params = useParams<{ templateId: string }>();
  const { user, profile, loading } = useAuth();
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  const id: TemplateId = params.templateId in TEMPLATES ? (params.templateId as TemplateId) : "modern";
  const entry = TEMPLATES[id];
  const Template = entry.component;

  async function useThisTemplate() {
    if (!user) return;
    setApplying(true);
    try {
      await saveResumeData(user.uid, { template: id });
      router.push("/resume");
    } finally {
      setApplying(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 pb-10">
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <Link href="/templates/resume" className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 shrink-0">
            <ArrowLeft size={16} /> Templates
          </Link>
          <div className="text-center min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-700">Template Preview</p>
            <p className="text-sm font-semibold text-neutral-900 truncate">{entry.label}</p>
          </div>
          <button
            onClick={useThisTemplate}
            disabled={applying}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-primary-700 text-white disabled:opacity-60 shrink-0"
          >
            {applying ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            {applying ? "Applying…" : "Use This Template"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-3 px-4">Sample details shown — your own information fills it in once you use it.</p>
      <div className="max-w-3xl mx-auto mt-3 px-3">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <Template {...SAMPLE} />
        </div>
      </div>
    </main>
  );
}
