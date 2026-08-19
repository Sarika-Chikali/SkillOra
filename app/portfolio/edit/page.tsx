'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioNavbar } from '@/components/portfolio/PortfolioNavbar';
import { PortfolioEditor } from '@/components/portfolio/PortfolioEditor';
import { ShareModal } from '@/components/portfolio/ShareModal';
import { DeploymentModal } from '@/components/portfolio/DeploymentModal';
import { PortfolioService, PORTFOLIO_UPDATED_EVENT } from '@/lib/services/portfolioService';
import { UserPortfolio } from '@/lib/types/portfolio';

import { initialPortfolio } from '@/lib/data/mockPortfolio';

export default function PortfolioEditPage() {
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

    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PortfolioNavbar
        onShareClick={() => setShareModalOpen(true)}
        onDeployClick={() => setDeployModalOpen(true)}
      />
      
      <main>
        <PortfolioEditor />
      </main>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        username={portfolio.username}
      />

      <DeploymentModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        portfolio={portfolio}
        onDeploymentSuccess={() => setPortfolio(PortfolioService.getPortfolio())}
      />
    </div>
  );
}
