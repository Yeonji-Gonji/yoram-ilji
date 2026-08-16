// 이력서 단일 소스 (Git 버전관리 · 여기만 편집하면 /resume 화면과 PDF에 동시 반영)
// - 본문은 마크다운 볼드(**강조**)를 지원합니다.
// - metric: 괄호형 정량 지표 (회색으로 분리 표기)
// - 픽셀 단위로 동일한 PDF 산출을 위해 자유 MDX가 아니라 구조화 데이터로 관리합니다.
// 이 파일이 이력서의 정본 (정본 인덱스: obsidian/portfolio/README.md)

import { appConfig } from '@/lib/config';

export interface ResumeBullet {
  md: string; // **강조** 지원. 경력 항목에서는 프로젝트 개요 1문장(서술형)
  metric?: string; // 회색 정량 지표 (항목 끝)
  subs?: string[]; // 실적 항목. 개조식(체언 종결) 20~50자. 근거: .claude/rules/tone-guide.md 실측
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
    { label: 'Blog', value: 'yoramilji.kr/blog' },
  ],
  summaryLead:
    'React와 Next.js로 커머스·AI·부동산처럼 데이터가 많은 실서비스 화면을 2년 넘게 만들어 온 프론트엔드 개발자입니다. 지금은 AI 에이전트 SaaS에서 프론트엔드와 기획을 함께 맡아, 자사 제품부터 공동사업과 고객사 발주 프로젝트까지 운영 단계로 끌고 갑니다. 그 전에 브랜드 커머스를 2년 3개월 디자인했고, 화면을 직접 만들고 싶어 개발로 전향했습니다.',
  // 축 순서 = strength-narrative.md 기본 배열(수치 → UX·디자인 → 오너십)
  summaryPoints: [
    {
      md: '**만든 것을 실측으로 확인하고 숫자로 남깁니다.** 콘텐츠 이미지 전송량을 33.8MB에서 0.38MB로 줄이고, 결제 테스트를 22건에서 47건으로 늘렸습니다. 진척이 말로 갈리는 지점은 화면 코드의 호출 지점을 전수 대조해 판정했습니다.',
    },
    {
      md: '커머스 화면은 디자이너 시절 검색·장바구니·주문서·회원까지 상태(state) 단위로 설계했고, **지금은 결제·정산 화면을 직접 구현**합니다. 디자인 시스템은 색·간격·elevation을 토큰으로 정의해 다크모드까지 값 교체로 따라오게 만듭니다.',
    },
    {
      md: '**화면을 만들다 기획까지 맡았습니다.** 기능정의서의 빈 곳이 구현하는 사람에게 가장 먼저 보였고, 그 자리를 메우면서 1년 정체된 서비스를 3개월 만에 출시하고 결제 장애를 당일 차단해 복구까지 끌고 갔습니다. 전시 부스 체험 앱은 행사 3일간 약 1,500명이 썼고, 개인 프로덕트 오늘수영은 기획부터 배포까지 단독으로 완주해 운영 중입니다.',
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
          md: '**자사 SaaS 결제·멤버십 신뢰성 복구.** 실사용자 결제 장애를 가장 먼저 발견해 당일 차단하고, 두 달에 걸쳐 다시 판매할 수 있는 상태까지 복구했습니다.',
          subs: [
            'HTTP 상태 코드 기준 결제 판정을 응답 본문 기준으로 교정',
            '결제 오류 13개 케이스 전수 매핑 후 사용자 문구로 정규화',
            '백엔드 멱등키·보상 트랜잭션 배포를 해제 조건으로 건 결제 게이트 설계',
            '회원 등급과 멤버십 상태 분리로 403 접근 불가 문제 해소',
            '백엔드 v2 200여 엔드포인트 대응, 호출 지점 전수 대조로 연동 진척 판정',
          ],
          metric: '결제 테스트 22→47건 · 실카드 시나리오 15건 통과',
        },
        {
          md: '**자사 SaaS 웹서비스·어드민 신규 구축과 진입 동선 기획.** 화면이 없는 상태에서 두 서비스를 단독 구축하고, 기획까지 맡아 진입점 전체의 사용자 흐름을 설계했습니다.',
          subs: [
            '가입·인증에서 결제·멤버십, 캐스팅, SDK 설치 온보딩까지 단일 동선 설계',
            '회원 콘솔 전반 한/영 다국어 전환',
            '메인 웹 Next.js 이관 후 정식 운영, 보안 헤더·CSP 정비',
          ],
        },
        {
          md: '**GEO·AI 챗봇·CMS 기반 한의원 웹서비스 구축** (공동사업, 진행 중). 검색·AI 답변 인용을 목표로 정보구조부터 설계하고 프론트엔드를 담당하고 있습니다.',
          subs: [
            '진료과목 18개 정보구조와 페이지 표준 설계',
            '프론트엔드·운영 백엔드·챗봇 서버 3자 인터페이스 계약 기능정의서 작성, 백엔드가 해당 문서로 구현',
            '의료 답변 골든셋 54문항 명세(필수 고지·금지 표현 포함)',
            '질환 상세 이미지 전송량 33.8MB→0.38MB (배치 시점 WebP 변환)',
            '검색 실적 16개월치 분석으로 레거시 URL 이관 범위 판정',
          ],
        },
        {
          md: '**커머스 진입점(카페24 앱스토어) 출시.** 1년간 정체돼 있던 신규 서비스를 맡아 커머스 데이터 구조부터 정의해 3개월 만에 MVP를 출시했습니다.',
          subs: [
            '상품·주문 흐름 백엔드 기능정의서 직접 작성, 화면 구현으로 누락·모순 검증',
            'Cafe24 OpenAPI 27개 스펙 대조, 온보딩 4단계 구현',
            '앱 심사 1차 반려(인증 콜백 파라미터) 당일 수정 후 통과',
          ],
          metric: '앱 프론트 gzip 186KB · 한/영 다국어',
        },
        {
          md: '**서드파티 임베드 SDK 구축과 배포 체계 전환.** 고객사 사이트에 삽입되는 위젯을 만들고, 직접 고른 NPM 배포가 호스트 React 버전과 충돌하는 것을 확인해 CDN 방식으로 전환했습니다.',
          subs: [
            'NPM 패키지에서 CDN standalone 스크립트로 전환, 버전 의존 제거',
            'GitHub Actions 직접 작성으로 푸시 1회 CDN 자동 배포 (Jenkins 이관)',
            '스프라이트 245KB→8.4KB, 초기 요청 2회→1회',
            '실서비스 위젯 미표시 장애 후 자동 발행 중단, 검증 스냅샷 복사 방식으로 전환',
          ],
        },
        {
          md: '**전시 부스 AI 체험 웹앱 구축과 현장 운영** (SEMICON Korea 2026). 3D와 실시간 채팅을 직접 구현하고 행사 3일을 무중단 운영했습니다.',
          subs: [
            'react-three-fiber 3D 화면, 네이티브 WebSocket 채팅 구현',
            '블루그린 배포 중 대화 유지되는 자동 재연결 설계',
            '첫날 결과 기반으로 채팅 진입 경로 전면 배치 전환, 익일 신규 채팅 사용자 1.5배',
          ],
          metric: '3일간 고유 사용자 약 1,500명 · 챗봇 대화 약 550개 메시지',
        },
        {
          md: '**프론트엔드 도커 배포 전환과 팀 배포 표준화.** 첫 시도에서 겪은 실수를 조사해 보강하고, 검증된 방식을 팀 표준으로 만들었습니다.',
          subs: [
            '환경 종속으로 배포가 멈추는 구조를 도커 이미지 배포로 전환',
            '로그 로테이션 누락·이미지 버전 불일치 지적 후 서버 운영 구조 전수 조사',
            '판단 기준 7원칙과 실행 도구로 정리해 팀 공유, 실전 사고 6건 내장',
            '타입체크·테스트·빌드 CI 게이트 신설, 어드민 타입체크 미작동 교정으로 잠재 오류 5건 발굴',
          ],
          metric: '한 주에 운영 승격 5회·롤백 0건 · 서버 디스크 79%→35%',
        },
        {
          md: '**이러닝 LMS·AI 대화 서비스 프론트엔드** (LMS 팀 10여 명, manil 프론트엔드 메인).',
          subs: [
            '결제 상태 6단계 분기, 인원수 기반 정산·할인 계산 구현',
            'HLS 플레이어 이어보기·3기기 동시 재생 제한·화질 전환',
            'manil 라우팅·채팅·등록 폼·리포트 화면 구현',
          ],
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
          md: '**부동산 진단·계산 서비스 프론트엔드.** 데이터가 많은 화면을 다루며 기초를 쌓은 시기입니다. React로 학습한 뒤 회사 스택 Angular 16·RxJS에 적응해 작업했습니다.',
          subs: [
            '부동산 지도(Naver Map) 구현: 주거형 매물 필터링, 타일·뷰포트 렌더링으로 대량 매물 표시',
            '대출 계산기 DSR 로직 이전, 입력 실시간 상태 처리로 소득 대비 한도 즉시 표시',
            '관리자 사이트 신규 개발, 데이터 처리 로직 Service 캡슐화로 6개 테이블 방식 통일',
            '관리자 권한 2단 분리(라우터 가드), 유저·결제 데이터 관리 화면 구현',
            'Studio NANGMAN·Bioroom 홈페이지 외주 제작',
          ],
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
          md: '**커머스·패션 브랜드 UI 비주얼 디자인.** 종합몰과 패션 커머스의 쇼핑 여정 전반을 브랜드 톤에 맞춰 완성했습니다. 지금 커머스 도메인 감각의 바탕이 된 시기입니다.',
          subs: [
            '오뚜기몰·동원몰 커머스 UI: 검색·장바구니·주문서·회원 화면',
            '로그인 여부·회원등급별 상태(state) 단위 화면 규칙 정의',
            '올리브데올리브 패션 커머스 PC·모바일 두 벌 작업 (모바일 화면만 60여 장)',
            'V12·YOUANDUS 서비스 플로우 기획부터 프로덕트 디자인까지 담당',
            '미래엔·앤드백·아이코스 외 다수 브랜드 웹·모바일 UI, 스타일 가이드, cafe24·고도몰 연계 사이트',
          ],
        },
      ],
    },
  ],
  sideProjects: [
    {
      md: '**오늘수영** (개인 프로덕트, 단독). 전국 자유수영 정보앱을 기획·디자인·개발·배포까지 단독으로 구축해 운영 중입니다.',
      subs: [
        'iOS 스타일 디자인 시스템·다크모드 시맨틱 토큰 설계, 라이트·다크 대비(AA) 검증',
        '리스트 중심 홈을 내 위치 기반 지도로 재설계, 마커 클러스터링으로 전국 표시',
        '지도 SDK 마커 오프셋 문제를 CSS transform 앵커로 해결',
        'Next 16·React 19·Tailwind v4·Kakao Maps, NestJS 백엔드 직접 구현',
      ],
      metric: '공공 API로 전국 602곳 적재 · 정식 배포 후 운영 중',
    },
    {
      md: '**헬핏 (HelFit)** (팀 6인, FE 팀장). 헬스 종합 플랫폼을 출시해 운영 중입니다.',
      subs: [
        '디자인과 프론트엔드 전담, D3.js 커스텀 차트 구현',
        'ChatGPT 스트리밍 챗봇·식단 추천 연동',
      ],
      metric: 'helfit.life 운영 중',
    },
    {
      md: '**Playlist → MP3** (개인, 단독). 유튜브 플레이리스트를 태그·앨범아트까지 담아 MP3로 저장하는 데스크톱 앱입니다.',
      subs: [
        'Python·PySide6 크로스 플랫폼 GUI, macOS·Windows·Linux 3종 배포',
        '워커 스레드 SIGSEGV 크래시 원인 규명 후 수정',
      ],
    },
    {
      md: '**낙낙** (팀, 팀장). React Native 일정관리 앱의 디자인과 프론트엔드를 맡아 스토어에 출시했습니다.',
      subs: ['App Store·Play Store 출시, 앱 서명·스토어 등록 담당'],
      metric: '현재 백엔드 미운영 (출시 이력)',
    },
  ],
  skills: [
    {
      label: '주력',
      items:
        'React 19 · Next.js 16 · TypeScript · Tailwind CSS · Zustand · TanStack Query',
    },
    {
      label: '디자인·UI 설계',
      items:
        '디자인 토큰·다크모드 설계 · Figma · Photoshop·Illustrator · 서비스 플로우 기획',
    },
    {
      label: '그래픽·실시간',
      items:
        'react-three-fiber·Three.js · WebSocket · D3.js · chart.js · Kakao·Naver Map',
    },
    {
      label: '인프라·품질',
      items:
        'GitHub Actions · Docker · AWS(S3·CloudFront) · Vercel · vitest · Playwright',
    },
    {
      label: '그 외 경험',
      items:
        'React Native · Angular 16·RxJS · Redux Toolkit · React Hook Form · Emotion·SCSS · next-intl·react-i18next · PWA · Alibaba Cloud · Vite',
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
