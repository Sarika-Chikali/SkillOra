'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioService, PORTFOLIO_UPDATED_EVENT } from '@/lib/services/portfolioService';
import { UserPortfolio } from '@/lib/types/portfolio';
import { PortfolioNavbar } from '@/components/portfolio/PortfolioNavbar';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { TemplateSelector } from '@/components/portfolio/TemplateSelector';
import { CareerPortfolioGuide } from '@/components/portfolio/CareerPortfolioGuide';
import { AIRecommendationBanner } from '@/components/portfolio/AIRecommendationBanner';
import { ShareModal } from '@/components/portfolio/ShareModal';
import { DeploymentModal } from '@/components/portfolio/DeploymentModal';

import { initialPortfolio } from '@/lib/data/mockPortfolio';

export default function PortfolioOverviewPage() {
  const [portfolio, setPortfolio] = useState<UserPortfolio>(initialPortfolio);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  useEffect(() => {
    setPortfolio(PortfolioService.getPortfolio());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserPortfolio>;
      if (customEvent.detail) {
        setPortfolio(customEvent.detail);
      } else {
        setPortfolio(PortfolioService.getPortfolio());
      }
    };

    window.addEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Auto-open Deployment Modal if returning from OAuth authorization callback
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('deployment') || params.has('connected') || params.has('connection')) {
        setDeployModalOpen(true);
      }
    }

    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Studio Top Navigation Bar */}
      <PortfolioNavbar
        onShareClick={() => setShareModalOpen(true)}
        onDeployClick={() => setDeployModalOpen(true)}
      />

      <main className="space-y-16">
        
        {/* SECTION 1: ORIGINAL CLEAN WHITE SKILLORA PORTFOLIO */}
        <section id="original-portfolio-section">
          <PortfolioView
            portfolio={portfolio}
            onShareClick={() => setShareModalOpen(true)}
            isEditable={true}
          />
        </section>

        {/* SECTION 2: PREMIUM TEMPLATE GALLERY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="section-template-gallery">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-10">
            
            {/* AI Recommendation Box */}
            <AIRecommendationBanner
              portfolio={portfolio}
              onTemplateApplied={() => {
                setPortfolio(PortfolioService.getPortfolio());
              }}
            />

            {/* Premium Template Selector */}
            <TemplateSelector
              portfolio={portfolio}
              onTemplateSelected={() => {
                setPortfolio(PortfolioService.getPortfolio());
              }}
            />

            {/* Compact Career Guidance */}
            <CareerPortfolioGuide
              onSelectTemplate={(templateId) => {
                PortfolioService.setSelectedTemplate(templateId);
                setPortfolio(PortfolioService.getPortfolio());
              }}
            />

          </div>
        </section>

      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        username={portfolio.username}
      />

      {/* Deployment Provider Modal */}
      <DeploymentModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        portfolio={portfolio}
        onDeploymentSuccess={() => setPortfolio(PortfolioService.getPortfolio())}
      />
    </div>
  );
}
