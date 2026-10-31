// Maps SkillOra's universal PortfolioTemplateProps into this template's
// content shape — same role as uzairDeveloper/adapter.ts. Read-only.

import type { PortfolioTemplateProps } from "../../templates/types";

export type TanishProject = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  featured: boolean;
  accentColor: string;
  gridSpan: "double" | "single";
};

export type TanishCertification = { id: string; title: string; issuer: string; link: string };

export type HeroLine = { text: string; accent?: boolean };

export type TanishContent = {
  navbar: { brand: string; brandFull: string; links: { label: string; href: string }[]; ctaHref: string };
  hero: { badge: string; lines: HeroLine[]; subtext: string; photoURL: string | null; initials: string };
  about: { bio: string; stats: { value: string; label: string }[]; skills: string[] };
  projects: TanishProject[];
  skills: { category: string; items: { name: string; level: number; label: string }[] }[];
  certifications: TanishCertification[];
  contact: { email: string; social: { label: string; handle: string; url: string; kind: "github" | "linkedin" | "email" | "other" }[] };
  footer: { text: string };
};

const ACCENT_PALETTE = ["#0066FF", "#00AAFF", "#10B981", "#7C3AED", "#F59E0B", "#DC2626", "#059669"];

function initials(name: string) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// The giant hero headline is styled for a short, punchy phrase (huge type,
// up to 4 lines) — the original template's own copy was exactly this
// ("Turning / ambitious ideas / into scalable / code", 8 words total). Real
// user headlines can run much longer, so this caps the word count fed into
// the display headline regardless of input length — anything longer belongs
// in the smaller subtext paragraph below, not the giant type, or it grows
// taller than the hero section and gets covered by the fixed navbar above.
const MAX_HEADLINE_WORDS = 8;
const MAX_WORDS_PER_LINE = 2;

function splitHeadlineLines(headline: string): HeroLine[] {
  const words = headline.trim().split(/\s+/).filter(Boolean).slice(0, MAX_HEADLINE_WORDS);
  if (words.length === 0) return [{ text: "Building" }, { text: "great", accent: true }, { text: "products" }];
  const lines: HeroLine[] = [];
  for (let i = 0; i < words.length; i += MAX_WORDS_PER_LINE) {
    lines.push({ text: words.slice(i, i + MAX_WORDS_PER_LINE).join(" ") });
    if (lines.length === 4) break;
  }
  if (lines.length > 0) lines[lines.length - 1].accent = true;
  return lines;
}

function projectCategory(technologies: string[]): TanishProject["gridSpan"] {
  return technologies.length >= 3 ? "double" : "single";
}

export function toTanishContent({ profile, data, projects }: PortfolioTemplateProps): TanishContent {
  const name = profile.name || "Your Name";
  const liveProjects = projects.filter((p) => p.status === "live");

  const social: TanishContent["contact"]["social"] = [];
  if (data.social.github) social.push({ label: "GitHub", handle: data.social.github.replace(/^https?:\/\/(www\.)?github\.com\//, "@"), url: data.social.github, kind: "github" });
  if (data.social.linkedin) social.push({ label: "LinkedIn", handle: name, url: data.social.linkedin, kind: "linkedin" });
  if (profile.email) social.push({ label: "Email", handle: profile.email, url: `mailto:${profile.email}`, kind: "email" });
  if (data.social.website) social.push({ label: "Website", handle: data.social.website.replace(/^https?:\/\//, ""), url: data.social.website, kind: "other" });

  return {
    navbar: {
      brand: name.split(" ")[0]?.slice(0, 2).toUpperCase() || "P.",
      brandFull: name,
      links: [
        { label: "About", href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Skills", href: "#skills" },
        ...(data.certifications.length > 0 ? [{ label: "Certifications", href: "#certifications" }] : []),
        { label: "Contact", href: "#contact" },
      ],
      ctaHref: data.social.github || data.social.linkedin || "#contact",
    },
    hero: {
      badge: "Available for work",
      lines: splitHeadlineLines(data.headline || `${name} builds things that ship`),
      subtext: data.tagline || data.about || "Building digital experiences that solve real-world problems.",
      photoURL: profile.photoURL,
      initials: initials(name),
    },
    about: {
      bio: data.about || "Add an About section in the portfolio editor to tell your story here.",
      stats: [
        { value: String(liveProjects.length), label: "Projects Built" },
        { value: String(data.experience.length), label: "Roles" },
        { value: String(data.skills.length), label: "Skills" },
      ],
      skills: data.skills.slice(0, 8),
    },
    projects: liveProjects.map((p, i) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tech: p.technologies,
      github: p.codeUrl,
      live: p.liveUrl,
      featured: p.featured,
      accentColor: ACCENT_PALETTE[i % ACCENT_PALETTE.length],
      gridSpan: projectCategory(p.technologies),
    })),
    // SkillOra doesn't track a numeric proficiency level for skills, so the
    // bar always fills fully — showing a fabricated percentage would
    // misrepresent something the user never actually claimed.
    skills: [{ category: "Skills", items: data.skills.map((s) => ({ name: s, level: data.skillLevels?.[s] ?? 80, label: "" })) }],
    certifications: data.certifications.map((c) => ({ id: c.fileId, title: c.name, issuer: c.issuer, link: c.fileUrl })),
    contact: {
      email: profile.email || "",
      social,
    },
    footer: { text: `Built with SkillOra` },
  };
}
