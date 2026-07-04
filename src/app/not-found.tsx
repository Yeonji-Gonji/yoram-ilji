import { generateSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = generateSeoMetadata({
  title: '페이지를 찾을 수 없습니다',
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-5 text-center">
      <p className="text-8xl font-bold text-point sm:text-9xl">404</p>
      <h1 className="mt-6 text-2xl font-medium text-dark-900 dark:text-light-100 sm:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-dark-400 dark:text-dark-300">
        주소가 잘못되었거나, 삭제되었거나, 이동한 페이지일 수 있어요.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-point px-6 py-2.5 text-sm font-medium text-light-50 transition-colors hover:bg-point-dark">
          홈으로
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-light-400 px-6 py-2.5 text-sm font-medium text-dark-900 transition-colors hover:border-point hover:text-point dark:border-dark-600 dark:text-light-100 dark:hover:border-point dark:hover:text-point">
          블로그
        </Link>
        <Link
          href="/portfolio"
          className="rounded-full border border-light-400 px-6 py-2.5 text-sm font-medium text-dark-900 transition-colors hover:border-point hover:text-point dark:border-dark-600 dark:text-light-100 dark:hover:border-point dark:hover:text-point">
          포트폴리오
        </Link>
      </div>
    </div>
  );
}
