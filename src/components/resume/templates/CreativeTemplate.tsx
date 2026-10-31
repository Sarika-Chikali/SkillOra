import type { TemplateProps } from "./types";
import { toBullets } from "./utils";

export function CreativeTemplate({ profile, data, certifications }: TemplateProps) {
  const initials = (profile.name || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }} className="flex min-h-full text-[12.5px] leading-relaxed">
      <aside
        style={{ backgroundImage: "linear-gradient(160deg, #2563eb, #8b5cf6)" }}
        className="w-[34%] p-6 text-white shrink-0"
      >
        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mb-3">
          {initials}
        </div>
        <h1 className="text-lg font-bold leading-tight">{profile.name || "Your Name"}</h1>
        <p className="text-white/80 text-xs mt-1">{profile.role}</p>
        {profile.email && <p className="text-white/70 text-xs mt-3 break-words">{profile.email}</p>}

        {data.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-white/90">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((s) => (
                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/15">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-white/90">Education</h2>
            <ul className="list-disc pl-4 marker:text-white/50 space-y-2">
            {data.education.map((e) => (
              <li key={e.id}>
                <p className="font-medium">{e.degree}</p>
                <p className="text-white/70 text-[11px]">{e.institution}</p>
                <p className="text-white/60 text-[10px]">{e.duration}</p>
              </li>
            ))}
            </ul>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-white/90">Certifications</h2>
            <ul className="list-disc pl-4 marker:text-white/50 space-y-1.5">
              {certifications.map((c, i) => (
                <li key={i} className="text-[11px]">
                  {c.name}
                  {c.verified && " ✓"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6">
        {data.summary && (
          <Section title="About Me" color="#8b5cf6">
            <p className="text-slate-700">{data.summary}</p>
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Experience" color="#8b5cf6">
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3.5">
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-900">{e.title}</p>
                  <p className="text-[11px] text-slate-500 shrink-0 ml-2">{e.duration}</p>
                </div>
                <p className="text-violet-600 text-xs">{e.company}</p>
                {e.description && (
                  <ul className="mt-1 space-y-0.5 pl-4" style={{ listStyleType: "disc" }}>
                    {toBullets(e.description).map((b, i) => (
                      <li key={i} className="text-slate-700 marker:text-violet-400">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title="Projects" color="#8b5cf6">
            {data.projects.map((p) => (
              <div key={p.id} className="mb-3">
                <p className="font-semibold text-slate-900">{p.title}</p>
                {p.description && (
                  <ul className="mt-1 space-y-0.5 pl-4" style={{ listStyleType: "disc" }}>
                    {toBullets(p.description).map((b, i) => (
                      <li key={i} className="text-slate-700 marker:text-violet-400">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
