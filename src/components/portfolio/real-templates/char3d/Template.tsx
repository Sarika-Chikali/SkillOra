"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const Character = dynamic(() => import("./Character"), { ssr: false });

export function Char3dTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const [slide, setSlide] = useState(0);

  const nameParts = c.name.trim().split(/\s+/);
  const first = nameParts[0] ?? c.name;
  const rest = nameParts.slice(1).join(" ");
  const headWords = c.headline.trim().split(/\s+/);
  const infoTop = headWords.slice(0, Math.ceil(headWords.length / 2)).join(" ");
  const infoBottom = headWords.slice(Math.ceil(headWords.length / 2)).join(" ");

  const half = Math.ceil(c.skills.length / 2);
  const skillBoxes = [c.skills.slice(0, half), c.skills.slice(half)].filter((b) => b.length > 0);
  const project = c.projects[slide % Math.max(c.projects.length, 1)];

  return (
    <div className={styles.app}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" precedence="default" />

      <div className={styles.navWrap}>
        <header className={styles.header}>
          <a href="#home" className={styles.navTitle}>
            {c.initials}
          </a>
          {c.links[0] && (
            <a href={c.links[0].url} target="_blank" rel="noreferrer" className={styles.navConnect}>
              {c.links[0].handle}
            </a>
          )}
          <ul>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#projects">WORK</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
        </header>
      </div>

      <section id="home" className={styles.landing}>
        <div className={styles.glow1} />
        <div className={styles.landingContainer}>
          <div className={styles.intro}>
            <h2>Hello! I&apos;m</h2>
            <h1>
              {first.toUpperCase()}
              {rest && (
                <>
                  <br />
                  <span>{rest.toUpperCase()}</span>
                </>
              )}
            </h1>
          </div>
          <div className={styles.info}>
            <h3>{infoBottom ? "Specialising in" : "I am a"}</h3>
            <h2 className={styles.infoMain}>{infoTop}</h2>
            {infoBottom && <h2 className={styles.infoAccent}>{infoBottom}</h2>}
          </div>
        </div>
        {!thumb && <Character />}
        {thumb && <div className={styles.thumbOrb} />}
        <div className={styles.heroFade} />
      </section>

      <section id="about" className={styles.about}>
        <div className={styles.aboutMe}>
          <h3 className={styles.title}>About Me</h3>
          <p className={styles.para}>{c.about}</p>
        </div>
      </section>

      <section id="skills" className={styles.whatIDo}>
        <div className={styles.whatTitleBox}>
          <h2 className={styles.title}>
            W<span className={styles.italic}>HAT</span>
            <div>
              I<span className={styles.accent}> DO</span>
            </div>
          </h2>
          <p className={styles.whatNote}>{c.tagline}</p>
        </div>
        <div className={styles.whatBoxes}>
          {skillBoxes.map((box, i) => (
            <div key={i} className={styles.whatContent}>
              <span className={`${styles.corner} ${styles.cTL}`} />
              <span className={`${styles.corner} ${styles.cTR}`} />
              <span className={`${styles.corner} ${styles.cBL}`} />
              <span className={`${styles.corner} ${styles.cBR}`} />
              <h3>{i === 0 ? "CORE SKILLS" : "ALSO USING"}</h3>
              <h4>Skillset & proficiency</h4>
              <ul className={styles.skillList}>
                {box.map((s) => (
                  <li key={s.name}>
                    <div className={styles.skillRow}>
                      <span className={styles.tag}>{s.name}</span>
                      <span className={styles.pct}>{s.level}%</span>
                    </div>
                    <div className={styles.bar}>
                      <span style={{ width: `${s.level}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {(c.experience.length > 0 || c.education.length > 0) && (
        <section id="experience" className={styles.career}>
          <h2 className={styles.careerTitle}>
            My career <span>&amp;</span>
            <br /> experience
          </h2>
          <div className={styles.careerInfo}>
            <div className={styles.careerTimeline}>
              <div className={styles.careerDot} />
            </div>
            {c.experience.map((x) => (
              <div key={x.id} className={styles.careerBox}>
                <div className={styles.careerIn}>
                  <div>
                    <h4>{x.title}</h4>
                    <h5>{x.company}</h5>
                  </div>
                  <h3>{x.duration}</h3>
                </div>
                {x.description && <p>{x.description}</p>}
              </div>
            ))}
            {c.education.map((x) => (
              <div key={x.id} className={styles.careerBox}>
                <div className={styles.careerIn}>
                  <div>
                    <h4>{x.degree}</h4>
                    <h5>{x.institution}</h5>
                  </div>
                  <h3>{x.duration}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="projects" className={styles.work}>
        <h2 className={styles.workTitle}>
          My <span>Work</span>
        </h2>
        {project ? (
          <div className={styles.workSlide}>
            <div className={styles.workInfo}>
              <div className={styles.workNum}>
                <h3>{String(((slide % c.projects.length) + 1)).padStart(2, "0")}</h3>
              </div>
              <div>
                <h4>{project.title}</h4>
                <p className={styles.workCat}>{project.tech.length ? project.tech.join(" · ") : "Project"}</p>
                {project.description && <p className={styles.workDesc}>{project.description}</p>}
                <div className={styles.workLinks}>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                  {project.code && (
                    <a href={project.code} target="_blank" rel="noreferrer">
                      Code ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.workImage}>
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={project.title} />
              ) : (
                <div className={styles.workPlaceholder}>{project.title.slice(0, 1)}</div>
              )}
            </div>
          </div>
        ) : (
          <p className={styles.workDesc}>Add projects to see them here.</p>
        )}
        {c.projects.length > 1 && (
          <div className={styles.workNav}>
            <button aria-label="Previous project" onClick={() => setSlide((s) => (s - 1 + c.projects.length) % c.projects.length)}>
              ←
            </button>
            <div className={styles.dots}>
              {c.projects.map((p, i) => (
                <button key={p.id} aria-label={`Project ${i + 1}`} className={i === slide % c.projects.length ? styles.dotActive : ""} onClick={() => setSlide(i)} />
              ))}
            </div>
            <button aria-label="Next project" onClick={() => setSlide((s) => (s + 1) % c.projects.length)}>
              →
            </button>
          </div>
        )}
      </section>

      {c.certifications.length > 0 && (
        <section id="certifications" className={styles.certs}>
          <h2 className={styles.title}>Certifications</h2>
          <div className={styles.certGrid}>
            {c.certifications.map((x) => (
              <a key={x.id} href={x.link || undefined} target="_blank" rel="noreferrer" className={styles.certCard}>
                <h4>{x.title}</h4>
                {x.issuer && <p>{x.issuer}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      <section id="contact" className={styles.contact}>
        <div className={styles.contactWrap}>
          <div>
            <h3 className={styles.title}>Contact</h3>
            <p className={styles.contactLead}>Let&apos;s build something together.</p>
            {c.email && (
              <a href={`mailto:${c.email}`} className={styles.contactEmail}>
                {c.email}
              </a>
            )}
          </div>
          <div className={styles.contactLinks}>
            <h4>Social</h4>
            {c.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
          <div className={styles.contactMade}>
            <h2>
              Designed and Developed <br /> by <span>{c.name}</span>
            </h2>
            <h5>
              © {c.year} · Built with SkillOra
            </h5>
          </div>
        </div>
      </section>
    </div>
  );
}
