/**
 * 블로그 글 공개 여부 판별의 단일 출처.
 *
 * 목록·feed.xml·llms.txt·sitemap 은 데이터소스 쿼리 필터(`발행 = true`)로 거르지만,
 * 상세(`/blog/[id]`)·OG 이미지·커버 프록시는 페이지 ID 로 `pages.retrieve` 를 직접 부르므로
 * 필터가 걸리지 않는다. 그 경로들은 조회 결과를 여기서 다시 판별한다.
 */
import { APIErrorCode, isNotionClientError } from '@notionhq/client';
import type { NotionPage } from '@/types/notion.type';

/**
 * 공개해도 되는 블로그 글인지. `발행` 체크박스가 켜져 있고 휴지통·보관 상태가 아니어야 한다.
 * `발행` 속성이 없는 페이지(블로그 데이터베이스 밖에서 통합에 공유된 페이지)는 공개하지 않는다.
 */
export function isPublishedBlogPost(page: unknown): page is NotionPage {
  if (typeof page !== 'object' || page === null) return false;
  const candidate = page as {
    object?: unknown;
    archived?: unknown;
    in_trash?: unknown;
    properties?: Record<string, unknown>;
  };
  if (candidate.object !== 'page') return false;
  if (candidate.archived === true || candidate.in_trash === true) return false;

  const published = candidate.properties?.['발행'] as
    | { type?: unknown; checkbox?: unknown }
    | undefined;
  return published?.type === 'checkbox' && published.checkbox === true;
}

/**
 * 없는 페이지로 보고 404 를 낼 Notion 오류 코드: 존재하지 않는 ID, 형식이 틀린 ID.
 * 한도 초과·5xx·타임아웃·인증 오류는 일시 장애나 설정 문제라 여기에 넣지 않는다.
 * 그 오류까지 404 로 바꾸면 재검증 중 한 번의 장애로 발행된 글이 404 로 캐시된다.
 */
const MISSING_PAGE_ERROR_CODES: ReadonlySet<string> = new Set([
  APIErrorCode.ObjectNotFound,
  APIErrorCode.ValidationError,
  APIErrorCode.InvalidRequestURL,
]);

export function isMissingNotionPageError(error: unknown): boolean {
  return isNotionClientError(error) && MISSING_PAGE_ERROR_CODES.has(error.code);
}
