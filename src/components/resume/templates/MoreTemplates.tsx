import type { ReactNode } from "react";
import type { TemplateProps } from "./types";
import { toBullets } from "./utils";

function Bullets({ text, marker }: { text: string; marker?: string }) {
  return (
    <ul className="mt-1 space-y-0.5 list-disc pl-4" style={marker ? { color: "inherit" } : undefined}>
      {toBullets(text).map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

const contactLine = (p: TemplateProps["profile"]) => [p.role, p.company, p.email].filter(Boolean).join("  ·  ");

/* 5 — Executive: navy banner, two columns */
export function ExecutiveTemplate({ profile, data, certifications }: TemplateProps) {
  const H = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b" style={{ color: "#0f2a4a", borderColor: "#c9a24b" }}>
      {children}
    </h2>
  );
  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1f2937" }} className="text-[12.5px] leading-relaxed">
      <div className="px-10 py-7" style={{ background: "#0f2a4a", color: "#fff" }}>
        <h1 className="text-3xl font-bold tracking-wide">{profile.name || "Your Name"}</h1>
        <p className="mt-1 text-[13px]" style={{ color: "#e5c878" }}>{contactLine(profile)}</p>
      </div>
      <div className="grid grid-cols-[1fr_190px] gap-8 px-10 py-6">
        <div>
          {data.summary && (
            <section className="mb-5">
              <H>Profile</H>
              <p>{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-5">
              <H>Experience</H>
              {data.experience.map((e) => (
                <div key={e.id} className="mb-3">
                  <div className="flex justify-between gap-2">
                    <p className="font-bold">{e.title}</p>
                    <p className="text-xs shrink-0" style={{ color: "#6b7280" }}>{e.duration}</p>
                  </div>
                  <p className="italic text-xs" style={{ color: "#0f2a4a" }}>{e.company}</p>
                  {e.description && <Bullets text={e.description} />}
                </div>
              ))}
            </section>
          )}
          {data.projects.length > 0 && (
            <section>
              <H>Projects</H>
              {data.projects.map((p) => (
                <div key={p.id} className="mb-2">
                  <p className="font-bold">{p.title}</p>
                  {p.description && <Bullets text={p.description} />}
                  {p.link && <p className="text-xs" style={{ color: "#0f2a4a" }}>{p.link}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
        <aside>
          {data.skills.length > 0 && (
            <section className="mb-5">
              <H>Skills</H>
              <ul className="space-y-0.5">
                {data.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          )}
          {data.education.length > 0 && (
            <section className="mb-5">
              <H>Education</H>
              {data.education.map((e) => (
                <div key={e.id} className="mb-2">
                  <p className="font-bold text-xs">{e.degree}</p>
                  <p className="text-xs">{e.institution}</p>
                  <p className="text-[11px]" style={{ color: "#6b7280" }}>{e.duration}</p>
                </div>
              ))}
            </section>
          )}
          {certifications.length > 0 && (
            <section>
              <H>Certificates</H>
              {certifications.map((c, i) => (
                <p key={i} className="text-xs mb-1">
                  {c.name}
                  <span style={{ color: "#6b7280" }}> — {c.issuer}</span>
                </p>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

/* 6 — Minimal: whitespace, small caps */
export function MinimalTemplate({ profile, data, certifications }: TemplateProps) {
  const H = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[10.5px] uppercase tracking-[0.3em] mb-2.5 mt-6" style={{ color: "#9ca3af" }}>
      {children}
    </h2>
  );
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: "#111827" }} className="px-12 py-10 text-[12.5px] leading-relaxed">
      <h1 className="text-[34px] font-light tracking-tight">{profile.name || "Your Name"}</h1>
      <p className="mt-1" style={{ color: "#6b7280" }}>{contactLine(profile)}</p>
      {data.summary && (
        <>
          <H>About</H>
          <p>{data.summary}</p>
        </>
      )}
      {data.experience.length > 0 && (
        <>
          <H>Experience</H>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3 grid grid-cols-[110px_1fr] gap-4">
              <p className="text-xs pt-0.5" style={{ color: "#9ca3af" }}>{e.duration}</p>
              <div>
                <p className="font-semibold">{e.title}, <span className="font-normal">{e.company}</span></p>
                {e.description && <Bullets text={e.description} />}
              </div>
            </div>
          ))}
        </>
      )}
      {data.projects.length > 0 && (
        <>
          <H>Projects</H>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2 grid grid-cols-[110px_1fr] gap-4">
              <p className="text-xs pt-0.5 truncate" style={{ color: "#9ca3af" }}>{p.link}</p>
              <div>
                <p className="font-semibold">{p.title}</p>
                {p.description && <Bullets text={p.description} />}
              </div>
            </div>
          ))}
        </>
      )}
      {data.education.length > 0 && (
        <>
          <H>Education</H>
          {data.education.map((e) => (
            <div key={e.id} className="mb-1.5 grid grid-cols-[110px_1fr] gap-4">
              <p className="text-xs pt-0.5" style={{ color: "#9ca3af" }}>{e.duration}</p>
              <p><span className="font-semibold">{e.degree}</span>, {e.institution}</p>
            </div>
          ))}
        </>
      )}
      {data.skills.length > 0 && (
        <>
          <H>Skills</H>
          <p>{data.skills.join("  /  ")}</p>
        </>
      )}
      {certifications.length > 0 && (
        <>
          <H>Certifications</H>
          {certifications.map((c, i) => (
            <p key={i}>{c.name} <span style={{ color: "#9ca3af" }}>— {c.issuer}</span></p>
          ))}
        </>
      )}
    </div>
  );
}

/* 7 — Bold: orange name block, filled headings */
export function BoldTemplate({ profile, data, certifications }: TemplateProps) {
  const H = ({ children }: { children: ReactNode }) => (
    <h2 className="inline-block text-[11px] font-black uppercase tracking-widest px-2.5 py-1 mb-2.5" style={{ background: "#111", color: "#fff" }}>
      {children}
    </h2>
  );
  return (
    <div style={{ fontFamily: "Arial Black, Arial, Helvetica, sans-serif", color: "#111" }} className="text-[12.5px] leading-relaxed">
      <div className="px-10 py-8" style={{ background: "#ff6b1a" }}>
        <h1 className="text-[38px] leading-none font-black uppercase tracking-tight">{profile.name || "Your Name"}</h1>
        <p className="mt-2 font-bold text-[13px]" style={{ fontFamily: "Arial, sans-serif" }}>{contactLine(profile)}</p>
      </div>
      <div className="px-10 py-6" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        {data.summary && (
          <section className="mb-5">
            <H>Summary</H>
            <p>{data.summary}</p>
          </section>
        )}
        {data.skills.length > 0 && (
          <section className="mb-5">
            <H>Skills</H>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span key={s} className="px-2 py-0.5 text-xs font-bold" style={{ border: "2px solid #111" }}>{s}</span>
              ))}
            </div>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-5">
            <H>Experience</H>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between gap-2">
                  <p className="font-bold">{e.title} — {e.company}</p>
                  <p className="text-xs font-bold shrink-0" style={{ color: "#ff6b1a" }}>{e.duration}</p>
                </div>
                {e.description && <Bullets text={e.description} />}
              </div>
            ))}
          </section>
        )}
        {data.projects.length > 0 && (
          <section className="mb-5">
            <H>Projects</H>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-bold">{p.title}</p>
                {p.description && <Bullets text={p.description} />}
              </div>
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section className="mb-5">
            <H>Education</H>
            {data.education.map((e) => (
              <p key={e.id}><b>{e.degree}</b> — {e.institution} <span style={{ color: "#ff6b1a" }}>{e.duration}</span></p>
            ))}
          </section>
        )}
        {certifications.length > 0 && (
          <section>
            <H>Certifications</H>
            {certifications.map((c, i) => (
              <p key={i}>{c.name} — {c.issuer}</p>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

/* 8 — Timeline: vertical rail with dots */
export function TimelineTemplate({ profile, data, certifications }: TemplateProps) {
  const H = ({ children }: { children: ReactNode }) => (
    <h2 className="text-sm font-bold mb-3 mt-6" style={{ color: "#0d9488" }}>{children}</h2>
  );
  const Rail = ({ children }: { children: ReactNode }) => (
    <div className="relative pl-5" style={{ borderLeft: "2px solid #99f6e4" }}>{children}</div>
  );
  const Dot = () => <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full" style={{ background: "#0d9488" }} />;
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: "#1f2937" }} className="px-10 py-9 text-[12.5px] leading-relaxed">
      <div className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: "#0d9488" }}>
          {(profile.name || "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name || "Your Name"}</h1>
          <p style={{ color: "#6b7280" }}>{contactLine(profile)}</p>
        </div>
      </div>
      {data.summary && (
        <>
          <H>Summary</H>
          <p>{data.summary}</p>
        </>
      )}
      {data.experience.length > 0 && (
        <>
          <H>Experience</H>
          <Rail>
            {data.experience.map((e) => (
              <div key={e.id} className="relative mb-4">
                <Dot />
                <p className="text-[11px] font-semibold" style={{ color: "#0d9488" }}>{e.duration}</p>
                <p className="font-bold">{e.title} · <span className="font-medium">{e.company}</span></p>
                {e.description && <Bullets text={e.description} />}
              </div>
            ))}
          </Rail>
        </>
      )}
      {data.education.length > 0 && (
        <>
          <H>Education</H>
          <Rail>
            {data.education.map((e) => (
              <div key={e.id} className="relative mb-3">
                <Dot />
                <p className="text-[11px] font-semibold" style={{ color: "#0d9488" }}>{e.duration}</p>
                <p className="font-bold">{e.degree}</p>
                <p>{e.institution}</p>
              </div>
            ))}
          </Rail>
        </>
      )}
      {data.projects.length > 0 && (
        <>
          <H>Projects</H>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-bold">{p.title}</p>
              {p.description && <Bullets text={p.description} />}
            </div>
          ))}
        </>
      )}
      {data.skills.length > 0 && (
        <>
          <H>Skills</H>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s} className="px-2.5 py-0.5 rounded-full text-xs" style={{ background: "#ccfbf1", color: "#0f766e" }}>{s}</span>
            ))}
          </div>
        </>
      )}
      {certifications.length > 0 && (
        <>
          <H>Certifications</H>
          {certifications.map((c, i) => (
            <p key={i}>{c.name} <span style={{ color: "#6b7280" }}>— {c.issuer}</span></p>
          ))}
        </>
      )}
    </div>
  );
}

/* 9 — Tech: monospace, comment-style headings */
export function TechTemplate({ profile, data, certifications }: TemplateProps) {
  const H = ({ children }: { children: ReactNode }) => (
    <h2 className="font-bold mt-5 mb-2" style={{ color: "#15803d" }}>{"// "}{children}</h2>
  );
  return (
    <div style={{ fontFamily: "ui-monospace, 'Courier New', monospace", color: "#0f172a", background: "#f8fafc" }} className="px-9 py-8 text-[12px] leading-relaxed">
      <p style={{ color: "#64748b" }}>{"> whoami"}</p>
      <h1 className="text-2xl font-bold">{profile.name || "Your Name"}</h1>
      <p style={{ color: "#475569" }}>{contactLine(profile)}</p>
      {data.summary && (
        <>
          <H>summary</H>
          <p>{data.summary}</p>
        </>
      )}
      {data.skills.length > 0 && (
        <>
          <H>skills</H>
          <p>{data.skills.map((s) => `[${s}]`).join(" ")}</p>
        </>
      )}
      {data.experience.length > 0 && (
        <>
          <H>experience</H>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <p><b>{e.title}</b> @ {e.company} <span style={{ color: "#64748b" }}>({e.duration})</span></p>
              {e.description && <Bullets text={e.description} />}
            </div>
          ))}
        </>
      )}
      {data.projects.length > 0 && (
        <>
          <H>projects</H>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p><b>{p.title}</b> {p.link && <span style={{ color: "#2563eb" }}>{p.link}</span>}</p>
              {p.description && <Bullets text={p.description} />}
            </div>
          ))}
        </>
      )}
      {data.education.length > 0 && (
        <>
          <H>education</H>
          {data.education.map((e) => (
            <p key={e.id}><b>{e.degree}</b>, {e.institution} <span style={{ color: "#64748b" }}>({e.duration})</span></p>
          ))}
        </>
      )}
      {certifications.length > 0 && (
        <>
          <H>certifications</H>
          {certifications.map((c, i) => (
            <p key={i}>{c.name} — {c.issuer}</p>
          ))}
        </>
      )}
    </div>
  );
}

/* 10 — Elegant: serif, beige sidebar */
export function ElegantTemplate({ profile, data, certifications }: TemplateProps) {
  const H = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[13px] italic mb-2 mt-5" style={{ color: "#9f1239", fontFamily: "Georgia, serif" }}>{children}</h2>
  );
  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#292524" }} className="grid grid-cols-[210px_1fr] text-[12.5px] leading-relaxed">
      <aside className="px-6 py-9" style={{ background: "#f5efe6" }}>
        <h1 className="text-2xl leading-tight font-bold">{profile.name || "Your Name"}</h1>
        <p className="mt-1 italic" style={{ color: "#9f1239" }}>{profile.role}</p>
        <div className="mt-3 text-xs break-words" style={{ color: "#57534e" }}>
          {profile.company && <p>{profile.company}</p>}
          {profile.email && <p>{profile.email}</p>}
        </div>
        {data.skills.length > 0 && (
          <>
            <H>Skills</H>
            <ul className="space-y-0.5">
              {data.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        )}
        {data.education.length > 0 && (
          <>
            <H>Education</H>
            {data.education.map((e) => (
              <div key={e.id} className="mb-2 text-xs">
                <p className="font-bold">{e.degree}</p>
                <p>{e.institution}</p>
                <p style={{ color: "#78716c" }}>{e.duration}</p>
              </div>
            ))}
          </>
        )}
        {certifications.length > 0 && (
          <>
            <H>Certificates</H>
            {certifications.map((c, i) => (
              <p key={i} className="text-xs mb-1">{c.name}</p>
            ))}
          </>
        )}
      </aside>
      <div className="px-8 py-9">
        {data.summary && (
          <>
            <H>Profile</H>
            <p>{data.summary}</p>
          </>
        )}
        {data.experience.length > 0 && (
          <>
            <H>Experience</H>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <p className="font-bold">{e.title}</p>
                <p className="italic text-xs" style={{ color: "#78716c" }}>{e.company} · {e.duration}</p>
                {e.description && <Bullets text={e.description} />}
              </div>
            ))}
          </>
        )}
        {data.projects.length > 0 && (
          <>
            <H>Projects</H>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-bold">{p.title}</p>
                {p.description && <Bullets text={p.description} />}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
