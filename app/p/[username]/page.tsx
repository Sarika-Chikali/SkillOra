import React from 'react';
import { Metadata } from 'next';
import { initialPortfolio } from '@/lib/data/mockPortfolio';
import PublicPortfolioClient from './PublicPortfolioClient';

interface Props {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;
  // Use initialPortfolio or mock data for server-side OG meta tags
  const portfolio = initialPortfolio;

  const title = `${portfolio.fullName} - ${portfolio.roleTitle}`;
  const description = `Passionate ${portfolio.roleTitle}. ${portfolio.bio.slice(0, 120)}...`;

  return {
    title: `${title} | SkillOra Portfolio Studio`,
    description,
    openGraph: {
      title,
      description,
      url: `https://skillora.app/p/${username}`,
      siteName: 'SkillOra Portfolio Studio',
      images: [
        {
          url: portfolio.avatarUrl,
          width: 800,
          height: 800,
          alt: portfolio.fullName,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [portfolio.avatarUrl],
    },
  };
}

export default function PublicPortfolioPage({ params }: Props) {
  return <PublicPortfolioClient username={params.username} />;
}
