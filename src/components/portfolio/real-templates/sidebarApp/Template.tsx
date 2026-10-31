"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

type PageId = "about" | "education" | "skills" | "experience" | "projects" | "certifications" | "contact";

const THEMES = {
  dark: {
    "--primary": "#9dff8e",
    "--secondary": "#a4afb5",
    "--muted": "#6c757d",
    "--bg": "#0c0c0c",
    "--bg-light": "#181818",
    "--texts": "#eeeeee",
    "--texts-inv": "#111111",
    "--container": "#191919",
    "--boards": "#242424",
    "--empty": "#121212",
    "--borders": "#1d1d1d",
    "--badge": "#232323",
  },
  light: {
    "--primary": "#269366",
    "--secondary": "#6b7377",
    "--muted": "#7c8d7f",
    "--bg": "#91d7aa",
    "--bg-light": "#a6e3b8",
    "--texts": "#202521",
    "--texts-inv": "#eeeeee",
    "--container": "#f5faf6",
    "--boards": "#e9f7ed",
    "--empty": "#ffffff",
    "--borders": "#dcefe1",
    "--badge": "#d2e8d8",
  },
} as const;

const NAV: { id: PageId; label: string; icon: string }[] = [
  { id: "about", label: "About me", icon: "◧" },
  { id: "education", label: "Education", icon: "✎" },
  { id: "skills", label: "Skills", icon: "✦" },
  { id: "experience", label: "Experience", icon: "▤" },
  { id: "projects", label: "Portfolio", icon: "❏" },
  { id: "certifications", label: "Achievements", icon: "★" },
  { id: "contact", label: "Contact", icon: "✉" },
];

function Header({ prefix, title, accent }: { prefix: string; title: string; accent: string }) {
  return (
    <header className={styles.sectionHeader}>
      <div className={styles.prefix}>◈ {prefix}</div>
      <h2 className={styles.sectionTitle}>
        {title} <span className={styles.accent}>{accent}</span>
      </h2>
    </header>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className={styles.subTitle}>{children}</h3>;
}

export function SidebarAppTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [page, setPage] = useState<PageId>("about");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const available = NAV.filter((n) => (n.id === "certifications" ? c.certifications.length > 0 : n.id === "education" ? c.education.length > 0 : n.id === "experience" ? c.experience.length > 0 : true));
  const active = available.some((n) => n.id === page) ? page : "about";

  const techFilters = ["All", ...Array.from(new Set(c.projects.flatMap((p) => p.tech))).slice(0, 5)];
  const projects = filter === "All" ? c.projects : c.projects.filter((p) => p.tech.includes(filter));

  function send(e: FormEvent) {
    e.preventDefault();
    if (!c.email) return;
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(form.subject || `Message from ${form.name}`)}&body=${body}`;
  }

  return (
    <div className={styles.app} style={THEMES[mode] as unknown as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Saira:wght@300;400;500;700&display=swap" precedence="default" />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              {c.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photoURL} alt={c.name} />
              ) : (
                <span>{c.initials}</span>
              )}
              <i className={styles.status} />
            </div>
            <div className={styles.profileName}>{c.name}</div>
            <div className={styles.profileRole}>{c.headline.length > 34 ? c.headline.slice(0, 32) + "…" : c.headline}</div>
          </div>

          <nav className={styles.nav}>
            {available.map((n) => (
              <button key={n.id} className={`${styles.navItem} ${active === n.id ? styles.navActive : ""}`} onClick={() => setPage(n.id)}>
                <span className={styles.navIcon}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.sideFooter}>
            <span>SkillOra</span>
            <button className={styles.themeBtn} onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))} aria-label="Toggle theme">
              {mode === "dark" ? "☾" : "☀"}
            </button>
          </div>
        </aside>

        <main className={styles.container}>
          <div key={active} className={styles.page}>
            {active === "about" && (
              <>
                <section id="home" className={styles.block}>
                  <Header prefix="Hello..." title="I'm" accent={`${c.name}!`} />
                  <div className={styles.metaRow}>
                    {c.email && <span>✉ {c.email}</span>}
                    {c.links.filter((l) => l.label !== "Email").map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                        {l.label}: {l.handle}
                      </a>
                    ))}
                  </div>
                  <p className={styles.tagline}>{c.tagline}</p>
                </section>
                <section id="about" className={styles.block}>
                  <SubTitle>
                    A little bit <span className={styles.accent}>about me...</span>
                  </SubTitle>
                  <div className={styles.aboutGrid}>
                    <div className={styles.terminal}>
                      <div className={styles.terminalBar}>
                        <i /> <i /> <i />
                      </div>
                      <pre>{`> whoami\n${c.name}\n> skills --count\n${c.skills.length}\n> projects --live\n${c.projects.length}`}</pre>
                    </div>
                    <p className={styles.bio}>{c.about}</p>
                  </div>
                  <div className={styles.facts}>
                    <div>
                      <strong>{c.projects.length}</strong>
                      <span>Projects</span>
                    </div>
                    <div>
                      <strong>{c.skills.length}</strong>
                      <span>Skills</span>
                    </div>
                    <div>
                      <strong>{c.experience.length + c.education.length}</strong>
                      <span>Milestones</span>
                    </div>
                  </div>
                </section>
              </>
            )}

            {active === "education" && (
              <section id="education" className={styles.block}>
                <Header prefix="This is my" title="Education" accent="Background" />
                <div className={styles.timeline}>
                  {c.education.map((x) => (
                    <article key={x.id} className={styles.board}>
                      <div className={styles.boardHead}>
                        <h4>{x.degree}</h4>
                        <span className={styles.dateBadge}>{x.duration}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span>{x.institution}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {active === "skills" && (
              <section id="skills" className={styles.block}>
                <Header prefix="Explore" title="My" accent="Skill Set" />
                <SubTitle>
                  <span className={styles.accent}>Skills</span> &amp; proficiency
                </SubTitle>
                <div className={styles.skillGrid}>
                  {c.skills.map((s) => (
                    <div key={s.name} className={styles.skill}>
                      <div className={styles.skillHead}>
                        <span>{s.name}</span>
                        <span className={styles.skillPct}>{s.level}%</span>
                      </div>
                      <div className={styles.bar}>
                        <span style={{ width: `${s.level}%` }} />
                      </div>
                    </div>
                  ))}
                  {c.skills.length === 0 && <p className={styles.bio}>Add skills in the portfolio editor.</p>}
                </div>
              </section>
            )}

            {active === "experience" && (
              <section id="experience" className={styles.block}>
                <Header prefix="My professional" title="Work" accent="Experience" />
                <div className={styles.timeline}>
                  {c.experience.map((x) => (
                    <article key={x.id} className={styles.board}>
                      <div className={styles.boardHead}>
                        <h4>{x.title}</h4>
                        <span className={styles.dateBadge}>{x.duration}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span>{x.company}</span>
                      </div>
                      {x.description && (
                        <ul className={styles.bullets}>
                          {x.description
                            .split("\n")
                            .filter(Boolean)
                            .map((l, i) => (
                              <li key={i}>{l}</li>
                            ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {active === "projects" && (
              <section id="projects" className={styles.block}>
                <Header prefix="Take a look at" title="My" accent="Portfolio" />
                <div className={styles.filters}>
                  {techFilters.map((f) => (
                    <button key={f} className={filter === f ? styles.filterOn : ""} onClick={() => setFilter(f)}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className={styles.cards}>
                  {projects.map((p) => (
                    <article key={p.id} className={styles.card}>
                      <div className={styles.cardHead}>
                        <div>
                          <h4 className={styles.cardTitle}>{p.title}</h4>
                          <span className={styles.cardSub}>{p.featured ? "Featured" : "Project"}</span>
                        </div>
                        <div className={styles.cardIcon}>
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt="" />
                          ) : (
                            p.title.slice(0, 1)
                          )}
                        </div>
                      </div>
                      <div className={styles.tags}>
                        {p.tech.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <p className={styles.cardText}>{p.description}</p>
                      <div className={styles.cardLinks}>
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer">
                            ▶ Live
                          </a>
                        )}
                        {p.code && (
                          <a href={p.code} target="_blank" rel="noreferrer">
                            ⌥ Code
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                  {projects.length === 0 && <p className={styles.bio}>No projects to show yet.</p>}
                </div>
              </section>
            )}

            {active === "certifications" && (
              <section id="certifications" className={styles.block}>
                <Header prefix="My" title="Awards &" accent="Achievements" />
                <div className={styles.cards}>
                  {c.certifications.map((x) => (
                    <a key={x.id} href={x.link || undefined} target="_blank" rel="noreferrer" className={`${styles.card} ${styles.certCard}`}>
                      <span className={styles.certStar}>★</span>
                      <div>
                        <h4 className={styles.cardTitle}>{x.title}</h4>
                        {x.issuer && <span className={styles.cardSub}>{x.issuer}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {active === "contact" && (
              <section id="contact" className={styles.block}>
                <Header prefix="Don't hesitate to" title="Contact" accent="Me" />
                <SubTitle>
                  Send me a <span className={styles.accent}>message</span>
                </SubTitle>
                <form className={styles.form} onSubmit={send}>
                  <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input placeholder="E-mail *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input className={styles.wide} placeholder="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  <textarea className={styles.wide} rows={5} placeholder="Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <button type="submit" className={styles.send}>
                    SEND MESSAGE
                  </button>
                </form>
                <SubTitle>
                  Or if you <span className={styles.accent}>prefer...</span>
                </SubTitle>
                <div className={styles.contactGrid}>
                  {c.email && (
                    <a href={`mailto:${c.email}`} className={styles.contactItem}>
                      <span>✉</span>
                      <div>
                        <strong>E-mail</strong>
                        <em>{c.email}</em>
                      </div>
                    </a>
                  )}
                  {c.links
                    .filter((l) => l.label !== "Email")
                    .map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className={styles.contactItem}>
                        <span>↗</span>
                        <div>
                          <strong>{l.label}</strong>
                          <em>{l.handle}</em>
                        </div>
                      </a>
                    ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
