import type { Metadata } from 'next';
import Link from 'next/link';
import { ExamRunner } from '@/components/quiz/ExamRunner';

export const metadata: Metadata = {
  title: '모의고사 | 정보처리기사 실기 CBT',
  robots: { index: false, follow: false },
};

export default function QuizExamPage() {
  return (
    <main className="max-w-3xl px-5 mx-auto">
      <div className="mb-6">
        <Link href="/quiz" className="text-sm text-point hover:underline">
          ← CBT 홈
        </Link>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">모의고사</h1>
      </div>
      <ExamRunner />
    </main>
  );
}
