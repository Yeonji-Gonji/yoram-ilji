import { APIErrorCode, APIResponseError } from '@notionhq/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OpengraphImage from './opengraph-image';
import PostPage, { generateMetadata } from './page';

// Notion 은 호출하지 않는다. pages.retrieve 가 돌려줄 페이지(또는 오류)만 바꿔 가며 본다.
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
// 렌더에 쓰이는 무거운 모듈은 빈 껍데기로 바꾼다(판별 로직과 무관).
vi.mock('@/lib/analytics', () => ({ getViewsForPath: vi.fn(async () => 0) }));
vi.mock('@/components/common/NotionBlock', () => ({ default: () => null }));
vi.mock('@/components/common/ViewCount', () => ({ default: () => null }));
vi.mock('next/image', () => ({ default: () => null }));
vi.mock('next/og', () => ({
  ImageResponse: class {
    constructor(
      readonly element: unknown,
      readonly init: unknown,
    ) {}
  },
}));

const ID = '00000000-0000-4000-8000-000000000001';
/** next/navigation notFound() 가 던지는 오류의 digest */
const NOT_FOUND = { digest: 'NEXT_HTTP_ERROR_FALLBACK;404' };

const page = (published: boolean) => ({
  object: 'page',
  id: ID,
  archived: false,
  in_trash: false,
  cover: null,
  properties: {
    이름: { type: 'title', title: [{ plain_text: '테스트 글' }] },
    카테고리: { type: 'select', select: { name: '개발' } },
    날짜: { type: 'date', date: { start: '2026-11-01' } },
    생성일: { type: 'created_time', created_time: '2026-11-01T00:00:00.000Z' },
    발행: { type: 'checkbox', checkbox: published },
  },
});

const apiError = (code: APIErrorCode, status: number) =>
  new APIResponseError({
    code,
    status,
    message: code,
    headers: new Headers(),
    rawBodyText: '{}',
    additional_data: undefined,
    request_id: undefined,
  });

const props = () => ({ params: Promise.resolve({ id: ID }) });

/** 같은 경로(/blog/[id])에서 글을 조회하는 세 진입점 */
const entries = [
  ['generateMetadata', () => generateMetadata(props())],
  ['상세 페이지', () => PostPage(props())],
  ['opengraph-image', () => OpengraphImage(props())],
] as const;

beforeEach(() => {
  retrieve.mockReset();
  listChildren.mockReset();
  listChildren.mockResolvedValue({
    results: [],
    has_more: false,
    next_cursor: null,
  });
});

describe('/blog/[id]: 발행 체크가 꺼진 글', () => {
  it.each(entries)('%s: 404(notFound)를 낸다', async (_name, run) => {
    retrieve.mockResolvedValue(page(false));
    await expect(run()).rejects.toMatchObject(NOT_FOUND);
  });

  it('본문 블록을 조회하지 않는다', async () => {
    retrieve.mockResolvedValue(page(false));
    await expect(PostPage(props())).rejects.toMatchObject(NOT_FOUND);
    expect(listChildren).not.toHaveBeenCalled();
  });
});

describe('/blog/[id]: 조회에 실패한 ID', () => {
  it.each(entries)(
    '%s: 없는 ID(object_not_found)면 404 를 낸다',
    async (_name, run) => {
      retrieve.mockRejectedValue(apiError(APIErrorCode.ObjectNotFound, 404));
      await expect(run()).rejects.toMatchObject(NOT_FOUND);
    },
  );

  it.each(entries)(
    '%s: ID 형식이 틀리면(validation_error) 404 를 낸다',
    async (_name, run) => {
      retrieve.mockRejectedValue(apiError(APIErrorCode.ValidationError, 400));
      await expect(run()).rejects.toMatchObject(NOT_FOUND);
    },
  );

  it.each(entries)(
    '%s: 한도 초과(rate_limited)는 404 로 바꾸지 않고 오류를 그대로 던진다',
    async (_name, run) => {
      const error = apiError(APIErrorCode.RateLimited, 429);
      retrieve.mockRejectedValue(error);
      await expect(run()).rejects.toBe(error);
    },
  );
});

describe('/blog/[id]: 발행된 글', () => {
  it('generateMetadata 가 글 제목으로 메타데이터를 만든다', async () => {
    retrieve.mockResolvedValue(page(true));
    const metadata = await generateMetadata(props());
    expect(metadata.openGraph?.title).toContain('테스트 글');
  });

  it('상세 페이지가 본문 블록을 조회해 렌더한다', async () => {
    retrieve.mockResolvedValue(page(true));
    await expect(PostPage(props())).resolves.toBeTruthy();
    expect(listChildren).toHaveBeenCalled();
  });

  it('opengraph-image 가 이미지를 만든다', async () => {
    retrieve.mockResolvedValue(page(true));
    await expect(OpengraphImage(props())).resolves.toBeTruthy();
  });
});
