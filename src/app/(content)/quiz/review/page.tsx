import type { Metadata } from 'next';
import Link from 'next/link';
import { ReviewClient } from '@/components/quiz/ReviewClient';

export const metadata: Metadata = {
  title: '오답노트 | 정보처리기사 실기 CBT',
  robots: { index: false, follow: false },
};

export default function QuizReviewPage() {
  return (
    <main className="max-w-3xl px-5 mx-auto">
      <div className="mb-6">
        <Link href="/quiz" className="text-sm text-point hover:underline">
          ← CBT 홈
        </Link>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">오답노트</h1>
      </div>
      <ReviewClient />
    </main>
  );
}
