"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { UzairContent } from "./adapter";
import styles from "./Hero.module.css";

// The distorted-sphere avatar is React Three Fiber — genuinely heavy (three.js
// + WebGL context). Loaded only on the client, only once this section is
// about to render, never blocking the rest of the hero's text/animations.
const Avatar3DCanvas = dynamic(() => import("./Avatar3DCanvas").then((m) => m.Avatar3DCanvas), {
  ssr: false,
  loading: () => <div className={styles["avatar-placeholder"]} />,
});

export function Hero({ content, thumbnailMode = false }: { content: UzairContent["hero"]; thumbnailMode?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className={styles.hero} id="home">
      <div className={styles["hero-container"]}>
        <div className={styles["hero-left"]}>
          <div className={styles["hero-content"]}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={styles["hero-badge"]}>
              <span className={styles["badge-dot"]} />
              <span className={styles["badge-text"]}>{content.badge}</span>
              <span className={styles["badge-glow"]} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className={styles["hero-title"]}>
              {content.greeting} <span className={styles.highlight}>{content.name}</span>
              <span className={styles["title-cursor"]}>|</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className={styles["hero-subtitle"]}>
              I&apos;m a {content.title}. {content.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className={styles["hero-actions"]}>
              <button className={styles["btn-primary"]} onClick={() => scrollTo("projects")}>
                <span className={styles["btn-content"]}>{content.buttons.primary}</span>
                <span className={styles["btn-glow-effect"]} />
              </button>
              <button className={styles["btn-secondary"]} onClick={() => scrollTo("about")}>
                {content.buttons.secondary}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className={styles["hero-stats"]}>
            {content.stats.map((stat, index) => (
              <div key={index} className={styles["stat-item"]}>
                <div className={styles["stat-glow"]} />
                <span className={styles["stat-number"]}>{stat.number}</span>
                <span className={styles["stat-label"]}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {content.technologies.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className={styles["tech-stack"]}>
              <p className={styles["tech-label"]}>
                <span className={styles["tech-dot"]} />
                Tech Stack
              </p>
              <div className={styles["tech-grid"]}>
                {content.technologies.map((tech, index) => (
                  <motion.span key={index} className={styles["tech-tag"]} whileHover={reducedMotion ? undefined : { scale: 1.05, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    {tech}
                    <span className={styles["tech-glow"]} />
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className={styles["hero-right"]}>
          <div className={styles["avatar-container"]}>
            {!thumbnailMode ? (
              <Suspense fallback={<div className={styles["avatar-placeholder"]} />}>
                <Avatar3DCanvas />
              </Suspense>
            ) : (
              <div className={styles["avatar-placeholder"]}>
                <div className={styles["avatar-static-img"]}>
                  {content.photoURL ? (
                    <Image src={content.photoURL} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    <span className={styles["avatar-initials"]}>{content.initials}</span>
                  )}
                </div>
              </div>
            )}

            <div className={styles["ring-dots"]} />
            <div className={styles["ring-dots-outer"]} />

            <div className={styles["particle-ring"]}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className={styles.dot} />
              ))}
            </div>

            <div className={styles["avatar-glow"]} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
