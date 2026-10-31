"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./gsap";
import type { TanishContent } from "./adapter";
import styles from "./Skills.module.css";

export function Skills({ content, thumbnailMode = false }: { content: TanishContent["skills"]; thumbnailMode?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || thumbnailMode) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".skillsTitle", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: ".skillsTitle", start: "top 85%" } });
      barRefs.current.forEach((bar) => {
        if (!bar) return;
        const level = bar.dataset.level ?? "0";
        gsap.fromTo(bar, { width: "0%" }, { width: `${level}%`, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 90%" } });
      });
      gsap.fromTo(".skillItem", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.08, scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
    }, sectionRef);

    return () => ctx.revert();
  }, [thumbnailMode]);

  if (content.every((c) => c.items.length === 0)) return null;

  let barIndex = 0;

  return (
    <section ref={sectionRef} id="skills" className={styles.skills}>
      <div className={styles.container}>
        <div className={`skillsTitle ${styles.titleBlock}`}>
          <span className={styles.eyebrow}>Expertise</span>
          <h2 className={styles.headline}>
            My <span className={styles.accent}>tech stack.</span>
          </h2>
        </div>

        <div className={styles.categoriesGrid}>
          {content.map((category) => (
            <div key={category.category} className={styles.categoryBlock}>
              <h3 className={styles.categoryTitle}>{category.category}</h3>
              <div className={styles.skillList}>
                {category.items.map((skill) => {
                  const idx = barIndex++;
                  return (
                    <div key={skill.name} className={`skillItem ${styles.skillItem}`}>
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.name}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          ref={(el) => {
                            barRefs.current[idx] = el;
                          }}
                          className={styles.barFill}
                          data-level={skill.level}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
