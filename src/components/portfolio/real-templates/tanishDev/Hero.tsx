"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMouseParallax } from "./useMouseParallax";
import type { TanishContent } from "./adapter";
import styles from "./Hero.module.css";

const HeroScene3D = dynamic(() => import("./HeroScene3D").then((m) => m.HeroScene3D), { ssr: false, loading: () => null });

const LINE_CLASSES = ["line1", "line2", "line3", "line4"] as const;

export function Hero({ content, thumbnailMode = false }: { content: TanishContent["hero"]; thumbnailMode?: boolean }) {
  const mouseRef = useMouseParallax();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!heroRef.current || thumbnailMode) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [thumbnailMode]);

  function handleScrollTo(e: React.MouseEvent<HTMLAnchorElement>, target: string) {
    e.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }

  const show3D = !thumbnailMode;

  return (
    <section ref={heroRef} className={styles.hero} id="home" style={{ backgroundColor: "#000000" }}>
      <div className={styles.canvas} style={{ pointerEvents: "none", zIndex: 0 }}>
        {show3D ? (
          <Suspense fallback={null}>
            <HeroScene3D mouseRef={mouseRef} inView={inView} />
          </Suspense>
        ) : (
          content.photoURL && (
            <div className={styles.staticAvatar}>
              <Image src={content.photoURL} alt="" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
          )
        )}
      </div>

      <div className={styles.content}>
        <motion.div className={styles.badge} animate={thumbnailMode ? undefined : { opacity: [0.85, 1, 0.85], scale: [0.99, 1.02, 0.99] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <span className={styles.dot} />
          {content.badge}
        </motion.div>

        <h1 className={styles.headline}>
          {content.lines.map((line, i) => (
            <span key={i} className={styles[LINE_CLASSES[i]]}>
              {line.accent ? <span className={styles.accent}>{line.text}</span> : line.text}
            </span>
          ))}
        </h1>

        <p className={styles.subtext}>{content.subtext}</p>

        <div className={styles.ctas}>
          <a href="#projects" className={styles.primaryCta} onClick={(e) => handleScrollTo(e, "#projects")}>
            View Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className={styles.secondaryCta} onClick={(e) => handleScrollTo(e, "#contact")}>
            Get in Touch
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll to explore</span>
      </div>
    </section>
  );
}
