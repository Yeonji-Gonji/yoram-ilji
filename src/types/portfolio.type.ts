/**
 * 포트폴리오 정본 데이터 타입.
 *
 * 포트폴리오 콘텐츠의 정본은 `src/content/portfolio/*.ts` 이고 Notion 을 거치지 않습니다.
 * 블록 모델은 실제로 쓰는 여섯 가지(제목·문단·목록·콜아웃·표·이미지)만 둡니다.
 * 블로그는 Notion CMS 를 그대로 쓰므로 이 타입과 무관합니다.
 */

export type PortfolioCategory = 'development' | 'design';

/** 서식이 붙은 글자 조각. 서식이 없으면 text 만 있습니다. */
export interface PortfolioRichText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  href?: string;
}

export interface PortfolioListItem {
  text: PortfolioRichText[];
}

export type PortfolioBlock =
  | { type: 'heading'; level: 2 | 3; text: PortfolioRichText[] }
  | { type: 'paragraph'; text: PortfolioRichText[] }
  | { type: 'list'; ordered: boolean; items: PortfolioListItem[] }
  | { type: 'callout'; icon?: string; text: PortfolioRichText[] }
  | {
      type: 'table';
      hasColumnHeader: boolean;
      hasRowHeader: boolean;
      /** 행 → 셀 → 글자 조각 */
      rows: PortfolioRichText[][][];
    }
  | {
      type: 'image';
      /** public/ 기준 정적 경로 */
      src: string;
      width: number;
      height: number;
      caption?: string;
    };

/** 목록·상세가 공유하는 메타. 본문 블록은 포함하지 않습니다. */
export interface PortfolioMeta {
  /** slug (URL 경로) */
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  period: string;
  role: string;
  team?: string;
  /** 기술스택 또는 디자인 도구 */
  skills: string[];
  /** 디자인 유형 배지 */
  type?: string;
  metrics: string[];
  /** 카드 썸네일 겸 상세 커버 (public/ 기준 정적 경로) */
  thumbnail: string;
  coverImage: string;
  coverWidth: number;
  coverHeight: number;
  color: string;
  featured: boolean;
  github?: string;
  live?: string;
}

/** 메타 + 본문. `src/content/portfolio/*.ts` 한 파일이 이 형태 하나를 내보냅니다. */
export interface PortfolioItem extends PortfolioMeta {
  blocks: PortfolioBlock[];
}

/** 목록·홈 카드용 축약 모델 (개발·디자인 공통). */
export interface PortfolioCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  period: string;
  /** 정적 경로, 없으면 '' → 그라데이션 폴백 */
  thumbnail: string;
  color: string;
  skills: string[];
  type?: string;
  role?: string;
  /** 스크린샷이 없는 개발 카드의 핵심 지표 */
  metrics?: string[];
  featured?: boolean;
}
