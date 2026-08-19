'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPortfolio, TemplateId } from '@/lib/types/portfolio';
import { PortfolioView } from './PortfolioView';
import { ObsidianTemplate } from './templates/ObsidianTemplate';
import { ModernDarkTemplate } from './templates/ModernDarkTemplate';
import { EditorialTemplate } from './templates/EditorialTemplate';
import { MinimalEditorialTemplate } from './templates/MinimalEditorialTemplate';
import { MinimalCleanTemplate } from './templates/MinimalCleanTemplate';
import { BentoTemplate } from './templates/BentoTemplate';
import { ColorfulBentoTemplate } from './templates/ColorfulBentoTemplate';
import { ColorfulVibesTemplate } from './templates/ColorfulVibesTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { CreativeAuroraTemplate } from './templates/CreativeAuroraTemplate';
import { CreativePortfolioTemplate } from './templates/CreativePortfolioTemplate';
import { DeveloperHubTemplate } from './templates/DeveloperHubTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { AuroraTemplate } from './templates/AuroraTemplate';
import { NeoMinimalTemplate } from './templates/NeoMinimalTemplate';
import { ImmersiveTemplate } from './templates/ImmersiveTemplate';

interface DynamicPortfolioRendererProps {
  portfolio: UserPortfolio;
  overrideTemplateId?: TemplateId;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const DynamicPortfolioRenderer: React.FC<DynamicPortfolioRendererProps> = ({
  portfolio,
  overrideTemplateId,
  onShareClick,
  isEditable = false,
}) => {
  const activeTemplateId = overrideTemplateId || portfolio.selectedTemplateId || 'obsidian';

  const renderTemplate = () => {
    switch (activeTemplateId as string) {
      case 'obsidian':
        return <ObsidianTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'modern-dark':
        return <ModernDarkTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'editorial':
        return <EditorialTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'minimal-editorial':
        return <MinimalEditorialTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'minimal-clean':
        return <MinimalCleanTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'bento':
        return <BentoTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'colorful-bento':
        return <ColorfulBentoTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'colorful-vibes':
        return <ColorfulVibesTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'creative':
        return <CreativeTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'creative-aurora':
        return <CreativeAuroraTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'creative-portfolio':
        return <CreativePortfolioTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'developer-hub':
        return <DeveloperHubTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'executive':
        return <ExecutiveTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'professional':
        return <ProfessionalTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'aurora':
        return <AuroraTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'neo-minimal':
        return <NeoMinimalTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
      case 'immersive':
        return <ImmersiveTemplate portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;

      case 'default-overview':
      default:
        return <PortfolioView portfolio={portfolio} onShareClick={onShareClick} isEditable={isEditable} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTemplateId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {renderTemplate()}
      </motion.div>
    </AnimatePresence>
  );
};
