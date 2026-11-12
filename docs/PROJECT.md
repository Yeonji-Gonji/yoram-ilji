---
project: yoram-ilji
type: project-status
status: 운영
updated: 2026-11-10
---

# PROJECT: yoram-ilji 온보딩 시트

> **이 문서는 리포 온보딩·아키텍처·고정 함정 시트다.**
> - **현재 라이브 배포 기준**: Vercel 대시보드(Production = main 최신 커밋) · `git log`
> - **남은 일·결정 필요**: GitHub Issues ("허브 기준 점검 2026-10-26" 이슈가 보강 체크리스트)
> - **변경 이력**: `git log`·PR. 2026-07-14 이전 현황판은 [archive/status-2026-07-14.md](archive/status-2026-07-14.md)(작성 시점 값으로 고정)
> - 이력서·지원서·회사별 맞춤 자료는 이 리포에 두지 않는다(공개 리포). 사이트에 띄우는 공개 프로필만 둔다.

## 요약

개인 포트폴리오 + 기술 블로그 사이트 `https://yoramilji.kr`. 블로그 콘텐츠는 Notion 데이터베이스가 데이터소스이고
포트폴리오는 리포 안 정본(`src/content/portfolio/`)과 로컬 이미지로 동작한다([ADR-0002](adr/ADR-0002-portfolio-static-git-ssot.md)).
정보처리기사 실기 CBT(`/quiz`)도 리포 안 JSON 문제은행으로 동작한다.

## 핵심 사양

- **스택**: Next.js 16 (App Router) · React 19 · TypeScript · HeroUI · Tailwind 4 · react-three-fiber(홈 히어로)
- **패키지 매니저 / dev 포트**: pnpm 10(`package.json`의 `packageManager`로 고정, CI도 같은 값. 전역 pnpm 11도 이 버전으로 바꿔 실행한다) / `pnpm dev` → http://localhost:3000 (`dev` 스크립트가 lint를 먼저 돌린다)
- **도메인 / 배포 타겟**: `https://yoramilji.kr` (Vercel, main push 자동 배포)
- **콘텐츠 소스**: 블로그 = Notion API(데이터소스 ID는 `src/lib/config.ts`) / 포트폴리오 = `src/content/portfolio/*.ts` + `public/portfolio/` 정적 이미지
- **계측**: GTM + GA4 + Search Console (식별자는 `src/lib/config.ts`, 서비스 계정 키만 env)
- **테스트**: vitest `src/**/*.test.ts` (퀴즈 채점 정규화·자동 채점·모의고사 출제·문제 은행 ID 중복·정답 공란 검사, 연락 폼 입력 검증·메일 HTML 이스케이프, 포트폴리오 정본 무결성·조회 API, 블로그 미발행 글 404). CI = lint → tsc → test

## 배포 · 환경 구조 (고정 규칙 및 함정)

- **배포 방식**: Vercel Git 연동. main 머지가 곧 운영 배포이므로 브랜치 → PR → CI(lint·typecheck) → 머지. Preview는 PR마다 자동.
- **빌드 게이트**: 빌드 시 Notion API를 호출하므로 CI에서는 `build`를 돌리지 않고 Vercel 빌드가 최종 게이트다.
- **런타임 환경변수(서버 전용, Vercel에 등록)**

  | 키 | 역할 | 없을 때 |
  |---|---|---|
  | `NOTION_API_KEY` | 블로그 조회 | 블로그 페이지 빌드 실패 (포트폴리오는 영향 없음) |
  | `GMAIL_APP_PASSWORD` | `/api/send-email` 발신(연락 폼) | 메일 발송 실패 |
  | `GOOGLE_PRIVATE_KEY` | GA4 Data API 서비스 계정 키 | 조회수 등 GA 데이터 비표시 |

  공개 상수(사이트 URL·연락 메일·Notion 블로그 데이터소스 ID·GTM/GA ID)는 env가 아니라 `src/lib/config.ts` 한 곳에서 관리한다.
- **운영·검증 함정**
  - Notion 공개 API 한도(통합당 3 req/s): 빌드는 `src/services/notion.client.ts`의 간격 제한·재시도와 정적 생성 워커 1개로 한도 아래를 유지한다([ADR-0001](adr/ADR-0001-notion-api-rate-limit-build.md)). 빌드는 약 5분 걸린다. Notion 클라이언트를 따로 만들지 않는다.
  - 블로그 글 공개 기준은 `발행` 체크박스다. 목록·`feed.xml`·`llms.txt`·sitemap은 데이터소스 쿼리 필터로 거르지만, 글을 ID로 여는 경로(상세 `/blog/[id]`·`generateMetadata`·`opengraph-image`·커버 프록시)는 필터가 걸리지 않는다. 그래서 이 경로는 `getPost`가 아니라 `getPublishedPost`(`src/services/notion.api.ts`)를 쓰고, 판별은 `src/lib/blog-post-visibility.ts` 한 곳에 둔다. 미발행·없는 ID는 404이고, Notion 한도 초과·5xx는 404로 바꾸지 않는다(재검증 중 장애로 발행 글이 404로 캐시되지 않게). `dynamicParams`는 기본값(true)이라 새로 발행한 글은 재배포 없이 열린다.
  - Notion 이미지(블로그)는 만료 URL이라 `/api/notion-image` 프록시를 거친다. 직접 URL을 캐시하지 않는다. 포트폴리오는 이 프록시를 쓰지 않는다. 이미지가 `public/portfolio/`에 있고 테스트가 경로 존재를 검사한다.
  - 포트폴리오 케이스를 더하거나 고칠 때는 `src/content/portfolio/<slug>.ts`를 쓰고 `index.ts` 배열에 끼운다(배열 순서 = 노출 순서 = 이전·다음 순서). 이미지는 `public/portfolio/<slug>/`에 webp로 두고 가로 1600px를 넘기지 않는다.
  - 배포 후 확인: `curl -s -o /dev/null -w '%{http_code}' https://yoramilji.kr`가 200, 없는 경로(`/zzz-nonexistent-control`)가 404(soft-404 아님, 2026-10-26 실측), 홈 히어로·블로그 목록 렌더.
  - 공개 리포다. 커밋 전 개인정보·이력서 자료가 섞이지 않았는지 본다. 한 번 push 된 파일은 삭제 커밋으로 히스토리에서 사라지지 않는다.

## 아키텍처 · 기능 모듈 지도

| 영역 | 경로 / 모듈 | 역할 및 고정 규칙 |
| --- | --- | --- |
| 홈 | `src/app/page.tsx`, `src/components/home/`, `hero.ts` | 3D 히어로(react-three-fiber) + Development·Design·Blog 섹션 |
| 블로그 | `src/app/(content)/blog/`, `src/services/notion.api.ts`·`notion.client.ts` | Notion 데이터소스 → 목록·상세. `feed.xml`·`llms.txt`도 같은 소스 |
| 포트폴리오 | `src/app/(content)/portfolio/`, `src/components/portfolio/`, `src/content/portfolio/`, `src/services/portfolio.api.ts`, `src/types/portfolio.type.ts` | 리포 안 정본 16건 + `public/portfolio/` 이미지. 조회는 `portfolio.api.ts` 한 곳(외부 호출 없음) |
| 프로필 | `src/app/(content)/profile/` | 공개 프로필만. 이력서 본문·PDF는 두지 않는다 |
| CBT 퀴즈 | `src/app/(content)/quiz/`(exam·practice·review), `src/lib/quiz/`, `src/data/quiz/*.json` | noindex. 오답 노트·풀이 기록은 문제 ID로 localStorage에 저장하므로 ID는 겹치면 안 된다(테스트가 검사). 기출은 `past.json` 하나가 원본이고 회차별 카테고리로 쪼개 쓴다 |
| API 라우트 | `src/app/api/notion-image`, `src/app/api/send-email` | 이미지 프록시, 연락 메일 발신. 연락 폼 입력 검증·HTML 이스케이프·길이 상한은 `src/lib/contact-email.ts` 한 곳(폼 `maxLength`도 같은 값) |
| SEO·메타 | `src/lib/seo.ts`, `src/app/sitemap.ts`·`robots.ts`·`opengraph-image.tsx` | JSON-LD·동적 OG. 기준 URL은 `config.ts` |
| 설정 단일 출처 | `src/lib/config.ts` | 공개 상수 전부. 시크릿만 env |
| 결정 기록 | `docs/adr/` | [ADR-0001](adr/ADR-0001-notion-api-rate-limit-build.md) Notion 한도 아래 빌드 · [ADR-0002](adr/ADR-0002-portfolio-static-git-ssot.md) 포트폴리오 Git 정본화 |

## 참고 / 외부 링크

- 이슈 추적: GitHub Issues
- 의사결정 기록: [`docs/adr/`](adr/)
- 과거 검증 리포트: `docs/archive/report-*.md`
