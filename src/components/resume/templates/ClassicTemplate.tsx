import type { TemplateProps } from "./types";
import { toBullets } from "./utils";

export function ClassicTemplate({ profile, data, certifications }: TemplateProps) {
  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#111827" }} className="p-10 text-[13px] leading-relaxed">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">{(profile.name || "Your Name").toUpperCase()}</h1>
        <p className="text-sm text-neutral-700 mt-1">
          {[profile.role, profile.company, profile.email].filter(Boolean).join("  •  ")}
        </p>
      </div>
      <hr className="border-neutral-900 mb-5" />

      {data.summary && (
        <Section title="Summary">
          <p>{data.summary}</p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Professional Experience">
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{e.title}, {e.company}</span>
                <span>{e.duration}</span>
              </div>
              {e.description && (
                <ul className="mt-1 pl-5" style={{ listStyleType: "disc" }}>
                  {toBullets(e.description).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          <ul className="pl-5" style={{ listStyleType: "disc" }}>
            {data.education.map((e) => (
              <li key={e.id} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{e.degree}, {e.institution}</span>
                  <span>{e.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2.5">
              <span className="font-semibold">{p.title}</span>
              {p.description && (
                <ul className="mt-1 pl-5" style={{ listStyleType: "disc" }}>
                  {toBullets(p.description).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          <p>{data.skills.join("  •  ")}</p>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="pl-5" style={{ listStyleType: "disc" }}>
            {certifications.map((c, i) => (
              <li key={i}>
                {c.name} — {c.issuer}
                {c.verified && " (verified)"}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-neutral-400 pb-1 mb-2">{title}</h2>
      {children}
    </div>
  );
}
