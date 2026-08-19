import { UserPortfolio, Project, Skill, CertificationAchievement, Education, WorkExperience } from '../types/portfolio';
import { initialPortfolio } from '../data/mockPortfolio';

const STORAGE_KEY = 'skillora_portfolio_data_v2';
export const PORTFOLIO_UPDATED_EVENT = 'skillora_portfolio_updated';

export class PortfolioService {
  static getPortfolio(): UserPortfolio {
    if (typeof window === 'undefined') return initialPortfolio;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...initialPortfolio,
            ...parsed,
            selectedTemplateId: parsed.selectedTemplateId || 'default-overview',
            contact: {
              ...initialPortfolio.contact,
              ...(parsed.contact || {}),
            },
            socialLinks: {
              ...initialPortfolio.socialLinks,
              ...(parsed.socialLinks || {}),
            },
            skills: Array.isArray(parsed.skills) ? parsed.skills : initialPortfolio.skills,
            education: Array.isArray(parsed.education) ? parsed.education : initialPortfolio.education,
            projects: Array.isArray(parsed.projects) ? parsed.projects : initialPortfolio.projects,
            certifications: Array.isArray(parsed.certifications) ? parsed.certifications : initialPortfolio.certifications,
            experiences: Array.isArray(parsed.experiences) ? parsed.experiences : initialPortfolio.experiences,
          };
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio from LocalStorage:', e);
    }
    // Set default seed
    this.savePortfolio(initialPortfolio);
    return initialPortfolio;
  }

  static savePortfolio(data: UserPortfolio): UserPortfolio {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(PORTFOLIO_UPDATED_EVENT, { detail: updated }));
      } catch (e) {
        console.error('Failed to save portfolio to LocalStorage:', e);
      }
    }
    return updated;
  }

  static updateProfileInfo(updates: Partial<UserPortfolio>): UserPortfolio {
    const current = this.getPortfolio();
    const updated = { ...current, ...updates };
    return this.savePortfolio(updated);
  }

  // Projects CRUD
  static addProject(project: Omit<Project, 'id'>): UserPortfolio {
    const current = this.getPortfolio();
    const newProject: Project = {
      ...project,
      id: 'proj-' + Date.now(),
    };
    const updated = { ...current, projects: [newProject, ...current.projects] };
    return this.savePortfolio(updated);
  }

  static updateProject(id: string, projectData: Partial<Project>): UserPortfolio {
    const current = this.getPortfolio();
    const updatedProjects = current.projects.map((p) => (p.id === id ? { ...p, ...projectData } : p));
    const updated = { ...current, projects: updatedProjects };
    return this.savePortfolio(updated);
  }

  static deleteProject(id: string): UserPortfolio {
    const current = this.getPortfolio();
    const updatedProjects = current.projects.filter((p) => p.id !== id);
    const updated = { ...current, projects: updatedProjects };
    return this.savePortfolio(updated);
  }

  // Education CRUD
  static addEducation(edu: Omit<Education, 'id'>): UserPortfolio {
    const current = this.getPortfolio();
    const newEdu: Education = {
      ...edu,
      id: 'edu-' + Date.now(),
    };
    const updated = { ...current, education: [newEdu, ...current.education] };
    return this.savePortfolio(updated);
  }

  static deleteEducation(id: string): UserPortfolio {
    const current = this.getPortfolio();
    const updatedEdu = current.education.filter((e) => e.id !== id);
    const updated = { ...current, education: updatedEdu };
    return this.savePortfolio(updated);
  }

  // Skills CRUD
  static addSkill(skill: Omit<Skill, 'id'>): UserPortfolio {
    const current = this.getPortfolio();
    const newSkill: Skill = {
      ...skill,
      id: 'sk-' + Date.now(),
    };
    const updated = { ...current, skills: [...current.skills, newSkill] };
    return this.savePortfolio(updated);
  }

  static deleteSkill(id: string): UserPortfolio {
    const current = this.getPortfolio();
    const updatedSkills = current.skills.filter((s) => s.id !== id);
    const updated = { ...current, skills: updatedSkills };
    return this.savePortfolio(updated);
  }

  // Certifications CRUD (with Career Wallet integration schema support)
  static addCertification(cert: Omit<CertificationAchievement, 'id'>): UserPortfolio {
    const current = this.getPortfolio();
    const newCert: CertificationAchievement = {
      ...cert,
      id: 'cert-' + Date.now(),
      walletSourceId: cert.walletSourceId || `cw-cert-${Date.now()}`,
      isWalletVerified: cert.isWalletVerified ?? true,
    };
    const updated = { ...current, certifications: [newCert, ...current.certifications] };
    return this.savePortfolio(updated);
  }

  static deleteCertification(id: string): UserPortfolio {
    const current = this.getPortfolio();
    const updatedCerts = current.certifications.filter((c) => c.id !== id);
    const updated = { ...current, certifications: updatedCerts };
    return this.savePortfolio(updated);
  }

  static setSelectedTemplate(templateId: UserPortfolio['selectedTemplateId']): UserPortfolio {
    const current = this.getPortfolio();
    const updated = { ...current, selectedTemplateId: templateId };
    return this.savePortfolio(updated);
  }

  static updateDeploymentInfo(deploymentInfo: UserPortfolio['deploymentInfo']): UserPortfolio {
    const current = this.getPortfolio();
    const updated = { ...current, deploymentInfo };
    return this.savePortfolio(updated);
  }

  // Experience CRUD
  static addExperience(exp: Omit<WorkExperience, 'id'>): UserPortfolio {
    const current = this.getPortfolio();
    const newExp: WorkExperience = {
      ...exp,
      id: 'exp-' + Date.now(),
    };
    const updated = { ...current, experiences: [newExp, ...current.experiences] };
    return this.savePortfolio(updated);
  }

  static deleteExperience(id: string): UserPortfolio {
    const current = this.getPortfolio();
    const updatedExp = current.experiences.filter((e) => e.id !== id);
    const updated = { ...current, experiences: updatedExp };
    return this.savePortfolio(updated);
  }
}

