import type { ComponentType } from "react";
import type { PortfolioTemplateProps } from "./types";
import type { PortfolioTemplateId } from "@/lib/portfolioTypes";
import { UzairDeveloperTemplate } from "../real-templates/uzairDeveloper/Template";
import { TanishDeveloperTemplate } from "../real-templates/tanishDev/Template";
import { DevPc3dTemplate } from "../real-templates/devPc3d/Template";
import { Char3dTemplate } from "../real-templates/char3d/Template";
import { DevBentoTemplate } from "../real-templates/devBento/Template";
import { SidebarAppTemplate } from "../real-templates/sidebarApp/Template";
import { CinematicTemplate } from "../real-templates/cinematic/Template";
import { AwwwardsTemplate } from "../real-templates/awwwards/Template";
import { Room3dTemplate } from "../real-templates/room3d/Template";
import { RetroIslandTemplate } from "../real-templates/retroIsland/Template";

export type { PortfolioTemplateProps, PortfolioProfile } from "./types";

/**
 * Real, downloaded portfolio templates, adapted into SkillOra's universal
 * portfolio data model — see PORTFOLIO_INTEGRATION.md in real-templates/ for
 * the source, license, and adaptation notes per template. The previous
 * generation of 10 SkillOra-authored placeholder templates has been removed
 * in favor of these; more real templates are added here incrementally as
 * each is adapted (see the project's template integration report).
 */
export const PORTFOLIO_TEMPLATES: Record<
  PortfolioTemplateId,
  { label: string; description: string; component: ComponentType<PortfolioTemplateProps>; swatch: string; category: string }
> = {
  uzairDev: {
    label: "Developer 3D",
    description: "Purple-glow dark theme, floating 3D orb avatar, spotlight cursor",
    component: UzairDeveloperTemplate,
    swatch: "linear-gradient(135deg, #06060e, #ba80ff)",
    category: "3D / Interactive",
  },
  tanishDev: {
    label: "Bento Blue",
    description: "OLED black, electric-blue glass orb hero, GSAP scroll reveals, bento project grid",
    component: TanishDeveloperTemplate,
    swatch: "linear-gradient(135deg, #000000, #0066ff)",
    category: "3D / Interactive",
  },
  devPc3d: {
    label: "Developer PC",
    description: "Starfield violet theme, 3D desktop-PC hero, tilt cards, 3D skill balls, orbiting planet contact",
    component: DevPc3dTemplate,
    swatch: "linear-gradient(135deg, #050816, #915eff)",
    category: "3D / Interactive",
  },
  char3d: {
    label: "Character 3D",
    description: "Teal-on-midnight, a rigged 3D character typing at a desk that follows your cursor, dashed-frame skill panels, project carousel",
    component: Char3dTemplate,
    swatch: "linear-gradient(135deg, #0a0e17, #5eead4)",
    category: "3D / Interactive",
  },
  devBento: {
    label: "Bento Light/Dark",
    description: "Modern bento tiles with a light/dark toggle, typewriter roles, indigo-violet gradient, timeline for experience",
    component: DevBentoTemplate,
    swatch: "linear-gradient(135deg, #09090b, #818cf8 60%, #c084fc)",
    category: "Minimal / Bento",
  },
  sidebarApp: {
    label: "Sidebar Console",
    description: "Futuristic sidebar app: page-flip sections, neon-green on charcoal, skill bars, filterable portfolio cards, dark/light toggle",
    component: SidebarAppTemplate,
    swatch: "linear-gradient(135deg, #0c0c0c, #9dff8e)",
    category: "App Style",
  },
  cinematic: {
    label: "Cinematic Scroll",
    description: "Scroll-scrubbed background video, giant outline-serif type, orange accent, editorial project rows",
    component: CinematicTemplate,
    swatch: "linear-gradient(135deg, #080808, #ff6b1a)",
    category: "Cinematic / Editorial",
  },
  awwwards: {
    label: "Awwwards Planet",
    description: "Warm-paper editorial with a 3D white planet and gold ring, giant uppercase name, dark skills index, gold marquee",
    component: AwwwardsTemplate,
    swatch: "linear-gradient(135deg, #e4e4de, #d4a63c)",
    category: "3D / Editorial",
  },
  room3d: {
    label: "3D Room Finder",
    description: "An explorable 3D desk room with day/night lights; click the monitor, keyboard or shelf to open a macOS-style Finder holding your details",
    component: Room3dTemplate,
    swatch: "linear-gradient(135deg, #2d2359, #ff6b81)",
    category: "3D / Interactive",
  },
  retroIsland: {
    label: "Retro Island",
    description: "Pixel-game title screen over a floating 3D island, PRESS START into a tabbed quest log with segmented skill bars",
    component: RetroIslandTemplate,
    swatch: "linear-gradient(135deg, #9fd5ff, #76c45f 60%, #f4c34d)",
    category: "Playful / Game",
  },
};
