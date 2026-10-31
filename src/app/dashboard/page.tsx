"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { Search, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { EditableBio } from "@/components/dashboard/EditableBio";
import { TemplateShowcase } from "@/components/dashboard/TemplateShowcase";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AvatarEditor } from "@/components/dashboard/AvatarEditor";
import { ResumeOptionsSheet } from "@/components/dashboard/ResumeOptionsSheet";
import { DoodleScribbles } from "@/components/DoodleScribbles";
import { getPersonalityProfile, isQuizDue } from "@/lib/personality";

const modules = [
  { icon: "/icons/career_vault_3d.svg", label: "Career Vault", href: "/career-vault", blurb: "Certificates & achievements" },
  { icon: "/icons/resume_3d.svg", label: "Resume", href: "/resume", blurb: "Build & tailor resumes" },
  { icon: "/icons/portfolio_3d.svg", label: "Portfolio", href: "/portfolio", blurb: "Your live website" },
  { icon: "/icons/personality_3d.svg", label: "Personality Dev.", href: "/personality", blurb: "Grow with daily check-ins" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [showResumeSheet, setShowResumeSheet] = useState(false);
  const [query, setQuery] = useState("");
  const matches = query.trim() ? modules.filter((m) => (m.label + " " + m.blurb).toLowerCase().includes(query.trim().toLowerCase())) : [];

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  // Compulsory personality check-in every 3 days — gate the whole app on it,
  // same as the onboarding gate, until it's done.
  useEffect(() => {
    if (loading || !user || !profile?.onboardingComplete) return;
    getPersonalityProfile(user.uid)
      .then((p) => {
        if (p.quizCount === 0 || isQuizDue(p.lastQuizAt)) router.replace("/personality/quiz");
      })
      .catch((err) => console.error("Couldn't check personality check-in status:", err));
  }, [loading, user, profile, router]);

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-primary-0 pb-24">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-8">
        <DoodleScribbles />
        <div className="relative max-w-3xl mx-auto px-4 pt-7">
          <header className="flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-sm text-white/80 leading-relaxed">
                Name: <span className="font-medium text-white">{profile?.name || "—"}</span>
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                Role: <span className="font-medium text-white">{profile?.role || "Student/Fresher"}</span>
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                Company: <span className="font-medium text-white">{profile?.company || "—"}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signOut(auth)}
                  aria-label="Sign out"
                  className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center text-white"
                >
                  <LogOut size={15} />
                </button>
              </div>
              <AvatarEditor
                uid={user.uid}
                name={profile?.name}
                photoURL={profile?.photoURL}
                avatarColor={profile?.avatarColor}
              />
            </div>
          </header>

          <div className="mt-12 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && matches[0]) matches[0].label === "Resume" ? setShowResumeSheet(true) : router.push(matches[0].href);
              }}
              placeholder="Search Career Vault, Resume, Portfolio, Personality…"
              className="w-full rounded-xl bg-white pl-10 pr-4 py-3 text-sm outline-none shadow-sm"
            />
            {query.trim() && (
              <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl bg-white shadow-lg overflow-hidden">
                {matches.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-neutral-500">No modules match &ldquo;{query}&rdquo;.</p>
                ) : (
                  matches.map((m) =>
                    m.label === "Resume" ? (
                      <button key={m.href} onClick={() => setShowResumeSheet(true)} className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-100">
                        {m.label} <span className="text-neutral-400">— {m.blurb}</span>
                      </button>
                    ) : (
                      <Link key={m.href} href={m.href} className="block px-4 py-3 text-sm hover:bg-neutral-100">
                        {m.label} <span className="text-neutral-400">— {m.blurb}</span>
                      </Link>
                    )
                  )
                )}
              </div>
            )}
          </div>

          <div className="mt-9 flex justify-center">
            <EditableBio uid={user.uid} bio={profile?.bio || "Never Give Up"} bioStyle={profile?.bioStyle} variant="quote" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <section className="mt-6 grid grid-cols-2 gap-4">
          {modules.map((m) => {
            const inner = (
              <>
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm p-3 group-hover:scale-105 transition">
                  <Image src={m.icon} alt="" width={64} height={64} className="h-full w-full object-contain" />
                </span>
                <span className="mt-3 text-base font-semibold text-neutral-900 leading-tight">{m.label}</span>
                <span className="mt-0.5 text-xs text-neutral-500">{m.blurb}</span>
              </>
            );
            const cls = "group flex flex-col items-center text-center rounded-3xl bg-neutral-100 hover:bg-primary-100 transition px-4 py-6";
            return m.label === "Resume" ? (
              <button key={m.href} onClick={() => setShowResumeSheet(true)} className={cls}>
                {inner}
              </button>
            ) : (
              <Link key={m.href} href={m.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </section>

        <TemplateShowcase />
      </div>

      <BottomNav />

      {showResumeSheet && <ResumeOptionsSheet onClose={() => setShowResumeSheet(false)} />}
    </main>
  );
}
