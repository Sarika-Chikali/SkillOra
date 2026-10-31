import type { UzairContent } from "./adapter";
import styles from "./Footer.module.css";

export function Footer({ content }: { content: UzairContent["footer"] }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        <div className={styles["footer-content"]}>
          <div className={styles["footer-brand"]}>
            <span className={styles["brand-dot"]} />
            <span className={styles["brand-text"]}>{content.brand}</span>
          </div>
          <p className={styles["footer-text"]}>{content.text}</p>
        </div>

        <div className={styles["footer-links"]}>
          {content.links.map((link, index) => (
            <a key={index} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles["footer-bottom"]}>
          <span>
            © {currentYear} {content.brand.replace(".", "")}. Built with SkillOra.
          </span>
        </div>
      </div>
    </footer>
  );
}
