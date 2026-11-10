import PortfolioRichText from '@/components/portfolio/PortfolioRichText';
import type { PortfolioBlock } from '@/types/portfolio.type';
import Image from 'next/image';

/** 포트폴리오 본문 블록 렌더러. 블록 종류는 `PortfolioBlock` 여섯 가지가 전부입니다. */
export default function PortfolioBlocks({
  blocks,
}: {
  blocks: PortfolioBlock[];
}) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return block.level === 2 ? (
              <h2 key={index} className="mt-10 mb-4 text-2xl font-medium">
                <PortfolioRichText spans={block.text} />
              </h2>
            ) : (
              <h3 key={index} className="mt-8 mb-3 text-xl font-medium">
                <PortfolioRichText spans={block.text} />
              </h3>
            );

          case 'paragraph':
            return (
              <p key={index} className="mb-4 leading-relaxed">
                <PortfolioRichText spans={block.text} />
              </p>
            );

          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                className={`my-4 space-y-1.5 pl-6 ${
                  block.ordered ? 'list-decimal' : 'list-disc'
                }`}>
                {block.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="leading-relaxed marker:text-point">
                    <PortfolioRichText spans={item.text} />
                  </li>
                ))}
              </ListTag>
            );
          }

          case 'callout':
            return (
              <aside
                key={index}
                className="my-6 flex gap-3 rounded-lg bg-light-200 p-4 leading-relaxed dark:bg-dark-700">
                {block.icon && (
                  <span aria-hidden className="text-xl leading-none">
                    {block.icon}
                  </span>
                )}
                <div>
                  <PortfolioRichText spans={block.text} />
                </div>
              </aside>
            );

          case 'table':
            return (
              <div key={index} className="my-6 overflow-x-auto">
                <table className="w-full border-collapse border border-light-400 dark:border-dark-600">
                  <tbody>
                    {block.rows.map((row, rowIndex) => {
                      const isHeaderRow =
                        block.hasColumnHeader && rowIndex === 0;
                      return (
                        <tr
                          key={rowIndex}
                          className={
                            isHeaderRow ? 'bg-light-200 dark:bg-dark-700' : ''
                          }>
                          {row.map((cell, cellIndex) => {
                            const isHeaderCell =
                              isHeaderRow ||
                              (block.hasRowHeader && cellIndex === 0);
                            const CellTag = isHeaderCell ? 'th' : 'td';
                            return (
                              <CellTag
                                key={cellIndex}
                                className={`border border-light-400 px-4 py-2 text-left align-top dark:border-dark-600 ${
                                  isHeaderCell ? 'font-semibold' : ''
                                }`}>
                                <PortfolioRichText spans={cell} />
                              </CellTag>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );

          case 'image':
            return (
              <figure key={index} className="my-6">
                <Image
                  src={block.src}
                  alt={block.caption || ''}
                  width={block.width}
                  height={block.height}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="mx-auto h-auto w-full rounded-lg"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-dark-400">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </>
  );
}
