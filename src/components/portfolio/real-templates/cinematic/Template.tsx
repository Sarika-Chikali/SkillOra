"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const VideoScrub = dynamic(() => import("./VideoScrub"), { ssr: false });

// Word-by-word blur-in (the source's BlurText), triggered once when scrolled
// into view; renders plainly when `still` (thumbnails).
function BlurWords({ text, className, still }: { text: string; className?: string; still: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
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
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [still]);
  const words = text.split(/(\s+)/);
  let i = 0;
  return (
    <p ref={ref} className={className}>
      {words.map((w, k) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <span key={k} className={`${styles.word} ${on ? styles.wordOn : ""}`} style={{ transitionDelay: `${Math.min(i++ * 28, 1400)}ms` }}>
            {w}
          </span>
        )
      )}
    </p>
  );
}

function Reveal({ children, still, className }: { children: ReactNode; still: boolean; className?: string }) {
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
      { threshold: 0.12 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [still]);
  return (
    <div ref={ref} className={`${styles.reveal} ${on ? styles.revealOn : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function CinematicTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const paragraphs = c.about.split(/\n+/).filter(Boolean);
  const heroParas = [c.tagline, ...paragraphs.slice(0, 1)].filter(Boolean);
  const nameChars = `${c.name}.`.split("");

  const nav = [
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  function send(e: FormEvent) {
    e.preventDefault();
    if (!c.email) return;
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(`Hello from ${form.name}`)}&body=${body}`;
  }

  return (
    <div className={styles.app} ref={wrapRef}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Playfair+Display:ital,wght@1,400&display=swap" precedence="default" />

      {thumb ? (
        <div className={styles.videoLayer}>
          <div className={styles.poster} />
          <div className={styles.shade1} />
          <div className={styles.shade2} />
          <div className={styles.shade3} />
        </div>
      ) : (
        <VideoScrub wrapperRef={wrapRef} />
      )}
      <div className={styles.grain} />

      <div className={styles.navWrap}>
        <nav className={styles.nav}>
          <div className={styles.navShade} />
          <a href="#home" className={styles.logo}>
            {c.name}
          </a>
          <ul className={styles.navLinks}>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href="#contact" className={styles.startBtn}>
                Start Now
              </a>
            </li>
          </ul>
          <button className={styles.burger} aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            <span />
            <span />
            <span />
          </button>
        </nav>
        {menu && (
          <div className={styles.mobileMenu}>
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenu(false)}>
                {n.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <section id="home" className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.label}>{c.headline}</p>
            <h1 className={styles.heroTitle}>
              <span className={`${styles.ghost} ${styles.heroGhost}`}>Hey, I&apos;m</span>
              <span className={styles.heroName}>
                {nameChars.map((ch, i) => (
                  <span key={i} className={styles.letter} style={{ animationDelay: `${0.7 + i * 0.06}s` }}>
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            </h1>
            <div className={styles.heroSub}>
              {heroParas.map((t, i) => (
                <BlurWords key={i} text={t} still={thumb} className={i === 0 ? styles.p1 : styles.p2} />
              ))}
              <p className={styles.explore}>Explore ↓</p>
            </div>
          </div>
        </section>

        <section id="about" className={styles.about}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutLeft}>
              <Reveal still={thumb}>
                <p className={styles.label}>About</p>
                <h2 className={styles.h2}>
                  <span>A little</span>
                  <span>bit about</span>
                  <span className={styles.ghost}>me.</span>
                </h2>
              </Reveal>
              {paragraphs.map((t, i) => (
                <BlurWords key={i} text={t} still={thumb} className={styles.bio} />
              ))}
              {c.links[0] && (
                <a href={c.links[0].url} target="_blank" rel="noreferrer" className={styles.pillBtn}>
                  {c.links[0].label} →
                </a>
              )}
            </div>

            <div className={styles.aboutRight}>
              <div className={styles.rule} />
              <div className={styles.group}>
                <p className={styles.groupTitle}>
                  <span>Tech I Work With</span>
                </p>
                <div className={styles.pills}>
                  {c.skills.map((s) => (
                    <span key={s.name} className={styles.pill} title={`${s.level}%`}>
                      {s.name}
                      <em>{s.level}%</em>
                      <i style={{ width: `${s.level}%` }} />
                    </span>
                  ))}
                </div>
              </div>
              {c.experience.length > 0 && (
                <div id="experience" className={styles.group}>
                  <p className={styles.groupTitle}>
                    <span>Experience</span>
                  </p>
                  <div className={styles.roles}>
                    {c.experience.map((x) => (
                      <div key={x.id}>
                        <p className={styles.role}>
                          {x.title} · {x.company}
                        </p>
                        <p className={styles.period}>{x.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {c.education.length > 0 && (
                <div id="education" className={styles.group}>
                  <p className={styles.groupTitle}>
                    <span>Education</span>
                  </p>
                  <div className={styles.roles}>
                    {c.education.map((x) => (
                      <div key={x.id}>
                        <p className={styles.role}>
                          {x.degree} · {x.institution}
                        </p>
                        <p className={styles.period}>{x.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="projects" className={styles.work}>
          <div className={styles.workInner}>
            <Reveal still={thumb}>
              <p className={styles.label}>Selected work</p>
              <h2 className={styles.workHeading}>Projects</h2>
            </Reveal>
            <div className={styles.rows}>
              {c.projects.map((p, i) => (
                <Reveal key={p.id} still={thumb}>
                  <a href={p.live || p.code || undefined} target="_blank" rel="noreferrer" className={styles.row}>
                    <span className={styles.bar} />
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    <div className={styles.rowBody}>
                      <p className={styles.rowLabel}>{p.tech.slice(0, 3).join(" · ") || "Project"}</p>
                      <h3>{p.title}</h3>
                      <p className={styles.rowDesc}>{p.description}</p>
                      <span className={styles.rowCta}>View project ↗</span>
                    </div>
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className={styles.rowImg} />
                    )}
                  </a>
                </Reveal>
              ))}
              {c.projects.length === 0 && <p className={styles.rowDesc}>Publish a project to see it here.</p>}
            </div>
          </div>
        </section>

        {c.certifications.length > 0 && (
          <section id="certifications" className={styles.work}>
            <div className={styles.workInner}>
              <Reveal still={thumb}>
                <p className={styles.label}>Credentials</p>
                <h2 className={styles.certHeading}>Certifications</h2>
              </Reveal>
              <div className={styles.rows}>
                {c.certifications.map((x, i) => (
                  <Reveal key={x.id} still={thumb}>
                    <a href={x.link || undefined} target="_blank" rel="noreferrer" className={styles.row}>
                      <span className={styles.bar} />
                      <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                      <div className={styles.rowBody}>
                        <p className={styles.rowLabel}>{x.issuer || "Certificate"}</p>
                        <h3>{x.title}</h3>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="contact" className={styles.contact}>
          <p className={styles.label}>Get in touch</p>
          <div className={styles.contactGrid}>
            <div>
              <h2 className={styles.contactHeading}>
                <span>Let&apos;s</span>
                <span className={styles.ghostOrange}>Connect</span>
              </h2>
              <div className={styles.socials}>
                {c.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <form className={styles.form} onSubmit={send}>
              <label>
                <span>Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </label>
              <label>
                <span>What&apos;s on your mind?</span>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project…" />
              </label>
              <button type="submit" className={styles.startBtn}>
                Send message
              </button>
            </form>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div>
              <p className={styles.label}>Thanks for scrolling</p>
              <h2 className={styles.footerName}>
                <span className={styles.ghost}>Made by</span>
                <span>{c.name}</span>
              </h2>
            </div>
            <nav className={styles.footerNav}>
              {nav.map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
          <div className={styles.footerRule} />
          <p className={styles.copy}>
            © {c.year} {c.name} · Built with SkillOra
          </p>
        </footer>
      </div>
    </div>
  );
}
