import type { TemplateId } from "@/lib/resume";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { CompactTemplate } from "./CompactTemplate";
import { ExecutiveTemplate, MinimalTemplate, BoldTemplate, TimelineTemplate, TechTemplate, ElegantTemplate } from "./MoreTemplates";

import type { TemplateProps } from "./types";

export type { TemplateProps, ResumeCertification } from "./types";

export const TEMPLATES: Record<TemplateId, { label: string; description: string; component: (props: TemplateProps) => React.ReactElement; swatch: string }> = {
  modern: {
    label: "Modern",
    description: "Clean single column with a bold accent header",
    component: ModernTemplate,
    swatch: "var(--gradient-primary)",
  },
  classic: {
    label: "Classic",
    description: "Traditional serif layout, formal and centered",
    component: ClassicTemplate,
    swatch: "var(--gradient-neutral)",
  },
  creative: {
    label: "Creative",
    description: "Colorful sidebar layout for a standout look",
    component: CreativeTemplate,
    swatch: "var(--gradient-violet)",
  },
  compact: {
    label: "ATS-Friendly",
    description: "Plain text layout built for applicant tracking systems",
    component: CompactTemplate,
    swatch: "var(--gradient-green)",
  },
  executive: { label: "Executive", description: "Navy banner with gold rules and a two-column body", component: ExecutiveTemplate, swatch: "linear-gradient(135deg,#0f2a4a,#c9a24b)" },
  minimal: { label: "Minimal", description: "Airy whitespace, light type and a date column", component: MinimalTemplate, swatch: "linear-gradient(135deg,#f3f4f6,#9ca3af)" },
  bold: { label: "Bold", description: "Loud orange name block with filled section tags", component: BoldTemplate, swatch: "linear-gradient(135deg,#ff6b1a,#111)" },
  timeline: { label: "Timeline", description: "Teal rail with dots for experience and education", component: TimelineTemplate, swatch: "linear-gradient(135deg,#0d9488,#99f6e4)" },
  tech: { label: "Developer", description: "Monospace, terminal-style comment headings", component: TechTemplate, swatch: "linear-gradient(135deg,#15803d,#0f172a)" },
  elegant: { label: "Elegant", description: "Serif type with a warm beige sidebar", component: ElegantTemplate, swatch: "linear-gradient(135deg,#f5efe6,#9f1239)" },
};
