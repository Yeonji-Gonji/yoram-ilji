import BlogSection, { HomeBlogPost } from '@/components/home/BlogSection';
import BubbleModelScene from '@/components/home/BubbleModelScene';
import ContactSection from '@/components/home/ContactSection';
import DesignBannerSection from '@/components/home/DesignBannerSection';
import DevelopmentSection from '@/components/home/DevelopmentSection';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import { siteConfig } from '@/lib/seo';
import { getBlogPosts, getPostExcerpt } from '@/services/notion.api';
import {
  getFeaturedCards,
  getPortfolioCards,
} from '@/services/portfolio.notion.api';
import dayjs from 'dayjs';
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

/** 홈 블로그 그리드 노출 수 (lg 기준 4×2) */
const HOME_BLOG_COUNT = 8;

/** 최신 8개 글에만 본문 요약을 붙인다 (글마다 블록 조회 1회, ISR 캐시로 상쇄) */
async function getHomeBlogPosts(): Promise<HomeBlogPost[]> {
  const posts = await getBlogPosts();

  const latest = [...posts]
    .sort((a, b) =>
      dayjs(
        b.properties.날짜?.date?.start ?? b.properties.생성일.created_time,
      ).diff(
        dayjs(
          a.properties.날짜?.date?.start ?? a.properties.생성일.created_time,
        ),
      ),
    )
    .slice(0, HOME_BLOG_COUNT);

  return Promise.all(
    latest.map(async (page) => ({
      page,
      excerpt: await getPostExcerpt(page.id),
    })),
  );
}

export default async function MainPage() {
  const [homePosts, featuredDev, designCards] = await Promise.all([
    getHomeBlogPosts(),
    getFeaturedCards(6),
    getPortfolioCards('design'),
  ]);

  return (
    <div className="relative flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden text-center">
      {/* 섹션 0: 인트로 히어로 (h1) */}
      <section
        className="relative flex items-center justify-center w-full min-h-screen py-20 pointer-events-auto"
        aria-label="Intro Section">
        <HomeHeroSection />
      </section>

      {/* 섹션 1: 개발 포트폴리오 (coverflow 캐러셀) */}
      <section
        className="flex items-center justify-center w-full min-h-screen py-20 pointer-events-auto"
        aria-label="Development Portfolio Section">
        <DevelopmentSection cards={featuredDev} />
      </section>

      {/* 섹션 2: 디자인 포트폴리오 — 화면 높이를 차지하지 않는 전폭 띠배너 (흐름 브레이크).
          섹션 높이가 100vh가 아니어도 BubbleModelScene이 DOM 경계로 섹션을 판정한다 */}
      <section
        className="flex items-center justify-center w-full py-16 pointer-events-auto"
        aria-label="Design Portfolio Section">
        <DesignBannerSection designPortfolios={designCards} />
      </section>

      {/* 섹션 3: 블로그 (4×2 그리드 + 본문 요약) */}
      <section
        className="flex items-center justify-center w-full min-h-screen py-20"
        aria-label="Blog Section">
        <BlogSection posts={homePosts} />
      </section>

      {/* 섹션 4: Contact */}
      <section
        className="relative w-full h-screen pointer-events-auto"
        aria-label="Contact Section">
        <ContactSection />
      </section>

      <BubbleModelScene />
    </div>
  );
}
