import BlogSection from '@/components/home/BlogSection';
import BubbleModelScene from '@/components/home/BubbleModelScene';
import ContactSection from '@/components/home/ContactSection';
import DesignPortfolioSection from '@/components/home/DesignPortfolioSection';
import DevelopmentHeroSection from '@/components/home/DevelopmentHeroSection';
import { getFeaturedCards, getPortfolioCards } from '@/services/portfolio.notion.api';
import { siteConfig } from '@/lib/seo';
import { getBlogPosts } from '@/services/notion.api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} - 프론트엔드 개발자 포트폴리오 & 기술 블로그`,
  },
  description:
    '프론트엔드 개발자 준희의 요람일지입니다. React, Next.js, TypeScript를 활용한 웹 개발 프로젝트와 기술 블로그를 확인하세요.',
  keywords: [
    '프론트엔드 개발자',
    '포트폴리오',
    '기술 블로그',
    'React',
    'Next.js',
    'TypeScript',
    '웹 개발',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteConfig.name} - 프론트엔드 개발자 포트폴리오 & 기술 블로그`,
    description:
      '프론트엔드 개발자 준희의 요람일지입니다. React, Next.js, TypeScript를 활용한 웹 개발 프로젝트와 기술 블로그를 확인하세요.',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function MainPage() {
  const posts = await getBlogPosts();

  const [featuredDev, designCards] = await Promise.all([
    getFeaturedCards(3),
    getPortfolioCards('design'),
  ]);

  return (
    <div className="relative flex flex-col items-center justify-center text-center overflow-x-hidden overflow-y-hidden">
      {/* 섹션 0: 개발 포트폴리오 히어로 배너 */}
      <section
        className="w-full min-h-screen flex items-center justify-center py-20 pointer-events-auto"
        aria-label="Development Portfolio Section">
        <DevelopmentHeroSection cards={featuredDev} />
      </section>

      {/* 섹션 1: 디자인 포트폴리오 */}
      <section
        className="w-full min-h-screen flex items-center justify-center py-20 pointer-events-auto"
        aria-label="Design Portfolio Section">
        <DesignPortfolioSection designPortfolios={designCards} />
      </section>

      {/* 섹션 2: 블로그 */}
      <section
        className="w-full min-h-screen flex items-center justify-center py-20"
        aria-label="Blog Section">
        <BlogSection posts={posts} />
      </section>

      {/* 섹션 3: Contact */}
      <section
        className="w-full h-screen relative pointer-events-auto"
        aria-label="Contact Section">
        <ContactSection />
      </section>

      <BubbleModelScene />
    </div>
  );
}
