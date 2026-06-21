import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Callout from './Callout';
import Figure from './Figure';
import MetricGrid from './MetricGrid';
import { ProcessStep, ProcessSteps } from './ProcessSteps';

/**
 * MDX 본문 렌더링용 컴포넌트 매핑.
 * - 기본 마크다운 요소(h2/p/ul/code…)는 디자인 토큰으로 스타일링
 * - 커스텀 컴포넌트(Callout/Figure/MetricGrid/ProcessSteps)는 본문에서 직접 호출
 */
export const portfolioMdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 mb-4 scroll-mt-24 text-2xl font-semibold md:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-10 mb-3 text-xl font-semibold" {...props} />
  ),
  p: (props) => (
    <p
      className="my-4 leading-relaxed text-dark-600 dark:text-dark-300"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="my-4 space-y-2" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-2 pl-5" {...props} />
  ),
  li: (props) => (
    <li
      className="relative pl-5 leading-relaxed text-dark-600 marker:text-point dark:text-dark-300 before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-point [&>ul>li]:before:bg-point/40"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="font-medium text-point underline-offset-4 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-dark-800 dark:text-light-100" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-point pl-4 italic text-dark-500 dark:text-dark-400"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-md bg-light-300 px-1.5 py-0.5 font-mono text-[0.9em] text-point-dark dark:bg-dark-800 dark:text-point-light"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-2xl bg-dark-900 p-5 text-sm text-light-200 dark:bg-dark-950 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-light-200"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-light-400 dark:border-dark-700" />,
  img: (props) => (
    <Image
      src={(props.src as string) ?? ''}
      alt={props.alt ?? ''}
      width={1600}
      height={1000}
      className="my-8 h-auto w-full rounded-2xl"
      sizes="(max-width: 768px) 100vw, 800px"
    />
  ),
  // 커스텀 블록
  Callout,
  Figure,
  MetricGrid,
  ProcessSteps,
  ProcessStep,
};
