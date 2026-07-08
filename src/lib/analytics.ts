/**
 * GA4 Data API 래퍼.
 *
 * GTM으로 GA4에 수집된 조회수(screenPageViews)를 서버에서 읽어와
 * 각 글/프로젝트 페이지에 개별 표시하기 위한 모듈. 원본은 GA4이므로 DB는 없다.
 *
 * 카드마다 API를 호출하면 비효율적이라, 경로별 조회수를 "한 번에" 받아
 * { pagePath: views } 맵으로 캐시(1h)한 뒤 각 항목이 자기 경로로 조회한다.
 *
 * 공개 식별자(속성 ID·서비스 계정 이메일)는 appConfig.analytics로 중앙관리하고,
 * 유일한 시크릿인 개인키만 환경변수로 둔다.
 * - GOOGLE_PRIVATE_KEY : 서비스 계정 개인키 (줄바꿈은 \n 으로 이스케이프)
 *
 * GA4 집계는 하루 정도 지연되고 애드블록 사용자는 잡히지 않으므로,
 * 여기서 반환하는 값은 실측이 아니라 "대략적인 누적 조회수"다.
 */
import { unstable_cache } from 'next/cache';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { appConfig } from './config';

const { ga4PropertyId: propertyId, gaClientEmail: clientEmail } =
  appConfig.analytics;
// Vercel 환경변수에 넣을 때 개행이 \n 문자로 저장되므로 실제 개행으로 복원
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const isConfigured = Boolean(propertyId && clientEmail && privateKey);

let client: BetaAnalyticsDataClient | null = null;
function getClient(): BetaAnalyticsDataClient | null {
  if (!isConfigured) return null;
  if (!client) {
    client = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }
  return client;
}

/** 경로 끝 슬래시를 제거해 조회 키를 통일한다. ('/blog/' → '/blog') */
function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/** 사이트 전체 경로별 누적 페이지뷰를 { 정규화된 경로: 조회수 } 맵으로 반환. */
async function fetchPageViewsMap(): Promise<Record<string, number> | null> {
  const analytics = getClient();
  if (!analytics) return null;

  try {
    const [response] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      limit: 10000,
    });

    const map: Record<string, number> = {};
    for (const row of response.rows ?? []) {
      const path = row.dimensionValues?.[0]?.value;
      const value = row.metricValues?.[0]?.value;
      if (!path) continue;
      const key = normalizePath(path);
      // 슬래시 정규화로 키가 겹치면 합산
      map[key] = (map[key] ?? 0) + Number(value ?? 0);
    }
    return map;
  } catch (error) {
    console.error('[analytics] GA4 조회 실패:', error);
    return null;
  }
}

/**
 * 1시간 캐시된 경로별 조회수 맵.
 * GA 데이터는 하루 단위로 갱신되므로 자주 호출할 필요가 없고 쿼터도 절약된다.
 * 태그 'ga-pageviews'로 필요 시 재검증 가능.
 */
export const getPageViewsMap = unstable_cache(
  fetchPageViewsMap,
  ['ga-pageviews-map'],
  { revalidate: 3600, tags: ['ga-pageviews'] },
);

/**
 * 특정 경로 하나의 누적 조회수.
 * @returns 조회수(number). 데이터 없으면 0, 미설정/오류 시 null.
 */
export async function getViewsForPath(path: string): Promise<number | null> {
  const map = await getPageViewsMap();
  if (map === null) return null;
  return map[normalizePath(path)] ?? 0;
}
