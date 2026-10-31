"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PORTFOLIO_TEMPLATES } from "@/components/portfolio/templates";
import { LiveHeroThumbnail } from "@/components/portfolio/PortfolioTemplatePicker";
import { TEMPLATES } from "@/components/resume/templates";
import { Thumb } from "@/components/resume/TemplatePicker";
import type { PortfolioTemplateId } from "@/lib/portfolioTypes";
import type { TemplateId } from "@/lib/resume";

function Row({ title, subtitle, href, children }: { title: string; subtitle: string; href: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <p className="text-xs text-neutral-500">{subtitle}</p>
        </div>
        <Link href={href} className="flex items-center text-sm font-semibold text-primary-700 shrink-0">
          View all <ChevronRight size={15} />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">{children}</div>
    </section>
  );
}

export function TemplateShowcase() {
  const resumeIds = Object.keys(TEMPLATES) as TemplateId[];
  const portfolioIds = Object.keys(PORTFOLIO_TEMPLATES) as PortfolioTemplateId[];
  return (
    <>
      <Row title="Resume templates" subtitle={`${resumeIds.length} designs — your details fill them in`} href="/templates/resume">
        {resumeIds.map((id) => (
          <Link key={id} href={`/resume/templates/${id}`} className="snap-start shrink-0 w-44 rounded-xl border-2 border-neutral-300/60 hover:border-primary-700 overflow-hidden bg-white transition">
            <Thumb id={id} />
            <div className="p-2.5">
              <p className="text-sm font-semibold text-neutral-900">{TEMPLATES[id].label}</p>
              <p className="text-[11px] text-neutral-500 leading-snug line-clamp-2">{TEMPLATES[id].description}</p>
            </div>
          </Link>
        ))}
      </Row>

      <Row title="Portfolio templates" subtitle={`${portfolioIds.length} designs — preview any one live`} href="/templates/portfolio">
        {portfolioIds.map((id) => (
          <Link key={id} href={`/portfolio/templates/${id}`} className="snap-start shrink-0 w-56 rounded-xl border-2 border-neutral-300/60 hover:border-primary-700 overflow-hidden bg-white transition">
            <LiveHeroThumbnail templateId={id} />
            <div className="p-2.5">
              <p className="text-sm font-semibold text-neutral-900">{PORTFOLIO_TEMPLATES[id].label}</p>
              <p className="text-[11px] text-neutral-500 leading-snug line-clamp-2">{PORTFOLIO_TEMPLATES[id].description}</p>
            </div>
          </Link>
        ))}
      </Row>
    </>
  );
}
