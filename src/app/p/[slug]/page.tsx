import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPortfolioServer } from "@/lib/portfolioServer";
import { PORTFOLIO_TEMPLATES } from "@/components/portfolio/templates";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicPortfolioServer(slug);
  if (!result) return { title: "Portfolio not found — SkillOra" };

  const { data } = result;
  const title = `${data.displayName || "Portfolio"}${data.headline ? ` — ${data.headline}` : ""}`;
  const description = data.tagline || data.about || "Built with SkillOra.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: "SkillOra",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPublicPortfolioServer(slug);
  if (!result) notFound();

  const { data, projects } = result;
  const Template = PORTFOLIO_TEMPLATES[data.template].component;

  return (
    <Template
      profile={{
        name: data.displayName,
        photoURL: data.photoURL,
        avatarColor: data.avatarColor,
        email: "",
      }}
      data={data}
      projects={projects}
    />
  );
}
