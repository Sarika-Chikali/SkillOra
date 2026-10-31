// Neutral placeholder content shown to brand-new users so every screen (resume,
// portfolio, templates) looks complete from the first visit. It is never written to
// the database until the person edits and saves, and it deliberately uses a made-up
// person — nothing here describes a real user.

export const SAMPLE_PERSON = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "Full Stack Developer",
  school: "Riverside University",
  company: "Northwind Labs",
};

export const SAMPLE_SKILLS = ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "REST APIs", "Figma"];

export const SAMPLE_SKILL_LEVELS: Record<string, number> = {
  JavaScript: 90,
  React: 85,
  "Node.js": 80,
  Python: 75,
  SQL: 78,
  Git: 82,
  "REST APIs": 84,
  Figma: 65,
};

export const SAMPLE_SUMMARY =
  "Computer Science graduate who enjoys turning ideas into reliable web applications. Comfortable across the stack, quick to learn new tools, and focused on building things people actually use.";

export const SAMPLE_EDUCATION = [{ id: "sample-edu-1", degree: "B.Tech, Computer Science", institution: SAMPLE_PERSON.school, duration: "2021 – 2025" }];

export const SAMPLE_EXPERIENCE = [
  {
    id: "sample-exp-1",
    title: "Software Engineering Intern",
    company: SAMPLE_PERSON.company,
    duration: "Jun 2024 – Aug 2024",
    description: "Built a customer dashboard used by the support team.\nCut report generation time by 40% with cached queries.",
  },
];

export const SAMPLE_RESUME_PROJECTS = [
  { id: "sample-proj-1", title: "TaskFlow — Team Planner", description: "A kanban-style planner with real-time updates.\nBuilt with React and Firebase.", link: "" },
];

export const SAMPLE_PORTFOLIO_TEXT = {
  headline: "Full Stack Developer & Problem Solver",
  tagline: "I build clean, fast web applications and enjoy turning ideas into products.",
  about:
    "I'm a Computer Science graduate who loves building useful software. I work across the stack — from polished interfaces to reliable APIs — and I'm always learning something new. Replace this text with your own story.",
};

export const SAMPLE_CERTIFICATIONS = [{ fileId: "sample-cert-1", name: "Web Development Fundamentals", issuer: "Example Academy", fileUrl: "" }];

export const SAMPLE_PROJECTS_LIST = [
  {
    id: "sample-1",
    title: "TaskFlow — Team Planner",
    description: "A kanban-style planner with real-time collaboration for small teams.",
    highlights: "Real-time updates\nDrag-and-drop boards",
    technologies: ["React", "Firebase", "Tailwind"],
    liveUrl: "",
    codeUrl: "",
    imageUrl: "",
    featured: true,
    status: "live" as const,
    createdAt: null,
  },
  {
    id: "sample-2",
    title: "ShopLite — Mini Storefront",
    description: "A lightweight online store with cart, search and checkout flow.",
    highlights: "Product search\nCart and checkout",
    technologies: ["Node.js", "MongoDB", "React"],
    liveUrl: "",
    codeUrl: "",
    imageUrl: "",
    featured: true,
    status: "live" as const,
    createdAt: null,
  },
  {
    id: "sample-3",
    title: "StudyBuddy — Notes App",
    description: "A simple notes app for students with tags and quick search.",
    highlights: "Tagging\nOffline friendly",
    technologies: ["JavaScript", "SQL"],
    liveUrl: "",
    codeUrl: "",
    imageUrl: "",
    featured: false,
    status: "live" as const,
    createdAt: null,
  },
];
