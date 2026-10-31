"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Printer,
  Trash2,
  Briefcase,
  Building2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { watchVaultFiles, type VaultFile } from "@/lib/vault";
import {
  watchResumeData,
  watchTailoredResumes,
  saveTailoredResume,
  deleteTailoredResume,
  setTailoredResumeTemplate,
  EMPTY_RESUME_DATA,
  type ResumeData,
  type TailoredResume,
  type TemplateId,
} from "@/lib/resume";
import { TailorJDModal, type TailorResult } from "@/components/resume/TailorJDModal";
import { TemplatePicker } from "@/components/resume/TemplatePicker";
import { TEMPLATES } from "@/components/resume/templates";
import { DoodleScribbles } from "@/components/DoodleScribbles";
import { BottomNav } from "@/components/dashboard/BottomNav";

export default function TailoredResumesPage() {
  return (
    <Suspense fallback={null}>
      <TailoredResumesPageInner />
    </Suspense>
  );
}

function formatRelative(value: unknown): string {
  const date =
    value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function"
      ? (value as { toDate: () => Date }).toDate()
      : null;
  if (!date) return "Just now";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function TailoredResumesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();

  const [baseData, setBaseData] = useState<ResumeData>(EMPTY_RESUME_DATA);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [items, setItems] = useState<TailoredResume[]>([]);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (searchParams.get("new") === "1") setShowModal(true);
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    const unsub1 = watchResumeData(user.uid, setBaseData);
    const unsub2 = watchVaultFiles(user.uid, setVaultFiles);
    const unsub3 = watchTailoredResumes(user.uid, setItems);
    return () => {
      unsub1();
      unsub2();
      unsub3();
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
      ...baseData.externalCertifications.map((c) => ({ name: c.name, issuer: c.issuer, verified: false })),
    ],
    [vaultFiles, baseData.externalCertifications]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (t) => t.jobTitle.toLowerCase().includes(term) || t.company.toLowerCase().includes(term)
    );
  }, [items, search]);

  const active = items.find((t) => t.id === activeId) || null;

  async function handleTailorResult(result: TailorResult) {
    if (!user) throw new Error("Please sign in again and retry.");
    try {
      const id = await saveTailoredResume(
        user.uid,
        {
          jobTitle: result.jobTitle,
          company: result.company,
          tailoredSummary: result.tailoredSummary,
          highlightedSkills: result.highlightedSkills,
          matchNotes: result.matchNotes,
        },
        baseData.template
      );
      setActiveId(id);
      setShowModal(false);
    } catch (err) {
      console.error("Couldn't save tailored resume:", err);
      const denied = err instanceof Error && /permission|insufficient/i.test(err.message);
      throw new Error(
        denied
          ? "The resume was generated but couldn't be saved (permission denied). Please contact support."
          : "The resume was generated but couldn't be saved. Please try again."
      );
    }
  }

  async function handleTemplateChange(template: TemplateId) {
    if (!user || !active) return;
    try {
      await setTailoredResumeTemplate(user.uid, active.id, template);
    } catch (err) {
      console.error("Couldn't update template:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setDeleteError("");
    try {
      await deleteTailoredResume(user.uid, id);
      if (activeId === id) setActiveId(null);
      setConfirmDeleteId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete this. Please try again.");
    }
  }

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  const Template = TEMPLATES[active?.template || baseData.template].component;
  const previewData: ResumeData | null = active
    ? { ...baseData, summary: active.tailoredSummary, skills: active.highlightedSkills }
    : null;

  return (
    <main className="flex-1 bg-primary-0 pb-24">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-6 print:hidden">
        <DoodleScribbles />
        <div className="relative max-w-5xl mx-auto px-4 pt-6">
          <Link
            href={active ? "#" : "/resume"}
            onClick={(e) => {
              if (active) {
                e.preventDefault();
                setActiveId(null);
              }
            }}
            className="inline-flex items-center gap-1.5 text-white/90 text-sm hover:text-white"
          >
            <ArrowLeft size={16} /> {active ? "All tailored resumes" : "Resume Builder"}
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">
            {active ? active.jobTitle : "Tailored Resumes"}
          </h1>
          <p className="text-sm text-white/80 mt-0.5">
            {active
              ? [active.company, "tailored to this role"].filter(Boolean).join(" — ")
              : "Every version you've tailored to a job — reuse one anytime you're going for the same kind of role."}
          </p>
        </div>
      </div>

      {!active && (
        <div className="max-w-5xl mx-auto px-4 mt-6 print:hidden">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role or company…"
                className="w-full rounded-xl border border-neutral-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="shrink-0 flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary-700 text-white"
            >
              <Sparkles size={15} /> New tailored resume
            </button>
          </div>

          {deleteError && <p className="text-sm text-accent-rose mt-3">{deleteError}</p>}

          {items.length === 0 ? (
            <div className="mt-10 text-center rounded-2xl bg-neutral-100 p-10">
              <Sparkles size={28} className="mx-auto text-primary-700 mb-3" />
              <p className="text-sm font-semibold text-neutral-900">No tailored resumes yet</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Paste a job description and we&apos;ll reshape your real resume to match it — saved here so you can
                reuse it whenever a similar role comes up.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-primary-700 text-white"
              >
                <Sparkles size={14} /> Tailor your first resume
              </button>
            </div>
          ) : (
            <>
              {filtered.length === 0 && (
                <p className="text-sm text-neutral-500 mt-8 text-center">No matches for &ldquo;{search}&rdquo;.</p>
              )}
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {filtered.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-neutral-300/60 hover:border-primary-400 bg-white p-4 transition cursor-pointer"
                    onClick={() => setActiveId(t.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 truncate">
                          <Briefcase size={14} className="text-primary-700 shrink-0" /> {t.jobTitle}
                        </p>
                        {t.company && (
                          <p className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5 truncate">
                            <Building2 size={12} className="shrink-0" /> {t.company}
                          </p>
                        )}
                      </div>
                      {confirmDeleteId === t.id ? (
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-[11px] font-semibold text-accent-rose px-2 py-1 rounded-full bg-accent-rose/10"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] font-medium text-neutral-500 px-2 py-1 rounded-full bg-neutral-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(t.id);
                          }}
                          aria-label="Delete"
                          className="shrink-0 text-neutral-400 hover:text-accent-rose p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {t.highlightedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {t.highlightedSkills.slice(0, 4).map((s) => (
                          <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                            {s}
                          </span>
                        ))}
                        {t.highlightedSkills.length > 4 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                            +{t.highlightedSkills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="flex items-center gap-1 text-[11px] text-neutral-400 mt-3">
                      <Clock size={11} /> {formatRelative(t.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {active && previewData && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="flex items-center justify-between mb-3 print:hidden">
            <div className="flex flex-wrap gap-1.5">
              {active.highlightedSkills.slice(0, 6).map((s) => (
                <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {confirmDeleteId === active.id ? (
                <>
                  <button
                    onClick={() => handleDelete(active.id)}
                    className="text-xs font-semibold text-white px-3 py-1.5 rounded-full bg-accent-rose"
                  >
                    Confirm delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs font-medium text-neutral-600 px-3 py-1.5 rounded-full bg-neutral-100"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(active.id)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700"
                >
                  <Trash2 size={13} /> Delete
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-900 text-white"
              >
                <Printer size={13} /> Download PDF
              </button>
            </div>
          </div>

          {active.matchNotes.length > 0 && (
            <div className="rounded-xl bg-primary-100/60 p-3 mb-4 print:hidden">
              {active.matchNotes.map((note, i) => (
                <p key={i} className="text-xs text-primary-700 flex gap-1.5">
                  <span>•</span> {note}
                </p>
              ))}
            </div>
          )}

          <div className="mb-4 print:hidden">
            <p className="text-sm font-semibold text-neutral-900 mb-1.5">Template</p>
            <TemplatePicker value={active.template} onChange={handleTemplateChange} />
          </div>

          <div id="resume-print-area" className="rounded-2xl border border-neutral-300/60 shadow-sm overflow-hidden bg-white">
            <Template
              profile={{
                name: profile?.name || "",
                role: profile?.role || "",
                company: profile?.company || "",
                email: profile?.email || "",
              }}
              data={previewData}
              certifications={certifications}
            />
          </div>
        </div>
      )}

      {showModal && (
        <TailorJDModal
          resumeData={baseData}
          certifications={certifications}
          onClose={() => setShowModal(false)}
          onResult={handleTailorResult}
        />
      )}

      <div className="print:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
