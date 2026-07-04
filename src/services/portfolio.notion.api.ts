import { PortfolioCategory } from '@/data/portfolio';
import { appConfig } from '@/lib/config';
import { PortfolioCard } from '@/lib/portfolio-content';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// API 키(NOTION_API_KEY)는 블로그와 동일한 integration을 재사용한다.
const PORTFOLIO_DS_ID = appConfig.notion.portfolioDataSourceId;

/* ───────── property 추출 헬퍼 ───────── */
const asTitle = (p: any): string => p?.title?.[0]?.plain_text ?? '';
const asText = (p: any): string => p?.rich_text?.[0]?.plain_text ?? '';
const asSelect = (p: any): string | undefined => p?.select?.name ?? undefined;
const asNumber = (p: any): number | undefined => p?.number ?? undefined;
const asCheck = (p: any): boolean => p?.checkbox ?? false;
const asUrl = (p: any): string | undefined => p?.url ?? undefined;
const splitComma = (s: string): string[] =>
  s
    ? s
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    : [];
const splitMid = (s: string): string[] =>
  s
    ? s
        .split(' · ')
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

export interface PortfolioNotionMeta {
  id: string; // slug (URL)
  pageId: string; // Notion 페이지 id
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  period: string;
  role: string;
  team?: string;
  skills: string[]; // 기술스택 또는 도구
  type?: string; // 디자인 유형
  metrics: string[];
  thumbnail: string; // 카드 썸네일: 썸네일 속성(상대경로) 우선, 없으면 커버 프록시
  coverImage: string; // 상세 상단 커버(프록시 URL), 없으면 ''
  color: string;
  featured: boolean;
  github?: string;
  live?: string;
}

function toMeta(page: any): PortfolioNotionMeta {
  const props = page.properties;
  // 카드 썸네일·상세 커버 = 항상 Notion 페이지 커버 (단일 소스).
  // - Notion 파일 커버: S3 URL이 만료되므로 프록시 경유
  // - 외부 URL 커버: 직접 사용하되, 자기 도메인이면 상대경로로 변환 (로컬 dev에서도 동작)
  let coverUrl = '';
  if (page.cover) {
    if (page.cover.type === 'external') {
      const url: string = page.cover.external.url;
      coverUrl = url.startsWith(appConfig.siteUrl)
        ? url.slice(appConfig.siteUrl.length)
        : url;
    } else {
      coverUrl = `/api/notion-image?type=cover&pageId=${page.id}`;
    }
  }
  const category = (asSelect(props['분류']) ??
    'development') as PortfolioCategory;
  const skills =
    category === 'design'
      ? splitComma(asText(props['도구']))
      : splitComma(asText(props['기술스택']));
  return {
    id: asText(props['slug']) || page.id,
    pageId: page.id,
    title: asTitle(props['이름']),
    subtitle: asText(props['부제']),
    description: asText(props['설명']),
    category,
    period: asText(props['기간']),
    role: asText(props['역할']),
    team: asText(props['팀']) || undefined,
    skills,
    type: asText(props['유형']) || undefined,
    metrics: splitMid(asText(props['지표'])),
    thumbnail: coverUrl,
    coverImage: coverUrl,
    color: '#6b6864',
    featured: asCheck(props['대표']),
    github: asUrl(props['GitHub']),
    live: asUrl(props['Live']),
  };
}

function toCard(m: PortfolioNotionMeta): PortfolioCard {
  return {
    id: m.id,
    title: m.title,
    subtitle: m.subtitle,
    description: m.description,
    category: m.category,
    period: m.period,
    thumbnail: m.thumbnail,
    color: m.color,
    skills: m.skills,
    type: m.type,
    role: m.role,
    metrics: m.metrics,
    featured: m.featured,
  };
}

/** 발행된 모든 케이스 메타 (정렬: 순서 오름차순 → 기간 역순). */
async function getAllMeta(): Promise<PortfolioNotionMeta[]> {
  try {
    const res = await notion.dataSources.query({
      data_source_id: PORTFOLIO_DS_ID,
      filter: { property: '발행', checkbox: { equals: true } },
      sorts: [{ property: '순서', direction: 'ascending' }],
    });
    return (res.results as any[]).map(toMeta);
  } catch (error) {
    console.error('[Portfolio Notion] query error:', error);
    return [];
  }
}

/** 목록/홈용 카드. category로 필터. */
export async function getPortfolioCards(
  category?: PortfolioCategory,
): Promise<PortfolioCard[]> {
  const all = await getAllMeta();
  return all.filter((m) => !category || m.category === category).map(toCard);
}

/** 홈 Selected Work용: featured를 앞세우고, 남는 자리는 나머지 개발 케이스로 채워 N개. */
export async function getFeaturedCards(limit = 6): Promise<PortfolioCard[]> {
  const dev = (await getAllMeta()).filter((m) => m.category === 'development');
  const featured = dev.filter((m) => m.featured);
  const rest = dev.filter((m) => !m.featured);
  return [...featured, ...rest].slice(0, limit).map(toCard);
}

/** generateStaticParams · sitemap용 slug 목록. */
export async function getPortfolioSlugs(): Promise<string[]> {
  return (await getAllMeta()).map((m) => m.id);
}

/** slug로 단일 케이스 메타 조회. 없으면 null. */
export async function getPortfolioBySlug(
  slug: string,
): Promise<PortfolioNotionMeta | null> {
  try {
    const res = await notion.dataSources.query({
      data_source_id: PORTFOLIO_DS_ID,
      filter: {
        and: [
          { property: '발행', checkbox: { equals: true } },
          { property: 'slug', rich_text: { equals: slug } },
        ],
      },
    });
    const page = (res.results as any[])[0];
    return page ? toMeta(page) : null;
  } catch (error) {
    console.error('[Portfolio Notion] getBySlug error:', error);
    return null;
  }
}

/** 이전/다음 케이스 (순서 기준). */
export async function getAdjacent(slug: string): Promise<{
  prev: PortfolioNotionMeta | null;
  next: PortfolioNotionMeta | null;
}> {
  const all = await getAllMeta();
  const idx = all.findIndex((m) => m.id === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
