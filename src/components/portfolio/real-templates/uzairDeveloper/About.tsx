"use client";

import { motion } from "framer-motion";
import type { UzairContent } from "./adapter";
import styles from "./About.module.css";

export function About({ content }: { content: UzairContent["about"] }) {
  if (content.paragraphs.length === 0 && content.skills.length === 0) return null;

  return (
    <section className={styles.about} id="about">
      <div className={styles["about-container"]}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={styles["about-header"]}>
          <span className={styles["section-tag"]}>{content.tag}</span>
          <h2 className={styles["section-title"]}>
            {content.title} <span className={styles.highlight}>{content.titleHighlight}</span>
          </h2>
        </motion.div>

        <div className={styles["about-grid"]}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className={styles["about-content"]}>
            {content.paragraphs.length > 0 ? (
              content.paragraphs.map((paragraph, index) => (
                <p key={index} className={styles["about-text"]}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className={styles["about-text"]}>Add an &quot;About&quot; section in the portfolio editor to tell your story here.</p>
            )}

            {content.stats.length > 0 && (
              <div className={styles["about-stats"]}>
                {content.stats.map((stat, index) => (
                  <div key={index} className={styles["about-stat"]}>
                    <span className={styles["stat-number"]}>{stat.number}</span>
                    <span className={styles["stat-label"]}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {content.skills.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className={styles["skills-container"]}>
              {content.skills.map((skill, index) => (
                <div key={index} className={styles["skill-item"]}>
                  <div className={styles["skill-header"]}>
                    <span className={styles["skill-name"]}>{skill.name}</span>
                  </div>
                  <div className={styles["skill-bar"]}>
                    <motion.div className={styles["skill-progress"]} initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.3 + index * 0.1 }} viewport={{ once: true }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
