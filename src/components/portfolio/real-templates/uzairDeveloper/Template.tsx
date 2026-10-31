"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toUzairContent } from "./adapter";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { Certifications } from "./Certifications";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import styles from "./Template.module.css";

// The CSS custom properties every sibling *.module.css file references via
// var(--accent) etc. — originally a global :root block, now scoped onto this
// wrapper since CSS Modules hash :root like any other selector.
const themeVars: CSSProperties = {
  ["--accent" as string]: "#ba80ff",
  ["--accent-glow" as string]: "rgba(186, 128, 255, 0.4)",
  ["--bg-primary" as string]: "rgba(8, 8, 16, 0.75)",
  ["--bg-secondary" as string]: "rgba(20, 20, 35, 0.6)",
  ["--text-primary" as string]: "#ffffff",
  ["--text-secondary" as string]: "rgba(255, 255, 255, 0.6)",
  ["--border-glass" as string]: "rgba(255, 255, 255, 0.08)",
  ["--shadow-glass" as string]: "0 8px 32px rgba(0, 0, 0, 0.6)",
};

export function UzairDeveloperTemplate(props: PortfolioTemplateProps) {
  const content = toUzairContent(props);
  const thumbnailMode = props.thumbnailMode ?? false;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Thumbnail cards render many of these at once (gallery grid) — a
    // window-level mousemove listener per card is wasted work, and the
    // cursor position wouldn't map sensibly onto a scaled-down card anyway.
    if (thumbnailMode) return;

    function handleMouseMove(e: MouseEvent) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setIsHovering(true);
      });
    }
    function handleMouseLeave() {
      setIsHovering(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [thumbnailMode]);

  return (
    <div className={styles.app} style={themeVars}>
      <div className={styles["app-background"]} />
      <div className={styles["grid-pattern-global"]} />

      <div
        className={styles["dark-overlay"]}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(6, 6, 14, 0.85) 35%, rgba(6, 6, 14, 0.95) 60%, #06060e 100%)`,
        }}
      />
      <div
        className={styles["global-spotlight"]}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(186, 128, 255, 0.25) 0%, rgba(186, 128, 255, 0.12) 15%, rgba(186, 128, 255, 0.04) 30%, transparent 55%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />
      <div
        className={styles["global-spotlight-secondary"]}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(186, 128, 255, 0.12) 0%, rgba(186, 128, 255, 0.04) 25%, transparent 50%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      <div className={`${styles["orb-global"]} ${styles["orb-global-1"]}`} />
      <div className={`${styles["orb-global"]} ${styles["orb-global-2"]}`} />
      <div className={`${styles["orb-global"]} ${styles["orb-global-3"]}`} />

      <div className={styles.sectionLayer}>
        <Navbar content={content.navbar} />
      </div>
      <div className={styles.sectionLayer}>
        <Hero content={content.hero} thumbnailMode={thumbnailMode} />
      </div>
      <div className={styles.sectionLayer}>
        <About content={content.about} />
      </div>
      <div className={styles.sectionLayer}>
        <Skills content={content.skills} />
      </div>
      <div className={styles.sectionLayer}>
        <Projects content={content.projects} />
      </div>
      <div className={styles.sectionLayer}>
        <Certifications content={content.certifications} />
      </div>
      <div className={styles.sectionLayer}>
        <Contact content={content.contact} />
      </div>
      <div className={styles.sectionLayer}>
        <Footer content={content.footer} />
      </div>
    </div>
  );
}
