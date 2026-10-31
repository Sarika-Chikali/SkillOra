"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import type { TanishContent } from "./adapter";
import styles from "./About.module.css";

export function About({ content, thumbnailMode = false }: { content: TanishContent["about"]; thumbnailMode?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || thumbnailMode) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: headlineRef.current, start: "top 85%" } });
      gsap.fromTo(bioRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15, scrollTrigger: { trigger: bioRef.current, start: "top 85%" } });
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.15, scrollTrigger: { trigger: statsRef.current, start: "top 85%" } });
      }
      gsap.fromTo(imageBlockRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: imageBlockRef.current, start: "top 80%" } });
    }, sectionRef);

    return () => ctx.revert();
  }, [thumbnailMode]);

  return (
    <section ref={sectionRef} id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.textCol}>
          <span className={styles.eyebrow}>About Me</span>
          <h2 ref={headlineRef} className={styles.headline}>
            My <span className={styles.accent}>story.</span>
          </h2>
          <p ref={bioRef} className={styles.bio}>
            {content.bio}
          </p>

          <div ref={statsRef} className={styles.stats}>
            {content.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {content.skills.length > 0 && (
          <div ref={imageBlockRef} className={styles.imageCol}>
            <div className={styles.imageCard}>
              <div className={styles.gradientOrb} />
              <div className={styles.codeBlock}>
                <span className={styles.codeComment}>// My stack</span>
                <span>
                  <span className={styles.codeKeyword}>const</span> <span className={styles.codeVar}>skills</span> = {"["}
                </span>
                {content.skills.map((s) => (
                  <span key={s} className={styles.codeIndent}>
                    <span className={styles.codeStr}>&apos;{s}&apos;</span>,
                  </span>
                ))}
                <span>{"]"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
