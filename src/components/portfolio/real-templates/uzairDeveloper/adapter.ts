// Maps SkillOra's universal PortfolioTemplateProps (profile/data/projects)
// into the content shape this template's components expect — the same role
// PortfolioContent.js played in the original template, except computed live
// from real user data instead of hardcoded at build time. Nothing here ever
// writes back to portfolio/profile/resume data — read-only transform.

import type { PortfolioTemplateProps } from "../../templates/types";
import { initials } from "../../templates/utils";

export type UzairProject = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  emoji: string;
  category: "frontend" | "fullstack" | "other";
  tags: string[];
  liveUrl: string;
  githubUrl: string;
};

export type UzairCertification = {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string;
  description: string;
  link: string;
};

export type UzairContent = {
  navbar: { brand: string; links: { label: string; href: string }[]; cta: string };
  hero: {
    badge: string;
    greeting: string;
    name: string;
    title: string;
    description: string;
    buttons: { primary: string; secondary: string };
    stats: { number: string; label: string }[];
    technologies: string[];
    photoURL: string | null;
    initials: string;
  };
  about: {
    tag: string;
    title: string;
    titleHighlight: string;
    paragraphs: string[];
    stats: { number: string; label: string }[];
    skills: { name: string }[];
  };
  skills: {
    tag: string;
    title: string;
    titleHighlight: string;
    description: string;
    items: string[];
  };
  projects: {
    tag: string;
    title: string;
    titleHighlight: string;
    description: string;
    categories: { id: string; label: string }[];
    items: UzairProject[];
  };
  certifications: {
    tag: string;
    title: string;
    titleHighlight: string;
    description: string;
    items: UzairCertification[];
  };
  contact: {
    tag: string;
    title: string;
    titleHighlight: string;
    description: string;
    email: string;
    location: string;
    social: { name: string; url: string }[];
  };
  footer: { brand: string; text: string; links: { label: string; href: string }[] };
};

function projectCategory(technologies: string[]): UzairProject["category"] {
  const hasBackend = technologies.some((t) =>
    /node|express|firebase|firestore|python|django|flask|mongo|sql|api|server/i.test(t)
  );
  const hasFrontend = technologies.some((t) => /react|next|vue|angular|html|css|tailwind/i.test(t));
  if (hasFrontend && hasBackend) return "fullstack";
  if (hasFrontend) return "frontend";
  return "other";
}

export function toUzairContent({ profile, data, projects }: PortfolioTemplateProps): UzairContent {
  const name = profile.name || "Your Name";
  const firstName = name.split(" ")[0];
  const liveProjects = projects.filter((p) => p.status === "live");

  const socialLinks = [
    { name: "GitHub", url: data.social.github },
    { name: "LinkedIn", url: data.social.linkedin },
    { name: "X / Twitter", url: data.social.twitter },
    { name: "Website", url: data.social.website },
  ].filter((s) => s.url);

  return {
    navbar: {
      brand: firstName,
      links: [
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        ...(data.certifications.length > 0 ? [{ label: "Certifications", href: "#certifications" }] : []),
        { label: "Contact", href: "#contact" },
      ],
      cta: "Contact",
    },
    hero: {
      badge: "Available for work",
      greeting: "Hey, I'm",
      name: firstName,
      title: data.headline || "Developer",
      description: data.tagline || "Building digital experiences that solve real-world problems.",
      buttons: { primary: "View Projects", secondary: "About Me" },
      stats: [
        { number: String(liveProjects.length), label: "Projects" },
        { number: String(data.skills.length), label: "Skills" },
        { number: String(data.experience.length), label: "Experience" },
        { number: String(data.certifications.length), label: "Certificates" },
      ],
      technologies: data.skills,
      photoURL: profile.photoURL,
      initials: initials(name),
    },
    about: {
      tag: "About Me",
      title: "Passionate about creating",
      titleHighlight: "digital experiences",
      paragraphs: data.about ? data.about.split("\n").filter(Boolean) : [],
      stats: [
        { number: String(liveProjects.length), label: "Projects" },
        { number: String(data.experience.length), label: "Roles" },
        { number: String(data.skills.length), label: "Technologies" },
      ],
      skills: data.skills.slice(0, 8).map((s) => ({ name: s })),
    },
    skills: {
      tag: "Expertise",
      title: "My",
      titleHighlight: "Skills",
      description: "A comprehensive overview of my technical skills and expertise.",
      items: data.skills,
    },
    projects: {
      tag: "Portfolio",
      title: "Featured",
      titleHighlight: "Projects",
      description: "Here are some of the projects I've worked on.",
      categories: [
        { id: "all", label: "All Projects" },
        { id: "frontend", label: "Frontend" },
        { id: "fullstack", label: "Full Stack" },
        { id: "other", label: "Others" },
      ],
      items: liveProjects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        emoji: "📁",
        category: projectCategory(p.technologies),
        tags: p.technologies,
        liveUrl: p.liveUrl,
        githubUrl: p.codeUrl,
      })),
    },
    certifications: {
      tag: "Credentials",
      title: "My ",
      titleHighlight: "Certifications",
      description: "A showcase of my professional qualifications and continuous learning journey.",
      items: data.certifications.map((c) => ({
        id: c.fileId,
        title: c.name,
        issuer: c.issuer,
        imageUrl: c.fileUrl,
        description: c.issuer ? `Issued by ${c.issuer}.` : "",
        link: c.fileUrl,
      })),
    },
    contact: {
      tag: "Contact",
      title: "Let's work",
      titleHighlight: "together",
      description: "Have a project in mind? I'm always open to new opportunities and collaborations.",
      email: profile.email || "",
      location: "",
      social: socialLinks,
    },
    footer: {
      brand: `${firstName}.`,
      text: data.tagline || "Building digital experiences with passion and creativity.",
      links: [
        { label: "About", href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    },
  };
}
