// Pure types/constants only — no Firebase imports. This module is shared by
// both the client-side lib/portfolio.ts and the server-only
// lib/portfolioServer.ts (used from the public /p/[slug] page and its OG
// image route), which must never pull in the client firebase/auth app.

// Real, downloaded-and-adapted portfolio templates only — see
// components/portfolio/real-templates/. The 10 earlier SkillOra-authored
// placeholder templates ("bento", "brutalist", etc.) were removed; a
// portfolio still pointing at one of those old ids falls back to the first
// real template below via normalizePortfolioTemplate.
export const PORTFOLIO_TEMPLATE_IDS = ["uzairDev", "tanishDev", "devPc3d", "char3d", "devBento", "sidebarApp", "cinematic", "awwwards", "room3d", "retroIsland"] as const;

export type PortfolioTemplateId = (typeof PORTFOLIO_TEMPLATE_IDS)[number];

/** Falls back to the default template for a stale/removed id (e.g. one of the old placeholder templates, or one being phased out). */
export function normalizePortfolioTemplate(value: unknown): PortfolioTemplateId {
  return (PORTFOLIO_TEMPLATE_IDS as readonly string[]).includes(value as string)
    ? (value as PortfolioTemplateId)
    : PORTFOLIO_TEMPLATE_IDS[0];
}

export type SocialLinks = {
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
};

export type DeployPlatform = "vercel" | "netlify";

export type DeployStatus = "connecting" | "building" | "deploying" | "live" | "failed";

export type DeployInfo = {
  platform: DeployPlatform;
  url: string;
  status: DeployStatus;
  error: string;
  siteId: string;
  deployedAt: unknown;
};

export const EMPTY_DEPLOY_INFO: DeployInfo = {
  platform: "vercel",
  url: "",
  status: "connecting",
  error: "",
  siteId: "",
  deployedAt: null,
};

export type PortfolioEducationEntry = { id: string; degree: string; institution: string; duration: string };
export type PortfolioExperienceEntry = { id: string; title: string; company: string; duration: string; description: string };

/**
 * A certificate shown on the portfolio, referencing its Career Vault file by
 * id rather than duplicating the file itself — name/issuer/fileUrl are a
 * small denormalized snapshot for rendering, refreshed whenever the user
 * re-syncs, not a copy of the certificate document or its binary.
 */
export type PortfolioCertification = { fileId: string; name: string; issuer: string; fileUrl: string };

export type PortfolioData = {
  headline: string;
  tagline: string;
  about: string;
  skills: string[];
  // Optional 0-100 proficiency per skill name; missing entries default to 80.
  skillLevels: Record<string, number>;
  education: PortfolioEducationEntry[];
  experience: PortfolioExperienceEntry[];
  certifications: PortfolioCertification[];
  social: SocialLinks;
  template: PortfolioTemplateId;
  slug: string;
  published: boolean;
  // Snapshotted from the profile at save time so the public /p/[slug] page
  // (unauthenticated) can render name/photo without needing to read the
  // private profiles/{uid} document.
  displayName: string;
  photoURL: string | null;
  avatarColor: string | null;
  // Set once the user connects Vercel/Netlify and a deploy has run.
  deploy: DeployInfo | null;
  // Field names the user has manually edited in the portfolio editor — a
  // "Sync from SkillOra" pass never silently overwrites these, only offers
  // them as a reviewable suggestion. See lib/portfolioSync.ts.
  manualFields: string[];
  // True while the screen is showing placeholder content for a brand-new user.
  isSample?: boolean;
};

export const EMPTY_PORTFOLIO_DATA: PortfolioData = {
  headline: "",
  tagline: "",
  about: "",
  skills: [],
  skillLevels: {},
  education: [],
  experience: [],
  certifications: [],
  social: { linkedin: "", github: "", twitter: "", website: "" },
  template: PORTFOLIO_TEMPLATE_IDS[0],
  slug: "",
  published: false,
  displayName: "",
  photoURL: null,
  avatarColor: null,
  deploy: null,
  manualFields: [],
};

export type Project = {
  id: string;
  title: string;
  description: string;
  highlights: string;
  technologies: string[];
  liveUrl: string;
  codeUrl: string;
  imageUrl: string;
  featured: boolean;
  status: "live" | "draft";
  createdAt: unknown;
};

export function newProjectId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
