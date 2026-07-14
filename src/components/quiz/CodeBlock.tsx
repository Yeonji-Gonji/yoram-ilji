'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  atomOneDark,
  atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
  code: string;
  language?: string | null;
}

/** 문제 코드 지문 표시용 코드 블록 (라이트/다크 테마 연동, 모바일 가로 스크롤) */
export function CodeBlock({ code, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <pre className="p-4 overflow-x-auto text-sm rounded-xl bg-light-200 dark:bg-dark-950">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <SyntaxHighlighter
        language={language ?? 'text'}
        style={resolvedTheme === 'dark' ? atomOneDark : atomOneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          borderRadius: '0.75rem',
        }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
