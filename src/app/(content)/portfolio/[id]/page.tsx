import PortfolioNotionDetail from '@/components/portfolio/PortfolioNotionDetail';
import {
  generateBreadcrumbJsonLd,
  generatePortfolioJsonLd,
  siteConfig,
} from '@/lib/seo';
import { getPostContentWithChildren } from '@/services/notion.api';
import {
  getAdjacent,
  getPortfolioBySlug,
  getPortfolioSlugs,
} from '@/services/portfolio.notion.api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

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
        ? [{ url: meta.thumbnail, width: 1200, height: 630, alt: meta.title }]
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

  const [blocks, adjacent] = await Promise.all([
    getPostContentWithChildren(meta.pageId),
    getAdjacent(id),
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
      <PortfolioNotionDetail
        meta={meta}
        blocks={blocks}
        prev={adjacent.prev}
        next={adjacent.next}
      />
    </>
  );
}
