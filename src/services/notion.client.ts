/**
 * Notion SDK 클라이언트 단일 인스턴스.
 *
 * 빌드 시 블로그·포트폴리오 페이지를 정적 생성하면서 Notion 공개 API 를 병렬로 때리다
 * 429(rate_limited)로 프리렌더가 중단되는 일이 반복됐다(2026-07-28 · 08-16 · 10-26 Vercel 빌드 실패).
 * Notion 공개 API 평균 한도는 통합(integration)당 초당 3요청이다.
 *
 * 그래서 SDK 의 fetch 를 바꿔치기해 프로세스 전체에서
 *   1) 요청 시작 간격을 MIN_INTERVAL_MS 이상으로 띄우고(직렬 스케줄러)
 *   2) 429·5xx·네트워크 오류는 retry-after(없으면 지수 백오프)만큼 기다렸다 재시도한다.
 * 호출 지점은 손대지 않는다. 워커 프로세스마다 한도가 따로 적용되므로 next.config 의
 * staticGenerationMinPagesPerWorker 로 정적 생성 워커를 하나로 묶는다.
 */
import { Client } from '@notionhq/client';
import type {
  SupportedFetch,
  SupportedRequestInit,
  SupportedResponse,
} from '@notionhq/client/build/src/fetch-types';

const MIN_INTERVAL_MS = 350; // ≈ 2.9 req/s
const MAX_ATTEMPTS = 6;
const MAX_WAIT_MS = 70_000; // Notion retry-after 는 보통 수십 초

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let lastStartedAt = 0;
let queue: Promise<void> = Promise.resolve();

/** 직렬 스케줄러: 앞 요청 시작 시각 + MIN_INTERVAL_MS 가 지나야 다음 요청을 내보낸다. */
function nextSlot(): Promise<void> {
  const mine = queue.then(async () => {
    const wait = lastStartedAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastStartedAt = Date.now();
  });
  queue = mine.catch(() => undefined);
  return mine;
}

function retryDelayMs(res: SupportedResponse | undefined, attempt: number): number {
  const headers = res?.headers as { get?: (k: string) => string | null } | undefined;
  const retryAfter = Number(headers?.get?.('retry-after'));
  const fromHeader = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 0;
  const backoff = Math.min(1000 * 2 ** attempt, 30_000);
  return Math.min(Math.max(fromHeader, backoff), MAX_WAIT_MS);
}

const throttledFetch: SupportedFetch = async (url, init?: SupportedRequestInit) => {
  for (let attempt = 1; ; attempt++) {
    await nextSlot();
    let res: SupportedResponse | undefined;
    try {
      res = await fetch(url, init as RequestInit);
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) throw error;
      const delay = retryDelayMs(undefined, attempt);
      console.warn(`[notion] 네트워크 오류, ${delay}ms 후 재시도 ${attempt}/${MAX_ATTEMPTS}`);
      await sleep(delay);
      continue;
    }
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= MAX_ATTEMPTS) return res;
    const delay = retryDelayMs(res, attempt);
    console.warn(`[notion] HTTP ${res.status}, ${delay}ms 후 재시도 ${attempt}/${MAX_ATTEMPTS}`);
    await res.text().catch(() => undefined); // 연결 반환
    await sleep(delay);
  }
};

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  fetch: throttledFetch,
});
