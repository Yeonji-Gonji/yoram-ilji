import NotionBlock from '@/components/common/NotionBlock';
import RichText from '@/components/common/RechText';
import { PortfolioNotionMeta } from '@/services/portfolio.notion.api';
import { BlockWithChildren } from '@/services/notion.api';
import {
  getBlockImageProxyUrl,
  isNotionS3Url,
} from '@/utils/notion-image-url';
import { ArrowLeft, ArrowRight, Github, Globe } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  meta: PortfolioNotionMeta;
  blocks: BlockWithChildren[];
  prev: PortfolioNotionMeta | null;
  next: PortfolioNotionMeta | null;
}

/**
 * 연속된 numbered_list_item / bulleted_list_item 을 하나의 <ol>/<ul>로 묶어
 * 번호가 매 항목마다 1로 리셋되지 않도록 렌더한다. 그 외 블록은 NotionBlock에 위임.
 */
function renderBlocks(blocks: BlockWithChildren[], pageId: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  for (let i = 0; i < blocks.length; ) {
    const type = blocks[i].type;
    // 이미지: aspect-video 강제 대신 자연 비율로 (세로 이미지·GIF 대응)
    if (type === 'image') {
      const img = (blocks[i] as any).image;
      const orig = img.type === 'file' ? img.file.url : img.external.url;
      const src = isNotionS3Url(orig)
        ? getBlockImageProxyUrl(pageId, blocks[i].id)
        : orig;
      const cap = img.caption?.[0]?.plain_text ?? '';
      nodes.push(
        <figure key={blocks[i].id} className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={cap || 'portfolio image'}
            loading="lazy"
            className="mx-auto w-full rounded-lg"
          />
          {cap && (
            <figcaption className="mt-2 text-center text-sm text-dark-400">
              {cap}
            </figcaption>
          )}
        </figure>,
      );
      i++;
      continue;
    }
    if (type === 'numbered_list_item' || type === 'bulleted_list_item') {
      const run: BlockWithChildren[] = [];
      while (i < blocks.length && blocks[i].type === type) {
        run.push(blocks[i]);
        i++;
      }
      const ordered = type === 'numbered_list_item';
      const ListTag = (ordered ? 'ol' : 'ul') as 'ol' | 'ul';
      nodes.push(
        <ListTag
          key={run[0].id}
          className={`my-4 space-y-1.5 pl-6 ${ordered ? 'list-decimal' : 'list-disc'}`}>
          {run.map((item) => {
            const rt = (item as any)[type].rich_text;
            return (
              <li key={item.id} className="leading-relaxed marker:text-point">
                <RichText richTexts={rt} />
                {item.children && item.children.length > 0 && (
                  <div className="mt-1">
                    {item.children.map((c) => (
                      <NotionBlock key={c.id} block={c} pageId={pageId} />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ListTag>,
      );
      continue;
    }
    nodes.push(
      <NotionBlock key={blocks[i].id} block={blocks[i]} pageId={pageId} />,
    );
    i++;
  }
  return nodes;
}

export default function PortfolioNotionDetail({
  meta,
  blocks,
  prev,
  next,
}: Props) {
  return (
    <div className="w-full dark:bg-dark-800">
      {meta.coverImage && (
        <div className="relative h-[38vh] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="h-full w-full object-cover"
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

          <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-5 font-mono text-xs text-dark-400">
            {meta.period && <span>{meta.period}</span>}
            {meta.role && <span>{meta.role}</span>}
            {meta.team && <span>{meta.team}</span>}
          </dl>

          {meta.skills.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-5">
              {meta.skills.map((s) => (
                <li
                  key={s}
                  className="px-2.5 py-1 text-xs rounded-full bg-light-200 text-dark-500 dark:bg-dark-700 dark:text-dark-300">
                  {s}
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
            {meta.metrics.map((m) => (
              <div
                key={m}
                className="border-l-2 border-point pl-3 text-sm text-dark-600 dark:text-dark-300">
                {m}
              </div>
            ))}
          </div>
        )}

        {/* 본문 (Notion 블록) */}
        <article className="text-dark-900 dark:text-light-300">
          {renderBlocks(blocks, meta.pageId)}
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
