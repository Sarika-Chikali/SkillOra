"use client";

import { useRef } from "react";
import type { TanishProject } from "./adapter";
import styles from "./BentoCard.module.css";

export function BentoCard({ project }: { project: TanishProject }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${project.gridSpan === "double" ? styles.double : styles.single} ${project.featured ? styles.featured : ""}`}
      onMouseMove={handleMouseMove}
      style={{ "--accent": project.accentColor } as React.CSSProperties}
    >
      <div className={styles.spotlight} />
      <div className={styles.borderGlow} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.index}>{project.featured ? "★ FEATURED" : "PROJECT"}</span>
          <div className={styles.links}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className={styles.iconLink} aria-label="GitHub" title="View Code">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02.005 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className={styles.iconLink} aria-label="Live site" title="Visit Site">
                ↗
              </a>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.description}>{project.description}</p>
        </div>

        {project.tech.length > 0 && (
          <div className={styles.techOverlay}>
            <p className={styles.techLabel}>Tech Stack</p>
            <div className={styles.techPills}>
              {project.tech.map((t) => (
                <span key={t} className={styles.pill}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
