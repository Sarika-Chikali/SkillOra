"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Printer, Save, Loader2, Check, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { watchVaultFiles, type VaultFile } from "@/lib/vault";
import { watchResumeData, saveResumeData, EMPTY_RESUME_DATA, type ResumeData, type TemplateId } from "@/lib/resume";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { TemplatePicker } from "@/components/resume/TemplatePicker";
import { TEMPLATES } from "@/components/resume/templates";
import { DoodleScribbles } from "@/components/DoodleScribbles";
import { BottomNav } from "@/components/dashboard/BottomNav";

export default function ResumePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [data, setData] = useState<ResumeData>(EMPTY_RESUME_DATA);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!user) return;
    const wanted = new URLSearchParams(window.location.search).get("template");
    let pending = wanted && wanted in TEMPLATES ? (wanted as TemplateId) : null;
    const unsub1 = watchResumeData(user.uid, (d) => {
      setData(pending ? { ...d, template: pending } : d);
      pending = null;
    });
    const unsub2 = watchVaultFiles(user.uid, setVaultFiles);
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  const certifications = useMemo(
    () => [
      ...vaultFiles
        .filter((f) => f.addedToResumePortfolio && f.extracted?.documentType === "certificate")
        .map((f) => ({
          name: f.extracted.name || f.fileName,
          issuer: f.extracted.issuer || f.folder,
          verified: f.verification.status === "verified" || f.verification.status === "likely_genuine",
        })),
      ...data.externalCertifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        verified: false,
      })),
    ],
    [vaultFiles, data.externalCertifications]
  );

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaveError("");
    try {
      await saveResumeData(user.uid, data);
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save your resume. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  const Template = TEMPLATES[data.template].component;

  return (
    <main className="flex-1 bg-primary-0 pb-24">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-6 print:hidden">
        <DoodleScribbles />
        <div className="relative max-w-5xl mx-auto px-4 pt-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/90 text-sm hover:text-white">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Resume Builder</h1>
          <p className="text-sm text-white/80 mt-0.5">
            Your base resume, built from your real profile and verified certificates.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 grid lg:grid-cols-2 gap-6 print:block">
        <div className="print:hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900">Your details</h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-60"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : savedTick ? <Check size={13} /> : <Save size={13} />}
              {savedTick ? "Saved" : "Save"}
            </button>
          </div>
          {saveError && <p className="text-xs text-accent-rose mb-3">{saveError}</p>}

          <ResumeForm data={data} onChange={setData} />

          {certifications.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-neutral-900 mb-1.5">
                Certifications <span className="text-neutral-500 font-normal">(from your Career Vault)</span>
              </p>
              <div className="rounded-xl bg-neutral-100 p-3 space-y-1.5">
                {certifications.map((c, i) => (
                  <p key={i} className="text-xs text-neutral-700">
                    {c.name} <span className="text-neutral-500">— {c.issuer}</span>
                    {c.verified && <span className="text-accent-green"> · verified</span>}
                  </p>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Add more from <Link href="/career-vault" className="text-primary-700 hover:underline">Career Vault</Link> by
                marking a certificate &ldquo;On Resume &amp; Portfolio&rdquo;.
              </p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-semibold text-neutral-900 mb-1.5">Template</p>
            <TemplatePicker value={data.template} onChange={(template) => setData({ ...data, template })} />
          </div>

          <Link
            href="/resume/tailored"
            className="mt-6 flex items-center justify-between gap-1.5 text-sm font-medium px-4 py-3 rounded-xl border-2 border-primary-700 text-primary-700 hover:bg-primary-100"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={15} /> Tailored Resumes
            </span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div>

          {data.isSample && (
          <div className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">You&apos;re looking at sample content</p>
            <p className="mt-0.5 text-xs">Your resume is filled with placeholder details so you can see how a finished one looks. Replace them with your own information on the left, then press Save.</p>
          </div>
          )}
          <div className="flex items-center justify-between mb-3 print:hidden">
            <h2 className="text-sm font-semibold text-neutral-900">Preview</h2>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-900 text-white"
            >
              <Printer size={13} /> Download PDF
            </button>
          </div>

          <div id="resume-print-area" className="rounded-2xl border border-neutral-300/60 shadow-sm overflow-hidden bg-white">
            <Template
              profile={{
                name: profile?.name || "",
                role: profile?.role || "",
                company: profile?.company || "",
                email: profile?.email || "",
              }}
              data={data}
              certifications={certifications}
            />
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
