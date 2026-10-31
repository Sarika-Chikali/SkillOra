"use client";

import { motion } from "framer-motion";
import type { UzairContent } from "./adapter";
import styles from "./Contact.module.css";

// The original template's contact form posted through EmailJS, a third-party
// service requiring the site owner's own service/template/public keys —
// SkillOra has no such account and shouldn't silently wire up a form that
// fails on every submit. Contact info + social links carry the section on
// their own, same as SkillOra's other templates.

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function AvailabilityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function Contact({ content }: { content: UzairContent["contact"] }) {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles["contact-container"]}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={styles["contact-header"]}>
          <span className={styles["section-tag"]}>{content.tag}</span>
          <h2 className={styles["section-title"]}>
            {content.title} <span className={styles.highlight}>{content.titleHighlight}</span>
          </h2>
          <p className={styles["section-subtitle"]}>{content.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className={styles["contact-info"]}>
          {content.email && (
            <div className={styles["info-item"]}>
              <span className={styles["info-icon"]}>
                <EmailIcon />
              </span>
              <div>
                <h4>Email</h4>
                <a href={`mailto:${content.email}`}>{content.email}</a>
              </div>
            </div>
          )}
          <div className={styles["info-item"]}>
            <span className={styles["info-icon"]}>
              <AvailabilityIcon />
            </span>
            <div>
              <h4>Availability</h4>
              <p>Open to work</p>
            </div>
          </div>

          {content.social.length > 0 && (
            <div className={styles["social-links"]}>
              <h4>Connect with me</h4>
              <div className={styles["social-grid"]}>
                {content.social.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["social-link"]}
                    whileHover={{ scale: 1.1, y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className={styles["social-name"]}>{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
