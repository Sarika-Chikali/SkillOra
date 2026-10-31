// Static sample content only — no Firestore reads or writes. Shared by the
// template gallery's live thumbnail cards, the full-page template preview
// route, and the standalone template switcher, so every "explore the
// template" surface shows the exact same realistic sample portfolio.
// The person is fictional; nothing here describes a real user.
import type { PortfolioData, Project } from "@/lib/portfolioTypes";
import type { PortfolioProfile } from "./types";
import {
  SAMPLE_PERSON,
  SAMPLE_SKILLS,
  SAMPLE_SKILL_LEVELS,
  SAMPLE_EDUCATION,
  SAMPLE_EXPERIENCE,
  SAMPLE_PORTFOLIO_TEXT,
  SAMPLE_CERTIFICATIONS,
  SAMPLE_PROJECTS_LIST,
} from "@/lib/sampleContent";

export const SAMPLE_PROFILE: PortfolioProfile = {
  name: SAMPLE_PERSON.name,
  photoURL: null,
  avatarColor: "#6366f1",
  email: SAMPLE_PERSON.email,
};

export const SAMPLE_DATA: PortfolioData = {
  ...SAMPLE_PORTFOLIO_TEXT,
  skills: SAMPLE_SKILLS,
  skillLevels: SAMPLE_SKILL_LEVELS,
  education: SAMPLE_EDUCATION,
  experience: SAMPLE_EXPERIENCE,
  certifications: SAMPLE_CERTIFICATIONS,
  social: {
    linkedin: "https://linkedin.com/in/your-name",
    github: "https://github.com/your-name",
    twitter: "",
    website: "",
  },
  template: "uzairDev",
  slug: "alex-morgan",
  published: false,
  displayName: SAMPLE_PERSON.name,
  photoURL: null,
  avatarColor: "#6366f1",
  deploy: null,
  manualFields: [],
};

export const SAMPLE_PROJECTS: Project[] = SAMPLE_PROJECTS_LIST;
