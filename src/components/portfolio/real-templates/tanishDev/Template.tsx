"use client";

import type { PortfolioTemplateProps } from "../../templates/types";
import { toTanishContent } from "./adapter";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { Certifications } from "./Certifications";
import { Contact } from "./Contact";
import styles from "./Template.module.css";

export function TanishDeveloperTemplate(props: PortfolioTemplateProps) {
  const content = toTanishContent(props);
  const thumbnailMode = props.thumbnailMode ?? false;

  return (
    <div className={styles.app}>
      <div className={styles.sectionLayer}>
        <Navbar content={content.navbar} />
      </div>
      <div className={styles.sectionLayer}>
        <Hero content={content.hero} thumbnailMode={thumbnailMode} />
      </div>
      <div className={styles.sectionLayer}>
        <About content={content.about} thumbnailMode={thumbnailMode} />
      </div>
      <div className={styles.sectionLayer}>
        <Projects content={content.projects} thumbnailMode={thumbnailMode} />
      </div>
      <div className={styles.sectionLayer}>
        <Skills content={content.skills} thumbnailMode={thumbnailMode} />
      </div>
      <div className={styles.sectionLayer}>
        <Certifications content={content.certifications} thumbnailMode={thumbnailMode} />
      </div>
      <div className={styles.sectionLayer}>
        <Contact content={content.contact} footer={content.footer} thumbnailMode={thumbnailMode} />
      </div>
    </div>
  );
}
