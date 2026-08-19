'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Palette, Cpu, TrendingUp, Stethoscope, GraduationCap, Compass, Sparkles, CheckCircle2, ChevronRight, ShieldCheck, Briefcase, Award } from 'lucide-react';
import { TemplateId } from '@/lib/types/portfolio';

interface DomainGuide {
  id: string;
  tabTitle: string;
  icon: React.ReactNode;
  recommendedTemplateId: TemplateId;
  recommendedTemplateName: string;
  whatRecruitersExpect: string;
  emphasizedSections: string[];
  valuableProjectTypes: string[];
  keyProofAndCredentials: string[];
}

const DOMAIN_GUIDES: DomainGuide[] = [
  {
    id: 'software-ai',
    tabTitle: 'Software & AI',
    icon: <Code2 className="w-4 h-4 text-cyan-500" />,
    recommendedTemplateId: 'obsidian',
    recommendedTemplateName: 'OBSIDIAN (Cinematic Dark)',
    whatRecruitersExpect: 'Working live demo URLs, public GitHub source code, clear API architecture, and specific modern tech stack tags.',
    emphasizedSections: ['Technical Mastery Matrix', 'Featured Live Projects', 'GitHub Repositories', 'Career Wallet Badges'],
    valuableProjectTypes: ['Full-stack web applications', 'AI/LLM microservices', 'Open-source contributions', 'API integrations'],
    keyProofAndCredentials: ['Live Vercel/Netlify demo links', 'Clean GitHub commit history', 'Verified certifications (AWS/Azure)'],
  },
  {
    id: 'data-analytics',
    tabTitle: 'Data & Analytics',
    icon: <Database className="w-4 h-4 text-emerald-500" />,
    recommendedTemplateId: 'developer-hub',
    recommendedTemplateName: 'DEVELOPER HUB (IDE Workspace)',
    whatRecruitersExpect: 'Model metrics (F1-score, accuracy), data visual charts, clean Jupyter notebooks, and business impact summaries.',
    emphasizedSections: ['Model Benchmarks', 'GitHub Notebooks', 'Dataset Repositories', 'Technical Skills'],
    valuableProjectTypes: ['Exploratory data analysis (EDA)', 'Predictive ML models', 'Interactive BI dashboards', 'NLP/Computer vision pipelines'],
    keyProofAndCredentials: ['Kaggle rankings', 'HuggingFace spaces', 'Verified Data Science credentials'],
  },
  {
    id: 'design-ux',
    tabTitle: 'Design & UX',
    icon: <Palette className="w-4 h-4 text-pink-500" />,
    recommendedTemplateId: 'bento',
    recommendedTemplateName: 'BENTO (Modular Grid)',
    whatRecruitersExpect: 'UX research process from user pain points to high-fidelity Figma prototypes and visual design system components.',
    emphasizedSections: ['Visual Case Studies', 'Figma Prototypes', 'Design System Skills', 'User Research'],
    valuableProjectTypes: ['End-to-end product design case studies', 'Mobile app UI redesigns', 'Design system libraries'],
    keyProofAndCredentials: ['Interactive Figma prototype embeds', 'User testing metrics', 'Design competition awards'],
  },
  {
    id: 'core-engineering',
    tabTitle: 'Core Engineering',
    icon: <Cpu className="w-4 h-4 text-amber-500" />,
    recommendedTemplateId: 'executive',
    recommendedTemplateName: 'EXECUTIVE (2-Column Corporate)',
    whatRecruitersExpect: 'CAD/3D model renders (SolidWorks, AutoCAD), ANSYS simulations, technical specs, and industrial site reports.',
    emphasizedSections: ['CAD Specs & Renders', 'Lab Testing Practicals', 'Academic Qualifications', 'Industrial Experience'],
    valuableProjectTypes: ['Robotics/Hardware prototypes', 'Structural CAD designs', 'Circuit/PCB design projects'],
    keyProofAndCredentials: ['SolidWorks/AutoCAD professional certs', 'GATE/ISRO ranks', 'Lab practical reports'],
  },
  {
    id: 'finance-mba',
    tabTitle: 'Finance / MBA',
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    recommendedTemplateId: 'executive',
    recommendedTemplateName: 'EXECUTIVE (2-Column Corporate)',
    whatRecruitersExpect: 'Quantifiable financial impact ($ revenue, % ROI), financial modeling (DCF/LBO/Excel), and structured leadership timeline.',
    emphasizedSections: ['Executive Summary', 'Financial Modeling Skills', 'Strategic Case Competitions', 'Verified Credentials'],
    valuableProjectTypes: ['Valuation & DCF models', 'Market research reports', 'Corporate strategy case studies'],
    keyProofAndCredentials: ['CFA/CPA/NISM credentials', 'Case competition ranks', 'MBA capstone deliverables'],
  },
  {
    id: 'healthcare',
    tabTitle: 'Healthcare',
    icon: <Stethoscope className="w-4 h-4 text-rose-500" />,
    recommendedTemplateId: 'editorial',
    recommendedTemplateName: 'EDITORIAL (Magazine Serif)',
    whatRecruitersExpect: 'Clinical research papers, hospital rotation history, verified medical accreditations, and formal academic foundation.',
    emphasizedSections: ['Clinical Research & Papers', 'Hospital Rotations', 'Medical Accreditations', 'Academic Degree'],
    valuableProjectTypes: ['Clinical research trials', 'Public health case studies', 'Medical literature reviews'],
    keyProofAndCredentials: ['Medical council registrations', 'Journal publication DOIs', 'Hospital rotation certs'],
  },
  {
    id: 'students-freshers',
    tabTitle: 'Students / Freshers',
    icon: <GraduationCap className="w-4 h-4 text-indigo-500" />,
    recommendedTemplateId: 'obsidian',
    recommendedTemplateName: 'OBSIDIAN or BENTO',
    whatRecruitersExpect: 'Hackathon achievements, academic capstone projects, fast-learning capability, and self-taught modern stacks.',
    emphasizedSections: ['Capstone Projects', 'Hackathons & Awards', 'Technical Skill Mastery', 'Education & CGPA'],
    valuableProjectTypes: ['College capstone projects', 'Hackathon MVP builds', 'Self-taught portfolio apps'],
    keyProofAndCredentials: ['Hackathon certificates', 'Academic CGPA & honors', 'SkillOra Verified Badges'],
  },
];

interface CareerPortfolioGuideProps {
  onSelectTemplate?: (templateId: TemplateId) => void;
}

export const CareerPortfolioGuide: React.FC<CareerPortfolioGuideProps> = ({ onSelectTemplate }) => {
  const [activeDomainId, setActiveDomainId] = useState<string>('software-ai');

  const activeGuide = DOMAIN_GUIDES.find((g) => g.id === activeDomainId) || DOMAIN_GUIDES[0];

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-5" id="career-guide-section">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Career Portfolio Strategy Guide
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Select your career domain to view tailored recruiter expectations</p>
          </div>
        </div>
      </div>

      {/* Lightweight Horizontal Domain Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DOMAIN_GUIDES.map((guide) => {
          const isActive = guide.id === activeDomainId;
          return (
            <button
              key={guide.id}
              onClick={() => setActiveDomainId(guide.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm scale-[1.01]'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {guide.icon}
              <span>{guide.tabTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Compact Strategy Insights Grid */}
      <motion.div
        key={activeGuide.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-lg border border-slate-800"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              RECRUITER STRATEGY // {activeGuide.tabTitle.toUpperCase()}
            </span>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {activeGuide.whatRecruitersExpect}
            </p>
          </div>

          {onSelectTemplate && (
            <button
              onClick={() => onSelectTemplate(activeGuide.recommendedTemplateId)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center gap-1 shrink-0 transition-colors"
            >
              Use {activeGuide.recommendedTemplateId.toUpperCase()} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3 Compact Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Sections to Emphasize
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {activeGuide.emphasizedSections.map((sec, i) => (
                <li key={i}>• {sec}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-purple-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Valuable Project Types
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {activeGuide.valuableProjectTypes.map((proj, i) => (
                <li key={i}>• {proj}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Proof & Credentials
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {activeGuide.keyProofAndCredentials.map((proof, i) => (
                <li key={i}>• {proof}</li>
              ))}
            </ul>
          </div>

        </div>
      </motion.div>

    </section>
  );
};
