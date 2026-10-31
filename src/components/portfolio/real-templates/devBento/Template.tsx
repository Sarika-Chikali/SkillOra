"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const THEMES = {
  dark: {
    "--bg": "#09090b",
    "--text": "#f4f4f5",
    "--text-muted": "#a1a1aa",
    "--accent": "#818cf8",
    "--accent-2": "#c084fc",
    "--accent-soft": "rgba(129, 140, 248, 0.14)",
    "--glow1": "rgba(99, 102, 241, 0.18)",
    "--glow2": "rgba(168, 85, 247, 0.12)",
    "--surface": "#141417",
    "--surface-2": "#1b1b1f",
    "--border": "rgba(255, 255, 255, 0.08)",
    "--navbar-bg": "rgba(9, 9, 11, 0.62)",
    "--timeline-line": "#27272a",
    "--shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.40), 0 4px 16px rgba(0, 0, 0, 0.40)",
    "--shadow-md": "0 8px 24px rgba(0, 0, 0, 0.55), 0 16px 48px rgba(0, 0, 0, 0.60)",
  },
  light: {
    "--bg": "#f4f4f6",
    "--text": "#18181b",
    "--text-muted": "#52525b",
    "--accent": "#4f46e5",
    "--accent-2": "#7c3aed",
    "--accent-soft": "rgba(79, 70, 229, 0.12)",
    "--glow1": "rgba(79, 70, 229, 0.10)",
    "--glow2": "rgba(124, 58, 237, 0.08)",
    "--surface": "#ffffff",
    "--surface-2": "#fafafa",
    "--border": "rgba(0, 0, 0, 0.08)",
    "--navbar-bg": "rgba(244, 244, 246, 0.72)",
    "--timeline-line": "#e4e4e7",
    "--shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)",
    "--shadow-md": "0 8px 24px rgba(0, 0, 0, 0.10), 0 16px 48px rgba(0, 0, 0, 0.12)",
  },
} as const;

function useTypewriter(strings: string[], enabled: boolean) {
  const [text, setText] = useState(enabled ? "" : strings[0] ?? "");
  const key = strings.join("|");
  useEffect(() => {
    if (!enabled || strings.length === 0) {
      setText(strings[0] ?? "");
      return;
    }
    let i = 0;
    let n = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = strings[i % strings.length];
      if (!deleting) {
        n++;
        setText(word.slice(0, n));
        if (n === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
        timer = setTimeout(tick, 60);
      } else {
        n--;
        setText(word.slice(0, n));
        if (n === 0) {
          deleting = false;
          i++;
        }
        timer = setTimeout(tick, 30);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  return text;
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className={styles.header}>{title}</h2>;
}

export function DevBentoTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [showAll, setShowAll] = useState(false);

  const roles = [c.headline, ...(c.skills.length ? [`skilled in ${c.skills.slice(0, 3).map((s) => s.name).join(", ")}`] : [])];
  const typed = useTypewriter(roles, !thumb);

  const skillGroups: { title: string; items: typeof c.skills }[] = [];
  const perGroup = 6;
  for (let i = 0; i < c.skills.length; i += perGroup) {
    skillGroups.push({ title: i === 0 ? "Core skills" : i === perGroup ? "Also working with" : `More skills ${i / perGroup - 0}`, items: c.skills.slice(i, i + perGroup) });
  }

  const visibleProjects = showAll ? c.projects : c.projects.slice(0, 6);
  const nav = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    ...(c.experience.length ? [{ href: "#experience", label: "Experience" }] : []),
    { href: "#projects", label: "Projects" },
    ...(c.certifications.length ? [{ href: "#certifications", label: "Certifications" }] : []),
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className={styles.app} style={THEMES[mode] as unknown as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        precedence="default"
      />

      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <a href="#home" className={styles.brand}>
            {c.initials}
          </a>
          <div className={styles.navRight}>
            {nav.map((n) => (
              <a key={n.href} href={n.href} className={styles.navLink}>
                {n.label}
              </a>
            ))}
            <button className={styles.themeToggle} onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))} aria-label="Toggle theme">
              {mode === "dark" ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className={styles.hero}>
        <div className={styles.bento}>
          <div className={`${styles.tile} ${styles.heroIntro} ${styles.span4} ${styles.rspan2}`}>
            <span className={styles.eyebrow}>Open to building cool things</span>
            <h1 className={styles.heroName}>{c.name}</h1>
            <div className={styles.heroRoles}>
              <span>I&apos;m&nbsp;</span>
              <span className={styles.typed}>{typed}</span>
              <span className={styles.caret}>|</span>
            </div>
            <p className={styles.heroTagline}>{c.tagline}</p>
            <div className={styles.heroCta}>
              <a className={`${styles.btnPill} ${styles.btnAccent}`} href="#projects">
                View my work
              </a>
              <a className={`${styles.btnPill} ${styles.btnGhost}`} href="#about">
                About me
              </a>
            </div>
          </div>
          <div className={`${styles.tile} ${styles.tileAccent} ${styles.monogram} ${styles.span2}`}>
            <span className={styles.monogramMark}>{c.initials}</span>
            <span className={styles.monogramLabel}>{c.name}</span>
          </div>
          <div className={`${styles.tile} ${styles.heroSocial} ${styles.span2}`}>
            <span className={styles.tileLabel}>Find me</span>
            <div className={styles.social}>
              {c.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className={styles.socialPill} title={l.handle}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about">
        <SectionHeader title="About" />
        <div className={styles.container}>
          <div className={styles.bento}>
            <div className={`${styles.tile} ${styles.aboutBio} ${styles.span4} ${styles.rspan2}`}>
              <p>{c.about}</p>
            </div>
            <div className={`${styles.tile} ${styles.aboutImage} ${styles.span2} ${styles.rspan2}`}>
              {c.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photoURL} alt={c.name} />
              ) : (
                <div className={styles.aboutMono}>{c.initials}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <SectionHeader title="Skills" />
        <div className={styles.container}>
          <div className={styles.bento}>
            {skillGroups.map((g) => (
              <div key={g.title} className={`${styles.tile} ${styles.tileInteractive} ${styles.skillTile} ${styles.span2}`}>
                <h3 className={styles.skillTitle}>{g.title}</h3>
                <ul className={styles.skillList}>
                  {g.items.map((s) => (
                    <li key={s.name}>
                      <div className={styles.skillRow}>
                        <span>{s.name}</span>
                        <span className={styles.skillPct}>{s.level}%</span>
                      </div>
                      <div className={styles.skillBar}>
                        <span style={{ width: `${s.level}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {skillGroups.length === 0 && <div className={`${styles.tile} ${styles.span6}`}>Add skills in the portfolio editor.</div>}
          </div>
        </div>
      </section>

      {c.experience.length > 0 && (
        <section id="experience">
          <SectionHeader title="Experience" />
          <div className={styles.container}>
            <div className={styles.tl}>
              {c.experience.map((x) => (
                <div className={styles.tlItem} key={x.id}>
                  <div className={styles.tlDot} />
                  <div className={styles.tlCard}>
                    <div className={styles.tlDate}>{x.duration}</div>
                    <h3 className={styles.tlTitle}>{x.title}</h3>
                    <div className={styles.tlSub}>
                      <span className={styles.accent}>{x.company}</span>
                    </div>
                    {x.description && (
                      <ul className={styles.tlList}>
                        {x.description
                          .split("\n")
                          .filter(Boolean)
                          .map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.education.length > 0 && (
        <section id="education">
          <SectionHeader title="Education" />
          <div className={styles.container}>
            <div className={styles.tl}>
              {c.education.map((x) => (
                <div className={styles.tlItem} key={x.id}>
                  <div className={styles.tlDot} />
                  <div className={styles.tlCard}>
                    <div className={styles.tlDate}>{x.duration}</div>
                    <h3 className={styles.tlTitle}>{x.degree}</h3>
                    <div className={styles.tlSub}>{x.institution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="projects">
        <SectionHeader title="Projects" />
        <div className={styles.container}>
          <div className={styles.bento}>
            {visibleProjects.map((p, i) => (
              <article key={p.id} className={`${styles.tile} ${styles.tileInteractive} ${styles.projectCard} ${i === 0 ? `${styles.span4} ${styles.featured}` : styles.span2}`}>
                <div className={styles.projectMedia}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div className={styles.mediaPlaceholder}>{p.title.slice(0, 1)}</div>
                  )}
                </div>
                <div className={styles.projectBody}>
                  <h3 className={styles.projectTitle}>{p.title}</h3>
                  <p className={styles.projectText}>{p.description}</p>
                </div>
                <div className={styles.projectFooter}>
                  {(p.live || p.code) && (
                    <div className={styles.projectLinks}>
                      {p.live && (
                        <a className={styles.projLink} href={p.live} target="_blank" rel="noreferrer">
                          Live ↗
                        </a>
                      )}
                      {p.code && (
                        <a className={styles.projLink} href={p.code} target="_blank" rel="noreferrer">
                          Code ↗
                        </a>
                      )}
                    </div>
                  )}
                  {p.tech.length > 0 && (
                    <div className={styles.projectTags}>
                      {p.tech.map((t) => (
                        <span key={t} className={styles.projectTag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {c.projects.length === 0 && <div className={`${styles.tile} ${styles.span6}`}>Publish a project to see it here.</div>}
          </div>
          {!showAll && c.projects.length > 6 && (
            <div className={styles.more}>
              <button type="button" className={`${styles.btnPill} ${styles.btnGhost}`} onClick={() => setShowAll(true)}>
                Show more
              </button>
            </div>
          )}
        </div>
      </section>

      {c.certifications.length > 0 && (
        <section id="certifications">
          <SectionHeader title="Certifications" />
          <div className={styles.container}>
            <div className={styles.bento}>
              {c.certifications.map((x) => (
                <a key={x.id} href={x.link || undefined} target="_blank" rel="noreferrer" className={`${styles.tile} ${styles.tileInteractive} ${styles.certTile} ${styles.span2}`}>
                  <span className={styles.tileLabel}>Certificate</span>
                  <h3 className={styles.skillTitle}>{x.title}</h3>
                  {x.issuer && <p className={styles.certIssuer}>{x.issuer}</p>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact">
        <SectionHeader title="Contact" />
        <div className={styles.container}>
          <div className={styles.bento}>
            <div className={`${styles.tile} ${styles.span4}`}>
              <span className={styles.tileLabel}>Say hello</span>
              <p className={styles.contactLead}>Have a project in mind, or just want to chat? My inbox is open.</p>
              {c.email && (
                <a className={`${styles.btnPill} ${styles.btnAccent}`} href={`mailto:${c.email}`}>
                  {c.email}
                </a>
              )}
            </div>
            <div className={`${styles.tile} ${styles.span2}`}>
              <span className={styles.tileLabel}>Elsewhere</span>
              <div className={styles.contactLinks}>
                {c.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        © {c.year} {c.name} · Built with SkillOra
      </footer>
    </div>
  );
}
