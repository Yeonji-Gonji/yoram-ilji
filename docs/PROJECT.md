---
project: yoram-ilji
type: project-status
status: 운영
updated: 2026-10-26
---

# PROJECT: yoram-ilji 온보딩 시트

> **이 문서는 리포 온보딩·아키텍처·고정 함정 시트다.**
> - **현재 라이브 배포 기준**: Vercel 대시보드(Production = main 최신 커밋) · `git log`
> - **남은 일·결정 필요**: GitHub Issues ("허브 기준 점검 2026-10-26" 이슈가 보강 체크리스트)
> - **변경 이력**: `git log`·PR. 2026-07-14 이전 현황판은 [archive/status-2026-07-14.md](archive/status-2026-07-14.md)(작성 시점 값으로 고정)
> - 이력서·지원서·회사별 맞춤 자료는 이 리포에 두지 않는다(공개 리포). 사이트에 띄우는 공개 프로필만 둔다.

## 요약

개인 포트폴리오 + 기술 블로그 사이트 `https://yoramilji.kr`. 블로그·포트폴리오 콘텐츠는 Notion 데이터베이스가 데이터소스이고,
정보처리기사 실기 CBT(`/quiz`)는 리포 안 JSON 문제은행으로 동작한다.

## 핵심 사양

- **스택**: Next.js 16 (App Router) · React 19 · TypeScript · HeroUI · Tailwind 4 · react-three-fiber(홈 히어로)
- **패키지 매니저 / dev 포트**: pnpm / `pnpm dev` → http://localhost:3000 (`dev` 스크립트가 lint 를 먼저 돌린다)
- **도메인 / 배포 타겟**: `https://yoramilji.kr` (Vercel, main push 자동 배포)
- **콘텐츠 소스**: Notion API (블로그·포트폴리오 데이터소스 ID 는 `src/lib/config.ts`)
- **계측**: GTM + GA4 + Search Console (식별자는 `src/lib/config.ts`, 서비스 계정 키만 env)
- **테스트**: vitest `src/**/*.test.ts` (퀴즈 채점 정규화·자동 채점·모의고사 출제·문제 은행 ID 중복·정답 공란 검사). CI = lint → tsc → test

## 배포 · 환경 구조 (고정 규칙 및 함정)

- **배포 방식**: Vercel Git 연동. main 머지가 곧 운영 배포이므로 브랜치 → PR → CI(lint·typecheck) → 머지. Preview 는 PR 마다 자동.
- **빌드 게이트**: 빌드 시 Notion API 를 호출하므로 CI 에서는 `build` 를 돌리지 않고 Vercel 빌드가 최종 게이트다.
- **런타임 환경변수(서버 전용, Vercel 에 등록)**

  | 키 | 역할 | 없을 때 |
  |---|---|---|
  | `NOTION_API_KEY` | 블로그·포트폴리오 조회 | 콘텐츠 페이지 빌드 실패 |
  | `GMAIL_APP_PASSWORD` | `/api/send-email` 발신(연락 폼) | 메일 발송 실패 |
  | `GOOGLE_PRIVATE_KEY` | GA4 Data API 서비스 계정 키 | 조회수 등 GA 데이터 비표시 |

  공개 상수(사이트 URL·연락 메일·Notion 데이터소스 ID·GTM/GA ID)는 env 가 아니라 `src/lib/config.ts` 한 곳에서 관리한다.
- **운영·검증 함정**
  - Notion 공개 API 한도(통합당 3 req/s): 빌드는 `src/services/notion.client.ts` 의 간격 제한·재시도와 정적 생성 워커 1개로 한도 아래를 유지한다([ADR-0001](adr/ADR-0001-notion-api-rate-limit-build.md)). 빌드는 약 5분 걸린다. Notion 클라이언트를 따로 만들지 않는다.
  - Notion 이미지는 만료 URL 이라 `/api/notion-image` 프록시를 거친다. 직접 URL 을 캐시하지 않는다.
  - 배포 후 확인: `curl -s -o /dev/null -w '%{http_code}' https://yoramilji.kr` 가 200, 없는 경로(`/zzz-nonexistent-control`)가 404(soft-404 아님, 2026-10-26 실측), 홈 히어로·블로그 목록 렌더.
  - 공개 리포다. 커밋 전 개인정보·이력서 자료가 섞이지 않았는지 본다. 한 번 push 된 파일은 삭제 커밋으로 히스토리에서 사라지지 않는다.

## 아키텍처 · 기능 모듈 지도

| 영역 | 경로 / 모듈 | 역할 및 고정 규칙 |
| --- | --- | --- |
| 홈 | `src/app/page.tsx`, `src/components/home/`, `hero.ts` | 3D 히어로(react-three-fiber) + Development·Design·Blog 섹션 |
| 블로그 | `src/app/(content)/blog/`, `src/services/*.notion.api.ts` | Notion 데이터소스 → 목록·상세. `feed.xml`·`llms.txt` 도 같은 소스 |
| 포트폴리오 | `src/app/(content)/portfolio/`, `src/components/portfolio/`, `src/data/portfolio.ts`, `src/lib/portfolio-content.ts` | Notion 포트폴리오 DB + 리포 내 케이스 메타 |
| 프로필 | `src/app/(content)/profile/` | 공개 프로필만. 이력서 본문·PDF 는 두지 않는다 |
| CBT 퀴즈 | `src/app/(content)/quiz/`(exam·practice·review), `src/lib/quiz/`, `src/data/quiz/*.json` | noindex. 오답 노트·풀이 기록은 문제 ID 로 localStorage 에 저장하므로 ID 는 겹치면 안 된다(테스트가 검사). 기출은 `past.json` 하나가 원본이고 회차별 카테고리로 쪼개 쓴다 |
| API 라우트 | `src/app/api/notion-image`, `src/app/api/send-email` | 이미지 프록시, 연락 메일 발신 |
| SEO·메타 | `src/lib/seo.ts`, `src/app/sitemap.ts`·`robots.ts`·`opengraph-image.tsx` | JSON-LD·동적 OG. 기준 URL 은 `config.ts` |
| 설정 단일 출처 | `src/lib/config.ts` | 공개 상수 전부. 시크릿만 env |

## 참고 / 외부 링크

- 이슈 추적: GitHub Issues
- 의사결정 기록: [`docs/adr/`](adr/)
- 과거 검증 리포트: `docs/archive/report-*.md`
