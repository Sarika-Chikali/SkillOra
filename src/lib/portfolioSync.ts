// Portfolio Sync — the adapter layer between SkillOra's source-of-truth data
// (Profile, Resume, Career Vault) and one user's Portfolio document.
//
// This module is pure data transformation — no Firebase reads of its own.
// The caller (the portfolio editor) already holds live copies of profile,
// resume, vault files, and the portfolio doc; buildSyncCandidates() diffs
// them and proposes what's new, applySyncCandidate() turns one accepted
// proposal into a Firestore patch.
//
// Rule this module exists to enforce: SkillOra data is the source of truth,
// but a sync is *proposed*, never silently applied — and a field the user
// has manually edited (tracked in portfolio.manualFields) is never
// overwritten by a sync, only re-offered as a suggestion the user can accept
// or ignore.

import type {
  PortfolioData,
  PortfolioCertification,
  PortfolioEducationEntry,
  PortfolioExperienceEntry,
} from "./portfolioTypes";
import type { UserProfile } from "./auth-context";
import type { ResumeData } from "./resume";
import type { VaultFile } from "./vault";

export type SyncCandidate =
  | { field: "headline"; label: string; value: string }
  | { field: "about"; label: string; value: string }
  | { field: "skills"; label: string; value: string[] }
  | { field: "education"; label: string; value: PortfolioEducationEntry[] }
  | { field: "experience"; label: string; value: PortfolioExperienceEntry[] }
  | { field: "certifications"; label: string; value: PortfolioCertification[] };

function pluralize(count: number, noun: string) {
  if (count === 1) return `${count} ${noun}`;
  const plural = noun.endsWith("y") ? `${noun.slice(0, -1)}ies` : `${noun}s`;
  return `${count} ${plural}`;
}

export function buildSyncCandidates(params: {
  portfolio: PortfolioData;
  profile: UserProfile | null;
  resume: ResumeData | null;
  vaultFiles: VaultFile[];
}): SyncCandidate[] {
  const { portfolio, profile, resume, vaultFiles } = params;
  const manual = new Set(portfolio.manualFields);
  const candidates: SyncCandidate[] = [];

  if (!manual.has("headline") && !portfolio.headline.trim() && profile?.role) {
    candidates.push({ field: "headline", label: `Headline from your profile: "${profile.role}"`, value: profile.role });
  }

  if (!manual.has("about") && !portfolio.about.trim()) {
    const bio = profile?.bio?.trim() || resume?.summary?.trim() || "";
    if (bio) {
      candidates.push({
        field: "about",
        label: `About, from your ${profile?.bio?.trim() ? "profile" : "resume summary"}`,
        value: bio,
      });
    }
  }

  if (!manual.has("skills") && resume?.skills?.length) {
    const newSkills = resume.skills.filter((s) => !portfolio.skills.includes(s));
    if (newSkills.length > 0) {
      candidates.push({
        field: "skills",
        label: `${pluralize(newSkills.length, "skill")} from your resume`,
        value: [...portfolio.skills, ...newSkills],
      });
    }
  }

  if (!manual.has("education") && portfolio.education.length === 0 && resume?.education?.length) {
    candidates.push({
      field: "education",
      label: `${pluralize(resume.education.length, "education entry")} from your resume`,
      value: resume.education.map((e) => ({ ...e })),
    });
  }

  if (!manual.has("experience") && portfolio.experience.length === 0 && resume?.experience?.length) {
    candidates.push({
      field: "experience",
      label: `${pluralize(resume.experience.length, "experience entry")} from your resume`,
      value: resume.experience.map((e) => ({ ...e })),
    });
  }

  if (!manual.has("certifications")) {
    const eligible = vaultFiles.filter((f) => f.addedToResumePortfolio && f.extracted?.documentType === "certificate");
    const existingIds = new Set(portfolio.certifications.map((c) => c.fileId));
    const newOnes = eligible.filter((f) => !existingIds.has(f.id));
    if (newOnes.length > 0) {
      candidates.push({
        field: "certifications",
        label: `${pluralize(newOnes.length, "certificate")} from Career Vault`,
        value: [
          ...portfolio.certifications,
          ...newOnes.map((f) => ({
            fileId: f.id,
            name: f.extracted?.name || f.fileName,
            issuer: f.extracted?.issuer || "",
            fileUrl: f.downloadURL,
          })),
        ],
      });
    }
  }

  return candidates;
}

/** Turns one accepted candidate into a Firestore patch, marking that field as no longer purely-synced (so a later manual edit is still what wins on conflict). */
export function applySyncCandidate(candidate: SyncCandidate): Partial<PortfolioData> {
  return { [candidate.field]: candidate.value } as Partial<PortfolioData>;
}
