"use client";

import { useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import { gsap, ScrollTrigger } from "./gsap";
import type { TanishContent } from "./adapter";
import styles from "./Contact.module.css";

function GithubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02.005 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.554v-5.57c0-1.328-.023-3.037-1.85-3.037-1.853 0-2.136 1.445-2.136 2.939v5.668H9.357V8.998h3.414v1.561h.047c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V8.998h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const KIND_ICON = { github: GithubIcon, linkedin: LinkedinIcon, email: Mail, other: Mail };

export function Contact({ content, footer, thumbnailMode = false }: { content: TanishContent["contact"]; footer: TanishContent["footer"]; thumbnailMode?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || thumbnailMode) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".contactContent", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".contactContent", start: "top 80%" } });
      gsap.fromTo(".socialLink", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: ".contactContent", start: "top 75%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, [thumbnailMode]);

  return (
    <section ref={sectionRef} id="contact" className={styles.contact}>
      <div className={styles.separator} />

      <div className={`contactContent ${styles.content}`}>
        <span className={styles.eyebrow}>Get In Touch</span>
        <h2 className={styles.headline}>
          Let&apos;s build something
          <br />
          <span className={styles.accent}>remarkable.</span>
        </h2>
        <p className={styles.sub}>Open to internships, freelance work, and collaborations.</p>

        {content.social.length > 0 && (
          <div className={styles.socialLinks}>
            {content.social.map((s) => {
              const Icon = KIND_ICON[s.kind];
              return (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className={`socialLink ${styles.socialCard}`}>
                  <div className={styles.socialIcon}>
                    <Icon width={22} height={22} />
                  </div>
                  <div className={styles.socialText}>
                    <span className={styles.socialLabel}>{s.label.toUpperCase()}</span>
                    <span className={styles.socialHandle}>{s.handle}</span>
                  </div>
                  <span className={styles.socialArrow}>↗</span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} {footer.text}
        </span>
        <span className={styles.footerHeart}>
          Crafted with <span className={styles.heartIcon}>♥</span>
        </span>
      </footer>
    </section>
  );
}
