"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  newId,
  type ResumeData,
  type ExperienceEntry,
  type EducationEntry,
  type ProjectEntry,
  type ExternalCertification,
} from "@/lib/resume";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function ResumeForm({ data, onChange }: { data: ResumeData; onChange: (data: ResumeData) => void }) {
  const [skillInput, setSkillInput] = useState("");

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || data.skills.includes(trimmed)) return;
    onChange({ ...data, skills: [...data.skills, trimmed] });
    setSkillInput("");
  }

  return (
    <div className="space-y-6">
      <Field label="Professional Summary">
        <textarea
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          rows={3}
          placeholder="A short pitch about who you are and what you're looking for…"
          className={inputClass}
        />
      </Field>

      <Field label="Skills">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {data.skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700"
            >
              {s}
              <button
                onClick={() => onChange({ ...data, skills: data.skills.filter((sk) => sk !== s) })}
                aria-label={`Remove ${s}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="e.g. React, Python, Figma"
            className={inputClass}
          />
          <button
            onClick={addSkill}
            className="shrink-0 px-3 rounded-lg bg-primary-700 text-white text-sm font-medium"
          >
            Add
          </button>
        </div>
      </Field>

      <ListSection<ExperienceEntry>
        title="Experience"
        items={data.experience}
        onChange={(items) => onChange({ ...data, experience: items })}
        makeEmpty={() => ({ id: newId(), title: "", company: "", duration: "", description: "" })}
        renderFields={(item, update) => (
          <>
            <div className="grid grid-cols-2 gap-2">
              <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Job title" className={inputClass} />
              <input value={item.company} onChange={(e) => update({ company: e.target.value })} placeholder="Company" className={inputClass} />
            </div>
            <input value={item.duration} onChange={(e) => update({ duration: e.target.value })} placeholder="Duration (e.g. Jan 2023 – Present)" className={inputClass} />
            <textarea
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder={"One achievement per line, e.g.\nBuilt a dashboard used by 200+ users\nReduced load time by 40%"}
              rows={3}
              className={inputClass}
            />
            <p className="text-[11px] text-neutral-500">Press Enter between points — each line becomes its own bullet.</p>
          </>
        )}
      />

      <ListSection<EducationEntry>
        title="Education"
        items={data.education}
        onChange={(items) => onChange({ ...data, education: items })}
        makeEmpty={() => ({ id: newId(), degree: "", institution: "", duration: "" })}
        renderFields={(item, update) => (
          <>
            <input value={item.degree} onChange={(e) => update({ degree: e.target.value })} placeholder="Degree / Course" className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <input value={item.institution} onChange={(e) => update({ institution: e.target.value })} placeholder="Institution" className={inputClass} />
              <input value={item.duration} onChange={(e) => update({ duration: e.target.value })} placeholder="Duration" className={inputClass} />
            </div>
          </>
        )}
      />

      <ListSection<ProjectEntry>
        title="Projects"
        items={data.projects}
        onChange={(items) => onChange({ ...data, projects: items })}
        makeEmpty={() => ({ id: newId(), title: "", description: "", link: "" })}
        renderFields={(item, update) => (
          <>
            <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Project title" className={inputClass} />
            <textarea
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder={"One point per line, e.g.\nBuilt with React and Firebase\nUsed by 50+ students"}
              rows={2}
              className={inputClass}
            />
            <input value={item.link} onChange={(e) => update({ link: e.target.value })} placeholder="Link (optional)" className={inputClass} />
          </>
        )}
      />

      <ListSection<ExternalCertification>
        title="Other Certifications"
        items={data.externalCertifications}
        onChange={(items) => onChange({ ...data, externalCertifications: items })}
        makeEmpty={() => ({ id: newId(), name: "", issuer: "" })}
        renderFields={(item, update) => (
          <div className="grid grid-cols-2 gap-2">
            <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Certificate name" className={inputClass} />
            <input value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} placeholder="Issued by" className={inputClass} />
          </div>
        )}
      />
      <p className="text-[11px] text-neutral-500 -mt-4">
        Certificates from Career Vault are pulled in automatically — use this only for certificates you haven&apos;t uploaded there.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-900 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ListSection<T extends { id: string }>({
  title,
  items,
  onChange,
  makeEmpty,
  renderFields,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  makeEmpty: () => T;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-neutral-900">{title}</label>
        <button
          onClick={() => onChange([...items, makeEmpty()])}
          className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
        >
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl bg-neutral-100 p-3 space-y-2 relative">
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label="Remove entry"
              className="absolute top-2 right-2 text-neutral-400 hover:text-accent-rose"
            >
              <Trash2 size={14} />
            </button>
            {renderFields(item, (patch) => {
              const next = [...items];
              next[i] = { ...item, ...patch };
              onChange(next);
            })}
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-neutral-500">Nothing added yet.</p>}
      </div>
    </div>
  );
}
