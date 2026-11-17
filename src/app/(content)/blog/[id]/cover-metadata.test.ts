import { siteConfig } from '@/lib/seo';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PostPage, { generateMetadata } from './page';

// Notion 은 호출하지 않는다. pages.retrieve 가 돌려줄 페이지의 커버만 바꿔 가며 본다.
const { retrieve, listChildren } = vi.hoisted(() => ({
  retrieve: vi.fn(),
  listChildren: vi.fn(),
}));
vi.mock('@/services/notion.client', () => ({
  notion: {
    pages: { retrieve },
    blocks: { retrieve: vi.fn(), children: { list: listChildren } },
    dataSources: { query: vi.fn() },
  },
}));
// 렌더에 쓰이는 무거운 모듈은 빈 껍데기로 바꾼다(커버 URL 과 무관).
vi.mock('@/lib/analytics', () => ({ getViewsForPath: vi.fn(async () => 0) }));
vi.mock('@/components/common/NotionBlock', () => ({ default: () => null }));
vi.mock('@/components/common/ViewCount', () => ({ default: () => null }));
vi.mock('next/image', () => ({ default: () => null }));

const ID = '00000000-0000-4000-8000-000000000002';
const PROXY_URL = `${siteConfig.url}/api/notion-image?type=cover&pageId=${ID}`;
/** Notion 이 올린 파일에 주는 임시 URL. 약 1시간 뒤 만료되어 403 이 된다. */
const S3_URL =
  'https://prod-files-secure.s3.us-west-2.amazonaws.com/workspace/file/cover.png?X-Amz-Expires=3600&X-Amz-Signature=test';
const EXTERNAL_URL = 'https://images.unsplash.com/photo-1?fm=jpg';

const fileCover = {
  type: 'file',
  file: { url: S3_URL, expiry_time: '2026-11-01T01:00:00.000Z' },
};
const externalCover = { type: 'external', external: { url: EXTERNAL_URL } };

const page = (cover: unknown) => ({
  object: 'page',
  id: ID,
  archived: false,
  in_trash: false,
  cover,
  properties: {
    이름: { type: 'title', title: [{ plain_text: '테스트 글' }] },
    카테고리: { type: 'select', select: { name: '개발' } },
    날짜: { type: 'date', date: { start: '2026-11-01' } },
    생성일: { type: 'created_time', created_time: '2026-11-01T00:00:00.000Z' },
    발행: { type: 'checkbox', checkbox: true },
  },
});

const props = () => ({ params: Promise.resolve({ id: ID }) });

/** 메타데이터의 images 값(문자열·URL·객체, 하나 또는 배열)을 주소 목록으로 편다. */
const urlsOf = (images: unknown): string[] =>
  [images]
    .flat()
    .filter(Boolean)
    .map((image) =>
      typeof image === 'string' || image instanceof URL
        ? String(image)
        : String((image as { url: string | URL }).url),
    );

/** generateMetadata 가 내보내는 og:image·twitter:image 주소 */
const shareImages = async () => {
  const metadata = await generateMetadata(props());
  return {
    og: urlsOf(metadata.openGraph?.images),
    twitter: urlsOf(metadata.twitter?.images),
  };
};

/** 상세 페이지가 그리는 Article JSON-LD 의 image */
const articleJsonLdImage = async () => {
  const found: Record<string, unknown>[] = [];
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    const elementProps = (node as { props?: Record<string, unknown> }).props;
    if (!elementProps) return;
    const html = (
      elementProps.dangerouslySetInnerHTML as { __html?: string } | undefined
    )?.__html;
    if (html) found.push(JSON.parse(html));
    walk(elementProps.children);
  };
  walk(await PostPage(props()));
  return found.find((data) => data['@type'] === 'Article')?.image;
};

beforeEach(() => {
  retrieve.mockReset();
  listChildren.mockReset();
  listChildren.mockResolvedValue({
    results: [],
    has_more: false,
    next_cursor: null,
  });
});

describe('/blog/[id]: Notion 에 올린 파일이 커버인 글', () => {
  it('og:image·twitter:image 에 만료되는 S3 임시 URL 대신 프록시의 절대 URL 을 쓴다', async () => {
    retrieve.mockResolvedValue(page(fileCover));
    expect(await shareImages()).toEqual({
      og: [PROXY_URL],
      twitter: [PROXY_URL],
    });
  });

  it('JSON-LD image 도 프록시의 절대 URL 이다', async () => {
    retrieve.mockResolvedValue(page(fileCover));
    expect(await articleJsonLdImage()).toBe(PROXY_URL);
  });
});

describe('/blog/[id]: 외부 URL 이 커버인 글', () => {
  it('og:image·twitter:image·JSON-LD image 에 그 URL 을 그대로 쓴다', async () => {
    retrieve.mockResolvedValue(page(externalCover));
    expect(await shareImages()).toEqual({
      og: [EXTERNAL_URL],
      twitter: [EXTERNAL_URL],
    });
    expect(await articleJsonLdImage()).toBe(EXTERNAL_URL);
  });
});

describe('/blog/[id]: 커버가 없는 글', () => {
  it('images 를 넣지 않아 파일 컨벤션(opengraph-image) 그림이 쓰이게 둔다', async () => {
    retrieve.mockResolvedValue(page(null));
    expect(await shareImages()).toEqual({ og: [], twitter: [] });
    expect(await articleJsonLdImage()).toBeUndefined();
  });
});
