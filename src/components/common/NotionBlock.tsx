// components/NotionBlock.tsx

'use client';
import { BlockWithChildren } from '@/services/notion.api';
import { getBlockImageProxyUrl, isNotionS3Url } from '@/utils/notion-image-url';
import { Accordion, AccordionItem, Alert, Checkbox } from '@heroui/react';
import Image from 'next/image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import RichText from './RechText';

interface NotionBlockProps {
  block: BlockWithChildren;
  pageId?: string;
  depth?: number;
}

// 자식 블록들을 렌더링하는 헬퍼 컴포넌트
function RenderChildren({
  children,
  pageId,
  depth = 0,
}: {
  children?: BlockWithChildren[];
  pageId?: string;
  depth?: number;
}) {
  if (!children || children.length === 0) return null;

  return (
    <div
      className={`ml-4 ${depth > 0 ? 'border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      {children.map((child) => (
        <NotionBlock
          key={child.id}
          block={child}
          pageId={pageId}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function NotionBlock({
  block,
  pageId,
  depth = 0,
}: NotionBlockProps) {
  if (!('type' in block)) {
    return (
      <pre className="p-2 rounded text-sm">
        {JSON.stringify(block, null, 2)}
      </pre>
    );
  }

  switch (block.type) {
    case 'heading_1':
      return (
        <h1 className="text-3xl font-medium mt-8 mb-4">
          <RichText richTexts={block.heading_1.rich_text} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2 className="text-2xl font-medium mt-8 mb-4">
          <RichText richTexts={block.heading_2.rich_text} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3 className="text-xl font-medium mt-6 mb-3">
          <RichText richTexts={block.heading_3.rich_text} />
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <div className="mb-1">
          <li className="list-disc list-inside">
            <RichText richTexts={block.bulleted_list_item.rich_text} />
          </li>
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );
    case 'numbered_list_item':
      return (
        <div className="mb-1">
          <li className="list-decimal list-inside">
            <RichText richTexts={block.numbered_list_item.rich_text} />
          </li>
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );
    case 'to_do':
      return (
        <div className="my-2">
          <div className="flex items-center">
            <Checkbox checked={block.to_do.checked} readOnly />
            <span
              className={
                block.to_do.checked ? 'line-through text-dark-500' : ''
              }>
              <RichText richTexts={block.to_do.rich_text} />
            </span>
          </div>
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );
    case 'divider':
      return <hr className="my-6 border-gray-300" />;

    case 'paragraph':
      return (
        <div className="mb-4">
          <p className="leading-relaxed">
            <RichText richTexts={block.paragraph.rich_text} />
          </p>
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );

    case 'toggle':
      return (
        <Accordion className="mb-4 border rounded">
          <AccordionItem
            title={<RichText richTexts={block.toggle.rich_text} />}>
            <RenderChildren
              children={block.children}
              pageId={pageId}
              depth={depth}
            />
          </AccordionItem>
        </Accordion>
      );

    case 'callout':
      return (
        <Alert
          className="my-4"
          hideIconWrapper
          classNames={{ alertIcon: 'text-xl' }}
          icon={
            block.callout.icon?.type === 'emoji' ? (
              <span>{block.callout.icon.emoji}</span>
            ) : null
          }>
          <RichText richTexts={block.callout.rich_text} />
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </Alert>
      );

    case 'quote':
      return (
        <blockquote className="my-4 py-1 pl-4 border-l-4 border-black leading-loose dark:border-white whitespace-pre-wrap">
          <RichText richTexts={block.quote.rich_text} />
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </blockquote>
      );

    case 'image':
      const originalSrc =
        block.image.type === 'file'
          ? block.image.file.url
          : block.image.external.url;
      const caption = block.image.caption;

      // S3 임시 URL인 경우 프록시 사용
      const imageSrc =
        pageId && isNotionS3Url(originalSrc)
          ? getBlockImageProxyUrl(pageId, block.id)
          : originalSrc;

      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video">
            <Image
              src={imageSrc}
              alt={caption.length > 0 ? caption[0].plain_text : 'Notion Image'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              unoptimized
            />
          </div>
          {caption.length > 0 && (
            <figcaption className="text-center text-sm text-dark-300 mt-2">
              <RichText richTexts={caption} />
            </figcaption>
          )}
        </figure>
      );

    case 'code':
      return (
        <pre className="bg-[#282c34] text-white p-4 rounded-md overflow-x-auto my-4 text-sm">
          <SyntaxHighlighter language={block.code.language} style={atomOneDark}>
            {block.code.rich_text[0]?.plain_text}
          </SyntaxHighlighter>
        </pre>
      );

    // 테이블 블록
    case 'table':
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <tbody>
              {block.children?.map((row, rowIndex) => {
                if (row.type !== 'table_row') return null;
                const isHeader =
                  block.table.has_column_header && rowIndex === 0;
                const cells = row.table_row.cells;

                return (
                  <tr
                    key={row.id}
                    className={isHeader ? 'bg-gray-100 dark:bg-gray-800' : ''}>
                    {cells.map((cell, cellIndex) => {
                      const isRowHeader =
                        block.table.has_row_header && cellIndex === 0;
                      const CellTag = isHeader || isRowHeader ? 'th' : 'td';

                      return (
                        <CellTag
                          key={cellIndex}
                          className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-left ${
                            isHeader || isRowHeader
                              ? 'font-semibold bg-gray-100 dark:bg-gray-800'
                              : ''
                          }`}>
                          <RichText richTexts={cell} />
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

    // 테이블 행 (단독으로 렌더링되는 경우)
    case 'table_row':
      return null; // 테이블 내에서 처리됨

    // 북마크 블록
    case 'bookmark':
      return (
        <a
          href={block.bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="text-blue-600 dark:text-blue-400 underline break-all">
            {block.bookmark.url}
          </div>
          {block.bookmark.caption && block.bookmark.caption.length > 0 && (
            <div className="text-sm text-gray-500 mt-2">
              <RichText richTexts={block.bookmark.caption} />
            </div>
          )}
        </a>
      );

    // 임베드 블록
    case 'embed':
      return (
        <div className="my-6">
          <iframe
            src={block.embed.url}
            className="w-full h-96 border-0 rounded-lg"
            allowFullScreen
          />
          {block.embed.caption && block.embed.caption.length > 0 && (
            <figcaption className="text-center text-sm text-dark-300 mt-2">
              <RichText richTexts={block.embed.caption} />
            </figcaption>
          )}
        </div>
      );

    // 비디오 블록
    case 'video':
      const videoUrl =
        block.video.type === 'file'
          ? block.video.file.url
          : block.video.external.url;

      // YouTube 임베드 처리
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.includes('youtu.be')
          ? videoUrl.split('/').pop()?.split('?')[0]
          : new URLSearchParams(new URL(videoUrl).search).get('v');

        return (
          <div className="my-6">
            <div className="relative w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute inset-0 w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
            {block.video.caption && block.video.caption.length > 0 && (
              <figcaption className="text-center text-sm text-dark-300 mt-2">
                <RichText richTexts={block.video.caption} />
              </figcaption>
            )}
          </div>
        );
      }

      return (
        <div className="my-6">
          <video controls className="w-full rounded-lg">
            <source src={videoUrl} />
          </video>
          {block.video.caption && block.video.caption.length > 0 && (
            <figcaption className="text-center text-sm text-dark-300 mt-2">
              <RichText richTexts={block.video.caption} />
            </figcaption>
          )}
        </div>
      );

    // 파일 블록
    case 'file':
      const fileUrl =
        block.file.type === 'file'
          ? block.file.file.url
          : block.file.external.url;
      const fileName = block.file.name || fileUrl.split('/').pop() || '파일';

      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 my-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span className="text-2xl">📎</span>
          <span className="text-blue-600 dark:text-blue-400 underline">
            {fileName}
          </span>
        </a>
      );

    // PDF 블록
    case 'pdf':
      const pdfUrl =
        block.pdf.type === 'file' ? block.pdf.file.url : block.pdf.external.url;

      return (
        <div className="my-6">
          <iframe
            src={pdfUrl}
            className="w-full h-[600px] border border-gray-300 dark:border-gray-600 rounded-lg"
          />
          {block.pdf.caption && block.pdf.caption.length > 0 && (
            <figcaption className="text-center text-sm text-dark-300 mt-2">
              <RichText richTexts={block.pdf.caption} />
            </figcaption>
          )}
        </div>
      );

    // 수식 블록
    case 'equation':
      return (
        <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center font-mono">
          {block.equation.expression}
        </div>
      );

    // 링크 프리뷰 블록
    case 'link_preview':
      return (
        <a
          href={block.link_preview.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="text-blue-600 dark:text-blue-400 underline break-all">
            {block.link_preview.url}
          </div>
        </a>
      );

    // 컬럼 리스트 블록
    case 'column_list':
      return (
        <div className="flex flex-col md:flex-row gap-4 my-4">
          {block.children?.map((column) => (
            <div key={column.id} className="flex-1">
              <RenderChildren
                children={column.children}
                pageId={pageId}
                depth={depth}
              />
            </div>
          ))}
        </div>
      );

    // 컬럼 블록 (단독으로 렌더링되는 경우)
    case 'column':
      return (
        <div className="flex-1">
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );

    // 싱크된 블록 (원본)
    case 'synced_block':
      return (
        <div className="my-4">
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );

    // 템플릿 블록
    case 'template':
      return (
        <div className="my-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <RichText richTexts={block.template.rich_text} />
          <RenderChildren
            children={block.children}
            pageId={pageId}
            depth={depth}
          />
        </div>
      );

    // 링크된 데이터베이스 또는 자식 데이터베이스
    case 'child_database':
      return (
        <div className="my-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-500">
            📊 데이터베이스: {block.child_database.title}
          </span>
        </div>
      );

    // 자식 페이지
    case 'child_page':
      return (
        <div className="my-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-500">
            📄 페이지: {block.child_page.title}
          </span>
        </div>
      );

    // 목차 블록
    case 'table_of_contents':
      return (
        <div className="my-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-500">📑 목차</span>
        </div>
      );

    // 브레드크럼 블록
    case 'breadcrumb':
      return (
        <div className="my-4 text-sm text-gray-500">
          <span>🏠 현재 위치</span>
        </div>
      );

    // 오디오 블록
    case 'audio':
      const audioUrl =
        block.audio.type === 'file'
          ? block.audio.file.url
          : block.audio.external.url;

      return (
        <div className="my-4">
          <audio controls className="w-full">
            <source src={audioUrl} />
          </audio>
          {block.audio.caption && block.audio.caption.length > 0 && (
            <figcaption className="text-center text-sm text-dark-300 mt-2">
              <RichText richTexts={block.audio.caption} />
            </figcaption>
          )}
        </div>
      );

    // 지원되지 않는 블록 타입
    case 'unsupported':
      return (
        <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300">
          ⚠️ 이 블록 타입은 지원되지 않습니다.
        </div>
      );

    default:
      return (
        <pre className="p-2 rounded text-sm bg-gray-100 dark:bg-gray-800 overflow-x-auto">
          {JSON.stringify(block, null, 2)}
        </pre>
      );
  }
}
