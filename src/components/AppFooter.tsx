"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Sparkles } from "lucide-react";
import { DoodleScribbles } from "@/components/DoodleScribbles";
import { useAuth } from "@/lib/auth-context";

// Routes where the footer would get in the way: a published portfolio is the
// user's own page (their template fills the whole screen), and the
// template preview pages are full-page previews.
const HIDE_ON = ["/login", "/signup", "/onboarding", "/p/", "/portfolio/templates/", "/resume/templates/", "/portfolio/demo"];
// Screens with the fixed bottom navigation need extra space so it doesn't cover the footer.
const HAS_BOTTOM_NAV = ["/dashboard", "/career-vault", "/resume", "/portfolio", "/profile", "/personality", "/templates"];

export function AppFooter() {
  const pathname = usePathname() || "/";
  const { user, loading } = useAuth();
  // Only signed-in users see the footer.
  if (loading || !user) return null;
  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;
  const pad = HAS_BOTTOM_NAV.some((p) => pathname.startsWith(p)) ? "pb-28" : "pb-8";

  return (
    <footer className={`relative overflow-hidden text-white/80 px-4 pt-10 ${pad} print:hidden`} style={{ background: "#2d5b88" }}>
      <DoodleScribbles />
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/skillora-logo.png" alt="" className="h-8 w-8 rounded-lg bg-white p-1 shadow" />
          <span className="text-lg font-semibold text-white">SkillOra</span>
        </div>
        <p className="text-sm mt-2 text-white/75">Never give up — your career growth companion.</p>

        <div className="grid gap-6 mt-8 text-sm">
          <section>
            <h3 className="flex items-center gap-1.5 text-white font-semibold mb-1.5">
              <Sparkles size={15} /> Why SkillOra exists
            </h3>
            <p className="text-white/75 leading-relaxed">
              SkillOra exists to help students and job seekers turn their skills, achievements, and potential into real career opportunities. It brings everything
              they need—from resumes and portfolios to skill-gap guidance, AI interviews, courses, and career insights—into one simple platform. Instead of
              struggling with scattered tools and information, users can build, improve, and manage their complete career profile in one place. SkillOra uses AI
              to provide personalized guidance, automate repetitive career tasks, and help users understand what they need to improve. With SkillOra, users can move
              from learning and preparing to confidently presenting themselves to the right opportunities.
            </p>
          </section>

          <section>
            <h3 className="flex items-center gap-1.5 text-white font-semibold mb-1.5">
              <Rocket size={15} /> What&apos;s next
            </h3>
            <p className="text-white/75 leading-relaxed">
              We&apos;re building toward skill-gap insights, interview practice, job and course matching and a career network — all powered by the profile you build here.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
          <span>© {new Date().getFullYear()} SkillOra. All rights reserved.</span>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:text-white">
              Home
            </Link>
            <Link href="/profile" className="hover:text-white">
              My Profile
            </Link>
            <Link href="/templates/portfolio" className="hover:text-white">
              Templates
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
