export type UserStatus = 'student' | 'fresher' | 'employee' | 'freelancer';

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'Mobile' | 'Cloud & DevOps' | 'Database' | 'Soft Skills' | 'Other';
  proficiency: number; // 0 to 100
  isVerified?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startYear: string;
  endYear: string | 'Present';
  gradeOrCgpa?: string;
  activities?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * CertificationAchievement model structured for future Career Wallet integration.
 * Enables direct ingestion of verified badges, credentials, and achievements from Career Wallet.
 */
export interface CertificationAchievement {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  type: 'certification' | 'achievement' | 'award';
  description?: string;
  
  // Future-ready Career Wallet Schema Integration fields:
  walletSourceId?: string;       // Unique reference ID from Skillora Career Wallet
  badgeImageUrl?: string;        // Visual badge asset URL from Wallet
  verificationTxHash?: string;   // Cryptographic / digital signature verification hash
  isWalletVerified?: boolean;    // Indicates badge verified & imported from Career Wallet
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  isCurrentRole: boolean;
  description: string;
  keyAchievements: string[];
}

export interface UserPortfolio {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bannerUrl?: string;
  roleTitle: string; // e.g. "Full Stack Developer"
  status: UserStatus; // 'student' | 'fresher' | 'employee' | 'freelancer'
  institutionOrCompany: string; // e.g. "NIT Warangal" or "Infosys"
  bio: string;
  contact: ContactInfo;
  socialLinks: SocialLinks;
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certifications: CertificationAchievement[];
  experiences: WorkExperience[];
  updatedAt: string;
}
