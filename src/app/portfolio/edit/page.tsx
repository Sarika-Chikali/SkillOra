"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Rocket,
  AlertTriangle,
  Sparkles,
  Palette,
  MousePointerClick,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  watchPortfolioData,
  watchProjects,
  savePortfolioData,
  saveProject,
  newProjectId,
  publishPortfolio,
  unpublishPortfolio,
  isSlugAvailable,
  EMPTY_PORTFOLIO_DATA,
  type PortfolioData,
  type Project,
  type DeployPlatform,
} from "@/lib/portfolio";
import { watchResumeData, EMPTY_RESUME_DATA, type ResumeData } from "@/lib/resume";
import { watchVaultFiles, type VaultFile } from "@/lib/vault";
import { buildSyncCandidates, applySyncCandidate, type SyncCandidate } from "@/lib/portfolioSync";
import { PortfolioTemplatePicker } from "@/components/portfolio/PortfolioTemplatePicker";
import { PORTFOLIO_TEMPLATES } from "@/components/portfolio/templates";
import { SAMPLE_PROJECTS_LIST } from "@/lib/sampleContent";
import { EditableCanvas } from "@/components/portfolio/EditableCanvas";
import { EditPanel, type PanelSectionId } from "@/components/portfolio/EditPanel";
import { DeployModal } from "@/components/portfolio/DeployModal";
import { PortfolioShareCard } from "@/components/portfolio/PortfolioShareCard";
import { BottomNav } from "@/components/dashboard/BottomNav";

type PublishState = "idle" | "checking" | "publishing" | "error";

export default function PortfolioEditPage() {
  return (
    <Suspense fallback={null}>
      <PortfolioEditPageInner />
    </Suspense>
  );
}

function PortfolioEditPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();

  const [data, setData] = useState<PortfolioData>(EMPTY_PORTFOLIO_DATA);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME_DATA);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishError, setPublishError] = useState("");
  const [selectedSection, setSelectedSection] = useState<PanelSectionId | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployError, setDeployError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!user) return;
    const unsub1 = watchPortfolioData(user.uid, (d) => {
      setData(d);
      setSlugInput((prev) => prev || d.slug);
    });
    const unsub2 = watchProjects(user.uid, setProjects);
    const unsub3 = watchResumeData(user.uid, setResume);
    const unsub4 = watchVaultFiles(user.uid, setVaultFiles);
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, [user]);

  // The adapter layer: diffs SkillOra's source data (profile/resume/vault)
  // against what's currently in the portfolio, proposing what's new. Never
  // applied automatically — see lib/portfolioSync.ts.
  const syncCandidates = useMemo(
    () => buildSyncCandidates({ portfolio: data, profile, resume, vaultFiles }),
    [data, profile, resume, vaultFiles]
  );

  function markManual(field: string) {
    setData((d) => (d.manualFields.includes(field) ? d : { ...d, manualFields: [...d.manualFields, field] }));
  }

  async function applySync(candidate: SyncCandidate) {
    if (!user) return;
    setSyncing(true);
    try {
      const patch = applySyncCandidate(candidate);
      setData((d) => ({ ...d, ...patch }));
      await savePortfolioData(user.uid, withProfileSnapshot({ ...data, ...patch }));
    } finally {
      setSyncing(false);
    }
  }

  // Coming back from the Vercel/Netlify OAuth round trip.
  useEffect(() => {
    if (!user) return;
    const deployed = searchParams.get("deployed");
    const errorMsg = searchParams.get("deployError");
    if (deployed === "1") {
      const platform = searchParams.get("platform") as DeployPlatform | null;
      const deployUrl = searchParams.get("deployUrl") || "";
      const siteId = searchParams.get("siteId") || "";
      if (platform) {
        savePortfolioData(user.uid, {
          deploy: { platform, url: deployUrl, status: "live", error: "", siteId, deployedAt: new Date() },
        }).catch(() => {});
      }
      router.replace("/portfolio/edit");
    } else if (errorMsg) {
      setDeployError(errorMsg);
      router.replace("/portfolio/edit");
    }
  }, [user, searchParams, router]);

  function handleDeployed(platform: DeployPlatform, url: string) {
    if (!user) return;
    savePortfolioData(user.uid, {
      deploy: { platform, url, status: "live", error: "", siteId: "", deployedAt: new Date() },
    }).catch(() => {});
    setShowDeployModal(false);
  }

  function addSkill() {
    const s = skillInput.trim();
    if (!s || data.skills.includes(s)) return;
    setData((d) => ({ ...d, skills: [...d.skills, s] }));
    setSkillInput("");
  }

  function withProfileSnapshot(fields: Partial<PortfolioData>) {
    return {
      ...fields,
      displayName: profile?.name || "",
      photoURL: profile?.photoURL || null,
      avatarColor: profile?.avatarColor || null,
    };
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaveError("");
    try {
      await savePortfolioData(user.uid, withProfileSnapshot(data));
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!user) return;
    setPublishError("");
    if (data.isSample) {
      setPublishError("Replace the sample content with your own details before publishing.");
      return;
    }
    setPublishState("checking");
    try {
      const clean = slugInput.trim();
      if (!clean) throw new Error("Choose a URL for your portfolio first.");
      const available = await isSlugAvailable(clean, user.uid);
      if (!available) {
        setPublishState("error");
        setPublishError("That URL is already taken. Try another.");
        return;
      }
      setPublishState("publishing");
      await savePortfolioData(user.uid, withProfileSnapshot(data));
      const finalSlug = await publishPortfolio(user.uid, clean, data.published ? data.slug : null);
      setSlugInput(finalSlug);
      setPublishState("idle");
    } catch (err) {
      setPublishState("error");
      setPublishError(err instanceof Error ? err.message : "Couldn't publish. Please try again.");
    }
  }

  async function handleUnpublish() {
    if (!user) return;
    try {
      await unpublishPortfolio(user.uid, data.slug || null);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Couldn't unpublish. Please try again.");
    }
  }

  const previewProfile = useMemo(
    () => ({
      name: profile?.name || "",
      photoURL: profile?.photoURL || null,
      avatarColor: profile?.avatarColor || null,
      email: profile?.email || "",
    }),
    [profile]
  );

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-primary-0 pb-24">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-6">
        <div className="relative max-w-3xl mx-auto px-4 pt-6">
          <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-white/90 text-sm hover:text-white">
            <ArrowLeft size={16} /> Portfolio
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Edit Portfolio</h1>
          <p className="text-sm text-white/80 mt-0.5">Your story, your skills, your template — then publish it.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Profile</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : savedTick ? <Check size={13} /> : <Save size={13} />}
            {savedTick ? "Saved" : "Save"}
          </button>
        </div>
        {saveError && <p className="text-xs text-accent-rose">{saveError}</p>}

        {syncCandidates.length > 0 && (
          <div className="rounded-2xl border border-primary-300/50 bg-primary-100/30 p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary-800">
              <Sparkles size={14} /> Your SkillOra profile has information not yet in this portfolio
            </h3>
            <div className="mt-3 space-y-2">
              {syncCandidates.map((c) => (
                <div key={c.field} className="flex items-center justify-between gap-3 bg-primary-0 rounded-xl px-3 py-2">
                  <span className="text-sm text-neutral-800">{c.label}</span>
                  <button
                    onClick={() => applySync(c)}
                    disabled={syncing}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-60"
                  >
                    Add to portfolio
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {data.isSample && (
          <div className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">You&apos;re looking at sample content</p>
            <p className="mt-0.5 text-xs">This portfolio is filled with placeholder details so you can see how it looks. Use “Edit All Details” (or tap any section) to replace it with your own information — you can’t publish until you do.</p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900">Your Live Portfolio</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSection("all")}
                className="flex items-center gap-1.5 text-xs font-medium text-primary-700 hover:underline"
              >
                <ListChecks size={13} /> Edit All Details
              </button>
              <button
                onClick={() => document.getElementById("more-templates")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-primary-700 text-white shadow-sm hover:bg-primary-800"
              >
                <Palette size={15} /> Change Template · {Object.keys(PORTFOLIO_TEMPLATES).length} designs
              </button>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
            <MousePointerClick size={13} className="shrink-0" /> Click the preview to edit it directly, or use &ldquo;Edit All Details&rdquo; for every field &mdash; including Education and Experience. Only the top of your portfolio is shown here.</p>
          <div className="rounded-2xl border border-neutral-300/60 overflow-hidden relative" style={{ height: "min(75vh, 640px)" }}>
            <EditableCanvas
              Template={PORTFOLIO_TEMPLATES[data.template].component}
              templateProps={{ profile: previewProfile, data, projects: data.isSample && projects.length === 0 ? SAMPLE_PROJECTS_LIST : projects }}
              onSelectSection={setSelectedSection}
            />
          </div>
        </div>

        <div id="more-templates" className="scroll-mt-4">
          <h2 className="text-base font-semibold text-neutral-900">More like this</h2>
          <p className="text-xs text-neutral-500 mt-0.5 mb-3">{Object.keys(PORTFOLIO_TEMPLATES).length} designs &mdash; your content carries over when you switch.</p>
          <PortfolioTemplatePicker
            value={data.template}
            onChange={(template) => {
              setData((d) => ({ ...d, template }));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>

        <div className="rounded-2xl border border-neutral-300/60 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
            <Rocket size={15} /> Publish
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Choose a URL for your portfolio. Anyone with the link can view it — no sign-in required.
          </p>

          <div className="flex items-center mt-3">
            <span className="text-xs text-neutral-500 bg-neutral-100 rounded-l-lg px-3 py-2 border border-r-0 border-neutral-300 shrink-0">
              skillora.app/p/
            </span>
            <input
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="your-name"
              className="flex-1 rounded-r-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
            />
          </div>

          {publishError && <p className="text-xs text-accent-rose mt-2">{publishError}</p>}

          <div className="mt-4">
            <button
              onClick={handlePublish}
              disabled={publishState === "checking" || publishState === "publishing"}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-primary-700 text-white disabled:opacity-60"
            >
              {publishState === "checking" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Checking URL…
                </>
              ) : publishState === "publishing" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Publishing…
                </>
              ) : (
                <>
                  <Rocket size={15} /> {data.published ? "Republish" : "Publish Portfolio"}
                </>
              )}
            </button>
          </div>

          {data.published && (
            <>
              {!(data.deploy?.status === "live" && data.deploy.url) && (
              <div className="mt-4">
                <PortfolioShareCard
                  url={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${data.slug}`}
                  ogImageUrl={`/p/${data.slug}/opengraph-image?v=${data.template}`}
                  displayName={data.displayName}
                  headline={data.headline}
                  tagline={data.tagline}
                />
              </div>
              )}
              <button onClick={handleUnpublish} className="text-xs text-neutral-400 hover:text-accent-rose mt-3">
                Unpublish portfolio
              </button>
            </>
          )}
        </div>

        {data.published && (
          <div className="rounded-2xl border border-neutral-300/60 p-5">
            <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
              <Rocket size={15} /> Deploy to Vercel or Netlify
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Get your own {"{"}your-project{"}"}.vercel.app or .netlify.app URL, hosted on their platform.
            </p>

            {deployError && (
              <p className="flex items-start gap-1.5 text-xs text-accent-rose mt-3">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" /> {deployError}
              </p>
            )}

            {data.deploy?.status === "live" && data.deploy.url ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-green">
                  <Check size={13} /> Deployed to {data.deploy.platform === "vercel" ? "Vercel" : "Netlify"}
                </div>
                <PortfolioShareCard
                  url={data.deploy.url}
                  ogImageUrl={`/p/${data.slug}/opengraph-image?v=${data.template}`}
                  displayName={data.displayName}
                  headline={data.headline}
                  tagline={data.tagline}
                />
                <button
                  onClick={() => setShowDeployModal(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full border-2 border-primary-700 text-primary-700"
                >
                  <Rocket size={15} /> Redeploy latest changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeployModal(true)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-neutral-900 text-white"
              >
                <Rocket size={15} /> Deploy Portfolio
              </button>
            )}
          </div>
        )}
      </div>

      <EditPanel
        sectionId={selectedSection}
        onClose={() => setSelectedSection(null)}
        data={data}
        setData={setData}
        markManual={markManual}
        skillInput={skillInput}
        setSkillInput={setSkillInput}
        addSkill={addSkill}
        onAddProject={async (fields) => {
          if (!user) return;
          await saveProject(user.uid, { id: newProjectId(), highlights: "", imageUrl: "", featured: false, status: "live", createdAt: null, ...fields });
        }}
      />

      {showDeployModal && user && (
        <DeployModal
          slug={data.slug}
          onClose={() => setShowDeployModal(false)}
          onDeployed={handleDeployed}
        />
      )}

      <BottomNav />
    </main>
  );
}
