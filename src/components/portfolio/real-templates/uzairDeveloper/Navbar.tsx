"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { UzairContent } from "./adapter";
import styles from "./Navbar.module.css";

export function Navbar({ content }: { content: UzairContent["navbar"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSection(id: string) {
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  }

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles["nav-container"]}>
        <div className={styles["nav-brand"]} onClick={() => scrollToSection("#home")}>
          <div className={styles["brand-glow"]} />
          <span className={styles["brand-dot"]} />
          <span className={styles["brand-text"]}>{content.brand}</span>
        </div>

        <ul className={`${styles["nav-links"]} ${open ? styles.open : ""}`}>
          {content.links.map((link, i) => (
            <motion.li key={link.label} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.label}
                <span className={styles["link-underline"]} />
              </a>
            </motion.li>
          ))}
          <li className={styles["mobile-cta"]}>
            <button className={styles["btn-glow"]} onClick={() => scrollToSection("#contact")}>
              <span className={styles["btn-text"]}>{content.cta}</span>
              <span className={styles["btn-shimmer"]} />
            </button>
          </li>
        </ul>

        <button className={styles["nav-cta"]} onClick={() => scrollToSection("#contact")}>
          <span className={styles["btn-text"]}>{content.cta}</span>
          <span className={styles["btn-shimmer"]} />
        </button>

        <button className={`${styles.burger} ${open ? styles.open : ""}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span />
          <span />
        </button>
      </div>
    </motion.nav>
  );
}
