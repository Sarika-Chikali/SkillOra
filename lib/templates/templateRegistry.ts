import { TemplateId, TemplateCategory } from '../types/portfolio';

export interface PortfolioTemplateMeta {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  careerFit: string;
  designStyle: string;
  description: string;
  badgeText: string;
  previewGradient: string;
  accentColor: string;
  darkHeader?: boolean;
  features: string[];
  thumbnailBg: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'All Templates',
  'Modern',
  'Minimal',
  'Creative',
  'Developer',
  'Professional',
];

export const PORTFOLIO_TEMPLATES: PortfolioTemplateMeta[] = [
  {
    id: 'obsidian',
    name: 'OBSIDIAN',
    category: 'Modern',
    careerFit: 'Software Engineers, Full-Stack Developers & AI Creators',
    designStyle: 'Cinematic Dark Developer',
    description: 'Cinematic dark developer portfolio with oversized headlines, glowing cyan accents, floating profile avatar, and immersive full-width project showcases.',
    badgeText: 'Cinematic Dark',
    previewGradient: 'from-[#050811] via-[#0B0F19] to-[#050811]',
    accentColor: '#38BDF8',
    darkHeader: true,
    features: ['Cinematic Dark Theme', 'Oversized Typography', 'Glow Accents'],
    thumbnailBg: 'bg-[#050811]',
  },
  {
    id: 'editorial',
    name: 'EDITORIAL',
    category: 'Minimal',
    careerFit: 'Writers, Researchers, Healthcare Professionals & Academics',
    designStyle: 'Magazine Editorial & Serif',
    description: 'High-fashion magazine layout with crisp off-white backdrop, serif headline typography, generous whitespace, and minimal hairline dividers.',
    badgeText: 'Magazine Layout',
    previewGradient: 'from-[#FAF8F5] via-[#F5F2ED] to-[#EFECE6]',
    accentColor: '#1E293B',
    darkHeader: false,
    features: ['Serif Headlines', 'Magazine Whitespace', 'Hairline Dividers'],
    thumbnailBg: 'bg-[#FAF8F5]',
  },
  {
    id: 'bento',
    name: 'BENTO',
    category: 'Creative',
    careerFit: 'Product Designers, UI/UX Specialists & Visual Storytellers',
    designStyle: 'Asymmetric 4-Column Bento Grid',
    description: 'Modern 4-column asymmetric Bento Grid composition arranging projects, skills matrix, verified wallet badges, and timeline into bento tiles.',
    badgeText: 'Bento Grid',
    previewGradient: 'from-blue-600 via-indigo-600 to-sky-600',
    accentColor: '#2563EB',
    darkHeader: false,
    features: ['4-Column Bento Grid', 'Modular Visual Tiles', 'Product Designer Vibe'],
    thumbnailBg: 'bg-gradient-to-tr from-[#F4F4F6] via-[#EAEAEA] to-[#F4F4F6]',
  },
  {
    id: 'creative',
    name: 'CREATIVE',
    category: 'Creative',
    careerFit: 'Art Directors, Content Creators & Multi-Disciplinary Talent',
    designStyle: 'Gradient Mesh & Glassmorphism',
    description: 'High-impact artistic portfolio featuring an expressive gradient mesh background, asymmetric hero composition, and floating glassmorphic panels.',
    badgeText: 'Gradient Mesh',
    previewGradient: 'from-purple-950 via-pink-950 to-[#0A0612]',
    accentColor: '#EC4899',
    darkHeader: true,
    features: ['Gradient Mesh', 'Asymmetric Hero', 'Layered Glassmorphism'],
    thumbnailBg: 'bg-gradient-to-br from-[#0A0612] via-[#1D0B2E] to-[#0A0612]',
  },
  {
    id: 'developer-hub',
    name: 'DEVELOPER HUB',
    category: 'Developer',
    careerFit: 'Backend Engineers, Data Scientists & Open-Source Contributors',
    designStyle: 'IDE Code Editor & GitHub',
    description: 'Engineering-oriented interface with an IDE code editor top bar, macOS control dots, GitHub repository cards with star/fork metrics, and code stack tags.',
    badgeText: 'IDE Workspace',
    previewGradient: 'from-[#0D1117] via-[#161B22] to-[#0D1117]',
    accentColor: '#10B981',
    darkHeader: true,
    features: ['IDE Control Header', 'GitHub Repo Cards', 'Code Stack Tags'],
    thumbnailBg: 'bg-[#0D1117]',
  },
  {
    id: 'executive',
    name: 'EXECUTIVE',
    category: 'Professional',
    careerFit: 'Finance Professionals, Core Engineers (Mech/Civil) & MBAs',
    designStyle: 'Recruiter 2-Column Corporate',
    description: 'Recruiter-conscious 2-column corporate sidebar layout prioritizing work experience timeline, academic qualifications, and Career Wallet verification.',
    badgeText: 'Corporate 2-Column',
    previewGradient: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    accentColor: '#1E40AF',
    darkHeader: true,
    features: ['2-Column Sidebar', 'Career Wallet Badges', 'Timeline Grid'],
    thumbnailBg: 'bg-[#0F172A]',
  },
  {
    id: 'aurora',
    name: 'AURORA',
    category: 'Modern',
    careerFit: 'AI Engineers, ML Engineers, Startups & Modern Software Developers',
    designStyle: 'Dark Ambient Aurora Mesh',
    description: 'Next-gen SaaS portfolio featuring a dark ambient gradient mesh lighting backdrop, glowing emerald AI tech badges, and floating glassmorphic cards.',
    badgeText: 'Aurora Mesh AI',
    previewGradient: 'from-[#070913] via-[#0C1022] to-[#070913]',
    accentColor: '#10B981',
    darkHeader: true,
    features: ['Aurora Mesh Glow', 'Floating Glass Profile', 'AI Skill Matrix'],
    thumbnailBg: 'bg-[#070913]',
  },
  {
    id: 'neo-minimal',
    name: 'NEO MINIMAL',
    category: 'Minimal',
    careerFit: 'Researchers, Academics, Consultants, Students & Professionals',
    designStyle: 'Swiss Precision & Fine Hairlines',
    description: 'Ultra-polished Swiss minimalist layout with warm-neutral alabaster canvas, generous whitespace, sharp typography hierarchy, and subtle project rows.',
    badgeText: 'Swiss Precision',
    previewGradient: 'from-[#FAFAF8] via-[#F3F3F0] to-[#EAEAE5]',
    accentColor: '#0F172A',
    darkHeader: false,
    features: ['Swiss Typography', 'Fine Hairlines', 'Alabaster Canvas'],
    thumbnailBg: 'bg-[#FAFAF8]',
  },
  {
    id: 'immersive',
    name: 'IMMERSIVE',
    category: 'Creative',
    careerFit: 'Designers, Photographers, Architects, Creators & Multidisciplinary Talent',
    designStyle: 'Full-Bleed Visual Storytelling',
    description: 'High-end visual storytelling portfolio with oversized hero text, full-width project imagery, deep dark contrast, and case-study layout.',
    badgeText: 'Visual Storytelling',
    previewGradient: 'from-[#0C0F17] via-[#161B2B] to-[#0C0F17]',
    accentColor: '#6366F1',
    darkHeader: true,
    features: ['Oversized Hero Typography', 'Full-Bleed Media', 'Dark/Light Contrast'],
    thumbnailBg: 'bg-[#0C0F17]',
  },
];

export const getTemplateById = (id?: TemplateId): PortfolioTemplateMeta => {
  const strId = id as string | undefined;
  let normalizedId: TemplateId | undefined = id;
  if (strId === 'modern-dark') normalizedId = 'obsidian';
  if (strId === 'minimal-editorial' || strId === 'minimal-clean') normalizedId = 'editorial';
  if (strId === 'creative-aurora' || strId === 'creative-portfolio') normalizedId = 'creative';
  if (strId === 'colorful-bento' || strId === 'colorful-vibes') normalizedId = 'bento';
  if (strId === 'professional') normalizedId = 'executive';

  const found = PORTFOLIO_TEMPLATES.find((t) => t.id === normalizedId);
  return found || PORTFOLIO_TEMPLATES[0];
};
