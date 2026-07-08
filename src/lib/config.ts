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

  /**
   * GA4 / GTM 식별자 (시크릿 아님, 서비스 계정 private_key만 .env로 관리).
   * - gtmId          : 브라우저에 노출되는 GTM 컨테이너 ID
   * - ga4MeasurementId: GA4 측정 ID (G-xxx)
   * - ga4PropertyId  : GA4 숫자 속성 ID (Data API 조회용)
   * - gaClientEmail  : 서비스 계정 이메일 (식별자일 뿐, 단독으로는 권한 없음)
   */
  analytics: {
    gtmId: 'GTM-5FGH28HC',
    ga4MeasurementId: 'G-1NRC5X4X0M',
    ga4PropertyId: '544610937',
    gaClientEmail: 'claudedev@yoramilji-d3183.iam.gserviceaccount.com',
  },
} as const;
