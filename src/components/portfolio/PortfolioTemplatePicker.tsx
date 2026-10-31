"use client";

import Link from "next/link";
import { Check, Eye } from "lucide-react";
import { PORTFOLIO_TEMPLATES } from "./templates";
import { SAMPLE_PROFILE, SAMPLE_DATA, SAMPLE_PROJECTS } from "./templates/demoData";
import type { PortfolioTemplateId } from "@/lib/portfolio";

// The live thumbnail: the actual template component, rendered full-size with
// sample data then scaled down and cropped to just its top (hero) — a real
// preview of the design, not a gradient placeholder. thumbnailMode=true on
// the template tells it to skip 3D canvases / global listeners so a gallery
// full of these stays cheap even as more templates are added.
export function LiveHeroThumbnail({ templateId }: { templateId: PortfolioTemplateId }) {
  const Template = PORTFOLIO_TEMPLATES[templateId].component;
  return (
    <div className="relative h-40 overflow-hidden bg-neutral-900">
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{ width: "400%", transform: "scale(0.25)" }}
      >
        <Template profile={SAMPLE_PROFILE} data={{ ...SAMPLE_DATA, template: templateId }} projects={SAMPLE_PROJECTS} thumbnailMode />
      </div>
    </div>
  );
}

export function PortfolioTemplatePicker({
  value,
  onChange,
}: {
  value: PortfolioTemplateId;
  onChange: (id: PortfolioTemplateId) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {(Object.keys(PORTFOLIO_TEMPLATES) as PortfolioTemplateId[]).map((id) => {
        const t = PORTFOLIO_TEMPLATES[id];
        const selected = value === id;
        return (
          <div
            key={id}
            className={`text-left rounded-xl border-2 overflow-hidden transition ${
              selected ? "border-primary-700" : "border-neutral-300/60 hover:border-neutral-400"
            }`}
          >
            <LiveHeroThumbnail templateId={id} />
            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-neutral-900">{t.label}</p>
                {selected && <Check size={15} className="text-primary-700 shrink-0" />}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{t.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Link
                  href={`/portfolio/templates/${id}`}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border border-neutral-300/60 text-neutral-700 hover:border-neutral-400"
                >
                  <Eye size={12} /> Preview
                </Link>
                <button
                  onClick={() => onChange(id)}
                  disabled={selected}
                  className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-50"
                >
                  {selected ? "Selected" : "Use template"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
