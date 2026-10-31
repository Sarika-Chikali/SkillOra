"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const Room = dynamic(() => import("./Room"), { ssr: false });

type PaneId = "about" | "skills" | "education" | "experience" | "projects" | "certifications" | "contact";

const SIDEBAR: { id: PaneId; label: string; icon: string }[] = [
  { id: "about", label: "About Me", icon: "👤" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "projects", label: "Projects", icon: "🗂" },
  { id: "certifications", label: "Certificates", icon: "🏅" },
  { id: "contact", label: "Contact", icon: "✉️" },
];

export function Room3dTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const [night, setNight] = useState(false);
  const [pane, setPane] = useState<PaneId>("about");
  const [selected, setSelected] = useState<string | null>(null);

  const available = SIDEBAR.filter((s) => (s.id === "education" ? c.education.length > 0 : s.id === "experience" ? c.experience.length > 0 : s.id === "certifications" ? c.certifications.length > 0 : true));
  const active = available.some((s) => s.id === pane) ? pane : "about";
  const current = available.find((s) => s.id === active)!;
  const project = c.projects.find((p) => p.id === selected) ?? null;

  function pick(target: "about" | "skills" | "projects" | "experience") {
    setPane(target);
    setSelected(null);
    document.getElementById("finder")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className={`${styles.app} ${night ? styles.night : ""}`}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap" precedence="default" />

      <header className={styles.topbar}>
        <span className={styles.brand}>{c.initials}</span>
        <nav>
          {available.slice(0, 4).map((s) => (
            <button key={s.id} onClick={() => pick(s.id as "about")} className={active === s.id ? styles.topActive : ""}>
              {s.label}
            </button>
          ))}
          <button className={styles.modeBtn} onClick={() => setNight((n) => !n)} aria-label="Toggle lights">
            {night ? "☀ Lights on" : "☾ Lights off"}
          </button>
        </nav>
      </header>

      <section id="home" className={styles.hero}>
        <div className={styles.canvas}>{thumb ? <div className={styles.roomStatic} /> : <Room night={night} onPick={pick} />}</div>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Welcome to my room</p>
          <h1>{c.name}</h1>
          <p className={styles.headline}>{c.headline}</p>
          <p className={styles.hint}>Drag to look around · click the monitor, keyboard, shelf or frames</p>
        </div>
      </section>

      <section id="finder" className={styles.finderWrap}>
        <div className={styles.finder}>
          <div className={styles.titlebar}>
            <span className={styles.dots}>
              <i style={{ background: "#ff5f57" }} />
              <i style={{ background: "#febc2e" }} />
              <i style={{ background: "#28c840" }} />
            </span>
            <span className={styles.path}>
              {c.firstName} <b>›</b> {current.label}
            </span>
          </div>
          <div className={styles.finderBody}>
            <aside className={styles.sidebar}>
              <p>Favorites</p>
              {available.map((s) => (
                <button key={s.id} className={active === s.id ? styles.sideOn : ""} onClick={() => { setPane(s.id); setSelected(null); }}>
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </aside>

            <div className={styles.pane}>
              {active === "about" && (
                <section id="about" className={styles.block}>
                  <div className={styles.aboutHead}>
                    <div className={styles.avatar}>
                      {c.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.photoURL} alt={c.name} />
                      ) : (
                        c.initials
                      )}
                    </div>
                    <div>
                      <h2>{c.name}</h2>
                      <p className={styles.muted}>{c.headline}</p>
                    </div>
                  </div>
                  <div className={styles.doc}>
                    <span className={styles.docName}>About Me.md</span>
                    <p>{c.tagline}</p>
                    <p>{c.about}</p>
                  </div>
                </section>
              )}

              {active === "skills" && (
                <section id="skills" className={styles.block}>
                  <h2 className={styles.paneTitle}>Skills</h2>
                  <div className={styles.rows}>
                    {c.skills.map((s) => (
                      <div key={s.name} className={styles.skillRow}>
                        <span className={styles.fileIcon}>⚡</span>
                        <span className={styles.fileName}>{s.name}</span>
                        <span className={styles.meter}>
                          <span style={{ width: `${s.level}%` }} />
                        </span>
                        <span className={styles.pct}>{s.level}%</span>
                      </div>
                    ))}
                    {c.skills.length === 0 && <p className={styles.muted}>No skills yet.</p>}
                  </div>
                </section>
              )}

              {active === "education" && (
                <section id="education" className={styles.block}>
                  <h2 className={styles.paneTitle}>Education</h2>
                  <div className={styles.rows}>
                    {c.education.map((x) => (
                      <div key={x.id} className={styles.fileRow}>
                        <span className={styles.fileIcon}>🎓</span>
                        <span className={styles.fileName}>
                          {x.degree}
                          <em>{x.institution}</em>
                        </span>
                        <span className={styles.date}>{x.duration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {active === "experience" && (
                <section id="experience" className={styles.block}>
                  <h2 className={styles.paneTitle}>Experience</h2>
                  <div className={styles.rows}>
                    {c.experience.map((x) => (
                      <div key={x.id} className={styles.fileRowTall}>
                        <span className={styles.fileIcon}>💼</span>
                        <span className={styles.fileName}>
                          {x.title}
                          <em>{x.company}</em>
                          {x.description && <small>{x.description}</small>}
                        </span>
                        <span className={styles.date}>{x.duration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {active === "projects" && (
                <section id="projects" className={styles.block}>
                  <h2 className={styles.paneTitle}>Projects</h2>
                  {!project ? (
                    <div className={styles.folderGrid}>
                      {c.projects.map((p) => (
                        <button key={p.id} className={styles.folder} onClick={() => setSelected(p.id)}>
                          <span className={styles.folderIcon}>{p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt="" />
                          ) : "📁"}</span>
                          <span>{p.title}</span>
                        </button>
                      ))}
                      {c.projects.length === 0 && <p className={styles.muted}>No projects yet.</p>}
                    </div>
                  ) : (
                    <div className={styles.detail}>
                      <button className={styles.back} onClick={() => setSelected(null)}>
                        ‹ Back
                      </button>
                      <h3>{project.title}</h3>
                      {project.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.image} alt={project.title} className={styles.shot} />
                      )}
                      <p>{project.description}</p>
                      <div className={styles.tags}>
                        {project.tech.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <div className={styles.links}>
                        {project.live && (
                          <a href={project.live} target="_blank" rel="noreferrer">
                            Open live ↗
                          </a>
                        )}
                        {project.code && (
                          <a href={project.code} target="_blank" rel="noreferrer">
                            View code ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {active === "certifications" && (
                <section id="certifications" className={styles.block}>
                  <h2 className={styles.paneTitle}>Certificates</h2>
                  <div className={styles.rows}>
                    {c.certifications.map((x) => (
                      <a key={x.id} href={x.link || undefined} target="_blank" rel="noreferrer" className={styles.fileRow}>
                        <span className={styles.fileIcon}>🏅</span>
                        <span className={styles.fileName}>
                          {x.title}
                          {x.issuer && <em>{x.issuer}</em>}
                        </span>
                        <span className={styles.date}>PDF</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {active === "contact" && (
                <section id="contact" className={styles.block}>
                  <h2 className={styles.paneTitle}>Contact</h2>
                  <div className={styles.rows}>
                    {c.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className={styles.fileRow}>
                        <span className={styles.fileIcon}>🔗</span>
                        <span className={styles.fileName}>
                          {l.label}
                          <em>{l.handle}</em>
                        </span>
                        <span className={styles.date}>Open ↗</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
        <p className={styles.footer}>
          © {c.year} {c.name} · Built with SkillOra
        </p>
      </section>
    </div>
  );
}
