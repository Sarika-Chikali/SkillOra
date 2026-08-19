'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio, TemplateId, TemplateCategory } from '@/lib/types/portfolio';
import { PORTFOLIO_TEMPLATES, TEMPLATE_CATEGORIES, PortfolioTemplateMeta } from '@/lib/templates/templateRegistry';
import { PortfolioService } from '@/lib/services/portfolioService';
import { AIRecommendationService } from '@/lib/services/aiRecommendationService';
import { DynamicPortfolioRenderer } from './DynamicPortfolioRenderer';
import { Check, Eye, Sparkles, X, ArrowRight, LayoutTemplate, Layers, Bot, Zap, Briefcase, Paintbrush } from 'lucide-react';

interface TemplateSelectorProps {
  portfolio: UserPortfolio;
  onTemplateSelected?: (templateId: TemplateId) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  portfolio,
  onTemplateSelected,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('All Templates');
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplateMeta | null>(null);

  const activeTemplateId = portfolio.selectedTemplateId || 'obsidian';
  const aiRecommendation = AIRecommendationService.analyzePortfolio(portfolio);

  const filteredTemplates = PORTFOLIO_TEMPLATES.filter((template) => {
    if (selectedCategory === 'All Templates') return true;
    return template.category === selectedCategory;
  });

  const handleSelectTemplate = (templateId: TemplateId) => {
    const updated = PortfolioService.setSelectedTemplate(templateId);
    if (onTemplateSelected) {
      onTemplateSelected(templateId);
    }
  };

  return (
    <section className="space-y-8 pt-4 pb-10" id="templates-section">
      
      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white tracking-wider shadow-sm shadow-blue-500/20">
              PREMIUM DESIGN MARKETPLACE
            </span>
            <span className="text-xs font-bold text-slate-500">9 Genuinely Distinct Design Systems</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Choose Your Portfolio Experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Your work deserves a design that represents it.
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of 6 Distinct Templates with Scaled Real Portfolio Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => {
          const isSelected = activeTemplateId === template.id || 
            (activeTemplateId === 'modern-dark' && template.id === 'obsidian') ||
            (activeTemplateId === 'minimal-editorial' && template.id === 'editorial') ||
            (activeTemplateId === 'colorful-bento' && template.id === 'bento') ||
            (activeTemplateId === 'creative-aurora' && template.id === 'creative') ||
            (activeTemplateId === 'professional' && template.id === 'executive');

          const isAIRecommended = aiRecommendation.recommendedTemplateId === template.id;

          return (
            <motion.div
              key={template.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`group bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between relative ${
                isSelected
                  ? 'border-blue-600 ring-4 ring-blue-600/20 shadow-2xl shadow-blue-500/10'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xl'
              }`}
            >
              {/* Scaled Live Portfolio Preview Card Thumbnail (Miniature Version of Actual User Data) */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950 border-b border-slate-200">
                
                {/* Scaled Live Component Rendering User's Actual Portfolio Data */}
                <div className="w-[300%] h-[300%] transform scale-[0.333] origin-top-left pointer-events-none select-none overflow-hidden">
                  <DynamicPortfolioRenderer
                    portfolio={portfolio}
                    overrideTemplateId={template.id}
                    isEditable={false}
                  />
                </div>

                {/* Top Category & Status Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-950/80 backdrop-blur-md text-white border border-white/20">
                    {template.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {isAIRecommended && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-300" /> AI Pick ({aiRecommendation.matchPercentage}%)
                      </span>
                    )}
                    {isSelected && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white shadow-lg flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Quick Action Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-white text-slate-900 shadow-lg flex items-center gap-1.5 hover:bg-slate-100 transition-transform hover:scale-105"
                  >
                    <Eye className="w-4 h-4 text-blue-600" /> View Full Demo
                  </button>
                </div>
              </div>

              {/* Template Meta Info & Actions */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{template.name}</h3>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 shrink-0">
                      {template.badgeText}
                    </span>
                  </div>

                  {/* Dual Dimensions: Career Fit & Design Style */}
                  <div className="space-y-1.5 pt-0.5">
                    <p className="text-[11px] font-bold text-slate-700 flex items-start gap-1.5 leading-tight">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Career Fit: <span className="text-slate-900 font-semibold">{template.careerFit}</span></span>
                    </p>
                    <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="text-purple-600 font-extrabold text-xs">✦</span>
                      <span className="text-slate-900 font-semibold">{template.designStyle}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Demo
                  </button>

                  <button
                    onClick={() => handleSelectTemplate(template.id)}
                    disabled={isSelected}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default font-bold'
                        : isAIRecommended
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 hover:scale-[1.02]'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Selected
                      </>
                    ) : isAIRecommended ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-300" /> Apply AI Pick
                      </>
                    ) : (
                      <>
                        Use Template
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Interactive Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Live Design System Demo: {previewTemplate.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{previewTemplate.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleSelectTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Use This Design System
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <DynamicPortfolioRenderer
                portfolio={portfolio}
                overrideTemplateId={previewTemplate.id}
                isEditable={false}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
