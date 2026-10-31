"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const PANELS = ["#d9d6cc", "#c7d0c3", "#cfc4b8", "#c3cbd3", "#d6c9c9", "#ccd3b8"];

function Reveal({ children, still, className, delay = 0 }: { children: ReactNode; still: boolean; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [still]);
  return (
    <div ref={ref} className={`${styles.reveal} ${on ? styles.revealOn : ""} ${className ?? ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function AwwwardsTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const [menu, setMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSkill, setOpenSkill] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 853px)");
    setIsMobile(mq.matches);
    const on = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const nav = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Work" },
    { href: "#contact", label: "Contact" },
  ];
  const marquee = c.skills.length ? c.skills.map((s) => s.name) : ["Design", "Code", "Motion"];
  const nameLine = c.name.replace(/\s+/g, " ");

  return (
    <div className={styles.app}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Archivo+Narrow:wght@400;500&display=swap" precedence="default" />

      <div className={styles.navWrap}>
        <button className={styles.burger} aria-label="Menu" onClick={() => setMenu((m) => !m)}>
          <span className={menu ? styles.b1x : ""} />
          <span className={menu ? styles.b2x : ""} />
        </button>
        <div className={`${styles.menu} ${menu ? styles.menuOpen : ""}`}>
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} style={{ transitionDelay: menu ? `${120 + i * 70}ms` : "0ms" }}>
                <a href={n.href} onClick={() => setMenu(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.menuLinks}>
            {c.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <section id="home" className={styles.hero}>
        <figure className={styles.planet}>{thumb ? <div className={styles.planetStatic} /> : <Scene isMobile={isMobile} />}</figure>
        <div className={styles.heroText}>
          <p className={styles.sub}>{c.headline}</p>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>{nameLine}</h1>
            <div className={styles.rule} />
          </div>
          <p className={styles.heroCopy}>{c.tagline}</p>
        </div>
      </section>

      <section id="about" className={styles.about}>
        <Reveal still={thumb}>
          <p className={styles.eyebrow}>Introduction</p>
        </Reveal>
        <Reveal still={thumb} delay={80}>
          <p className={styles.statement}>{c.about}</p>
        </Reveal>
        <div className={styles.stats}>
          {[
            [String(c.projects.length).padStart(2, "0"), "Projects"],
            [String(c.skills.length).padStart(2, "0"), "Skills"],
            [String(c.experience.length + c.education.length).padStart(2, "0"), "Milestones"],
          ].map(([n, l]) => (
            <div key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" className={styles.skills}>
        <Reveal still={thumb}>
          <h2 className={styles.h2}>Skills</h2>
        </Reveal>
        <ul className={styles.skillList}>
          {c.skills.map((s, i) => (
            <li key={s.name} className={`${styles.skillRow} ${openSkill === s.name ? styles.skillOpen : ""}`} onMouseEnter={() => setOpenSkill(s.name)} onMouseLeave={() => setOpenSkill(null)} onClick={() => setOpenSkill(openSkill === s.name ? null : s.name)}>
              <span className={styles.skillIdx}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.skillName}>{s.name}</span>
              <span className={styles.skillMeter}>
                <span style={{ width: `${s.level}%` }} />
              </span>
              <span className={styles.skillPct}>{s.level}%</span>
            </li>
          ))}
          {c.skills.length === 0 && <li className={styles.skillRow}>Add skills in the editor.</li>}
        </ul>
      </section>

      {(c.experience.length > 0 || c.education.length > 0) && (
        <section id="experience" className={styles.exp}>
          <Reveal still={thumb}>
            <h2 className={`${styles.h2} ${styles.h2Dark}`}>Journey</h2>
          </Reveal>
          <div id="education" className={styles.table}>
            {c.experience.map((x) => (
              <div key={x.id} className={styles.tr}>
                <span className={styles.tdYear}>{x.duration}</span>
                <span className={styles.tdMain}>
                  {x.title}
                  <em>{x.company}</em>
                </span>
                <span className={styles.tdDesc}>{x.description}</span>
              </div>
            ))}
            {c.education.map((x) => (
              <div key={x.id} className={styles.tr}>
                <span className={styles.tdYear}>{x.duration}</span>
                <span className={styles.tdMain}>
                  {x.degree}
                  <em>{x.institution}</em>
                </span>
                <span className={styles.tdDesc}>Education</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="projects" className={styles.works}>
        <Reveal still={thumb}>
          <h2 className={`${styles.h2} ${styles.h2Dark}`}>Selected Work</h2>
        </Reveal>
        <div className={styles.workList}>
          {c.projects.map((p, i) => (
            <Reveal key={p.id} still={thumb}>
              <article className={styles.work} style={{ background: PANELS[i % PANELS.length] }}>
                <div className={styles.workMedia}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <span>{p.title.slice(0, 1)}</span>
                  )}
                </div>
                <div className={styles.workInfo}>
                  <span className={styles.workNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className={styles.workTags}>
                    {p.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className={styles.workLinks}>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer">
                        Live ↗
                      </a>
                    )}
                    {p.code && (
                      <a href={p.code} target="_blank" rel="noreferrer">
                        Code ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          {c.projects.length === 0 && <p className={styles.empty}>Publish a project to see it here.</p>}
        </div>
      </section>

      {c.certifications.length > 0 && (
        <section id="certifications" className={styles.certs}>
          <Reveal still={thumb}>
            <h2 className={styles.h2}>Certifications</h2>
          </Reveal>
          <div className={styles.certGrid}>
            {c.certifications.map((x, i) => (
              <a key={x.id} href={x.link || undefined} target="_blank" rel="noreferrer" className={styles.cert}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{x.title}</strong>
                {x.issuer && <em>{x.issuer}</em>}
              </a>
            ))}
          </div>
        </section>
      )}

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => (
            <span key={i}>
              {m} <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <section id="contact" className={styles.contact}>
        <p className={styles.eyebrowLight}>Got a project in mind?</p>
        <h2 className={styles.contactTitle}>Let&apos;s work together</h2>
        {c.email && (
          <a href={`mailto:${c.email}`} className={styles.email}>
            {c.email}
          </a>
        )}
        <div className={styles.socials}>
          {c.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
        <p className={styles.copy}>
          © {c.year} {c.name} · Built with SkillOra
        </p>
      </section>
    </div>
  );
}
