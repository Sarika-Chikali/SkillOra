"use client";

import { useEffect, useState, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const Island = dynamic(() => import("./Island"), { ssr: false });

type Tab = "about" | "skills" | "quests" | "projects" | "certifications" | "contact";

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "PROFILE" },
  { id: "skills", label: "SKILLS" },
  { id: "quests", label: "QUESTS" },
  { id: "projects", label: "PROJECTS" },
  { id: "certifications", label: "BADGES" },
  { id: "contact", label: "CONTACT" },
];

function Blocks({ level }: { level: number }) {
  const filled = Math.round(level / 10);
  return (
    <span className={styles.blocks} aria-label={`${level}%`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <i key={i} className={i < filled ? styles.blockOn : ""} />
      ))}
    </span>
  );
}

export function RetroIslandTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const [screen, setScreen] = useState<"title" | "sweep" | "workspace">("title");
  const [tab, setTab] = useState<Tab>("about");
  const [leds, setLeds] = useState<boolean[]>(() => Array(12).fill(true));

  useEffect(() => {
    if (thumb) return;
    const t = setInterval(() => setLeds((l) => l.map((_, i) => (i > 7 ? Math.random() > 0.2 : true))), 900);
    return () => clearInterval(t);
  }, [thumb]);

  const tabs = TABS.filter((t) => (t.id === "certifications" ? c.certifications.length > 0 : t.id === "quests" ? c.experience.length + c.education.length > 0 : true));
  const active = tabs.some((t) => t.id === tab) ? tab : "about";

  function start(e: MouseEvent) {
    e.stopPropagation();
    setScreen("sweep");
    setTimeout(() => setScreen("workspace"), 900);
  }
  function back(e: MouseEvent) {
    e.stopPropagation();
    setScreen("title");
  }

  const level = Math.min(99, 1 + c.projects.length * 3 + c.experience.length * 5 + Math.floor(c.skills.length / 2));

  return (
    <div className={styles.app}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Outfit:wght@400;600&display=swap" precedence="default" />

      <div className={`${styles.world} ${screen !== "workspace" ? styles.worldTitle : ""}`}>{thumb ? <div className={styles.islandStatic} /> : <Island />}</div>
      <div className={styles.scanlines} />
      {screen === "sweep" && <div className={styles.sweep} />}

      {screen !== "workspace" && (
        <section id="home" className={styles.title}>
          <div className={styles.signpost}>
            <span>LVL {String(level).padStart(2, "0")}</span>
            <span>{c.projects.length} QUESTS DONE</span>
            <span>{c.skills.length} SKILLS</span>
          </div>
          <div className={styles.banner}>
            <p className={styles.presents}>{c.headline}</p>
            <h1>
              {c.name.toUpperCase()}
              <small>&apos;S PORTFOLIO</small>
            </h1>
            <p className={styles.tag}>{c.tagline}</p>
            <button className={styles.start} onClick={start}>
              ▶ PRESS START
            </button>
          </div>
          <div className={styles.status}>
            <div className={styles.ledRow}>
              {leds.map((on, i) => (
                <i key={i} className={on ? styles.ledOn : ""} />
              ))}
            </div>
            <span>© {c.year} {c.name.toUpperCase()} · BUILT WITH SKILLORA</span>
          </div>
        </section>
      )}

      {screen === "workspace" && (
        <div className={styles.workspace}>
          <div className={styles.topbar}>
            <button className={styles.back} onClick={back}>
              ◀ TITLE
            </button>
            <nav className={styles.tabs}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={active === t.id ? styles.tabOn : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTab(t.id);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          <div className={styles.panel}>
            {active === "about" && (
              <section id="about" className={styles.pane}>
                <div className={styles.profileRow}>
                  <div className={styles.portrait}>
                    {c.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photoURL} alt={c.name} />
                    ) : (
                      <span>{c.initials}</span>
                    )}
                  </div>
                  <div>
                    <h2 className={styles.h2}>{c.name}</h2>
                    <p className={styles.role}>{c.headline}</p>
                    <div className={styles.stats}>
                      <div>
                        <span>LVL</span>
                        <b>{level}</b>
                      </div>
                      <div>
                        <span>QUESTS</span>
                        <b>{c.projects.length}</b>
                      </div>
                      <div>
                        <span>SKILLS</span>
                        <b>{c.skills.length}</b>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.dialog}>
                  <span className={styles.dialogTag}>NPC</span>
                  <p>{c.about}</p>
                </div>
              </section>
            )}

            {active === "skills" && (
              <section id="skills" className={styles.pane}>
                <h2 className={styles.h2}>SKILL TREE</h2>
                <div className={styles.skillGrid}>
                  {c.skills.map((s) => (
                    <div key={s.name} className={styles.skillCard}>
                      <div className={styles.skillHead}>
                        <span>{s.name}</span>
                        <em>{s.level}%</em>
                      </div>
                      <Blocks level={s.level} />
                    </div>
                  ))}
                  {c.skills.length === 0 && <p className={styles.muted}>No skills unlocked yet.</p>}
                </div>
              </section>
            )}

            {active === "quests" && (
              <>
                {c.experience.length > 0 && (
                  <section id="experience" className={styles.pane}>
                    <h2 className={styles.h2}>QUEST LOG</h2>
                    <div className={styles.quests}>
                      {c.experience.map((x) => (
                        <article key={x.id} className={styles.quest}>
                          <div className={styles.questHead}>
                            <h3>{x.title}</h3>
                            <span className={styles.badge}>{x.duration}</span>
                          </div>
                          <p className={styles.role}>{x.company}</p>
                          {x.description && <p className={styles.desc}>{x.description}</p>}
                        </article>
                      ))}
                    </div>
                  </section>
                )}
                {c.education.length > 0 && (
                  <section id="education" className={styles.pane}>
                    <h2 className={styles.h2}>TRAINING</h2>
                    <div className={styles.quests}>
                      {c.education.map((x) => (
                        <article key={x.id} className={styles.quest}>
                          <div className={styles.questHead}>
                            <h3>{x.degree}</h3>
                            <span className={styles.badge}>{x.duration}</span>
                          </div>
                          <p className={styles.role}>{x.institution}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {active === "projects" && (
              <section id="projects" className={styles.pane}>
                <h2 className={styles.h2}>GAME LIBRARY</h2>
                <div className={styles.carts}>
                  {c.projects.map((p) => (
                    <article key={p.id} className={styles.cart}>
                      <div className={styles.cartArt}>
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.title} />
                        ) : (
                          <span>{p.title.slice(0, 1)}</span>
                        )}
                      </div>
                      <h3>{p.title}</h3>
                      <p className={styles.desc}>{p.description}</p>
                      <div className={styles.tags}>
                        {p.tech.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <div className={styles.cartLinks}>
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer">
                            ▶ PLAY
                          </a>
                        )}
                        {p.code && (
                          <a href={p.code} target="_blank" rel="noreferrer">
                            {"</>"} CODE
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                  {c.projects.length === 0 && <p className={styles.muted}>No games in the library yet.</p>}
                </div>
              </section>
            )}

            {active === "certifications" && (
              <section id="certifications" className={styles.pane}>
                <h2 className={styles.h2}>ACHIEVEMENTS</h2>
                <div className={styles.badges}>
                  {c.certifications.map((x) => (
                    <a key={x.id} href={x.link || undefined} target="_blank" rel="noreferrer" className={styles.medal}>
                      <span className={styles.star}>★</span>
                      <b>{x.title}</b>
                      {x.issuer && <em>{x.issuer}</em>}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {active === "contact" && (
              <section id="contact" className={styles.pane}>
                <h2 className={styles.h2}>MULTIPLAYER</h2>
                <p className={styles.desc}>Ready to team up? Send a message and let&apos;s start a new quest.</p>
                <div className={styles.contactGrid}>
                  {c.email && (
                    <a href={`mailto:${c.email}`} className={styles.contactBtn}>
                      ✉ {c.email}
                    </a>
                  )}
                  {c.links
                    .filter((l) => l.label !== "Email")
                    .map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className={styles.contactBtn}>
                        ↗ {l.label.toUpperCase()}
                      </a>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
