"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { UzairContent, UzairProject } from "./adapter";
import styles from "./Projects.module.css";

export function Projects({ content }: { content: UzairContent["projects"] }) {
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<UzairProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (content.items.length === 0) return null;

  const filteredProjects = filter === "all" ? content.items : content.items.filter((p) => p.category === filter);

  function openModal(project: UzairProject) {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => setSelectedProject(null), 300);
  }

  return (
    <section className={styles.projects} id="projects">
      <div className={styles["projects-container"]}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={styles["projects-header"]}>
          <span className={styles["section-tag"]}>{content.tag}</span>
          <h2 className={styles["section-title"]}>
            {content.title} <span className={styles.highlight}>{content.titleHighlight}</span>
          </h2>
          <p className={styles["section-subtitle"]}>{content.description}</p>
        </motion.div>

        <div className={styles["projects-filters"]}>
          {content.categories.map((cat) => (
            <button key={cat.id} className={`${styles["filter-btn"]} ${filter === cat.id ? styles.active : ""}`} onClick={() => setFilter(cat.id)}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles["projects-grid"]}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={styles["project-card"]}
            >
              <div className={styles["project-image"]}>
                {project.imageUrl ? (
                  <Image src={project.imageUrl} alt={project.title} fill style={{ objectFit: "cover" }} unoptimized />
                ) : (
                  <span className={styles["project-emoji"]}>{project.emoji}</span>
                )}
              </div>
              <div className={styles["project-content"]}>
                <h3 className={styles["project-title"]}>{project.title}</h3>
                <p className={styles["project-description"]}>{project.description}</p>
                {project.tags.length > 0 && (
                  <div className={styles["project-tags"]}>
                    {project.tags.map((tag, i) => (
                      <span key={i} className={styles["project-tag"]}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={() => openModal(project)} className={styles["project-link"]}>
                  View Project →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && selectedProject && (
              <motion.div className={styles["modal-overlay"]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
                <motion.div
                  className={styles["modal-content"]}
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className={styles["modal-close"]} onClick={closeModal} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  <div className={styles["modal-image"]}>
                    {selectedProject.imageUrl ? (
                      <Image src={selectedProject.imageUrl} alt={selectedProject.title} fill style={{ objectFit: "cover" }} unoptimized />
                    ) : (
                      <span className={styles["modal-emoji"]}>{selectedProject.emoji}</span>
                    )}
                  </div>

                  <div className={styles["modal-body"]}>
                    <h2 className={styles["modal-title"]}>{selectedProject.title}</h2>
                    <p className={styles["modal-description"]}>{selectedProject.description}</p>

                    {selectedProject.tags.length > 0 && (
                      <div className={styles["modal-tags"]}>
                        {selectedProject.tags.map((tag, i) => (
                          <span key={i} className={styles["modal-tag"]}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles["modal-actions"]}>
                      {selectedProject.liveUrl ? (
                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className={`${styles["modal-btn"]} ${styles.primary}`}>
                          Live Site
                        </a>
                      ) : (
                        <button className={`${styles["modal-btn"]} ${styles.primary} ${styles.disabled}`} disabled title="Not live yet">
                          Not Live Yet
                        </button>
                      )}

                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className={`${styles["modal-btn"]} ${styles.secondary}`}>
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
