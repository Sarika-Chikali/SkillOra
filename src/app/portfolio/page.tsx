"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  FolderGit2,
  Star,
  Sparkles,
  Settings,
  Eye,
  Trash2,
  Pencil,
  Globe,
  ExternalLink,
  Rocket,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  watchPortfolioData,
  watchProjects,
  saveProject,
  deleteProject,
  EMPTY_PORTFOLIO_DATA,
  type PortfolioData,
  type Project,
} from "@/lib/portfolio";
import { ProjectForm } from "@/components/portfolio/ProjectForm";
import { DoodleScribbles } from "@/components/DoodleScribbles";
import { BottomNav } from "@/components/dashboard/BottomNav";

export default function PortfolioPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [data, setData] = useState<PortfolioData>(EMPTY_PORTFOLIO_DATA);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!user) return;
    const unsub1 = watchPortfolioData(user.uid, setData);
    const unsub2 = watchProjects(user.uid, setProjects);
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  const strength = useMemo(() => {
    let score = 0;
    if (data.headline && data.tagline && data.about) score += 20;
    if (data.skills.length >= 3) score += 20;
    if (projects.length >= 1) score += 20;
    if (projects.some((p) => p.featured)) score += 20;
    if (data.published) score += 20;
    return score;
  }, [data, projects]);

  const featuredCount = projects.filter((p) => p.featured).length;
  const liveCount = projects.filter((p) => p.status === "live").length;

  async function handleSaveProject(project: Project) {
    if (!user) return;
    await saveProject(user.uid, project);
  }

  async function handleDeleteProject(id: string) {
    if (!user) return;
    setError("");
    try {
      await deleteProject(user.uid, id);
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete this project.");
    }
  }

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
        <DoodleScribbles />
        <div className="relative max-w-4xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/90 text-sm hover:text-white">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <Link
              href="/portfolio/edit"
              className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white bg-white/15 px-3 py-1.5 rounded-full"
            >
              <Settings size={13} /> Edit profile
            </Link>
          </div>
          <h1 className="text-xl font-bold text-white mt-3">Portfolio Builder</h1>
          <p className="text-sm text-white/80 mt-0.5">Build and showcase your work. Impress recruiters with real projects.</p>

          {data.published && data.slug && (
            <a
              href={`/p/${data.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full mt-4"
            >
              <Globe size={13} /> Live at /p/{data.slug} <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Stats row — every number here is real, computed from actual saved data */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={FolderGit2} label="Projects" value={projects.length} />
          <StatCard icon={Rocket} label="Live" value={liveCount} />
          <StatCard icon={Star} label="Featured" value={featuredCount} />
          <StatCard icon={Sparkles} label="Skills" value={data.skills.length} />
        </div>

        {/* Portfolio strength */}
        <div className="mt-4 rounded-2xl border border-neutral-300/60 p-4 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="var(--color-accent-green)"
                strokeWidth="3"
                strokeDasharray={`${(strength / 100) * 97.4} 97.4`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-neutral-900">{strength}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Portfolio strength</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {strength === 100
                ? "Complete — this is ready to impress."
                : strength >= 60
                  ? "Good progress. Add more to stand out further."
                  : "Fill in your profile and add projects to build a stronger portfolio."}
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-accent-rose mt-3">{error}</p>}

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="mt-6 text-center rounded-2xl bg-neutral-100 p-10">
            <FolderGit2 size={28} className="mx-auto text-primary-700 mb-3" />
            <p className="text-sm font-semibold text-neutral-900">You haven&apos;t built any portfolio yet!</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              Create your first project and showcase your skills to the world.
            </p>
            <button
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-primary-700 text-white"
            >
              <Plus size={15} /> Create New Project
            </button>

            <div className="grid sm:grid-cols-3 gap-3 mt-8 text-left">
              <Tip title="Showcase your skills" description="With real projects, not just a list of buzzwords." />
              <Tip title="Stand out to recruiters" description="A portfolio proves what your resume claims." />
              <Tip title="Get more job opportunities" description="Share one link that does the talking for you." />
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-neutral-900">Your projects</h2>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white"
              >
                <Plus size={13} /> Add project
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {projects.map((p) => (
                <div key={p.id} className="rounded-2xl border border-neutral-300/60 bg-white overflow-hidden">
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="w-full h-32 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate flex items-center gap-1.5">
                          {p.title}
                          {p.featured && <Star size={12} className="text-accent-amber shrink-0" fill="currentColor" />}
                        </p>
                        <span
                          className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${
                            p.status === "live" ? "bg-accent-green/15 text-accent-green" : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {p.status === "live" ? "Live" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProject(p);
                            setShowForm(true);
                          }}
                          aria-label="Edit"
                          className="p-1.5 text-neutral-400 hover:text-primary-700"
                        >
                          <Pencil size={14} />
                        </button>
                        {confirmDeleteId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDeleteProject(p.id)} className="text-[10px] font-semibold text-white bg-accent-rose px-2 py-1 rounded-full">
                              Confirm
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] font-medium text-neutral-500 px-2 py-1">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(p.id)} aria-label="Delete" className="p-1.5 text-neutral-400 hover:text-accent-rose">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {p.description && <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">{p.description}</p>}
                    {p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {p.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publish CTA */}
        <Link
          href="/portfolio/edit"
          className="mt-8 flex items-center justify-between gap-2 rounded-2xl p-5 text-white"
          style={{ backgroundImage: "var(--gradient-violet)" }}
        >
          <div className="flex items-center gap-3">
            <Eye size={22} />
            <div>
              <p className="text-sm font-semibold">{data.published ? "Manage your live portfolio" : "Ready to publish?"}</p>
              <p className="text-xs text-white/80">
                {data.published ? "Update your details, template, or unpublish anytime." : "Choose a template and get a shareable public link."}
              </p>
            </div>
          </div>
          <ArrowLeft size={16} className="rotate-180 shrink-0" />
        </Link>
      </div>

      {showForm && user && (
        <ProjectForm
          uid={user.uid}
          initial={editingProject}
          onClose={() => setShowForm(false)}
          onSave={handleSaveProject}
        />
      )}

      <BottomNav />
    </main>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number }>; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-neutral-100 p-3.5 text-center">
      <Icon size={16} />
      <p className="text-lg font-bold text-neutral-900 mt-1">{value}</p>
      <p className="text-[11px] text-neutral-500">{label}</p>
    </div>
  );
}

function Tip({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-white p-3 border border-neutral-200">
      <p className="text-xs font-semibold text-neutral-900">{title}</p>
      <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>
    </div>
  );
}
