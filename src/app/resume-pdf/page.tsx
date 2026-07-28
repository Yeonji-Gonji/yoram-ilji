import ResumeDocument from '@/components/resume/ResumeDocument';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 공개 페이지가 아니라 이력서 디자인(ResumeDocument) 미리보기 전용 라우트.
// 프로덕션에서는 404, 개발 환경에서만 렌더한다.
// 다운로드용 public/junhei-kim-resume.pdf 는 빌드 때 scripts/gen-resume-pdf.tsx 가
// 이 컴포넌트를 그대로 렌더해 자동 생성하므로, 수동 인쇄·교체는 더 이상 필요 없다.
// (수동으로 다시 뽑고 싶으면: pnpm gen:resume-pdf)
export const metadata: Metadata = {
  title: '이력서 PDF (내부용)',
  robots: { index: false, follow: false },
};

export default function ResumePdfPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <ResumeDocument />;
}
