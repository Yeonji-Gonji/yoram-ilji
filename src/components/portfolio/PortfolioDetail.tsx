import ViewCount from '@/components/common/ViewCount';
import PortfolioBlocks from '@/components/portfolio/PortfolioBlocks';
import type { PortfolioBlock, PortfolioMeta } from '@/types/portfolio.type';
import { ArrowLeft, ArrowRight, Github, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  meta: PortfolioMeta;
  blocks: PortfolioBlock[];
  prev: PortfolioMeta | null;
  next: PortfolioMeta | null;
  /** 이 프로젝트의 누적 조회수 (GA4). 미설정·실패 시 null. */
  views?: number | null;
}

export default function PortfolioDetail({
  meta,
  blocks,
  prev,
  next,
  views,
}: Props) {
  return (
    <div className="w-full dark:bg-dark-800">
      {meta.coverImage && (
        <div className="relative h-[38vh] w-full overflow-hidden">
          <Image
            src={meta.coverImage}
            alt={meta.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="max-w-4xl px-4 py-20 mx-auto">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 mb-8 text-sm text-dark-400 transition-colors hover:text-point">
          <ArrowLeft className="size-4" /> 포트폴리오
        </Link>

        {/* 헤더 */}
        <header className="pb-8 mb-10 border-b border-light-300 dark:border-dark-700">
          <span className="inline-block px-2 py-1 mb-3 text-xs font-medium border rounded-full border-point text-point">
            {meta.category === 'development' ? '개발' : '디자인'}
          </span>
          <h1 className="mb-3 text-3xl font-semibold md:text-4xl">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="text-lg text-dark-500 dark:text-dark-300">
              {meta.subtitle}
            </p>
          )}

          <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-5 font-mono text-xs text-dark-400">
            {meta.period && <span>{meta.period}</span>}
            {meta.role && <span>{meta.role}</span>}
            {meta.team && <span>{meta.team}</span>}
            <ViewCount count={views} />
          </dl>

          {meta.skills.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-5">
              {meta.skills.map((skill) => (
                <li
                  key={skill}
                  className="px-2.5 py-1 text-xs rounded-full bg-light-200 text-dark-500 dark:bg-dark-700 dark:text-dark-300">
                  {skill}
                </li>
              ))}
            </ul>
          )}

          {(meta.github || meta.live) && (
            <div className="flex gap-3 mt-5">
              {meta.live && (
                <a
                  href={meta.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-point px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-point-dark">
                  <Globe className="size-4" /> Live
                </a>
              )}
              {meta.github && (
                <a
                  href={meta.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-light-500 px-3 py-1.5 text-sm font-medium transition-colors hover:text-point dark:border-dark-600">
                  <Github className="size-4" /> GitHub
                </a>
              )}
            </div>
          )}
        </header>

        {/* 핵심 지표 */}
        {meta.metrics.length > 0 && (
          <div className="grid gap-3 mb-10 sm:grid-cols-2 lg:grid-cols-3">
            {meta.metrics.map((metric) => (
              <div
                key={metric}
                className="border-l-2 border-point pl-3 text-sm text-dark-600 dark:text-dark-300">
                {metric}
              </div>
            ))}
          </div>
        )}

        {/* 본문 */}
        <article className="text-dark-900 dark:text-light-300">
          <PortfolioBlocks blocks={blocks} />
        </article>

        {/* 이전 / 다음 */}
        {(prev || next) && (
          <nav className="grid grid-cols-2 gap-4 pt-8 mt-16 border-t border-light-300 dark:border-dark-700">
            <div>
              {prev && (
                <Link
                  href={`/portfolio/${prev.id}`}
                  className="group flex flex-col gap-1 text-sm">
                  <span className="inline-flex items-center gap-1 text-dark-400">
                    <ArrowLeft className="size-3" /> 이전
                  </span>
                  <span className="font-medium transition-colors group-hover:text-point">
                    {prev.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link
                  href={`/portfolio/${next.id}`}
                  className="group flex flex-col items-end gap-1 text-sm">
                  <span className="inline-flex items-center gap-1 text-dark-400">
                    다음 <ArrowRight className="size-3" />
                  </span>
                  <span className="font-medium transition-colors group-hover:text-point">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
