import { Fragment } from 'react';

interface PassageTextProps {
  text: string;
}

/** markdown 표 여부 판단용 */
const isTableLine = (line: string) => line.trimStart().startsWith('|');
const isSeparatorRow = (line: string) =>
  /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line);

function splitCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

/**
 * 문제 지문 렌더러: 데이터 JSON의 passage(평문 + markdown 표 혼합)를
 * 표는 <table>로, 나머지는 개행 보존 문단으로 표시한다.
 */
export function PassageText({ text }: PassageTextProps) {
  const lines = text.split('\n');
  const blocks: { type: 'text' | 'table'; lines: string[] }[] = [];

  for (const line of lines) {
    const type = isTableLine(line) ? 'table' : 'text';
    const last = blocks[blocks.length - 1];
    if (last && last.type === type) {
      last.lines.push(line);
    } else {
      blocks.push({ type, lines: [line] });
    }
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, blockIdx) => {
        if (block.type === 'table') {
          const rows = block.lines.filter((line) => !isSeparatorRow(line));
          if (rows.length === 0) return null;
          const [head, ...body] = rows.map(splitCells);
          return (
            <div key={blockIdx} className="overflow-x-auto">
              <table className="min-w-max border-collapse text-xs sm:text-sm">
                <thead>
                  <tr>
                    {head.map((cell, idx) => (
                      <th
                        key={idx}
                        className="border border-light-500 bg-light-300 px-3 py-1.5 font-semibold dark:border-dark-600 dark:bg-dark-700">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((cells, rowIdx) => (
                    <tr key={rowIdx}>
                      {cells.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="border border-light-500 px-3 py-1.5 dark:border-dark-600">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        const content = block.lines.join('\n');
        if (!content.trim()) return <Fragment key={blockIdx} />;
        return (
          <p key={blockIdx} className="whitespace-pre-wrap">
            {content}
          </p>
        );
      })}
    </div>
  );
}
