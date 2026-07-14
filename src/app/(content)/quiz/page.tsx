import type { Metadata } from 'next';
import { QuizDashboard } from '@/components/quiz/QuizDashboard';

// 개인 학습용 페이지: 검색엔진 노출 제외
export const metadata: Metadata = {
  title: '정보처리기사 실기 CBT',
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  return (
    <main className="max-w-3xl px-5 mx-auto">
      <QuizDashboard />
    </main>
  );
}
