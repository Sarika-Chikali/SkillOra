"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TEMPLATES } from "@/components/resume/templates";
import { Thumb } from "@/components/resume/TemplatePicker";
import type { TemplateId } from "@/lib/resume";

export default function ResumeTemplatesPage() {
  const ids = Object.keys(TEMPLATES) as TemplateId[];
  return (
    <main className="flex-1 bg-primary-0 pb-10">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-4">Resume templates</h1>
        <p className="text-sm text-neutral-500 mt-1">{ids.length} designs. Pick one and your details fill it in.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {ids.map((id) => (
            <Link key={id} href={`/resume/templates/${id}`} className="rounded-xl border-2 border-neutral-300/60 hover:border-primary-700 overflow-hidden bg-white transition">
              <Thumb id={id} />
              <div className="p-3">
                <p className="text-sm font-semibold text-neutral-900">{TEMPLATES[id].label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{TEMPLATES[id].description}</p>
                <span className="inline-block mt-2.5 text-xs font-semibold text-primary-700">Preview →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
