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

export interface ResumeEduItem {
  period: string; // "2022.10 ~ 2023.04" 또는 "2024.11"
  title: string; // 기관·과정·자격명 (볼드 렌더)
  subtitle?: string; // 학과·과정 설명 (회색)
}

export interface ResumeEduGroup {
  label: string; // "학력" | "교육 · 자기개발" | "자격증"
  items: ResumeEduItem[];
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
  education: ResumeEduGroup[];
}

export const resume: ResumeData = {
  name: '김준희',
  title: '프론트엔드 개발자',
  tagline: '디자인 감각을 갖춘 프론트엔드 · 기획(PM)을 겸하는 개발자',
  contacts: [
    { label: 'GitHub', value: 'github.com/Yeonji-Gonji' },
    { label: 'Email', value: appConfig.contactEmail },
    { label: '포트폴리오', value: 'yoramilji.kr' },
    { label: 'Blog', value: 'modac.tistory.com' },
  ],
  summaryLead:
    '시각디자인을 전공하고 브랜드 커머스를 디자인하다, 화면을 직접 만들고 싶어 프론트엔드로 전향했습니다. 디자인을 해봤기에 사용자 눈으로 화면을 판단합니다. 지금은 AI 프로덕트 스타트업에서 PM과 프론트엔드를 함께 맡아 여러 서비스를 운영 단계까지 끌고 갑니다.',
  summaryPoints: [
    {
      md: '**UI/UX 디자이너로 2년 3개월** 일한 뒤 프론트엔드로 전향해, 2년 넘게 커머스와 AI, 부동산처럼 데이터가 많은 실서비스 화면을 개발하고 있습니다.',
    },
    {
      md: '커머스 화면은 디자이너 시절 검색·장바구니·주문서·회원까지 상태(state) 단위로 설계했고, **지금은 결제·정산 화면을 직접 구현**합니다. 그리는 관점과 만드는 관점을 모두 거쳤습니다.',
    },
    {
      md: '지금은 **AI 에이전트 SaaS에서 PM과 프론트엔드를 겸하며** 메인 웹·임베드 SDK·전시 앱·병원 SI를 맡고 있습니다. 결과는 테스트·번들 최적화·배포 자동화로 남기며, 지표는 모두 실측치입니다.',
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
          md: '**1년 간 출시가 정체돼 있던 신규 AI 챗봇 서비스를 맡아**, 3개월 만에 브랜딩과 서비스 목표를 명확히 정리했습니다. 이후 백엔드 개발자와 협업해 시장 검증용 MVP 출시를 완수했습니다.',
          metric:
            '카페24 앱 심사 반려(OAuth iss 누락) 당일 수정 · gzip 186KB · vitest 12 · i18n 60키 ko/en · Cafe24 OpenAPI 27스펙',
        },
        {
          md: '**병원 홈페이지 리뉴얼 SI**를 PM 겸 프론트엔드로 진행하고 있습니다. 비개발자 고객과 정보구조·회원 정책을 직접 정하고, 인프라·인증 결정 5건은 고객이 판단할 수 있는 형태로 정리해 중개했습니다.',
          metric: '2026.04~ · 2개월 오픈 목표',
        },
        {
          md: '**운영 중이던 결제 서비스에서 실사용자 장애를 가장 먼저 발견**하고, 백엔드를 바로 고치기 어려운 상황이라 프론트엔드에서 결제를 막아 추가 피해를 당일 차단했습니다. 이후 PG 대시보드로 직접 환불·사과하고, 원인을 정책 문제로 다시 정의해 권한·멤버십 정리를 제안했습니다.',
        },
        {
          md: '**임베드형 AI SDK 배포를 NPM에서 CDN 방식으로 바꿔**, 호스트 사이트와의 React 버전 충돌을 없앴습니다. GitHub Actions도 직접 작성해 푸시 한 번에 CDN으로 자동 배포되게 만들었습니다.',
          metric:
            'Jenkins→GHA·pnpm 통일 · vitest 184 · 스프라이트 245KB→8.4KB · 초기 요청 2→1회',
        },
        {
          md: '**AI 서비스 메인 웹을 Next.js로 이관**해 인증·결제·멤버십·캐스팅 동선을 구현하고 정식 운영에 올렸습니다. 운영 중 해킹 시도를 계기로 보안 헤더·CSP·XSS 방어도 정비했습니다.',
          metric: 'LIVE',
        },
        {
          md: '**전시 부스 체험 웹앱**을 3D(react-three-fiber)와 실시간 채팅(네이티브 WebSocket)으로 거의 다 직접 구현했습니다. 블루그린 배포 중에도 대화가 끊기지 않도록 자동 재연결을 설계했습니다.',
          metric: 'SEMICON Korea 2026, 코엑스',
        },
        {
          md: '**이러닝 LMS**(팀 10여 명·본인 300여 커밋)의 프론트엔드를 맡아 6단계 결제 상태 분기, HLS 플레이어(이어보기·3기기 제한), 인원수 기반 정산·할인 계산을 구현했습니다. 사주 기반 AI 대화 서비스 manil의 프론트엔드 메인(94/166 커밋)도 담당했습니다.',
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
          md: '**부동산 지도(Naver Map)를 구현**했습니다. 주거형 매물만 필터링하고 타일·뷰포트 렌더링으로 대량 매물을 끊김 없이 띄웠으며, 마커에서 인프라·실거래·평형 상세로 연결했습니다.',
        },
        {
          md: '**대출 계산기를 맡아 DSR 로직을 이전**했습니다. 입력을 실시간 상태로 처리해 소득 대비 한도를 바로 보여줬습니다(차트·슬라이더).',
        },
        {
          md: '관리자 사이트를 신규 개발하고, Studio NANGMAN·Bioroom 홈페이지를 외주로 만들었습니다.',
          metric:
            'Angular Material·6개 테이블 Service 캡슐화·라우터 가드 / 스택 Angular 16·RxJS·TS·Tailwind (React로 학습 후 적응)',
        },
      ],
    },
    {
      company: 'MSYNC (엠싱크)',
      role: 'UI/UX·GUI 디자이너 (주임)',
      period: '2020.07 ~ 2022.10',
      note: '유명 브랜드 커머스 웹·모바일 기획·디자인. 커머스 도메인 감각의 바탕',
      bullets: [
        {
          md: '**오뚜기몰·동원몰의 커머스 UI를 디자인**했습니다. 검색·장바구니·주문서·회원 화면을 상태(state)까지 설계했습니다.',
        },
        {
          md: '골프웨어 V12·큐레이팅 브랜드 YOUANDUS의 서비스 플로우를 기획하고 프로덕트 디자인을 맡았습니다.',
        },
        {
          md: '미래엔·올리브데올리브·앤드백·아이코스 외 다수의 웹·모바일 UI와 기획전 비주얼을 작업하고, 스타일 가이드와 cafe24·고도몰 연계 사이트를 제작했습니다.',
        },
      ],
    },
  ],
  sideProjects: [
    {
      md: '**헬핏 (HelFit)**: FE 팀장으로 6인 팀을 이끌어 헬스 종합 플랫폼을 배포했습니다(helfit.life). 디자인과 프론트엔드를 모두 맡아 D3.js 커스텀 차트와 ChatGPT 스트리밍 챗봇·식단 추천을 연동했습니다.',
    },
    {
      md: '**오늘수영**: 자유수영 정보앱을 기획부터 배포까지 혼자 완성했습니다. iOS 스타일 디자인 시스템·다크모드를 토큰으로 직접 만들고, 홈을 내 위치 기반 지도-퍼스트로 재설계했습니다(Next 16·React 19·Tailwind v4·Kakao Maps).',
    },
    {
      md: '**Playlist → MP3**: 유튜브 플레이리스트를 태그·앨범아트까지 담아 MP3로 저장하는 크로스 플랫폼 데스크톱 앱을 단독으로 만들었습니다(macOS·Windows·Linux). 워커 스레드 SIGSEGV 크래시 원인을 규명해 고쳤습니다.',
    },
    {
      md: '**노크노크**: 팀장으로 React Native 일정관리 앱의 디자인과 프론트엔드를 맡아 App Store·Play Store에 출시했습니다.',
      metric: '현재 백엔드 미운영: 출시 경험만',
    },
  ],
  skills: [
    {
      label: 'Frontend',
      items: 'React 19 · Next.js 16 · TypeScript · Angular · React Native · Vite',
    },
    {
      label: '상태/데이터',
      items: 'Zustand · Redux Toolkit · RxJS · TanStack Query · React Hook Form',
    },
    { label: '스타일', items: 'Tailwind CSS · Emotion · SCSS · 디자인 시스템' },
    {
      label: '그래픽/실시간',
      items: 'react-three-fiber·Three.js · WebSocket · D3.js · chart.js · Naver Map',
    },
    {
      label: '인프라/품질',
      items: 'GitHub Actions · AWS(S3·CloudFront) · Vercel · PWA · vitest · Playwright',
    },
    { label: '다국어', items: 'next-intl · react-i18next' },
    {
      label: '디자인',
      items: 'Photoshop·Illustrator · Figma · UI/UX · 서비스 플로우 기획',
    },
  ],
  education: [
    {
      label: '학력',
      items: [
        {
          period: '2013.03 ~ 2020.02',
          title: '남서울대학교',
          subtitle: '시각정보디자인학과 (시각디자인 전공)',
        },
      ],
    },
    {
      label: '교육 · 자기개발',
      items: [
        {
          period: '2022.10 ~ 2023.04',
          title: '코드스테이츠 (Code States)',
          subtitle: '소프트웨어 엔지니어링 부트캠프 · 프론트엔드',
        },
        {
          period: '2021.10 ~ 2022.02',
          title: '1분코딩 퍼블리싱 강의',
          subtitle: '디자이너를 위한 코딩: 입문부터 포트폴리오 응용까지',
        },
        {
          period: '2019.12 ~ 2020.04',
          title: '봄아카데미',
          subtitle: 'UI/UX 모바일 웹 디자이너 양성 (웹디자인·웹퍼블리싱·HTML/CSS)',
        },
      ],
    },
    {
      label: '자격증',
      items: [
        {
          period: '2024.11',
          title: '웹디자인기능사',
          subtitle: 'HRDK 한국산업인력공단',
        },
      ],
    },
  ],
};
