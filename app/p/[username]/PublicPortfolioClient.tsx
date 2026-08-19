'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioService, PORTFOLIO_UPDATED_EVENT } from '@/lib/services/portfolioService';
import { UserPortfolio } from '@/lib/types/portfolio';
import { DynamicPortfolioRenderer } from '@/components/portfolio/DynamicPortfolioRenderer';
import { PortfolioNavbar } from '@/components/portfolio/PortfolioNavbar';
import { ShareModal } from '@/components/portfolio/ShareModal';

import { initialPortfolio } from '@/lib/data/mockPortfolio';

interface Props {
  username: string;
}

export default function PublicPortfolioClient({ username }: Props) {
  const [portfolio, setPortfolio] = useState<UserPortfolio>(initialPortfolio);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const data = PortfolioService.getPortfolio();
    setPortfolio(data);

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
  }, [username]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PortfolioNavbar onShareClick={() => setShareModalOpen(true)} />
      
      <main>
        <DynamicPortfolioRenderer
          portfolio={portfolio}
          onShareClick={() => setShareModalOpen(true)}
          isEditable={false}
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
