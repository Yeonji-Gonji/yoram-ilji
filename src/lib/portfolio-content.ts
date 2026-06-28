import { PortfolioCategory } from '@/data/portfolio';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// MDX 케이스의 frontmatter(구조화 메타) — 카드·히어로·사이드바·SEO 공통 사용
export interface PortfolioFrontmatter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  period: string;
  role: string;
  team?: string;
  thumbnail: string;
  color: string;
  // 개발용
  techStack?: string[];
  // 디자인용
  tools?: string[];
  type?: string;
  // 사이드바 핵심 지표(자유 본문과 별개로 항상 노출)
  metrics?: string[];
  // 갤러리 이미지 (없으면 본문 인라인 이미지만)
  images?: string[];
  links?: {
    github?: string;
    live?: string;
    appStore?: string;
    playStore?: string;
  };
  // /portfolio 목록·홈 Selected Work 정렬·노출 제어
  featured?: boolean;
  order?: number;
}

export interface PortfolioContent {
  meta: PortfolioFrontmatter;
  body: string; // 컴파일 전 MDX 본문
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/portfolio');

function readDirSafe(): string[] {
  try {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.mdx'));
  } catch {
    return []; // 콘텐츠 디렉토리가 아직 없을 때
  }
}

/** 해당 id의 .mdx 케이스를 읽어 frontmatter + 본문 반환. 없으면 null. */
export function getPortfolioContent(id: string): PortfolioContent | null {
  const filePath = path.join(CONTENT_DIR, `${id}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    meta: { ...(data as PortfolioFrontmatter), id },
    body: content,
  };
}

/** MDX로 이식된 모든 케이스의 메타 목록 (정렬: order → period 역순). */
export function getAllPortfolioContentMeta(): PortfolioFrontmatter[] {
  return readDirSafe()
    .map((file) => {
      const id = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return { ...(data as PortfolioFrontmatter), id };
    })
    .sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      return (b.period ?? '').localeCompare(a.period ?? '');
    });
}

/** MDX 케이스 slug 목록 (generateStaticParams용). */
export function getPortfolioContentSlugs(): string[] {
  return readDirSafe().map((f) => f.replace(/\.mdx$/, ''));
}

// 목록·홈 카드용 정규화 모델 (개발/디자인 공통)
export interface PortfolioCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  period: string;
  thumbnail: string; // 없으면 '' → 그라데이션 폴백
  color: string;
  skills: string[]; // techStack 또는 tools
  type?: string; // 디자인 유형 배지
  role?: string; // 카드 푸터에 노출하는 역할
  metrics?: string[]; // 스크린샷 없는 개발 카드의 핵심 자산(숫자/성과)
  featured?: boolean;
}

function toCard(m: PortfolioFrontmatter): PortfolioCard {
  return {
    id: m.id,
    title: m.title,
    subtitle: m.subtitle,
    description: m.description,
    category: m.category,
    period: m.period,
    thumbnail: m.thumbnail ?? '',
    color: m.color ?? '#6b6864',
    skills: m.techStack ?? m.tools ?? [],
    type: m.type,
    role: m.role,
    metrics: m.metrics,
    featured: m.featured,
  };
}

/** 목록/홈용 카드 목록. category로 필터, 정렬은 메타 순서(order→period). */
export function getPortfolioCards(category?: PortfolioCategory): PortfolioCard[] {
  return getAllPortfolioContentMeta()
    .filter((m) => !category || m.category === category)
    .map(toCard);
}

/** 홈 Selected Work용: featured 우선, 없으면 개발 케이스 상위 N. */
export function getFeaturedCards(limit = 3): PortfolioCard[] {
  const dev = getPortfolioCards('development');
  const featured = dev.filter((c) => c.featured);
  return (featured.length > 0 ? featured : dev).slice(0, limit);
}

/** 이전/다음 케이스 네비게이션용. */
export function getAdjacentContent(id: string): {
  prev: PortfolioFrontmatter | null;
  next: PortfolioFrontmatter | null;
} {
  const all = getAllPortfolioContentMeta();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
