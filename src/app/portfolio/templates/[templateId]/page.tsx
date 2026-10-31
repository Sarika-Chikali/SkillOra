"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Rocket, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { savePortfolioData } from "@/lib/portfolio";
import { normalizePortfolioTemplate } from "@/lib/portfolioTypes";
import { PORTFOLIO_TEMPLATES } from "@/components/portfolio/templates";
import { SAMPLE_PROFILE, SAMPLE_DATA, SAMPLE_PROJECTS } from "@/components/portfolio/templates/demoData";

export default function TemplatePreviewPage() {
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

  const templateId = normalizePortfolioTemplate(params.templateId);
  const entry = PORTFOLIO_TEMPLATES[templateId];
  const Template = entry.component;

  async function useThisTemplate() {
    if (!user) return;
    setApplying(true);
    try {
      await savePortfolioData(user.uid, { template: templateId });
      router.push("/portfolio/edit");
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
    <main className="min-h-screen bg-neutral-100">
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link href="/portfolio/edit" className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 shrink-0">
            <ArrowLeft size={16} /> Back to Templates
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
            {applying ? <Loader2 size={13} className="animate-spin" /> : <Rocket size={13} />}
            {applying ? "Applying…" : "Use This Template"}
          </button>
        </div>
      </div>

      {/* transform contains any `position: fixed` element inside the
          template (used by some for nav/background) to this box instead of
          the real viewport, so it can't collide with the sticky bar above. */}
      <div className="bg-white shadow-sm" style={{ transform: "translateZ(0)" }}>
        <Template profile={SAMPLE_PROFILE} data={{ ...SAMPLE_DATA, template: templateId }} projects={SAMPLE_PROJECTS} />
      </div>
    </main>
  );
}
