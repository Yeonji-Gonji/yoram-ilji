import type { Metadata } from 'next';
import Link from 'next/link';
import { PracticeRunner } from '@/components/quiz/PracticeRunner';

export const metadata: Metadata = {
  title: '유형별 연습 | 정보처리기사 실기 CBT',
  robots: { index: false, follow: false },
};

export default async function QuizPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <main className="max-w-3xl px-5 mx-auto">
      <div className="mb-6">
        <Link href="/quiz" className="text-sm text-point hover:underline">
          ← CBT 홈
        </Link>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">유형별 연습</h1>
      </div>
      <PracticeRunner initialCategory={category} />
    </main>
  );
}
