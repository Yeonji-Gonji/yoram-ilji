# ADR-0001: 빌드 시 Notion API 호출은 프로세스 단일 스케줄러로 한도 아래에 묶고 429 는 재시도한다

- 날짜: 2026-10-26
- 상태: 채택
- 관련: `src/services/notion.client.ts`, `next.config.ts`(`experimental.staticGeneration*`), PR #5

## 배경

블로그·포트폴리오 페이지는 빌드 시 Notion 데이터소스를 읽어 정적 생성한다. Next 기본값(워커 여러 개 × 워커당 페이지 8개 동시 ×
페이지 안의 블록 자식 조회 `Promise.all`)으로는 통합(integration)당 평균 3 req/s 인 Notion 공개 API 한도를 넘어
429 `rate_limited`(retry-after 58초)로 프리렌더가 중단됐다. 2026-07-28·08-16·10-26 Vercel 빌드가 이 원인으로 실패했고,
코드 변경이 없는 문서 커밋에서도 재현됐다. 실패한 빌드는 라이브를 바꾸지 않아 사이트는 떠 있었지만 어떤 변경도 배포되지 않는 상태였다.

## 검토한 대안

1. 그대로 두고 실패하면 Redeploy — 8월 16일처럼 가끔 통과하지만 배포가 운에 달린다.
2. 블로그 상세를 빌드 시 생성하지 않고 ISR 로 첫 요청 때 생성 — 빌드 호출은 줄지만 429 가 런타임(크롤러 폭주)으로 옮겨 가고 첫 방문 지연이 생긴다.
3. SDK `fetch` 를 바꿔치기해 프로세스 전체 요청 간격을 한도 아래로 고정하고 429·5xx 는 retry-after 만큼 기다렸다 재시도, 같은 렌더의 중복 조회는
   React `cache()` 로 제거, 정적 생성 워커를 1개로 묶어 간격 제한이 빌드 전체에 적용되게 한다. (채택)

## 결정

대안 3. `src/services/notion.client.ts` 가 유일한 Notion 클라이언트다(블로그·포트폴리오 서비스가 공유). 요청 시작 간격 350ms(≈2.9 req/s),
429·5xx·네트워크 오류는 `retry-after`(없으면 지수 백오프, 최대 70초)로 최대 6회 재시도. `next.config.ts` 에
`staticGenerationMinPagesPerWorker: 10000`(워커 1개), `staticGenerationMaxConcurrency: 4`, `staticGenerationRetryCount: 2`.

## 결과

- 검증(PR #5 Preview 빌드): 1 worker 로 132 페이지 4.0분, 429 0건·재시도 0건. 전체 빌드 약 5분(이전 실패 빌드는 3분 안에 중단).
- 빌드 시간은 늘었다. 페이지가 많아지면 더 늘어난다. 글이 수백 개가 되면 대안 2(상세 ISR)를 다시 검토한다.
- 간격 제한은 런타임(ISR 재검증·`/api/notion-image`)에도 적용된다. 요청이 몰리면 Notion 호출이 줄을 서지만 429 로 깨지지 않는다.
- 되돌릴 경우의 비용: 두 서비스의 `notion` import 를 각자 `new Client()` 로 되돌리고 `experimental` 블록을 지우면 된다.
