import { PortfolioCategory } from '@/data/portfolio';

// 포트폴리오 콘텐츠 정본은 Notion (@/services/portfolio.notion.api).
// 이 파일은 목록·홈·상세가 공유하는 카드 타입만 제공한다.

// 목록/홈 카드용 정규화 모델 (개발/디자인 공통)
export interface PortfolioCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  period: string;
  thumbnail: string; // 상대경로, 없으면 '' → 그라데이션 폴백
  color: string;
  skills: string[]; // techStack 또는 tools
  type?: string; // 디자인 유형 배지
  role?: string; // 카드 푸터 역할
  metrics?: string[]; // 스크린샷 없는 개발 카드의 핵심 지표
  featured?: boolean;
}
