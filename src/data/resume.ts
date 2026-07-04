// 이력서 단일 소스 (Git 버전관리 · 여기만 편집하면 /resume 화면과 PDF에 동시 반영)
// - 본문은 마크다운 볼드(**강조**)를 지원합니다.
// - metric: 괄호형 정량 지표 (회색으로 분리 표기)
// - 픽셀 단위로 동일한 PDF 산출을 위해 자유 MDX가 아니라 구조화 데이터로 관리합니다.
// 이 파일이 이력서의 정본 (정본 인덱스: obsidian/portfolio/README.md)

import { appConfig } from '@/lib/config';

export interface ResumeBullet {
  md: string; // **강조** 지원
  metric?: string; // 회색 정량 지표
}

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  note?: string; // 회사 한 줄 설명 (이탤릭)
  bullets: ResumeBullet[];
}

export interface ResumeSkillRow {
  label: string;
  items: string;
}

export interface ResumeData {
  name: string;
  title: string;
  tagline: string;
  contacts: { label: string; value: string }[];
  summaryLead: string;
  summaryPoints: ResumeBullet[];
  experience: ResumeExperience[];
  sideProjects: ResumeBullet[];
  skills: ResumeSkillRow[];
  education: string[];
}

export const resume: ResumeData = {
  name: '김준희',
  title: '프론트엔드 개발자',
  tagline:
    '디자인 감각을 갖춘 프론트엔드 · 기획과 개발 사이를 직접 메우는 사람',
  contacts: [
    { label: 'GitHub', value: 'github.com/Yeonji-Gonji' },
    { label: 'Email', value: appConfig.contactEmail },
    { label: '포트폴리오', value: 'yoramilji.kr' },
    { label: 'Blog', value: 'modac.tistory.com' },
  ],
  summaryLead:
    '시각디자인을 전공하고 브랜드 커머스를 디자인하다 프론트엔드로 전향한 개발자입니다. 디자인을 해본 경험 덕분에 사용자 관점에서 화면을 판단하고, 기획이 비어 있는 부분은 화면을 직접 구현하면서 찾아 메웁니다. 현재 AI 프로덕트 스타트업에서 기획(PM)과 프론트엔드를 함께 맡아 여러 서비스를 운영 단계까지 담당하고 있습니다.',
  summaryPoints: [
    {
      md: '**경력**: UI/UX 디자이너 2년 3개월(브랜드 커머스) → 프론트엔드 2년+(AI 스타트업·부동산 서비스).',
    },
    {
      md: '**지금**: AI 에이전트 SaaS에서 프론트엔드 + PM 겸직. 메인 웹·임베드 SDK·전시 앱·병원 홈페이지 SI를 운영·구축 단계까지 담당.',
    },
    {
      md: '**커머스 적합성**: 검색·장바구니·주문서·회원 화면을 상태까지 설계(디자이너) → 결제·정산 화면을 직접 구현(현재).',
    },
    {
      md: '**검증 방식**: 테스트·번들 최적화·배포 자동화로 결과를 수치로 남김. 지표는 실측치이며 값이 없으면 추정하지 않음.',
    },
  ],
  experience: [
    {
      company: '업폴 (Upfall)',
      role: '프론트엔드 / PM 겸',
      period: '2025.02 ~ 재직 중',
      note: '고객사 자사몰에 임베드형 AI 에이전트를 붙이는 SaaS 스타트업',
      bullets: [
        {
          md: '**1년 가까이 정체됐던 신규 AI 챗봇 서비스의 PM을 맡아 3개월 만에 브랜딩 확정·서비스 목표 정의·1차 백엔드 완료·출시 준비까지 견인.** 기획-개발 병목을 화면을 직접 구현하며 메웠고, 카페24 앱 심사 1차 반려(OAuth 콜백 iss 누락)를 당일 수정·재심사로 대응.',
          metric:
            '프론트 gzip 186KB · vitest 12 통과 · i18n 60키 ko/en · Cafe24 OpenAPI 27스펙 일치',
        },
        {
          md: '**병원 홈페이지 리뉴얼 SI(의사친구)를 PM 겸 프론트엔드로 진행 중.** 비개발자 고객(원장)과 정보구조·회원 정책을 직접 협상해 확정하고, AI 검색(GEO) 대응 구조 위에 AI 상담 챗봇과 운영 도구를 얹는 프로젝트. 인프라·인증 결정 5건을 고객이 판단할 수 있는 형태로 정리해 중개.',
          metric: '2026.04~ · 2개월 오픈 목표 진행 중',
        },
        {
          md: '**운영 중 결제 서비스에서 실사용자 결제 장애를 가장 먼저 감지·수습.** 백엔드 단기 수정이 어려워 프론트엔드에서 결제를 차단해 추가 피해를 당일 차단, PG 대시보드로 직접 환불·사과. 이후 원인을 정책 문제로 재정의해 권한·멤버십·유료 정책 정리를 제안.',
        },
        {
          md: '**임베드형 AI SDK 배포를 NPM→CDN standalone으로 전환**해 호스트 React 버전 충돌을 근본 해결하고, GitHub Actions 워크플로우를 직접 작성(Jenkins→GHA, pnpm 통일)해 푸시 한 번에 CDN 자동 배포.',
          metric:
            'vitest 184케이스 통과 · 스프라이트 245KB→8.4KB · 초기 요청 2회→1회',
        },
        {
          md: 'AI 서비스 메인 웹을 **Next.js로 이관**하고 인증·결제·멤버십·캐스팅 동선을 구현해 정식 운영(LIVE). 해킹 시도를 계기로 보안 헤더·CSP·XSS 방어를 정비하고, 한국어 하드코딩 24개 파일을 한/영으로 일괄 정리.',
        },
        {
          md: '**전시 부스 체험 웹앱**을 3D(react-three-fiber)·자동 복구형 실시간 채팅(네이티브 WebSocket)으로 거의 전부 직접 구현: 블루그린 배포 중에도 대화를 잃지 않는 재연결 경로 설계.',
          metric: 'SEMICON Korea 2026, 코엑스',
        },
        {
          md: '**이러닝 LMS**(모노레포, 팀 10여 명·약 6개월·본인 300여 커밋) FE: 6단계 결제 상태 분기·payDt 정합성 검증, HLS 플레이어(이어보기·3기기 제한), 인원수 기반 정산·할인 계산 담당.',
        },
        {
          md: '**manil**(사주 기반 AI 대화 서비스) FE 메인(본인 94/166 커밋): 라우팅·채팅(일일 사용량 제한)·생년월일 폼(양/음력 휠 피커)·OAuth 로그인 동선 구현.',
        },
      ],
    },
    {
      company: 'ARESA Korea (아리사 코리아)',
      role: '프론트엔드 (신입)',
      period: '2023.12 ~ 2024.07',
      note: '부동산 진단·계산 서비스. 데이터가 많은 실서비스 화면으로 FE 기초를 쌓은 시기',
      bullets: [
        {
          md: '**부동산 지도(Naver Map)**: 주거형 매물 필터링, 타일·뷰포트 렌더링으로 대량 매물을 끊김 없이 표시. 마커→인프라·실거래·평형 상세 연결.',
        },
        {
          md: '**대출 계산기**: DSR 계산 로직 이전, 입력을 클라이언트 실시간 상태로 처리해 소득 대비 한도 즉시 표시(차트·슬라이더).',
        },
        {
          md: '관리자 사이트 신규 개발(Angular Material, 6개 테이블 Service 캡슐화·라우터 가드), Studio NANGMAN·Bioroom 홈페이지 외주.',
        },
        {
          md: '스택: Angular 16, RxJS, TypeScript, Tailwind.',
          metric: 'React로 학습했으나 회사 스택 Angular에 적응',
        },
      ],
    },
    {
      company: '코드스테이츠 부트캠프 (SEB)',
      role: '프론트엔드 전향',
      period: '2022.10 ~ 2023.11',
      bullets: [
        {
          md: '디자인 실무를 바탕으로 프론트엔드로 커리어를 전환. 프론트엔드 부트캠프(SEB) 수료.',
        },
      ],
    },
    {
      company: 'MSYNC (엠싱크)',
      role: 'UI/UX·GUI 디자이너 (주임/계장)',
      period: '2020.07 ~ 2022.10',
      note: '유명 브랜드 커머스 웹·모바일 기획·디자인. 커머스 도메인 감각의 바탕',
      bullets: [
        {
          md: '**오뚜기몰·동원몰 커머스 UI 디자인**: 검색·장바구니·주문서·회원 화면과 상태(state)까지 설계.',
        },
        {
          md: '골프웨어 V12·큐레이팅 브랜드 YOUANDUS 서비스 플로우 기획 + 프로덕트 디자인.',
        },
        {
          md: '미래엔·올리브데올리브·앤드백·아이코스 외 다수 웹/모바일 UI 및 기획전 비주얼. UI/UX·스타일 가이드 제작, cafe24·고도몰 연계 사이트 제작.',
        },
      ],
    },
  ],
  sideProjects: [
    {
      md: '**헬핏 (HelFit)** | FE·팀장, 6인, 배포(helfit.life): 헬스 종합 플랫폼. 디자인·FE 모두 수행. D3.js 커스텀 차트, ChatGPT 스트리밍 챗봇·식단 추천 연동.',
    },
    {
      md: '**오늘수영** | 단독: 자유수영 정보앱을 기획부터 배포(Vercel)까지 혼자 완성. Next 16·React 19·Tailwind v4·PWA.',
    },
    {
      md: '**Playlist → MP3** | 단독: 유튜브 플레이리스트를 태그·앨범아트까지 담아 MP3로 저장하는 크로스 플랫폼 데스크톱 앱(macOS·Windows·Linux). 워커 스레드 SIGSEGV 크래시 원인 규명·수정, uv 원클릭 설치 스크립트 배포.',
    },
    {
      md: '**노크노크** | 팀장, RN 일정관리 앱, 디자인+FE, App Store·Play Store 출시 경험.',
      metric: '현재 백엔드 미운영: 출시 경험만',
    },
  ],
  skills: [
    {
      label: 'Frontend',
      items:
        'React 19 · Next.js 16 · TypeScript · Angular · React Native · Vite',
    },
    {
      label: '상태/데이터',
      items:
        'Zustand · Redux Toolkit · RxJS · TanStack Query · React Hook Form',
    },
    { label: '스타일', items: 'Tailwind CSS · Emotion · SCSS · 디자인 시스템' },
    {
      label: '그래픽/실시간',
      items:
        'react-three-fiber·Three.js · WebSocket · D3.js · chart.js · Naver Map',
    },
    {
      label: '인프라/품질',
      items:
        'GitHub Actions · AWS(S3·CloudFront) · Vercel · PWA · vitest · Playwright',
    },
    { label: '다국어', items: 'next-intl · react-i18next' },
    {
      label: '디자인',
      items: 'Photoshop·Illustrator · Figma · UI/UX · 서비스 플로우 기획',
    },
  ],
  education: [
    '남서울대학교 시각정보디자인학과(시각디자인 전공) 졸업 (~2020.02)',
    '코드스테이츠 부트캠프(SEB) 수료',
    '정보처리기사 실기 응시 예정 (2026.07)',
  ],
};
