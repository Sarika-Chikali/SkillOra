"use client";

import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { PortfolioData, Project } from "@/lib/portfolioTypes";
import type { EditableSectionId } from "./EditableCanvas";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

// "education" and "experience" aren't rendered as clickable sections by any
// current template, and "all" is reached only via the "Edit All Details"
// button (not a canvas click) — see the portfolio edit page. Kept separate
// from EditableCanvas's EditableSectionId, which stays limited to ids that
// actually exist as clickable DOM sections.
export type PanelSectionId = EditableSectionId | "all";

const TITLES: Record<PanelSectionId, string> = {
  home: "Edit Hero",
  about: "Edit About",
  skills: "Edit Skills",
  projects: "Projects",
  certifications: "Edit Certifications",
  contact: "Edit Contact & Social",
  education: "Edit Education",
  experience: "Edit Experience",
  all: "Edit All Details",
};

export function EditPanel({
  sectionId,
  onClose,
  data,
  setData,
  markManual,
  skillInput,
  setSkillInput,
  addSkill,
  onAddProject,
}: {
  sectionId: PanelSectionId | null;
  onClose: () => void;
  data: PortfolioData;
  setData: Dispatch<SetStateAction<PortfolioData>>;
  markManual: (field: string) => void;
  skillInput: string;
  setSkillInput: (v: string) => void;
  addSkill: () => void;
  onAddProject: (fields: Pick<Project, "title" | "description" | "technologies" | "liveUrl" | "codeUrl">) => Promise<void>;
}) {
  if (!sectionId) return null;
  const showAll = sectionId === "all";
  const show = (id: PanelSectionId) => sectionId === id || showAll;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-sm bg-primary-0 h-full overflow-y-auto shadow-xl p-5 animate-in slide-in-from-right">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900">{TITLES[sectionId]}</h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {show("home") && (
            <PanelSection title={showAll ? "Hero" : undefined}>
              <Field label="Headline">
                <input
                  autoFocus={!showAll}
                  value={data.headline}
                  onChange={(e) => setData((d) => ({ ...d, headline: e.target.value }))}
                  onBlur={() => data.headline.trim() && markManual("headline")}
                  placeholder="Full Stack Developer"
                  className={inputClass}
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={data.tagline}
                  onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
                  placeholder="Building digital experiences that solve real-world problems."
                  className={inputClass}
                />
              </Field>
            </PanelSection>
          )}

          {show("about") && (
            <PanelSection title={showAll ? "About" : undefined}>
              <Field label="About">
                <textarea
                  autoFocus={!showAll}
                  value={data.about}
                  onChange={(e) => setData((d) => ({ ...d, about: e.target.value }))}
                  onBlur={() => data.about.trim() && markManual("about")}
                  rows={6}
                  placeholder="A short story about who you are, what you build, and what drives you."
                  className={inputClass}
                />
              </Field>
            </PanelSection>
          )}

          {show("skills") && (
            <PanelSection title={showAll ? "Skills" : undefined}>
              <Field label="Skills">
                <div className="space-y-2 mb-3">
                  {data.skills.map((s) => {
                    const level = data.skillLevels?.[s] ?? 80;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="w-28 shrink-0 truncate text-xs font-medium text-neutral-800" title={s}>{s}</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={level}
                          onChange={(e) => {
                            markManual("skills");
                            const v = Number(e.target.value);
                            setData((d) => ({ ...d, skillLevels: { ...(d.skillLevels ?? {}), [s]: v } }));
                          }}
                          className="flex-1 accent-primary-700"
                          aria-label={`${s} proficiency`}
                        />
                        <span className="w-9 text-right text-xs tabular-nums text-neutral-600">{level}%</span>
                        <button
                          aria-label={`Remove ${s}`}
                          className="text-neutral-400 hover:text-red-600 text-base leading-none"
                          onClick={() => {
                            markManual("skills");
                            setData((d) => {
                              const rest = { ...(d.skillLevels ?? {}) };
                              delete rest[s];
                              return { ...d, skills: d.skills.filter((x) => x !== s), skillLevels: rest };
                            });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    autoFocus={!showAll}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), markManual("skills"), addSkill())}
                    placeholder="React.js, Node.js, Figma…"
                    className={inputClass}
                  />
                  <button
                    onClick={() => {
                      markManual("skills");
                      addSkill();
                    }}
                    className="shrink-0 px-3 rounded-lg bg-primary-700 text-white text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </Field>
            </PanelSection>
          )}

          {show("education") && (
            <PanelSection title={showAll ? "Education" : undefined}>
              {data.education.length === 0 ? (
                <p className="text-sm text-neutral-500">No education entries on this portfolio yet — use the sync banner above to bring them in from your resume.</p>
              ) : (
                <div className="space-y-1.5">
                  {data.education.map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg bg-neutral-100 px-3 py-2">
                      <span className="text-sm text-neutral-800 truncate">
                        {e.degree} — {e.institution}
                      </span>
                      <button
                        onClick={() => {
                          markManual("education");
                          setData((d) => ({ ...d, education: d.education.filter((x) => x.id !== e.id) }));
                        }}
                        className="text-neutral-400 hover:text-accent-rose shrink-0"
                        aria-label="Remove from portfolio"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AddForm
                label="Add education"
                fields={[
                  { key: "degree", label: "Degree / course", required: true },
                  { key: "institution", label: "School / college", required: true },
                  { key: "duration", label: "Years (e.g. 2022-2026)" },
                ]}
                onAdd={(v) => {
                  markManual("education");
                  setData((d) => ({ ...d, education: [...d.education, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, degree: v.degree, institution: v.institution, duration: v.duration }] }));
                }}
              />
            </PanelSection>
          )}

          {show("experience") && (
            <PanelSection title={showAll ? "Experience" : undefined}>
              {data.experience.length === 0 ? (
                <p className="text-sm text-neutral-500">No experience entries on this portfolio yet — use the sync banner above to bring them in from your resume.</p>
              ) : (
                <div className="space-y-1.5">
                  {data.experience.map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg bg-neutral-100 px-3 py-2">
                      <span className="text-sm text-neutral-800 truncate">
                        {e.title} at {e.company}
                      </span>
                      <button
                        onClick={() => {
                          markManual("experience");
                          setData((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== e.id) }));
                        }}
                        className="text-neutral-400 hover:text-accent-rose shrink-0"
                        aria-label="Remove from portfolio"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AddForm
                label="Add experience"
                fields={[
                  { key: "title", label: "Role", required: true },
                  { key: "company", label: "Company", required: true },
                  { key: "duration", label: "Dates" },
                  { key: "description", label: "What you did", multiline: true },
                ]}
                onAdd={(v) => {
                  markManual("experience");
                  setData((d) => ({ ...d, experience: [...d.experience, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title: v.title, company: v.company, duration: v.duration, description: v.description }] }));
                }}
              />
            </PanelSection>
          )}

          {show("projects") && (
            <PanelSection title={showAll ? "Projects" : undefined}>
              <AddForm
                label="Add a project"
                fields={[
                  { key: "title", label: "Project name", required: true },
                  { key: "description", label: "Description", multiline: true },
                  { key: "technologies", label: "Tech used (comma separated)" },
                  { key: "liveUrl", label: "Live link" },
                  { key: "codeUrl", label: "Code link" },
                ]}
                onAdd={(v) =>
                  onAddProject({
                    title: v.title,
                    description: v.description,
                    technologies: v.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                    liveUrl: v.liveUrl,
                    codeUrl: v.codeUrl,
                  })
                }
              />
              <p className="text-sm text-neutral-600 my-3">Edit, feature, image-upload or unpublish projects on the main Portfolio page.</p>
              <Link
                href="/portfolio"
                className="flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-primary-700 text-white"
              >
                Manage Projects <ArrowUpRight size={14} />
              </Link>
            </PanelSection>
          )}

          {show("certifications") && (
            <PanelSection title={showAll ? "Certifications" : undefined}>
              {data.certifications.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No certificates on this portfolio yet — mark a certificate &ldquo;On Resume &amp; Portfolio&rdquo; in Career Vault, then use the sync
                  banner above to bring it in.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {data.certifications.map((c) => (
                    <div key={c.fileId} className="flex items-center justify-between gap-2 rounded-lg bg-neutral-100 px-3 py-2">
                      <span className="text-sm text-neutral-800 truncate">
                        {c.name}
                        {c.issuer ? ` — ${c.issuer}` : ""}
                      </span>
                      <button
                        onClick={() => {
                          markManual("certifications");
                          setData((d) => ({ ...d, certifications: d.certifications.filter((x) => x.fileId !== c.fileId) }));
                        }}
                        className="text-neutral-400 hover:text-accent-rose shrink-0"
                        aria-label="Remove from portfolio"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AddForm
                label="Add a certification"
                fields={[
                  { key: "name", label: "Certificate name", required: true },
                  { key: "issuer", label: "Issued by" },
                  { key: "fileUrl", label: "Link to certificate (optional)" },
                ]}
                onAdd={(v) => {
                  markManual("certifications");
                  setData((d) => ({ ...d, certifications: [...d.certifications, { fileId: "manual-" + `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: v.name, issuer: v.issuer, fileUrl: v.fileUrl }] }));
                }}
              />
              <p className="text-xs text-neutral-500 mt-2">Removing a certificate here only hides it from your portfolio — it stays in Career Vault.</p>
            </PanelSection>
          )}

          {show("contact") && (
            <PanelSection title={showAll ? "Contact & Social" : undefined}>
              <div className="space-y-3">
                <Field label="LinkedIn">
                  <input
                    autoFocus={!showAll}
                    value={data.social.linkedin}
                    onChange={(e) => setData((d) => ({ ...d, social: { ...d.social, linkedin: e.target.value } }))}
                    placeholder="https://linkedin.com/in/…"
                    className={inputClass}
                  />
                </Field>
                <Field label="GitHub">
                  <input
                    value={data.social.github}
                    onChange={(e) => setData((d) => ({ ...d, social: { ...d.social, github: e.target.value } }))}
                    placeholder="https://github.com/…"
                    className={inputClass}
                  />
                </Field>
                <Field label="X / Twitter">
                  <input
                    value={data.social.twitter}
                    onChange={(e) => setData((d) => ({ ...d, social: { ...d.social, twitter: e.target.value } }))}
                    placeholder="https://x.com/…"
                    className={inputClass}
                  />
                </Field>
                <Field label="Website">
                  <input
                    value={data.social.website}
                    onChange={(e) => setData((d) => ({ ...d, social: { ...d.social, website: e.target.value } }))}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </Field>
              </div>
            </PanelSection>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelSection({ title, children }: { title?: string; children: React.ReactNode }) {
  if (!title) return <>{children}</>;
  return (
    <div className="pt-2 border-t border-neutral-200 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">{title}</h3>
      {children}
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

type AddField = { key: string; label: string; required?: boolean; multiline?: boolean };

function AddForm({ label, fields, onAdd }: { label: string; fields: AddField[]; onAdd: (values: Record<string, string>) => void | Promise<void> }) {
  const empty = () => Object.fromEntries(fields.map((f) => [f.key, ""]));
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(empty);
  const [busy, setBusy] = useState(false);
  const ok = fields.every((f) => !f.required || values[f.key].trim());

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-3 w-full rounded-lg border-2 border-dashed border-primary-500 text-primary-700 text-sm font-semibold py-2 hover:bg-primary-100/50">
        + {label}
      </button>
    );
  }
  return (
    <div className="mt-3 rounded-xl border border-neutral-300 p-3 space-y-2.5 bg-white">
      {fields.map((f) => (
        <Field key={f.key} label={f.label + (f.required ? " *" : "")}>
          {f.multiline ? (
            <textarea rows={3} value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className={inputClass} />
          ) : (
            <input value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className={inputClass} />
          )}
        </Field>
      ))}
      <div className="flex gap-2">
        <button
          disabled={!ok || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onAdd(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])));
              setValues(empty());
              setOpen(false);
            } finally {
              setBusy(false);
            }
          }}
          className="flex-1 rounded-lg bg-primary-700 text-white text-sm font-semibold py-2 disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add"}
        </button>
        <button onClick={() => setOpen(false)} className="px-4 rounded-lg border border-neutral-300 text-sm text-neutral-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
