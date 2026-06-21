import PortfolioListClient from '@/components/portfolio/PortfolioListClient';
import { PortfolioCategory } from '@/data/portfolio';
import { getPortfolioCards } from '@/lib/portfolio-content';
import { siteConfig } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '포트폴리오',
  description:
    '프론트엔드 개발 및 UI/UX 디자인 프로젝트 경험과 작업물을 확인하세요. React, Next.js, TypeScript를 활용한 웹 개발 프로젝트를 소개합니다.',
  keywords: [
    '포트폴리오',
    '프론트엔드 개발',
    'UI/UX 디자인',
    'React',
    'Next.js',
    '웹 개발 프로젝트',
  ],
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: '포트폴리오 | ' + siteConfig.name,
    description:
      '프론트엔드 개발 및 UI/UX 디자인 프로젝트 경험과 작업물을 확인하세요.',
    type: 'website',
    url: `${siteConfig.url}/portfolio`,
  },
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const cards = getPortfolioCards();
  const initialCategory: PortfolioCategory | 'all' =
    category === 'design' || category === 'development' ? category : 'all';

  return (
    <div className="max-w-7xl mx-auto max-lg:px-5">
      <h1 className="text-4xl font-medium mb-8">포트폴리오</h1>
      <PortfolioListClient cards={cards} initialCategory={initialCategory} />
    </div>
  );
}
