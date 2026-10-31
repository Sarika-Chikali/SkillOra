"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { UzairContent, UzairCertification } from "./adapter";
import styles from "./Certifications.module.css";

export function Certifications({ content }: { content: UzairContent["certifications"] }) {
  const [selectedCert, setSelectedCert] = useState<UzairCertification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (content.items.length === 0) return null;

  function openModal(cert: UzairCertification) {
    setSelectedCert(cert);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => setSelectedCert(null), 300);
  }

  return (
    <section className={styles.certifications} id="certifications">
      <div className={styles["certifications-container"]}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={styles["certifications-header"]}>
          <span className={styles["section-tag"]}>{content.tag}</span>
          <h2 className={styles["section-title"]}>
            {content.title}
            <span className={styles.highlight}>{content.titleHighlight}</span>
          </h2>
          <p className={styles["section-subtitle"]}>{content.description}</p>
        </motion.div>

        <div className={styles["certifications-grid"]}>
          {content.items.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={styles["cert-card"]}
            >
              <div className={styles["cert-image-wrapper"]}>
                {cert.imageUrl ? (
                  <Image src={cert.imageUrl} alt={cert.title} fill style={{ objectFit: "cover" }} unoptimized />
                ) : (
                  <div className={styles["cert-image-placeholder"]}>{cert.title}</div>
                )}
              </div>

              <div className={styles["cert-content"]}>
                {cert.issuer && <p className={styles["cert-issuer"]}>{cert.issuer}</p>}
                <h3 className={styles["cert-title"]}>{cert.title}</h3>
                <button onClick={() => openModal(cert)} className={styles["cert-link"]}>
                  View Certification →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && selectedCert && (
              <motion.div className={styles["cert-modal-overlay"]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
                <motion.div
                  className={styles["cert-modal-content"]}
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className={styles["cert-modal-close"]} onClick={closeModal} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  <div className={styles["cert-modal-image-wrapper"]}>
                    {selectedCert.imageUrl ? (
                      <Image src={selectedCert.imageUrl} alt={selectedCert.title} fill style={{ objectFit: "cover" }} unoptimized />
                    ) : (
                      <div className={styles["cert-modal-placeholder"]}>No Image Available</div>
                    )}
                  </div>

                  <div className={styles["cert-modal-body"]}>
                    <div className={styles["cert-modal-header"]}>
                      <div>
                        <h2 className={styles["cert-modal-title"]}>{selectedCert.title}</h2>
                        {selectedCert.issuer && <p className={styles["cert-modal-issuer"]}>{selectedCert.issuer}</p>}
                      </div>
                    </div>

                    {selectedCert.description && <p className={styles["cert-modal-description"]}>{selectedCert.description}</p>}

                    <div className={styles["cert-modal-actions"]}>
                      {selectedCert.link ? (
                        <a href={selectedCert.link} target="_blank" rel="noopener noreferrer" className={`${styles["cert-modal-btn"]} ${styles.primary}`}>
                          View Certificate
                        </a>
                      ) : (
                        <button className={`${styles["cert-modal-btn"]} ${styles.primary} ${styles.disabled}`} disabled>
                          No Link Available
                        </button>
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
