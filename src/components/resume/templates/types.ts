import type { ResumeData } from "@/lib/resume";

export type ResumeCertification = {
  name: string;
  issuer: string;
  verified: boolean;
};

export type TemplateProps = {
  profile: { name: string; role: string; company: string; email: string };
  data: ResumeData;
  certifications: ResumeCertification[];
};
