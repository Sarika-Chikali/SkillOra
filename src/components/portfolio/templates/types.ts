import type { PortfolioData, Project } from "@/lib/portfolioTypes";

export type PortfolioProfile = {
  name: string;
  photoURL: string | null;
  avatarColor: string | null;
  email: string;
};

export type PortfolioTemplateProps = {
  profile: PortfolioProfile;
  data: PortfolioData;
  projects: Project[];
  /**
   * Hint for the gallery's small live thumbnail cards: render a lightweight,
   * non-interactive version — skip heavy 3D canvases, global mouse-tracking
   * listeners, and autoplay-on-mount animation loops. Every template should
   * respect this so the gallery never has to mount N full 3D scenes/listeners
   * at once (see real-templates/uzairDeveloper/Hero.tsx for the pattern).
   * Defaults to false (full, interactive render) when omitted.
   */
  thumbnailMode?: boolean;
};
