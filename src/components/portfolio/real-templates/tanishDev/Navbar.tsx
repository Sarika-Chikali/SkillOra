"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";
import type { TanishContent } from "./adapter";
import styles from "./Navbar.module.css";

export function Navbar({ content }: { content: TanishContent["navbar"] }) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <span className={styles.logoText}>{content.brand}.</span>
        <span className={styles.logoSub}>{content.brandFull.split(" ")[0]}</span>
      </div>

      <ul className={styles.links}>
        {content.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.link} onClick={(e) => handleNavClick(e, link.href)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a href={content.ctaHref} target="_blank" rel="noreferrer" className={styles.cta}>
        Connect ↗
      </a>
    </nav>
  );
}
