import PortfolioDetail from '@/components/portfolio/PortfolioDetail';
import { getViewsForPath } from '@/lib/analytics';
import {
  generateBreadcrumbJsonLd,
  generatePortfolioJsonLd,
  siteConfig,
} from '@/lib/seo';
import {
  getAdjacent,
  getPortfolioBlocks,
  getPortfolioBySlug,
  getPortfolioSlugs,
} from '@/services/portfolio.api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

// 본문은 Git 정본이라 재생성이 필요 없고, 이 주기는 GA4 조회수를 다시 읽기 위한 것입니다.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const meta = await getPortfolioBySlug(id);

  if (!meta) {
    return { title: '프로젝트를 찾을 수 없습니다' };
  }

  return {
    title: `${meta.title} | 포트폴리오`,
    description: meta.description,
    keywords: [
      meta.title,
      '포트폴리오',
      meta.category === 'development' ? '개발' : '디자인',
      ...meta.skills.slice(0, 5),
    ],
    alternates: { canonical: `/portfolio/${id}` },
    openGraph: {
      title: `${meta.title} | 포트폴리오 | ${siteConfig.name}`,
      description: meta.description,
      type: 'article',
      url: `${siteConfig.url}/portfolio/${id}`,
      images: meta.thumbnail
        ? [
            {
              url: meta.thumbnail,
              width: meta.coverWidth,
              height: meta.coverHeight,
              alt: meta.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const meta = await getPortfolioBySlug(id);

  if (!meta) {
    notFound();
  }

  const [blocks, adjacent, views] = await Promise.all([
    getPortfolioBlocks(id),
    getAdjacent(id),
    getViewsForPath(`/portfolio/${id}`),
  ]);

  const portfolioJsonLd = generatePortfolioJsonLd({
    title: meta.title,
    description: meta.description,
    image: meta.thumbnail,
    url: `${siteConfig.url}/portfolio/${id}`,
    dateCreated: meta.period,
    skills: meta.skills,
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', url: siteConfig.url },
    { name: '포트폴리오', url: `${siteConfig.url}/portfolio` },
    { name: meta.title, url: `${siteConfig.url}/portfolio/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PortfolioDetail
        meta={meta}
        blocks={blocks}
        prev={adjacent.prev}
        next={adjacent.next}
        views={views}
      />
    </>
  );
}
