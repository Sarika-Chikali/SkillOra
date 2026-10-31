"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import type { TanishContent } from "./adapter";
import styles from "./Certifications.module.css";

export function Certifications({ content, thumbnailMode = false }: { content: TanishContent["certifications"]; thumbnailMode?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || thumbnailMode) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".certCard",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [thumbnailMode]);

  if (content.length === 0) return null;

  return (
    <section ref={sectionRef} id="certifications" className={styles.certifications}>
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>Credentials</span>
          <h2 className={styles.headline}>
            My <span className={styles.accent}>certifications.</span>
          </h2>
        </div>
        <div className={styles.grid}>
          {content.map((c) => (
            <div key={c.id} className={`certCard ${styles.card}`}>
              <p className={styles.certTitle}>{c.title}</p>
              {c.issuer && <p className={styles.certIssuer}>{c.issuer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
