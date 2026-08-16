import PortfolioDocument from '@/components/resume/PortfolioDocument';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 공개 페이지가 아니라 포트폴리오 PDF 디자인(PortfolioDocument) 미리보기 전용 라우트.
// 프로덕션에서는 404, 개발 환경에서만 렌더한다.
// 제출용 PDF는 pnpm gen:portfolio-pdf 가 이 컴포넌트를 그대로 렌더해 생성한다.
// 내용 정본은 docs/portfolio/case-*.md, 렌더 소스는 src/data/portfolio-doc.ts.
export const metadata: Metadata = {
  title: '포트폴리오 PDF (내부용)',
  robots: { index: false, follow: false },
};

export default function PortfolioPdfPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <PortfolioDocument />;
}
