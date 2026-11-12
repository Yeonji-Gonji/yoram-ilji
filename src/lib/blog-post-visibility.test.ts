import {
  APIErrorCode,
  APIResponseError,
  UnknownHTTPResponseError,
} from '@notionhq/client';
import { describe, expect, it } from 'vitest';
import {
  isMissingNotionPageError,
  isPublishedBlogPost,
} from './blog-post-visibility';

/** pages.retrieve 응답 모양의 블로그 글. 필요한 필드만 채운다. */
const blogPage = (overrides: Record<string, unknown> = {}) => ({
  object: 'page',
  id: '00000000-0000-4000-8000-000000000001',
  archived: false,
  in_trash: false,
  properties: {
    이름: { type: 'title', title: [{ plain_text: '글' }] },
    발행: { type: 'checkbox', checkbox: true },
  },
  ...overrides,
});

const withPublished = (published: unknown) =>
  blogPage({
    properties: {
      이름: { type: 'title', title: [{ plain_text: '글' }] },
      발행: published,
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

describe('isPublishedBlogPost: 상세 페이지에 보여도 되는 글인지', () => {
  it('발행 체크가 켜진 글은 보인다', () => {
    expect(isPublishedBlogPost(blogPage())).toBe(true);
  });

  it('발행 체크가 꺼진 글은 숨긴다', () => {
    expect(
      isPublishedBlogPost(withPublished({ type: 'checkbox', checkbox: false })),
    ).toBe(false);
  });

  it('발행 속성이 없는 페이지(블로그 데이터베이스 밖)는 숨긴다', () => {
    expect(isPublishedBlogPost(blogPage({ properties: { 이름: {} } }))).toBe(
      false,
    );
    expect(isPublishedBlogPost(blogPage({ properties: undefined }))).toBe(
      false,
    );
  });

  it('발행 속성이 체크박스가 아니면 값이 참이어도 숨긴다', () => {
    expect(
      isPublishedBlogPost(
        withPublished({ type: 'formula', formula: { boolean: true } }),
      ),
    ).toBe(false);
    expect(
      isPublishedBlogPost(withPublished({ type: 'checkbox', checkbox: 'true' })),
    ).toBe(false);
  });

  it('휴지통·보관 처리된 글은 발행 체크가 남아 있어도 숨긴다', () => {
    expect(isPublishedBlogPost(blogPage({ in_trash: true }))).toBe(false);
    expect(isPublishedBlogPost(blogPage({ archived: true }))).toBe(false);
  });

  it('페이지 객체가 아니면 숨긴다', () => {
    expect(isPublishedBlogPost(null)).toBe(false);
    expect(isPublishedBlogPost(undefined)).toBe(false);
    expect(isPublishedBlogPost('page')).toBe(false);
    expect(isPublishedBlogPost(blogPage({ object: 'database' }))).toBe(false);
  });
});

describe('isMissingNotionPageError: 없는 페이지로 보고 404 를 낼 오류인지', () => {
  it('존재하지 않는 ID·잘못된 ID 형식은 없는 페이지다', () => {
    expect(
      isMissingNotionPageError(apiError(APIErrorCode.ObjectNotFound, 404)),
    ).toBe(true);
    expect(
      isMissingNotionPageError(apiError(APIErrorCode.ValidationError, 400)),
    ).toBe(true);
    expect(
      isMissingNotionPageError(apiError(APIErrorCode.InvalidRequestURL, 400)),
    ).toBe(true);
  });

  it('한도 초과·서버 오류·인증 오류는 일시 장애나 설정 문제라 404 로 바꾸지 않는다', () => {
    for (const [code, status] of [
      [APIErrorCode.RateLimited, 429],
      [APIErrorCode.InternalServerError, 500],
      [APIErrorCode.ServiceUnavailable, 503],
      [APIErrorCode.Unauthorized, 401],
      [APIErrorCode.RestrictedResource, 403],
    ] as const) {
      expect(isMissingNotionPageError(apiError(code, status)), code).toBe(
        false,
      );
    }
  });

  it('Notion SDK 오류가 아니면 404 로 바꾸지 않는다', () => {
    expect(
      isMissingNotionPageError(
        new UnknownHTTPResponseError({
          status: 502,
          message: 'bad gateway',
          headers: new Headers(),
          rawBodyText: '',
        }),
      ),
    ).toBe(false);
    expect(isMissingNotionPageError(new Error('network'))).toBe(false);
    expect(
      isMissingNotionPageError({ code: APIErrorCode.ObjectNotFound }),
    ).toBe(false);
  });
});
