"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Pencil } from "lucide-react";
import type { PortfolioTemplateProps } from "./templates/types";

export type EditableSectionId = "home" | "about" | "skills" | "projects" | "certifications" | "contact" | "education" | "experience";

const SECTION_LABELS: Record<EditableSectionId, string> = {
  home: "Hero",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  contact: "Contact",
  education: "Education",
  experience: "Experience",
};

const SECTION_SELECTOR = "#home, #about, #skills, #projects, #certifications, #contact, #education, #experience";

/**
 * Wraps a live template render so the user can click directly on a rendered
 * section (hero, about, skills, ...) to edit it — a lighter, achievable take
 * on Canva-style direct manipulation. Templates already tag their sections
 * with these ids for their own scroll-nav (see real-templates/*), so this
 * works against any template without per-template instrumentation: find the
 * nearest ancestor matching a known section id, highlight it on hover, open
 * the matching edit panel on click.
 */
export function EditableCanvas({
  Template,
  templateProps,
  onSelectSection,
}: {
  Template: React.ComponentType<PortfolioTemplateProps>;
  templateProps: PortfolioTemplateProps;
  onSelectSection: (id: EditableSectionId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ id: EditableSectionId; rect: DOMRect } | null>(null);

  const updateHover = useCallback((target: EventTarget | null) => {
    const container = containerRef.current;
    if (!container || !(target instanceof Element)) {
      setHover(null);
      return;
    }
    const section = target.closest(SECTION_SELECTOR);
    if (!section || !container.contains(section)) {
      setHover(null);
      return;
    }
    const id = section.id as EditableSectionId;
    const rect = section.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setHover({
      id,
      rect: new DOMRect(rect.left - containerRect.left, rect.top - containerRect.top, rect.width, rect.height),
    });
  }, []);

  useEffect(() => {
    // The canvas scrolls with the page itself (see below) — no separate
    // inner scroll container, so the relevant scroll to clear a stale
    // highlight on is the window's.
    function onScroll() {
      setHover(null);
    }
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);

  return (
    <div
      ref={containerRef}
      // Deliberately no overflow/max-height here — an inner scroll region
      // nested inside the page's own scroll made the portfolio preview
      // start almost a full screen below the fold with a confusing
      // double-scroll to reach it. Letting the canvas flow with the page is
      // the standard, unsurprising behavior (and matches every other page
      // in the app).
      //
      // `transform` here isn't decorative — some templates use `position:
      // fixed` for their nav/background (correct on their own standalone
      // routes, where the template owns the whole viewport). Embedded here
      // inside the editor's much taller page, those fixed layers would
      // otherwise anchor to the *browser* viewport instead of this canvas —
      // covering the page's own header and sync banner with a full-screen
      // backdrop. Any transform on an ancestor makes it the containing
      // block for fixed descendants instead, so they stay scoped to this
      // canvas exactly like `position: absolute` would.
      className="relative"
      style={{ transform: "translateZ(0)" }}
      onMouseMove={(e) => updateHover(e.target)}
      onMouseLeave={() => setHover(null)}
      onClick={(e) => {
        const section = (e.target as Element).closest(SECTION_SELECTOR);
        if (section) onSelectSection(section.id as EditableSectionId);
      }}
    >
      <Template {...templateProps} />

      {hover && (
        <div
          className="absolute pointer-events-none border-2 border-primary-500 rounded-md transition-[top,left,width,height] duration-100"
          style={{ top: hover.rect.top, left: hover.rect.left, width: hover.rect.width, height: hover.rect.height }}
        >
          <span className="absolute -top-7 left-0 flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-primary-700 text-white shadow-sm">
            <Pencil size={10} /> Edit {SECTION_LABELS[hover.id]}
          </span>
        </div>
      )}
    </div>
  );
}
