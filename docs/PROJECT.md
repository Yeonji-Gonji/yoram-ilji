---
project: yoram-ilji
type: project-overview
---

# PROJECT: yoram-ilji

> 이 문서는 프로젝트 목표와 기술 스택만 담음. 진행 상황(진행 중·완료·남은 일·결정 대기)은 적지 않음.
> - **진행 상황·남은 일**: [GitHub Issues](https://github.com/Yeonji-Gonji/yoram-ilji/issues)
> - **변경 이력**: `git log`·PR
> - **명령·환경변수·모듈 지도·운영 함정**: 루트 [README](../README.md)

## 목표

개인 포트폴리오와 기술 블로그를 한 사이트 `https://yoramilji.kr`로 공개함.

- **블로그**: Notion 데이터베이스에 쓴 글 중 `발행` 체크박스를 켠 글만 공개. 새로 발행한 글은 재배포 없이 열림
- **포트폴리오**: 리포 안 정본(`src/content/portfolio/`)과 로컬 이미지로 운영. 외부 호출 없음([ADR-0002](adr/ADR-0002-portfolio-static-git-ssot.md))
- **정보처리기사 실기 CBT(`/quiz`)**: 리포 안 JSON 문제은행으로 운영. 검색 비노출
- **공개 범위**: 공개 리포. 사이트에 띄우는 공개 프로필만 두고 이력서·지원서·회사별 맞춤 자료는 두지 않음

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) · React 19 · TypeScript |
| UI | HeroUI · Tailwind 4 · react-three-fiber(홈 히어로) |
| 콘텐츠 | 블로그 = Notion API, 포트폴리오 = `src/content/portfolio/` + `public/portfolio/`, 퀴즈 = `src/data/quiz/*.json` |
| 계측 | GTM · GA4(조회수는 GA4 Data API) · Search Console |
| 테스트·CI | vitest, GitHub Actions(lint → tsc → test) |
| 패키지 매니저 | pnpm 10(`package.json`의 `packageManager`로 고정) |
| 배포 | Vercel, main push 자동 배포 |

## 참고 문서

- **구 의사결정 기록**: [`docs/adr/`](adr/)(동결 참고본). [ADR-0001](adr/ADR-0001-notion-api-rate-limit-build.md) Notion 한도 아래 빌드 · [ADR-0002](adr/ADR-0002-portfolio-static-git-ssot.md) 포트폴리오 Git 정본화
- **과거 현황판·검증 리포트**: [`docs/archive/`](archive/)(작성 시점 값으로 고정)
