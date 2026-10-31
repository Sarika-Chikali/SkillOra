"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { PortfolioTemplateProps } from "../../templates/types";
import { toCommonContent } from "../shared/content";
import styles from "./Template.module.css";

const ComputersCanvas = dynamic(() => import("./Scenes").then((m) => m.ComputersCanvas), { ssr: false });
const BallCanvas = dynamic(() => import("./Scenes").then((m) => m.BallCanvas), { ssr: false });
const EarthCanvas = dynamic(() => import("./Scenes").then((m) => m.EarthCanvas), { ssr: false });
const StarsCanvas = dynamic(() => import("./Scenes").then((m) => m.StarsCanvas), { ssr: false });

const IMG = "/templates/devpc/img";
const CARD_ICONS = [`${IMG}/web.png`, `${IMG}/mobile.png`, `${IMG}/backend.png`, `${IMG}/creator.png`];
const TAG_COLORS = ["#36d7ff", "#4ade80", "#f472b6", "#fbbf24", "#a78bfa"];

function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * 30).toFixed(1)}deg) rotateY(${(px * 30).toFixed(1)}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  }
  return (
    <div ref={ref} className={`${styles.tilt} ${className ?? ""}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, className, still }: { children: ReactNode; delay?: number; className?: string; still: boolean }) {
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function DevPc3dTemplate(props: PortfolioTemplateProps) {
  const c = toCommonContent(props);
  const thumb = props.thumbnailMode ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (thumb) return;
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [thumb]);

  const nav = [
    { id: "about", title: "About" },
    ...(c.experience.length ? [{ id: "experience", title: "Experience" }] : []),
    { id: "skills", title: "Skills" },
    { id: "projects", title: "Projects" },
    { id: "contact", title: "Contact" },
  ];

  const balls = c.skills.slice(0, 12);
  const aboutCards = c.education.length
    ? c.education.map((e) => ({ title: e.degree, sub: `${e.institution}${e.duration ? " · " + e.duration : ""}` }))
    : [
        { title: `${c.projects.length} Projects`, sub: "Built & shipped" },
        { title: `${c.skills.length} Skills`, sub: "In the toolbox" },
        { title: `${c.experience.length} Roles`, sub: "Work experience" },
      ];

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!c.email) return;
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:${c.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className={styles.app}>
      <div className={styles.navWrap}>
        <nav className={`${styles.nav} ${scrolled ? styles.navSolid : ""}`}>
          <div className={styles.navInner}>
            <a href="#home" className={styles.brand}>
              <span className={styles.logo}>{c.initials}</span>
              <span>
                {c.name} <span className={styles.brandSuffix}>| Portfolio</span>
              </span>
            </a>
            <ul className={styles.navLinks}>
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.title}</a>
                </li>
              ))}
            </ul>
            <button className={styles.burger} aria-label="Menu" onClick={() => setMenu((m) => !m)}>
              {menu ? "✕" : "☰"}
            </button>
            {menu && (
              <ul className={styles.mobileMenu}>
                {nav.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} onClick={() => setMenu(false)}>
                      {n.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>

      <div className={styles.heroBg}>
        <section id="home" className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.heroRail}>
              <div className={styles.dot} />
              <div className={styles.line} />
            </div>
            <div>
              <h1 className={styles.heroHead}>
                Hi, I&apos;m <span className={styles.purple}>{c.firstName}</span>
              </h1>
              <p className={styles.heroSub}>{c.headline}</p>
              <p className={styles.heroTag}>{c.tagline}</p>
            </div>
          </div>
          <div className={styles.heroCanvas}>{!thumb && <ComputersCanvas />}</div>
          <a href="#about" className={styles.scrollHint} aria-label="Scroll to About">
            <div className={styles.mouse}>
              <div className={styles.wheel} />
            </div>
          </a>
        </section>
      </div>

      <section id="about" className={styles.section}>
        <Reveal still={thumb}>
          <p className={styles.subText}>Introduction</p>
          <h2 className={styles.headText}>Overview.</h2>
          <p className={styles.lead}>{c.about}</p>
        </Reveal>
        <div className={styles.cards}>
          {aboutCards.map((card, i) => (
            <Reveal key={i} delay={i * 0.15} still={thumb} className={styles.cardWrap}>
              <Tilt>
                <div className={styles.gradientBorder}>
                  <div className={styles.serviceCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CARD_ICONS[i % CARD_ICONS.length]} alt="" className={styles.serviceIcon} />
                    <h3>{card.title}</h3>
                    <p>{card.sub}</p>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {c.experience.length > 0 && (
        <section id="experience" className={styles.section}>
          <Reveal still={thumb}>
            <p className={`${styles.subText} ${styles.center}`}>What I have done so far</p>
            <h2 className={`${styles.headText} ${styles.center}`}>Work Experience.</h2>
          </Reveal>
          <div className={styles.timeline}>
            {c.experience.map((x, i) => (
              <Reveal key={x.id} still={thumb} className={`${styles.tlItem} ${i % 2 ? styles.tlRight : styles.tlLeft}`}>
                <span className={styles.tlIcon}>{x.company.slice(0, 1).toUpperCase() || "•"}</span>
                <div className={styles.tlCard}>
                  <span className={styles.tlDate}>{x.duration}</span>
                  <h3>{x.title}</h3>
                  <p className={styles.tlCompany}>{x.company}</p>
                  {x.description && <p className={styles.tlDesc}>{x.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section id="skills" className={styles.section}>
        <Reveal still={thumb}>
          <p className={`${styles.subText} ${styles.center}`}>What I work with</p>
          <h2 className={`${styles.headText} ${styles.center}`}>Skills.</h2>
        </Reveal>
        <div className={styles.balls}>
          {balls.map((s) => (
            <div key={s.name} className={styles.ballItem}>
              <div className={styles.ball}>{!thumb && <BallCanvas label={s.name} />}</div>
              <div className={styles.meter} title={`${s.level}%`}>
                <span style={{ width: `${s.level}%` }} />
              </div>
              <p className={styles.ballLabel}>
                {s.name} · {s.level}%
              </p>
            </div>
          ))}
        </div>
        {c.skills.length > balls.length && (
          <div className={styles.chips}>
            {c.skills.slice(balls.length).map((s) => (
              <span key={s.name}>
                {s.name} · {s.level}%
              </span>
            ))}
          </div>
        )}
      </section>

      <section id="projects" className={styles.section}>
        <Reveal still={thumb}>
          <p className={styles.subText}>My work</p>
          <h2 className={styles.headText}>Projects.</h2>
          <p className={styles.lead}>Real-world examples of my work, each with links to the code and a live demo.</p>
        </Reveal>
        <div className={styles.projects}>
          {c.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12} still={thumb} className={styles.projectWrap}>
              <Tilt className={styles.projectCard}>
                <div className={styles.projectImg}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div className={styles.projectPlaceholder}>{p.title.slice(0, 1)}</div>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noreferrer" className={styles.ghBtn} aria-label="Source code">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${IMG}/github.png`} alt="" />
                    </a>
                  )}
                </div>
                <h3>{p.title}</h3>
                <p className={styles.projectDesc}>{p.description}</p>
                <div className={styles.tags}>
                  {p.tech.map((t, j) => (
                    <span key={t} style={{ color: TAG_COLORS[j % TAG_COLORS.length] }}>
                      #{t}
                    </span>
                  ))}
                </div>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className={styles.liveLink}>
                    Live demo ↗
                  </a>
                )}
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {c.certifications.length > 0 && (
        <section id="certifications" className={styles.section}>
          <Reveal still={thumb}>
            <p className={styles.subText}>What others can verify</p>
            <h2 className={styles.headText}>Certifications.</h2>
          </Reveal>
          <div className={styles.certs}>
            {c.certifications.map((x, i) => (
              <Reveal key={x.id} delay={i * 0.1} still={thumb} className={styles.certWrap}>
                <a href={x.link || undefined} target="_blank" rel="noreferrer" className={styles.cert}>
                  <span className={styles.quote}>&ldquo;</span>
                  <p className={styles.certTitle}>{x.title}</p>
                  {x.issuer && (
                    <p className={styles.certIssuer}>
                      <span className={styles.blue}>@</span> {x.issuer}
                    </p>
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <div className={styles.contactWrap}>
        <section id="contact" className={`${styles.section} ${styles.contact}`}>
          <Reveal still={thumb} className={styles.formCol}>
            <p className={styles.subText}>Get in touch</p>
            <h3 className={styles.headText}>Contact.</h3>
            <form onSubmit={submit} className={styles.form}>
              <label>
                <span>Your Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What's your good name?" />
              </label>
              <label>
                <span>Your email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="What's your email address?" />
              </label>
              <label>
                <span>Your Message</span>
                <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What do you want to say?" />
              </label>
              <button type="submit">Send</button>
            </form>
            {c.links.length > 0 && (
              <div className={styles.links}>
                {c.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                    {l.label}: {l.handle}
                  </a>
                ))}
              </div>
            )}
          </Reveal>
          <div className={styles.earth}>{!thumb && <EarthCanvas />}</div>
        </section>
        <div className={styles.stars}>{!thumb && <StarsCanvas />}</div>
      </div>

      <footer className={styles.footer}>
        © {c.year} {c.name} · Built with SkillOra · 3D planet by cmzw (CC-BY 4.0)
      </footer>
    </div>
  );
}
