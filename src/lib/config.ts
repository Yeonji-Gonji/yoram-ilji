/**
 * 앱 전역 설정 값 중앙 관리.
 *
 * 시크릿(NOTION_API_KEY, GMAIL_APP_PASSWORD)만 .env로 관리하고,
 * 그 외 공개 상수(연락처 이메일 · 사이트 URL · Notion 데이터소스 ID 등)는
 * 전부 이 파일에서 단일 소스로 관리한다.
 */
export const appConfig = {
  /** 사이트 기본 URL */
  siteUrl: 'https://yoramilji.kr',

  /** 연락처 겸 Gmail 발신/수신 계정 (공개 값, 시크릿 아님) */
  contactEmail: 'juni940302@gmail.com',

  /** Notion 데이터소스 ID (시크릿 아님, API 키만 .env로 관리) */
  notion: {
    blogDataSourceId: '2ec765fe-8b67-80fb-94d5-000b1661d660',
    portfolioDataSourceId: '390765fe-8b67-804b-9445-000b5c5ed7d1',
  },
} as const;
