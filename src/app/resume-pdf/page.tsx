import ResumeDocument from '@/components/resume/ResumeDocument';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 공개 페이지가 아니라 "PDF 생성 전용" 라우트.
// 프로덕션에서는 404, 개발 환경에서만 렌더한다.
// 이력서 내용(resume.ts) 수정 후 이 페이지를 열어 인쇄→PDF로 저장하고
// public/junhei-kim-resume.pdf 를 교체한다.
export const metadata: Metadata = {
  title: '이력서 PDF (내부용)',
  robots: { index: false, follow: false },
};

export default function ResumePdfPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <ResumeDocument />;
}
