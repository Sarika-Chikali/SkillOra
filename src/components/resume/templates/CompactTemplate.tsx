import type { TemplateProps } from "./types";
import { toBullets } from "./utils";

// Deliberately plain: no columns, no icons, no colors — the layout most ATS
// (applicant tracking system) resume parsers handle reliably. This follows
// the same "ATS-safe" philosophy as builders like Rezi: single column,
// standard fonts, plain bullet points, reverse-chronological order.
export function CompactTemplate({ profile, data, certifications }: TemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#000000" }} className="p-8 text-[12.5px] leading-normal">
      <h1 className="text-xl font-bold">{profile.name || "Your Name"}</h1>
      <p className="text-sm">
        {[profile.role, profile.company, profile.email].filter(Boolean).join(" | ")}
      </p>

      {data.summary && (
        <Section title="SUMMARY">
          <p>{data.summary}</p>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="SKILLS">
          <p>{data.skills.join(", ")}</p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="EXPERIENCE">
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <p className="font-bold">
                {e.title} — {e.company} ({e.duration})
              </p>
              {e.description && (
                <ul className="mt-0.5 pl-4" style={{ listStyleType: "disc" }}>
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
        <Section title="EDUCATION">
          <ul className="pl-4" style={{ listStyleType: "disc" }}>
            {data.education.map((e) => (
              <li key={e.id} className="mb-1">
                {e.degree}, {e.institution} ({e.duration})
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="PROJECTS">
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-bold">{p.title}</p>
              {p.description && (
                <ul className="mt-0.5 pl-4" style={{ listStyleType: "disc" }}>
                  {toBullets(p.description).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="CERTIFICATIONS">
          <ul className="pl-4" style={{ listStyleType: "disc" }}>
            {certifications.map((c, i) => (
              <li key={i} className="mb-1">
                {c.name} — {c.issuer}
                {c.verified ? " (Verified)" : ""}
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
    <div className="mt-4">
      <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5">{title}</h2>
      {children}
    </div>
  );
}
