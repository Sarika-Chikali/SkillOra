import { Mail, Briefcase, GraduationCap, FolderGit2, Award, Wrench } from "lucide-react";
import type { TemplateProps } from "./types";
import { toBullets } from "./utils";

export function ModernTemplate({ profile, data, certifications }: TemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#1e293b" }} className="p-10 text-[13px] leading-relaxed">
      <div className="flex items-start justify-between border-b-4 border-blue-600 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{profile.name || "Your Name"}</h1>
          <p className="text-blue-600 font-semibold mt-1">{profile.role}{profile.company ? ` · ${profile.company}` : ""}</p>
        </div>
        {profile.email && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 mt-1">
            <Mail size={12} /> {profile.email}
          </p>
        )}
      </div>

      {data.summary && (
        <Section title="Summary" icon={Briefcase}>
          <p className="text-slate-700">{data.summary}</p>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills" icon={Wrench}>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Experience" icon={Briefcase}>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <p className="font-bold text-slate-900">{e.title}</p>
                <p className="text-xs font-medium text-slate-500 shrink-0 ml-3">{e.duration}</p>
              </div>
              <p className="text-blue-600 text-xs font-medium">{e.company}</p>
              {e.description && (
                <ul className="mt-1.5 space-y-1 list-disc pl-4 marker:text-blue-500">
                  {toBullets(e.description).map((b, i) => (
                    <li key={i} className="text-slate-700">
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
        <Section title="Projects" icon={FolderGit2}>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-3">
              <p className="font-bold text-slate-900">{p.title}</p>
              {p.description && (
                <ul className="mt-1 space-y-1 list-disc pl-4 marker:text-blue-500">
                  {toBullets(p.description).map((b, i) => (
                    <li key={i} className="text-slate-700">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {p.link && <p className="text-blue-600 text-xs mt-0.5">{p.link}</p>}
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education" icon={GraduationCap}>
          <ul className="space-y-2 list-disc pl-4 marker:text-blue-500">
            {data.education.map((e) => (
              <li key={e.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="font-bold text-slate-900">{e.degree}</p>
                    <p className="text-blue-600 text-xs">{e.institution}</p>
                  </div>
                  <p className="text-xs font-medium text-slate-500 shrink-0 ml-3">{e.duration}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" icon={Award}>
          <ul className="space-y-1 list-disc pl-4 marker:text-blue-500">
            {certifications.map((c, i) => (
              <li key={i} className="text-slate-700">
                {c.name} <span className="text-slate-500">— {c.issuer}</span>
                {c.verified && <span className="text-emerald-600 text-xs font-medium"> ✓ Verified</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
        <Icon size={13} />
        {title}
      </h2>
      {children}
    </div>
  );
}
