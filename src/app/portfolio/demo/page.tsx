"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PORTFOLIO_TEMPLATES } from "@/components/portfolio/templates";
import { SAMPLE_PROFILE, SAMPLE_DATA, SAMPLE_PROJECTS } from "@/components/portfolio/templates/demoData";
import type { PortfolioTemplateId } from "@/lib/portfolioTypes";

export default function PortfolioDemoPage() {
  const templateIds = Object.keys(PORTFOLIO_TEMPLATES) as PortfolioTemplateId[];
  const [template, setTemplate] = useState<PortfolioTemplateId>(templateIds[0]);
  const Template = PORTFOLIO_TEMPLATES[template].component;

  return (
    <main className="flex-1 bg-neutral-100">
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <Link href="/portfolio" className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 shrink-0">
            <ArrowLeft size={16} /> Portfolio
          </Link>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {templateIds.map((id) => (
              <button
                key={id}
                onClick={() => setTemplate(id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  template === id ? "bg-primary-700 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {PORTFOLIO_TEMPLATES[id].label}
              </button>
            ))}
          </div>
          <span className="text-xs text-neutral-400 shrink-0">Sample data — not saved</span>
        </div>
      </div>

      {/* transform makes this the containing block for any `position: fixed`
          element inside the template (some use it for their own nav/bg —
          correct on their standalone routes) — without it, those elements
          would anchor to the real browser viewport and collide with this
          page's own sticky header above. */}
      <div className="max-w-5xl mx-auto bg-white shadow-sm" style={{ transform: "translateZ(0)" }}>
        <Template profile={SAMPLE_PROFILE} data={{ ...SAMPLE_DATA, template }} projects={SAMPLE_PROJECTS} />
      </div>
    </main>
  );
}
