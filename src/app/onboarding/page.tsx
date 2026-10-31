"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Wrench,
  FolderGit2,
  Award,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { saveOnboardingProfile, saveProfileDraft } from "@/lib/auth-context";
import { getResumeData, saveResumeData, newId } from "@/lib/resume";
import type { ResumeData, ExperienceEntry, EducationEntry, ProjectEntry, ExternalCertification } from "@/lib/resume";
import { DoodleScribbles } from "@/components/DoodleScribbles";

const STEPS = [
  { key: "basic", label: "Basic Details", icon: UserIcon },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "summary", label: "Summary", icon: FileText },
] as const;

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("Student/Fresher");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<ResumeData>({
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    externalCertifications: [],
    template: "modern",
  });
  const [skillInput, setSkillInput] = useState("");
  const [draftingSummary, setDraftingSummary] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && profile?.onboardingComplete) router.replace("/dashboard");
  }, [loading, profile, router]);

  useEffect(() => {
    if (loading || !user || ready) return;
    (async () => {
      if (profile) {
        setName(profile.name || "");
        setRole(profile.role || "Student/Fresher");
        setCompany(profile.company || "");
        setPhone(profile.phone || "");
      }
      const existing = await getResumeData(user.uid, { sample: false });
      setResume(existing);
      setReady(true);
    })();
  }, [loading, user, profile, ready]);

  const current = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const canProceed = useMemo(() => {
    if (current.key === "basic") return name.trim().length > 0 && role.trim().length > 0;
    if (current.key === "skills") return resume.skills.length > 0;
    return true;
  }, [current.key, name, role, resume.skills.length]);

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      await saveOnboardingProfile(user.uid, { name, role, company, phone });
      await saveResumeData(user.uid, resume);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your details. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function saveProgress() {
    if (!user) return;
    saveProfileDraft(user.uid, { name, role, company, phone }).catch(() => {});
    saveResumeData(user.uid, resume).catch(() => {});
  }

  function handleNext() {
    if (isLastStep) {
      handleFinish();
    } else {
      saveProgress();
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    saveProgress();
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleDraftSummary() {
    setDraftingSummary(true);
    try {
      const res = await fetch("/api/resume/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          education: resume.education,
          experience: resume.experience,
          skills: resume.skills,
          projects: resume.projects,
        }),
      });
      const body = await res.json();
      if (res.ok) setResume((r) => ({ ...r, summary: body.summary }));
    } finally {
      setDraftingSummary(false);
    }
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || resume.skills.includes(trimmed)) return;
    setResume((r) => ({ ...r, skills: [...r.skills, trimmed] }));
    setSkillInput("");
  }

  if (loading || !user || !ready) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-primary-0 pb-10">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-8">
        <DoodleScribbles />
        <div className="relative max-w-xl mx-auto px-4 pt-8">
          <h1 className="text-xl font-bold text-white">Let&apos;s set up your profile</h1>
          <p className="text-sm text-white/80 mt-1">
            A few quick steps — this becomes your resume, and you won&apos;t need to enter it again.
          </p>

          <div className="flex items-center justify-between mt-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const state = i < step ? "done" : i === step ? "active" : "todo";
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                        state === "done"
                          ? "bg-accent-green border-accent-green text-white"
                          : state === "active"
                            ? "bg-white border-white text-primary-700"
                            : "bg-white/10 border-white/30 text-white/50"
                      }`}
                    >
                      {state === "done" ? <Check size={15} /> : <Icon size={14} />}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 ${i < step ? "bg-accent-green" : "bg-white/25"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-white/80 mt-2">
            Step {step + 1} of {STEPS.length} — {current.label}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-6">
        {error && <p className="text-sm text-accent-rose mb-3">{error}</p>}

        {current.key === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Full name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Email</label>
              <input value={user.email || ""} disabled className={`${inputClass} bg-neutral-100 text-neutral-500`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Role *</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                  <option>Student/Fresher</option>
                  <option>Working Professional</option>
                  <option>Job Seeker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Company/College</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your college or company" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." className={inputClass} />
            </div>
          </div>
        )}

        {current.key === "education" && (
          <ListStep<EducationEntry>
            hint="Add your degrees or courses — most recent first. You can skip if you don't have any yet."
            items={resume.education}
            onChange={(items) => setResume((r) => ({ ...r, education: items }))}
            makeEmpty={() => ({ id: newId(), degree: "", institution: "", duration: "" })}
            addLabel="Add education"
            renderFields={(item, update) => (
              <>
                <input value={item.degree} onChange={(e) => update({ degree: e.target.value })} placeholder="Degree / Course" className={inputClass} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={item.institution} onChange={(e) => update({ institution: e.target.value })} placeholder="Institution" className={inputClass} />
                  <input value={item.duration} onChange={(e) => update({ duration: e.target.value })} placeholder="Duration" className={inputClass} />
                </div>
              </>
            )}
          />
        )}

        {current.key === "experience" && (
          <ListStep<ExperienceEntry>
            hint="Internships, jobs, freelance work — anything counts. No experience yet? Just skip this step."
            items={resume.experience}
            onChange={(items) => setResume((r) => ({ ...r, experience: items }))}
            makeEmpty={() => ({ id: newId(), title: "", company: "", duration: "", description: "" })}
            addLabel="Add experience"
            renderFields={(item, update) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Job title" className={inputClass} />
                  <input value={item.company} onChange={(e) => update({ company: e.target.value })} placeholder="Company" className={inputClass} />
                </div>
                <input value={item.duration} onChange={(e) => update({ duration: e.target.value })} placeholder="Duration" className={inputClass} />
                <textarea
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder={"One achievement per line"}
                  rows={2}
                  className={inputClass}
                />
              </>
            )}
          />
        )}

        {current.key === "skills" && (
          <div>
            <p className="text-sm text-neutral-600 mb-3">
              Add at least one skill — technical or soft skills both count.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {resume.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 text-primary-700">
                  {s}
                  <button onClick={() => setResume((r) => ({ ...r, skills: r.skills.filter((sk) => sk !== s) }))}>
                    ×
                  </button>
                </span>
              ))}
              {resume.skills.length === 0 && <p className="text-xs text-neutral-400">No skills added yet.</p>}
            </div>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, Communication, Excel"
                className={inputClass}
              />
              <button onClick={addSkill} className="shrink-0 px-4 rounded-lg bg-primary-700 text-white text-sm font-medium">
                Add
              </button>
            </div>
          </div>
        )}

        {current.key === "projects" && (
          <ListStep<ProjectEntry>
            hint="Personal, academic, or hackathon projects — great for showing initiative. Skip if none yet."
            items={resume.projects}
            onChange={(items) => setResume((r) => ({ ...r, projects: items }))}
            makeEmpty={() => ({ id: newId(), title: "", description: "", link: "" })}
            addLabel="Add project"
            renderFields={(item, update) => (
              <>
                <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Project title" className={inputClass} />
                <textarea
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="One point per line"
                  rows={2}
                  className={inputClass}
                />
                <input value={item.link} onChange={(e) => update({ link: e.target.value })} placeholder="Link (optional)" className={inputClass} />
              </>
            )}
          />
        )}

        {current.key === "certifications" && (
          <div>
            <div className="rounded-xl bg-primary-100/60 p-3.5 flex gap-2.5 mb-4">
              <ShieldCheck size={18} className="text-primary-700 shrink-0 mt-0.5" />
              <p className="text-sm text-primary-700">
                Certificates you upload to <strong>Career Vault</strong> and mark &ldquo;On Resume &amp; Portfolio&rdquo;
                are pulled into your resume automatically — you don&apos;t need to re-type them here.
              </p>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Got a certificate you don&apos;t want to upload as a file? Add it here instead.
            </p>
            <ListStep<ExternalCertification>
              hint=""
              items={resume.externalCertifications}
              onChange={(items) => setResume((r) => ({ ...r, externalCertifications: items }))}
              makeEmpty={() => ({ id: newId(), name: "", issuer: "" })}
              addLabel="Add certificate"
              renderFields={(item, update) => (
                <div className="grid grid-cols-2 gap-2">
                  <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Certificate name" className={inputClass} />
                  <input value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} placeholder="Issued by" className={inputClass} />
                </div>
              )}
            />
          </div>
        )}

        {current.key === "summary" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-neutral-900">Professional summary</label>
              <button
                onClick={handleDraftSummary}
                disabled={draftingSummary}
                className="flex items-center gap-1 text-xs font-medium text-primary-700 disabled:opacity-60"
              >
                {draftingSummary ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Draft this for me
              </button>
            </div>
            <textarea
              value={resume.summary}
              onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))}
              rows={5}
              placeholder="A short pitch about who you are and what you're looking for…"
              className={inputClass}
            />
            <p className="text-xs text-neutral-500 mt-2">
              This is the last step — click Finish to save everything and go to your dashboard.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-1 text-sm font-medium text-neutral-600 disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed || saving}
          className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-primary-700 text-white disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : isLastStep ? (
            <Check size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
          {saving ? "Saving…" : isLastStep ? "Finish setup" : "Next"}
        </button>
      </div>
    </main>
  );
}

function ListStep<T extends { id: string }>({
  hint,
  items,
  onChange,
  makeEmpty,
  addLabel,
  renderFields,
}: {
  hint: string;
  items: T[];
  onChange: (items: T[]) => void;
  makeEmpty: () => T;
  addLabel: string;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div>
      {hint && <p className="text-sm text-neutral-600 mb-3">{hint}</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl bg-neutral-100 p-3 space-y-2 relative">
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label="Remove"
              className="absolute top-2 right-2 text-neutral-400 hover:text-accent-rose"
            >
              <Trash2 size={14} />
            </button>
            {renderFields(item, (patch) => {
              const next = [...items];
              next[i] = { ...item, ...patch };
              onChange(next);
            })}
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...items, makeEmpty()])}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary-700"
      >
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}
