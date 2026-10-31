"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Circle, ChevronRight, Loader2 } from "lucide-react";
import { useAuth, saveProfileDraft } from "@/lib/auth-context";
import { watchResumeData, saveResumeData, EMPTY_RESUME_DATA, type ResumeData } from "@/lib/resume";
import { watchPortfolioData, savePortfolioData, EMPTY_PORTFOLIO_DATA, type PortfolioData } from "@/lib/portfolio";
import { watchPersonalityProfile, EMPTY_PERSONALITY_PROFILE, type PersonalityProfile } from "@/lib/personality";
import { watchVaultFiles, type VaultFile } from "@/lib/vault";
import { AvatarEditor } from "@/components/dashboard/AvatarEditor";
import { BottomNav } from "@/components/dashboard/BottomNav";

type Item = { label: string; done: boolean; hint?: string };

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-neutral-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

function ModuleStatus({ title, href, cta, items }: { title: string; href: string; cta: string; items: Item[] }) {
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  return (
    <section className="rounded-2xl border border-neutral-300/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pct === 100 ? "bg-green-100 text-accent-green" : "bg-primary-100 text-primary-700"}`}>{pct}% complete</span>
      </div>
      <div className="h-1.5 rounded-full bg-neutral-200 mt-2 overflow-hidden">
        <div className="h-full bg-primary-700 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((i) => (
          <li key={i.label} className="flex items-start gap-2 text-sm">
            {i.done ? <Check size={15} className="text-accent-green mt-0.5 shrink-0" /> : <Circle size={15} className="text-neutral-300 mt-0.5 shrink-0" />}
            <span className={i.done ? "text-neutral-700" : "text-neutral-900 font-medium"}>
              {i.label}
              {!i.done && i.hint && <span className="block text-xs font-normal text-neutral-500">{i.hint}</span>}
            </span>
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
        {cta} <ChevronRight size={14} />
      </Link>
    </section>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME_DATA);
  const [portfolio, setPortfolio] = useState<PortfolioData>(EMPTY_PORTFOLIO_DATA);
  const [personality, setPersonality] = useState<PersonalityProfile>(EMPTY_PERSONALITY_PROFILE);
  const [vault, setVault] = useState<VaultFile[]>([]);

  const [form, setForm] = useState({ name: "", role: "", company: "", phone: "", bio: "", linkedinUrl: "" });
  const [summary, setSummary] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const unsubs = [
      watchResumeData(user.uid, setResume),
      watchPortfolioData(user.uid, setPortfolio),
      watchPersonalityProfile(user.uid, setPersonality),
      watchVaultFiles(user.uid, setVault),
    ];
    return () => unsubs.forEach((u) => u());
  }, [user]);

  // Fill the form once from the stored profile; later edits stay local until saved.
  useEffect(() => {
    if (loaded || !profile) return;
    setForm({
      name: profile.name || "",
      role: profile.role || "",
      company: profile.company || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
      linkedinUrl: profile.linkedinUrl || "",
    });
    setLoaded(true);
  }, [profile, loaded]);

  useEffect(() => {
    setSummary((s) => s || (resume.isSample ? "" : resume.summary));
  }, [resume.summary]);

  const certCount = vault.filter((f) => f.extracted?.documentType === "certificate").length;
  const portfolioHasContent = !portfolio.isSample && Boolean(portfolio.headline || portfolio.about || portfolio.skills.length);

  const resumeItems: Item[] = useMemo(
    () => [
      { label: "Name, role and email", done: Boolean(profile?.name && profile?.role && profile?.email), hint: "Fill these in under Basic info above." },
      { label: "Professional summary", done: !resume.isSample && Boolean(resume.summary.trim()), hint: "Add a 2-3 line summary below." },
      { label: "At least 3 skills", done: !resume.isSample && resume.skills.length >= 3, hint: "Add skills below or in the Resume builder." },
      { label: "Work experience", done: !resume.isSample && resume.experience.length > 0, hint: "Add a job, internship or role in Resume." },
      { label: "Education", done: !resume.isSample && resume.education.length > 0, hint: "Add your degree or school in Resume." },
      { label: "Projects", done: !resume.isSample && resume.projects.length > 0, hint: "Add a project in Resume." },
      { label: "Certificates", done: certCount > 0, hint: "Upload a certificate to Career Vault." },
    ],
    [profile, resume, certCount]
  );

  const portfolioItems: Item[] = useMemo(
    () => [
      { label: "Profile photo", done: Boolean(profile?.photoURL), hint: "Tap your photo above to add one." },
      { label: "Headline", done: !portfolio.isSample && Boolean(portfolio.headline), hint: "Set it in the Portfolio editor." },
      { label: "Tagline", done: !portfolio.isSample && Boolean(portfolio.tagline), hint: "Set it in the Portfolio editor." },
      { label: "About section", done: !portfolio.isSample && Boolean(portfolio.about), hint: "Write it in the Portfolio editor." },
      { label: "Skills", done: !portfolio.isSample && portfolio.skills.length > 0, hint: "Use Sync from SkillOra in the editor to bring them from your resume." },
      { label: "Social links", done: Boolean(portfolio.social.linkedin || portfolio.social.github || profile?.linkedinUrl), hint: "Add LinkedIn or GitHub." },
      { label: "Published", done: portfolio.published, hint: "Publish to get your public link." },
    ],
    [profile, portfolio]
  );

  const personalityItems: Item[] = useMemo(
    () => [{ label: "First personality check-in", done: personality.quizCount > 0, hint: "Take the quiz in Personality Dev." }],
    [personality]
  );

  async function saveBasics() {
    if (!user) return;
    setSaving(true);
    try {
      await saveProfileDraft(user.uid, { ...form, name: form.name.trim(), role: form.role.trim(), company: form.company.trim() });
      // Keep the published-portfolio snapshot of the name in step with the profile.
      if (portfolioHasContent && form.name.trim()) await savePortfolioData(user.uid, { displayName: form.name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function saveResumeEssentials(patch: Partial<ResumeData>) {
    if (!user) return;
    await saveResumeData(user.uid, patch);
  }

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  const total = [...resumeItems, ...portfolioItems, ...personalityItems];
  const overall = Math.round((total.filter((i) => i.done).length / total.length) * 100);

  return (
    <main className="flex-1 bg-primary-0 pb-28">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="pb-6">
        <div className="max-w-3xl mx-auto px-4 pt-7 flex items-center gap-4">
          <AvatarEditor uid={user.uid} name={profile?.name} photoURL={profile?.photoURL} avatarColor={profile?.avatarColor} menuAlign="left" />
          <div className="min-w-0 text-white">
            <h1 className="text-xl font-semibold truncate">{profile?.name || "My Profile"}</h1>
            <p className="text-sm text-white/80 truncate">{[profile?.role, profile?.company].filter(Boolean).join(" · ") || profile?.email}</p>
            <p className="text-xs text-white/80 mt-1">Profile {overall}% complete</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-5 space-y-5">
        <p className="text-xs text-neutral-500">
          Update your details once here — your resume, portfolio and personality space all read from this profile, so changes show up everywhere they&apos;re used.
        </p>

        <section className="rounded-2xl border border-neutral-300/60 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Basic info</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Full name">
              <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Role">
              <input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Student, Frontend Developer…" />
            </Field>
            <Field label="College / company">
              <input className={inputClass} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Email (from your login)">
              <input className={`${inputClass} bg-neutral-100`} value={profile?.email || ""} readOnly />
            </Field>
            <Field label="LinkedIn profile URL">
              <input className={inputClass} value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/…" />
            </Field>
          </div>
          <Field label="Bio / motto">
            <input className={inputClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </Field>
          <button onClick={saveBasics} disabled={saving} className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full bg-primary-700 text-white disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saved ? "Saved" : "Save basic info"}
          </button>
        </section>

        <section className="rounded-2xl border border-neutral-300/60 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Resume essentials</h2>
          <Field label="Professional summary">
            <textarea
              rows={3}
              className={inputClass}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onBlur={() => summary !== resume.summary && saveResumeEssentials({ summary })}
              placeholder="A short pitch about who you are and what you build."
            />
          </Field>
          <div>
            <span className="block text-xs font-medium text-neutral-600 mb-1">Skills</span>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(resume.isSample ? [] : resume.skills).map((s) => (
                <span key={s} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                  {s}
                  <button aria-label={`Remove ${s}`} onClick={() => saveResumeEssentials({ skills: (resume.isSample ? [] : resume.skills).filter((x) => x !== s) })}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              className={inputClass}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = skillInput.trim();
                  if (v && !resume.skills.includes(v)) saveResumeEssentials({ skills: [...(resume.isSample ? [] : resume.skills), v] });
                  setSkillInput("");
                }
              }}
              placeholder="Add a skill and press Enter"
            />
          </div>
          <p className="text-xs text-neutral-500">
            Saved to your resume automatically. Bring the same skills into your portfolio with &ldquo;Sync from SkillOra&rdquo; in the portfolio editor.
          </p>
        </section>

        <h2 className="text-base font-semibold text-neutral-900 pt-2">What you&apos;ve provided and what&apos;s still needed</h2>
        <ModuleStatus title="Resume" href="/resume" cta="Open resume builder" items={resumeItems} />
        <ModuleStatus title="Portfolio" href="/portfolio/edit" cta="Open portfolio editor" items={portfolioItems} />
        <ModuleStatus title="Personality Dev" href="/personality" cta="Open Personality Dev" items={personalityItems} />
        <section className="rounded-2xl border border-neutral-300/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900">Career Vault</h3>
            <span className="text-xs font-semibold text-primary-700">
              {vault.length} file{vault.length === 1 ? "" : "s"} · {certCount} certificate{certCount === 1 ? "" : "s"}
            </span>
          </div>
          <Link href="/career-vault" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
            Open Career Vault <ChevronRight size={14} />
          </Link>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
