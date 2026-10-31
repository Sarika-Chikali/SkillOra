"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { TEMPLATES } from "./templates";
import type { TemplateProps } from "./templates";
import type { TemplateId } from "@/lib/resume";
import { SAMPLE_PERSON, SAMPLE_SKILLS, SAMPLE_SUMMARY, SAMPLE_EDUCATION, SAMPLE_EXPERIENCE, SAMPLE_RESUME_PROJECTS, SAMPLE_CERTIFICATIONS } from "@/lib/sampleContent";

export const SAMPLE: TemplateProps = {
  profile: { name: SAMPLE_PERSON.name, role: SAMPLE_PERSON.role, company: SAMPLE_PERSON.company, email: SAMPLE_PERSON.email },
  data: {
    summary: SAMPLE_SUMMARY,
    skills: SAMPLE_SKILLS,
    experience: SAMPLE_EXPERIENCE,
    education: SAMPLE_EDUCATION,
    projects: SAMPLE_RESUME_PROJECTS,
    externalCertifications: [],
    template: "modern",
  },
  certifications: [{ name: SAMPLE_CERTIFICATIONS[0].name, issuer: SAMPLE_CERTIFICATIONS[0].issuer, verified: true }],
};

export function Thumb({ id }: { id: TemplateId }) {
  const Template = TEMPLATES[id].component;
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 800));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-44 overflow-hidden bg-white border-b border-neutral-200">
      <div className="absolute top-0 left-0 origin-top-left pointer-events-none bg-white" style={{ width: 800, transform: `scale(${scale})` }}>
        <Template {...SAMPLE} />
      </div>
    </div>
  );
}

export function TemplatePicker({ value, onChange }: { value: TemplateId; onChange: (id: TemplateId) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => {
        const t = TEMPLATES[id];
        const selected = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`text-left rounded-xl border-2 overflow-hidden transition ${
              selected ? "border-primary-700 ring-2 ring-primary-100" : "border-neutral-300/60 hover:border-neutral-400"
            }`}
          >
            <Thumb id={id} />
            <div className="p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-neutral-900">{t.label}</p>
                {selected && <Check size={14} className="text-primary-700 shrink-0" />}
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{t.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
