import type { PortfolioRichText as RichTextSpan } from '@/types/portfolio.type';
import React from 'react';

/** 포트폴리오 정본의 글자 조각을 서식과 함께 그립니다. */
export default function PortfolioRichText({
  spans,
}: {
  spans: RichTextSpan[];
}) {
  return (
    <>
      {spans.map((span, index) => {
        let content: React.ReactNode = span.text;

        if (span.bold) content = <strong className="text-point">{content}</strong>;
        if (span.italic) content = <em>{content}</em>;
        if (span.strikethrough) content = <s>{content}</s>;
        if (span.underline) content = <u>{content}</u>;
        if (span.code) {
          content = (
            <code className="rounded bg-light-300 px-1 py-0.5 font-mono text-sm dark:bg-dark-700">
              {content}
            </code>
          );
        }
        if (span.href) {
          content = (
            <a
              href={span.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-point hover:underline">
              {content}
            </a>
          );
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </>
  );
}
