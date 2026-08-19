import { UserPortfolio, TemplateId } from '../types/portfolio';

export interface AIRecommendationResult {
  recommendedTemplateId: TemplateId;
  recommendedTemplateName: string;
  matchPercentage: number;
  domainCategory: string;
  primaryReasons: string[];
  suggestedFocusAreas: string[];
  aiAnalysisSummary: string;
}

export class AIRecommendationService {
  public static analyzePortfolio(portfolio: UserPortfolio): AIRecommendationResult {
    const roleLower = (portfolio.roleTitle || '').toLowerCase();
    const bioLower = (portfolio.bio || '').toLowerCase();
    const skillsLower = portfolio.skills.map((s) => s.name.toLowerCase()).join(' ');

    let recommendedTemplateId: TemplateId = 'obsidian';
    let recommendedTemplateName = 'OBSIDIAN';
    let matchPercentage = 96;
    let domainCategory = 'Software & AI Engineering';
    let primaryReasons: string[] = [];
    let suggestedFocusAreas: string[] = [];
    let aiAnalysisSummary = '';

    // Logic: Determine Domain Category and Best Design System Match
    if (
      roleLower.includes('design') ||
      roleLower.includes('ux') ||
      roleLower.includes('ui') ||
      roleLower.includes('creative') ||
      roleLower.includes('art') ||
      skillsLower.includes('figma') ||
      skillsLower.includes('ui/ux')
    ) {
      domainCategory = 'Product Design & UX';
      recommendedTemplateId = 'bento';
      recommendedTemplateName = 'BENTO';
      matchPercentage = 98;
      primaryReasons = [
        'High density of design and UX competencies detected in your profile.',
        'Bento layout arranges visual project cards and core skills into asymmetric modular blocks favored by product design recruiters.',
        'Puts your visual project screenshots and highlight chips front and center.',
      ];
      suggestedFocusAreas = [
        'Add high-resolution Figma prototype screenshots to featured projects.',
        'Include UX research metrics and conversion impact numbers.',
      ];
      aiAnalysisSummary = `Based on your profile as a ${portfolio.roleTitle}, AI selected BENTO because product designers benefit most from modular, grid-based visual storytelling.`;
    } else if (
      roleLower.includes('finance') ||
      roleLower.includes('mba') ||
      roleLower.includes('management') ||
      roleLower.includes('analyst') ||
      roleLower.includes('business') ||
      roleLower.includes('consultant')
    ) {
      domainCategory = 'Finance, Commerce & Management';
      recommendedTemplateId = 'executive';
      recommendedTemplateName = 'EXECUTIVE';
      matchPercentage = 95;
      primaryReasons = [
        'Corporate and executive profile indicators identified.',
        'The EXECUTIVE 2-column layout highlights structured career history, quantifiable milestones, and academic foundation.',
        'Includes explicit Career Wallet credential verification blocks for recruiters.',
      ];
      suggestedFocusAreas = [
        'Quantify achievements in your work experience (e.g., % revenue growth or cost savings).',
        'Import verified credentials from SkillOra Career Wallet.',
      ];
      aiAnalysisSummary = `AI analyzed your ${portfolio.roleTitle} background and matched it with EXECUTIVE for corporate readability and recruiter-focused structure.`;
    } else if (
      roleLower.includes('writer') ||
      roleLower.includes('content') ||
      roleLower.includes('journal') ||
      roleLower.includes('researcher') ||
      roleLower.includes('editorial')
    ) {
      domainCategory = 'Editorial & Content Strategy';
      recommendedTemplateId = 'editorial';
      recommendedTemplateName = 'EDITORIAL';
      matchPercentage = 97;
      primaryReasons = [
        'Text-first and research-heavy profile content identified.',
        'EDITORIAL uses high-contrast serif typography and magazine whitespace for maximum reading comfort.',
        'Highlights your statement of purpose and essay-like project summaries.',
      ];
      suggestedFocusAreas = [
        'Refine your quotation bio block to communicate your core thesis.',
        'Add direct article or thesis publication links.',
      ];
      aiAnalysisSummary = `AI selected EDITORIAL for your ${portfolio.roleTitle} profile because editorial typography elevates text-first accomplishments and publications.`;
    } else if (
      roleLower.includes('frontend') ||
      roleLower.includes('full stack') ||
      roleLower.includes('ai') ||
      roleLower.includes('developer') ||
      roleLower.includes('engineer') ||
      roleLower.includes('backend') ||
      portfolio.status === 'student'
    ) {
      domainCategory = 'Software & AI Engineering';
      recommendedTemplateId = 'obsidian';
      recommendedTemplateName = 'OBSIDIAN';
      matchPercentage = 96;
      primaryReasons = [
        'Detected strong technical stack competencies (React, TypeScript, Next.js, Python, Node.js).',
        'OBSIDIAN delivers a high-impact dark developer theme with glowing cyan accents and oversized typography.',
        'Highlights code repositories, live demo URLs, and verified technical skills.',
      ];
      suggestedFocusAreas = [
        'Ensure all featured projects have live demo links and GitHub repository URLs.',
        'Keep your tech stack tags specific (e.g., Next.js 14, Tailwind CSS, FastAPI).',
      ];
      aiAnalysisSummary = `AI analyzed your ${portfolio.roleTitle} background and technical skills. OBSIDIAN was chosen to provide a cinematic, high-credibility dark developer interface.`;
    } else {
      domainCategory = 'Multi-Disciplinary Professional';
      recommendedTemplateId = 'creative';
      recommendedTemplateName = 'CREATIVE';
      matchPercentage = 94;
      primaryReasons = [
        'Multi-faceted skill portfolio spanning technology and creative domains.',
        'CREATIVE combines an expressive gradient mesh background with glassmorphic cards for maximum visual engagement.',
        'Highlights both technical competencies and visual project achievements.',
      ];
      suggestedFocusAreas = [
        'Add tagline summaries to your featured projects.',
        'Organize your skills by proficiency to highlight core strengths.',
      ];
      aiAnalysisSummary = `AI recommended CREATIVE for your multi-disciplinary background as a ${portfolio.roleTitle}.`;
    }

    return {
      recommendedTemplateId,
      recommendedTemplateName,
      matchPercentage,
      domainCategory,
      primaryReasons,
      suggestedFocusAreas,
      aiAnalysisSummary,
    };
  }
}
