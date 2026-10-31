// Common content model shared by the newer templates — a flattened, display-
// ready view of PortfolioTemplateProps so each template only worries about
// look and motion, not data plumbing.

import type { PortfolioTemplateProps } from "../../templates/types";

export type CommonSkill = { name: string; level: number };
export type CommonProject = {
  id: string;
  title: string;
  description: string;
  highlights: string;
  tech: string[];
  live: string;
  code: string;
  image: string;
  featured: boolean;
};
export type CommonLink = { label: string; handle: string; url: string };

export type CommonContent = {
  name: string;
  firstName: string;
  initials: string;
  photoURL: string | null;
  email: string;
  headline: string;
  tagline: string;
  about: string;
  skills: CommonSkill[];
  projects: CommonProject[];
  education: { id: string; degree: string; institution: string; duration: string }[];
  experience: { id: string; title: string; company: string; duration: string; description: string }[];
  certifications: { id: string; title: string; issuer: string; link: string }[];
  links: CommonLink[];
  year: number;
};

export function toCommonContent({ profile, data, projects }: PortfolioTemplateProps): CommonContent {
  const name = profile.name || "Your Name";
  const links: CommonLink[] = [];
  if (data.social.github) links.push({ label: "GitHub", handle: data.social.github.replace(/^https?:\/\/(www\.)?github\.com\//, "@"), url: data.social.github });
  if (data.social.linkedin) links.push({ label: "LinkedIn", handle: name, url: data.social.linkedin });
  if (data.social.twitter) links.push({ label: "Twitter", handle: data.social.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, "@"), url: data.social.twitter });
  if (data.social.website) links.push({ label: "Website", handle: data.social.website.replace(/^https?:\/\//, ""), url: data.social.website });
  if (profile.email) links.push({ label: "Email", handle: profile.email, url: `mailto:${profile.email}` });

  return {
    name,
    firstName: name.split(" ")[0] || name,
    initials: name.split(" ").filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "?",
    photoURL: profile.photoURL,
    email: profile.email || "",
    headline: data.headline || `${name} builds things that ship`,
    tagline: data.tagline || "Building digital experiences that solve real-world problems.",
    about: data.about || "Add an About section in the portfolio editor to tell your story here.",
    skills: data.skills.map((s) => ({ name: s, level: data.skillLevels?.[s] ?? 80 })),
    projects: projects
      .filter((p) => p.status === "live")
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        highlights: p.highlights,
        tech: p.technologies,
        live: p.liveUrl,
        code: p.codeUrl,
        image: p.imageUrl,
        featured: p.featured,
      })),
    education: data.education,
    experience: data.experience,
    certifications: data.certifications.map((c) => ({ id: c.fileId, title: c.name, issuer: c.issuer, link: c.fileUrl })),
    links,
    year: new Date().getFullYear(),
  };
}
