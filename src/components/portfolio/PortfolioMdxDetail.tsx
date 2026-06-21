import {
  PortfolioContent,
  PortfolioFrontmatter,
} from '@/lib/portfolio-content';
import { compileMDX } from 'next-mdx-remote/rsc';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import rehypeSlug from 'rehype-slug';
import Gallery from './Gallery';
import VisualStory from './VisualStory';
import { portfolioMdxComponents } from './mdx/mdx-components';

interface Props {
  content: PortfolioContent;
  prev: PortfolioFrontmatter | null;
  next: PortfolioFrontmatter | null;
}

export default async function PortfolioMdxDetail({
  content,
  prev,
  next,
}: Props) {
  const { meta, body } = content;
  const skills = meta.techStack ?? meta.tools ?? [];

  const { content: mdxBody } = await compileMDX({
    source: body,
    components: portfolioMdxComponents,
    options: {
      mdxOptions: { rehypePlugins: [rehypeSlug] },
    },
  });

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div className="absolute inset-0">
          {meta.thumbnail ? (
            <>
              <Image
                src={meta.thumbnail}
                alt={meta.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-light-50 via-light-50/80 to-light-50/40 dark:from-dark-900 dark:via-dark-900/80 dark:to-dark-900/40" />
            </>
          ) : (
            // 스크린샷이 없는 케이스(회사 작업 등) — 브랜드 컬러 그라데이션 폴백
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(135deg, ${meta.color}55 0%, ${meta.color}14 60%, transparent 100%)`,
              }}
            />
          )}
        </div>

        <div className="relative flex h-full flex-col justify-end px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="mb-2 text-4xl font-medium md:text-5xl">
              {meta.title}
            </h1>
            <p className="text-xl text-dark-500 dark:text-dark-400">
              {meta.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <Meta label="기간" value={meta.period} />
              <Meta label="역할" value={meta.role} />
              {meta.team && <Meta label="팀 구성" value={meta.team} />}
              {meta.type && <Meta label="유형" value={meta.type} />}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2단: 자유 본문 + sticky 메타 사이드바 ── */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_280px]">
          {/* 본문(MDX) */}
          <article className="min-w-0 max-w-3xl">
            <p className="text-lg leading-relaxed text-dark-600 dark:text-dark-300">
              {meta.description}
            </p>
            <div className="mt-8">{mdxBody}</div>
          </article>

          {/* 사이드바 */}
          <aside className="md:sticky md:top-24 md:self-start">
            <div className="space-y-8 rounded-2xl bg-light-200 p-6 dark:bg-dark-800">
              {meta.metrics && meta.metrics.length > 0 && (
                <div>
                  <SidebarLabel>핵심 지표</SidebarLabel>
                  <ul className="mt-3 space-y-2">
                    {meta.metrics.map((m, i) => (
                      <li
                        key={i}
                        className="text-sm leading-snug text-dark-600 dark:text-dark-300">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <SidebarLabel>
                    {meta.category === 'design' ? 'Tools' : 'Tech Stack'}
                  </SidebarLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-light-300 px-3 py-1 text-xs font-medium text-dark-700 dark:bg-dark-700 dark:text-dark-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {meta.links &&
                (meta.links.github || meta.links.live) && (
                  <div>
                    <SidebarLabel>Links</SidebarLabel>
                    <div className="mt-3 flex flex-col gap-2">
                      {meta.links.github && (
                        <a
                          href={meta.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-dark-800 px-4 py-2 text-sm text-white transition-colors hover:bg-dark-700 dark:bg-dark-700 dark:hover:bg-dark-600">
                          <Github className="h-4 w-4" /> GitHub
                        </a>
                      )}
                      {meta.links.live && (
                        <a
                          href={meta.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-point px-4 py-2 text-sm text-white transition-colors hover:bg-point-dark">
                          <ExternalLink className="h-4 w-4" /> 라이브 데모
                        </a>
                      )}
                    </div>
                  </div>
                )}
          </div>
          </aside>
        </div>
      </section>

      {/* ── 비주얼 ── 디자인은 큰 세로 스토리, 개발은 스크린샷 그리드 ── */}
      {meta.images && meta.images.length > 0 && (
        meta.category === 'design' ? (
          <VisualStory title={meta.title} images={meta.images} />
        ) : (
          meta.images.length > 1 && (
            <Gallery title={meta.title} images={meta.images} />
          )
        )
      )}

      {/* ── 이전/다음 케이스 ── */}
      {(prev || next) && (
        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
            {prev ? (
              <CaseNav meta={prev} direction="prev" />
            ) : (
              <div className="hidden sm:block" />
            )}
            {next && <CaseNav meta={next} direction="next" />}
          </div>
        </section>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-dark-500 dark:text-dark-400">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-dark-500 dark:text-dark-400">
      {children}
    </p>
  );
}

function CaseNav({
  meta,
  direction,
}: {
  meta: PortfolioFrontmatter;
  direction: 'prev' | 'next';
}) {
  return (
    <Link
      href={`/portfolio/${meta.id}`}
      className={`group rounded-2xl border border-light-400 p-5 transition-colors hover:border-point dark:border-dark-700 ${
        direction === 'next' ? 'text-right' : ''
      }`}>
      <span className="text-xs uppercase tracking-wider text-dark-400">
        {direction === 'prev' ? '이전 작업' : '다음 작업'}
      </span>
      <p className="mt-1 font-medium transition-colors group-hover:text-point">
        {meta.title}
      </p>
      <p className="text-sm text-dark-500 dark:text-dark-400">
        {meta.subtitle}
      </p>
    </Link>
  );
}
