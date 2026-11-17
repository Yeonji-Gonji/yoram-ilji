# yoram-ilji

개인 포트폴리오 + 기술 블로그 https://yoramilji.kr 의 소스. 목표와 기술 스택은 [docs/PROJECT.md](docs/PROJECT.md), 진행 상황은 GitHub Issues.

## 개발

```bash
pnpm install
pnpm dev          # lint 후 http://localhost:3000
```

pnpm 버전은 `package.json` 의 `packageManager`(pnpm 10)로 고정하고 CI 도 같은 값을 쓴다. 전역 pnpm 11 도 이 버전으로 바꿔 실행한다.

`.env.local` 에 서버 전용 키를 둔다(값은 커밋하지 않는다). 운영 값은 Vercel 에 등록한다.

```bash
NOTION_API_KEY=<Notion 통합 시크릿>
GMAIL_APP_PASSWORD=<연락 폼 발신용 Gmail 앱 비밀번호>
GOOGLE_PRIVATE_KEY=<GA4 Data API 서비스 계정 private_key>
```

| 키 | 역할 | 없을 때 |
|---|---|---|
| `NOTION_API_KEY` | 블로그 조회 | 블로그 페이지 빌드 실패(포트폴리오는 영향 없음) |
| `GMAIL_APP_PASSWORD` | `/api/send-email` 발신(연락 폼) | 메일 발송 실패 |
| `GOOGLE_PRIVATE_KEY` | GA4 Data API 서비스 계정 키 | 조회수 등 GA 데이터 비표시 |

공개 상수(사이트 URL·연락 메일·Notion 블로그 데이터소스 ID·GTM/GA ID)는 env 가 아니라 `src/lib/config.ts` 한 곳에서 관리한다.

## 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | lint 후 개발 서버 |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | 타입 검사 |
| `pnpm test` | vitest 단위테스트(`src/**/*.test.ts`) |
| `pnpm build` | 프로덕션 빌드(Notion API 호출, 약 5분, 연속 실행 시 429 주의) |

## CI/CD

- **CI**: `.github/workflows/ci.yml`. PR·main 푸시마다 lint → typecheck → test (main 푸시는 문서 전용 변경 제외). 빌드는 Notion 키가 필요해 Vercel 빌드가 최종 게이트다.
- **배포**: Vercel Git 연동. main 머지가 곧 운영 배포이므로 main 직접 push 대신 브랜치 → PR → CI 통과 → 머지. Preview 는 PR 마다 자동.
- **배포 후 확인**: `curl -s -o /dev/null -w '%{http_code}' https://yoramilji.kr` 가 200, 없는 경로(`/zzz-nonexistent-control`)가 404(soft-404 아님, 2026-10-26 확인), 홈 히어로·블로그 목록 렌더.

## 모듈 지도

| 영역 | 경로 / 모듈 | 역할 및 고정 규칙 |
|---|---|---|
| 홈 | `src/app/page.tsx`, `src/components/home/`, `hero.ts` | 3D 히어로(react-three-fiber) + Development·Design·Blog 섹션 |
| 블로그 | `src/app/(content)/blog/`, `src/services/notion.api.ts`·`notion.client.ts` | Notion 데이터소스 → 목록·상세. `feed.xml`·`llms.txt`도 같은 소스 |
| 포트폴리오 | `src/app/(content)/portfolio/`, `src/components/portfolio/`, `src/content/portfolio/`, `src/services/portfolio.api.ts`, `src/types/portfolio.type.ts` | 리포 안 정본 + `public/portfolio/` 이미지. 조회는 `portfolio.api.ts` 한 곳(외부 호출 없음) |
| 프로필 | `src/app/(content)/profile/` | 공개 프로필만. 이력서 본문·PDF는 두지 않는다 |
| CBT 퀴즈 | `src/app/(content)/quiz/`(exam·practice·review), `src/lib/quiz/`, `src/data/quiz/*.json` | noindex. 오답 노트·풀이 기록은 문제 ID로 localStorage에 저장하므로 ID는 겹치면 안 된다(테스트가 검사). 기출은 `past.json` 하나가 원본이고 회차별 카테고리로 쪼개 쓴다 |
| API 라우트 | `src/app/api/notion-image`, `src/app/api/send-email` | 이미지 프록시, 연락 메일 발신. 연락 폼 입력 검증·HTML 이스케이프·길이 상한은 `src/lib/contact-email.ts` 한 곳(폼 `maxLength`도 같은 값) |
| SEO·메타 | `src/lib/seo.ts`, `src/app/sitemap.ts`·`robots.ts`·`opengraph-image.tsx` | JSON-LD·동적 OG. 기준 URL은 `config.ts` |
| 설정 단일 출처 | `src/lib/config.ts` | 공개 상수 전부. 시크릿만 env |

## 운영 함정

근거와 세부 동작은 각 파일 머리 주석에 있다.

- **Notion API 한도(통합당 3 req/s)**: 빌드는 `src/services/notion.client.ts` 의 간격 제한·재시도와 정적 생성 워커 1개로 한도 아래를 유지한다(`docs/adr/ADR-0001`). Notion 클라이언트를 따로 만들지 않는다.
- **블로그 글 공개 기준 = `발행` 체크박스**: 글을 ID로 여는 경로(상세 `/blog/[id]`·`generateMetadata`·`opengraph-image`·커버 프록시)는 쿼리 필터가 걸리지 않으므로 `getPost` 가 아니라 `getPublishedPost`(`src/services/notion.api.ts`)를 쓴다. 판별은 `src/lib/blog-post-visibility.ts` 한 곳. 미발행·없는 ID는 404이고, Notion 한도 초과·5xx는 404로 바꾸지 않는다(재검증 중 장애로 발행 글이 404로 캐시되지 않게).
- **Notion 이미지는 만료 URL**: 블로그 이미지는 `/api/notion-image` 프록시를 거치고 직접 URL을 캐시하지 않는다. 페이지 밖에서 읽히는 커버(og:image·twitter:image·JSON-LD)는 `getShareableCoverUrl` 로 프록시의 절대 URL을 쓴다. 포트폴리오는 이 프록시를 쓰지 않는다.
- **포트폴리오 케이스 추가**: `src/content/portfolio/<slug>.ts` 를 쓰고 `index.ts` 배열에 끼운다(배열 순서 = 노출 순서 = 이전·다음 순서). 이미지는 `public/portfolio/<slug>/` 에 webp로 두고 가로 1600px를 넘기지 않는다. 이미지 경로 존재는 테스트가 검사한다.

## 주의

공개 리포다. 커밋 전 이력서·지원서·개인 연락처 같은 자료가 섞이지 않았는지 본다. 한 번 push 된 파일은 삭제 커밋으로 히스토리에서 사라지지 않는다.
