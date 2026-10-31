"use client";

import { motion } from "framer-motion";
import type { UzairContent } from "./adapter";
import styles from "./Skills.module.css";

export function Skills({ content }: { content: UzairContent["skills"] }) {
  if (content.items.length === 0) return null;

  return (
    <section className={styles["skills-page"]} id="skills">
      <div className={styles["skills-page-container"]}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={styles["skills-page-header"]}>
          <span className={styles["section-tag"]}>{content.tag}</span>
          <h2 className={styles["section-title"]}>
            {content.title} <span className={styles.highlight}>{content.titleHighlight}</span>
          </h2>
          <p className={styles["section-subtitle"]}>{content.description}</p>
        </motion.div>

        <motion.div layout className={styles["skills-grid-page"]}>
          {content.items.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={styles["skill-card-page"]}
            >
              <div className={styles["skill-card-header"]}>
                <div className={styles["skill-card-info"]}>
                  <h3 className={styles["skill-card-name"]}>{skill}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
