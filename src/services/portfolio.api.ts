import { portfolioItems } from '@/content/portfolio';
import type {
  PortfolioBlock,
  PortfolioCard,
  PortfolioCategory,
  PortfolioItem,
  PortfolioMeta,
} from '@/types/portfolio.type';

/**
 * 포트폴리오 조회 API.
 *
 * 정본은 `src/content/portfolio/*.ts` 라서 외부 호출이 없고, 모든 함수가 동기 값을 반환합니다.
 * 호출부(홈·목록·상세·sitemap·llms.txt)가 서버 컴포넌트라 async 시그니처는 그대로 둡니다.
 * 전환 경위는 `docs/adr/ADR-0002-portfolio-static-git-ssot.md` 에 있습니다.
 */

function toCard(item: PortfolioMeta): PortfolioCard {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    category: item.category,
    period: item.period,
    thumbnail: item.thumbnail,
    color: item.color,
    skills: item.skills,
    type: item.type,
    role: item.role,
    metrics: item.metrics,
    featured: item.featured,
  };
}

function toMeta({ blocks: _blocks, ...meta }: PortfolioItem): PortfolioMeta {
  return meta;
}

/** 목록·홈용 카드. category 로 걸러냅니다. */
export async function getPortfolioCards(
  category?: PortfolioCategory,
): Promise<PortfolioCard[]> {
  return portfolioItems
    .filter((item) => !category || item.category === category)
    .map(toCard);
}

/** 홈 Selected Work: 대표를 앞세우고 남는 자리는 나머지 개발 케이스로 채워 N개. */
export async function getFeaturedCards(limit = 6): Promise<PortfolioCard[]> {
  const dev = portfolioItems.filter((item) => item.category === 'development');
  const featured = dev.filter((item) => item.featured);
  const rest = dev.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, limit).map(toCard);
}

/** generateStaticParams·sitemap 용 slug 목록. */
export async function getPortfolioSlugs(): Promise<string[]> {
  return portfolioItems.map((item) => item.id);
}

/** slug 로 단일 케이스 메타 조회. 없으면 null. */
export async function getPortfolioBySlug(
  slug: string,
): Promise<PortfolioMeta | null> {
  const item = portfolioItems.find((candidate) => candidate.id === slug);
  return item ? toMeta(item) : null;
}

/** slug 로 본문 블록 조회. 없으면 빈 배열. */
export async function getPortfolioBlocks(
  slug: string,
): Promise<PortfolioBlock[]> {
  return portfolioItems.find((item) => item.id === slug)?.blocks ?? [];
}

/** 이전·다음 케이스 (정본 배열 순서 기준). */
export async function getAdjacent(slug: string): Promise<{
  prev: PortfolioMeta | null;
  next: PortfolioMeta | null;
}> {
  const index = portfolioItems.findIndex((item) => item.id === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? toMeta(portfolioItems[index - 1]) : null,
    next:
      index < portfolioItems.length - 1
        ? toMeta(portfolioItems[index + 1])
        : null,
  };
}
