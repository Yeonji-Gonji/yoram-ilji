# PROJECT: yoram-ilji 현황판

> 갱신일: 2026-07-14
> 히스토리 정본: obsidian vault `projects/yoram-ilji.md` (private)
> 사이트 구조·콘텐츠 설계: vault `portfolio/site-structure-plan.md` + `detail-design-and-content-architecture.md`

## 현재 상태

- 개인 포트폴리오 + 기술 블로그. `https://yoramilji.kr`, Vercel 배포.
- Next.js 16 + React 19 + HeroUI + Tailwind 4 + react-three-fiber. 콘텐츠는 Notion API가 데이터소스.
- SEO/GEO 정비 완료(sitemap·robots·JSON-LD 6종·동적 OG·llms.txt·feed.xml), GTM+GA4+GSC 측정 인프라 가동(2026-07-09).

## 진행 중

- 콘텐츠 발행 (최대 미해결, 정처기 7/18 이후 집중)

## 최근 완료

- 2026-07-17 기출복원 전 회차 20문제 충족: 웹수집 50문제 추가(2023-1 8, 2023-3 10, 2024-1 3, 2024-2 7, 2024-3 1, 2025-1 6, 2025-2 1, 2025-3 11, 2026-1 3)로 기출 150→200, 총 340→390문제. 검증 기준은 기존과 동일(2개 이상 독립 출처 교차 일치 또는 코드 직접 실행/트레이스), 2026-1 신유형 2문제만 단일 출처 복원이라 해설에 주의 표기. 수집 로그는 세션 스크래치패드에만 존재
- 2026-07-14 정보처리기사 실기 CBT 기능(/quiz) 추가: 340문제(시나공 PDF 7종 190 + 웹수집 기출복원 2023~2026 150, 회차별 분류), 모의고사·유형별 연습·오답노트 3모드, 자동 채점+자가 채점, localStorage 기록, noindex. 전수 검증 워크플로우(PDF 대조+코드 재트레이스) 통과 → 상세: `docs/archive/report-quiz-cbt-2026-07-14.md`
- 2026-07-09 GTM(GTM-5FGH28HC)+GA4+GSC·네이버 소유확인, 사이트맵 제출
- 2026-07-09 오늘수영 인프라 글 긱뉴스 등록: 첫 유입 활동 (당일 7P)
- 2026-07-05 홈 개편: Development 부채꼴 갤러리, Design 쇼케이스 배너, Blog 그리드, 연지곤지 거북이 히어로 SVG

## 알려진 이슈 / 남은 일

- Notion 포폴 케이스 커버(썸네일) 업로드 대기 (`~/Desktop/projects/portfolio-thumbnails/` 시안 3종 제작됨)
- 오늘수영 케이스 featured 여부 미결정
- 빌드 연속 실행 시 Notion API 429 주의

## 링크

- GitHub: Yeonji-Gonji/yoram-ilji
- 케이스 데이터 정본: Notion 포폴 DB / 이력서 정본: `src`의 resume.ts
