"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PORTFOLIO_TEMPLATES } from "@/components/portfolio/templates";
import { LiveHeroThumbnail } from "@/components/portfolio/PortfolioTemplatePicker";
import type { PortfolioTemplateId } from "@/lib/portfolioTypes";

export default function PortfolioTemplatesPage() {
  const ids = Object.keys(PORTFOLIO_TEMPLATES) as PortfolioTemplateId[];
  return (
    <main className="flex-1 bg-primary-0 pb-10">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-4">Portfolio templates</h1>
        <p className="text-sm text-neutral-500 mt-1">{ids.length} designs. Open one for a full live preview, then use it.</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {ids.map((id) => (
            <Link key={id} href={`/portfolio/templates/${id}`} className="rounded-xl border-2 border-neutral-300/60 hover:border-primary-700 overflow-hidden bg-white transition">
              <LiveHeroThumbnail templateId={id} />
              <div className="p-3">
                <p className="text-sm font-semibold text-neutral-900">{PORTFOLIO_TEMPLATES[id].label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{PORTFOLIO_TEMPLATES[id].description}</p>
                <span className="inline-block mt-2.5 text-xs font-semibold text-primary-700">Preview →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
