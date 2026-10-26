# yoram-ilji

개인 포트폴리오 + 기술 블로그. https://yoramilji.kr

- **스택**: Next.js 16 (App Router) · React 19 · TypeScript · HeroUI · Tailwind 4 · react-three-fiber
- **콘텐츠**: Notion API (블로그·포트폴리오), 리포 내 JSON(정보처리기사 CBT)
- **배포**: Vercel (main 머지 = 운영 배포)
- **온보딩 시트**: [docs/PROJECT.md](docs/PROJECT.md)

## 개발

```bash
pnpm install
pnpm dev          # lint 후 http://localhost:3000
```

`.env.local` 에 서버 전용 키를 둔다(값은 커밋하지 않는다).

```bash
NOTION_API_KEY=<Notion 통합 시크릿>
GMAIL_APP_PASSWORD=<연락 폼 발신용 Gmail 앱 비밀번호>
GOOGLE_PRIVATE_KEY=<GA4 Data API 서비스 계정 private_key>
```

공개 상수(사이트 URL·연락 메일·Notion 데이터소스 ID·GTM/GA ID)는 `src/lib/config.ts` 에서 관리한다.

## 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | lint 후 개발 서버 |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | 타입 검사 |
| `pnpm build` | 프로덕션 빌드(Notion API 호출, 연속 실행 시 429 주의) |

## CI/CD

- **CI**: `.github/workflows/ci.yml`. PR·main 푸시마다 lint → typecheck (문서 전용 변경 제외). 빌드는 Notion 키가 필요해 Vercel 이 최종 게이트다.
- **배포**: Vercel Git 연동. main 직접 push 대신 브랜치 → PR → CI 통과 → 머지.

## 주의

공개 리포다. 이력서·지원서·개인 연락처 같은 자료를 넣지 않는다. 한 번 push 된 파일은 삭제 커밋으로 히스토리에서 사라지지 않는다.
