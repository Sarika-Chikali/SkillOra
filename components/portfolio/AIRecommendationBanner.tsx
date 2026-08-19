'use client';

import React from 'react';
import { UserPortfolio, TemplateId } from '@/lib/types/portfolio';
import { AIRecommendationService } from '@/lib/services/aiRecommendationService';
import { PortfolioService } from '@/lib/services/portfolioService';
import { Bot, CheckCircle2, Zap, Sparkles } from 'lucide-react';

interface AIRecommendationBannerProps {
  portfolio: UserPortfolio;
  onTemplateApplied?: (templateId: TemplateId) => void;
}

export const AIRecommendationBanner: React.FC<AIRecommendationBannerProps> = ({
  portfolio,
  onTemplateApplied,
}) => {
  const recommendation = AIRecommendationService.analyzePortfolio(portfolio);

  const isAlreadyActive = portfolio.selectedTemplateId === recommendation.recommendedTemplateId;

  const handleApplyAI = () => {
    PortfolioService.setSelectedTemplate(recommendation.recommendedTemplateId);
    if (onTemplateApplied) {
      onTemplateApplied(recommendation.recommendedTemplateId);
    }
  };

  return (
    <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-3xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6 text-white relative overflow-hidden" id="ai-recommendation-section">
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-indigo-900/60 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-cyan-400" /> AI DESIGN RECOMMENDATION
          </span>
          <span className="text-xs text-slate-400 font-mono">Deterministic Match Engine</span>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
          {recommendation.matchPercentage}% Profile Match
        </span>
      </div>

      {/* Main Rationale Card Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-center">
        
        {/* Left Recommendation Info (8 Cols) */}
        <div className="md:col-span-8 space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
              Recommended for you
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {recommendation.recommendedTemplateName}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl">
            &ldquo;{recommendation.aiAnalysisSummary}&rdquo;
          </p>

          <div className="pt-2 space-y-2">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Why this template?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recommendation.primaryReasons.map((reason, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Button Box (4 Cols) */}
        <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center space-y-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-indigo-900/60 md:pl-6">
          <button
            onClick={handleApplyAI}
            disabled={isAlreadyActive}
            className={`w-full py-3.5 px-5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              isAlreadyActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/40 hover:scale-[1.02]'
            }`}
          >
            {isAlreadyActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommended Template Active
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" /> Use Recommended Template
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center md:text-right">
            Zero-reload instant preview update
          </p>
        </div>

      </div>

    </section>
  );
};
