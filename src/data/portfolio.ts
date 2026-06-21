// 포트폴리오 카테고리 타입
export type PortfolioCategory = 'development' | 'design';

// 공통 포트폴리오 베이스 타입
interface PortfolioBase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  period: string;
  role: string;
  images: string[];
  color: string;
  thumbnail: string;
  category: PortfolioCategory;
}

// 기술 과제 타입
export interface TechnicalChallenge {
  challenge: string;
  solution: string;
  codeSnippet?: string;
}

// 개발 프로세스 타입 (문제 발견 → 기능 분류 → 기술과제 → 성과)
export interface DevelopmentProcess {
  problemDiscovery: {
    background: string;
    problems: string[];
  };
  requirements: {
    functional: string[];
    nonFunctional: string[];
  };
  technicalChallenges: TechnicalChallenge[];
  achievements: {
    metrics?: string[];
    qualitative?: string[];
    learnings?: string[];
  };
}

// 개발 포트폴리오 타입
export interface DevelopmentPortfolio extends PortfolioBase {
  category: 'development';
  team?: string;
  techStack: string[];
  features: string[];
  process?: DevelopmentProcess;
  links?: {
    github?: string;
    live?: string;
    appStore?: string;
    playStore?: string;
  };
}

// 디자인 포트폴리오 타입
export interface DesignPortfolio extends PortfolioBase {
  category: 'design';
  tools: string[];
  type: string;
}

// 통합 타입
export type PortfolioProject = DevelopmentPortfolio | DesignPortfolio;

// 타입 가드
export function isDevelopmentPortfolio(
  project: PortfolioProject,
): project is DevelopmentPortfolio {
  return project.category === 'development';
}

export function isDesignPortfolio(
  project: PortfolioProject,
): project is DesignPortfolio {
  return project.category === 'design';
}

// ⚠️ 모든 케이스는 src/content/portfolio/*.mdx 로 이관됨 (frontmatter + 자유 본문).
// 카드·목록·홈은 @/lib/portfolio-content 의 getPortfolioCards()를 사용한다.
// 아래 배열은 레거시 폴백용으로 비워 둔다. (신규 케이스는 .mdx 로만 추가)
export const portfolioProjects: PortfolioProject[] = [];

export function getPortfolioById(id: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id);
}

export function getPortfoliosByCategory(
  category: PortfolioCategory,
): PortfolioProject[] {
  return portfolioProjects.filter((project) => project.category === category);
}

// 카테고리 라벨
export const categoryLabels: Record<PortfolioCategory, string> = {
  development: '개발',
  design: '디자인',
};
