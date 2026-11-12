import { APIErrorCode, APIResponseError } from '@notionhq/client';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

// Notion 과 이미지 원본(S3)은 호출하지 않는다.
const { retrieve } = vi.hoisted(() => ({ retrieve: vi.fn() }));
vi.mock('@/services/notion.client', () => ({
  notion: {
    pages: { retrieve },
    blocks: { retrieve: vi.fn(), children: { list: vi.fn() } },
    dataSources: { query: vi.fn() },
  },
}));

const ID = '00000000-0000-4000-8000-000000000001';
const COVER_URL =
  'https://prod-files-secure.s3.us-west-2.amazonaws.com/cover.png';

const page = (published: boolean) => ({
  object: 'page',
  id: ID,
  archived: false,
  in_trash: false,
  cover: { type: 'file', file: { url: COVER_URL } },
  properties: { 발행: { type: 'checkbox', checkbox: published } },
});

const getCover = () =>
  GET(
    new NextRequest(
      `http://localhost/api/notion-image?type=cover&pageId=${ID}`,
    ),
  );

const imageFetch = vi.fn();

beforeEach(() => {
  retrieve.mockReset();
  imageFetch.mockReset();
  imageFetch.mockResolvedValue(
    new Response(new Uint8Array([1, 2, 3]), {
      headers: { 'content-type': 'image/png' },
    }),
  );
  vi.stubGlobal('fetch', imageFetch);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('GET /api/notion-image?type=cover: 블로그 글 커버 프록시', () => {
  it('발행된 글의 커버를 내려준다', async () => {
    retrieve.mockResolvedValue(page(true));
    const res = await getCover();
    expect(res.status).toBe(200);
    expect(imageFetch).toHaveBeenCalledWith(COVER_URL, expect.anything());
  });

  it('발행 체크가 꺼진 글의 커버는 404 이고 원본을 가져오지 않는다', async () => {
    retrieve.mockResolvedValue(page(false));
    const res = await getCover();
    expect(res.status).toBe(404);
    expect(imageFetch).not.toHaveBeenCalled();
  });

  it('없는 페이지 ID 는 404 다', async () => {
    retrieve.mockRejectedValue(
      new APIResponseError({
        code: APIErrorCode.ObjectNotFound,
        status: 404,
        message: 'not found',
        headers: new Headers(),
        rawBodyText: '{}',
        additional_data: undefined,
        request_id: undefined,
      }),
    );
    const res = await getCover();
    expect(res.status).toBe(404);
  });
});
