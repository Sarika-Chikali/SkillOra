'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioService, PORTFOLIO_UPDATED_EVENT } from '@/lib/services/portfolioService';
import { UserPortfolio } from '@/lib/types/portfolio';
import { PortfolioNavbar } from '@/components/portfolio/PortfolioNavbar';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { ShareModal } from '@/components/portfolio/ShareModal';

export default function PortfolioOverviewPage() {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    // Initial fetch from centralized PortfolioService
    setPortfolio(PortfolioService.getPortfolio());

    // Listen for portfolio updates across components/windows
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

    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PortfolioNavbar onShareClick={() => setShareModalOpen(true)} />
      
      <main>
        <PortfolioView
          portfolio={portfolio}
          onShareClick={() => setShareModalOpen(true)}
          isEditable={true}
        />
      </main>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        username={portfolio.username}
      />
    </div>
  );
}
