'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { Play, RotateCcw, Terminal } from 'lucide-react';
import { useTheme } from 'next-themes';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import { useEffect, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';

const PYODIDE_VERSION = '0.29.3';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

const DEFAULT_CODE =
  '# Python 템플릿\nprint("Hello, World!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Playground"))';

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (options: {
      indexURL: string;
    }) => Promise<PyodideInstance>;
  }
}

export default function PlaygroundClient() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState('');
  const pyodideRef = useRef<PyodideInstance | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (!window.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = PYODIDE_SCRIPT_URL;
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error('Pyodide 스크립트 로드 실패'));
            document.head.appendChild(script);
          });
        }
        if (!window.loadPyodide) {
          throw new Error('Pyodide 전역이 초기화되지 않았습니다.');
        }
        const pyodide = await window.loadPyodide({
          indexURL: PYODIDE_INDEX_URL,
        });
        if (!cancelled) {
          pyodideRef.current = pyodide;
          setIsPyodideReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setPyodideError(
            err instanceof Error ? err.message : 'Pyodide 초기화 실패',
          );
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const highlightCode = (code: string) =>
    highlight(code, languages.python, 'python');

  const runCode = async () => {
    const py = pyodideRef.current;
    if (!py) return;

    setIsLoading(true);
    setOutput('');
    setError('');

    let stdoutBuf = '';
    let stderrBuf = '';
    py.setStdout({ batched: (msg) => (stdoutBuf += msg + '\n') });
    py.setStderr({ batched: (msg) => (stderrBuf += msg + '\n') });

    try {
      await py.runPythonAsync(code);
      if (stderrBuf) setError(stderrBuf);
      setOutput(stdoutBuf || (stderrBuf ? '' : 'No output'));
    } catch (err) {
      setError(err instanceof Error ? err.message : '코드 실행 중 오류');
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setOutput('');
    setError('');
  };

  const runDisabled = !isPyodideReady || isLoading;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pt-32">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Playground</h1>
            <p className="text-default-500">
              웹 브라우저에서 Python 코드를 작성하고 즉시 실행해보세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              color="danger"
              variant="flat"
              isIconOnly
              onPress={resetCode}
              aria-label="초기화">
              <RotateCcw size={20} />
            </Button>
            <Button
              color="primary"
              className="font-medium"
              startContent={<Play size={20} fill="currentColor" />}
              onPress={runCode}
              isLoading={isLoading}
              isDisabled={runDisabled}>
              {isPyodideReady ? '실행하기' : 'Python 런타임 로드 중...'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* Editor Area */}
          <Card
            className={`border-none shadow-xl overflow-hidden ${
              isDark ? 'bg-[#282c34]' : 'bg-[#fafafa]'
            }`}>
            <CardBody className="p-0 overflow-auto">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlightCode}
                padding={16}
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  fontSize: 14,
                  lineHeight: 1.5,
                  minHeight: '100%',
                  backgroundColor: 'transparent',
                  caretColor: isDark ? 'white' : 'black',
                }}
                className={`min-h-full focus:outline-none ${
                  isDark ? 'prism-dark' : 'prism-light'
                }`}
                textareaClassName="focus:outline-none"
              />
            </CardBody>
          </Card>

          {/* Console Area */}
          <Card
            className={`border-none shadow-xl overflow-hidden ${
              isDark ? 'bg-[#1e1e1e]' : 'bg-[#f5f5f5]'
            }`}>
            <div className="px-4 py-2 bg-default-100 flex items-center gap-2 border-b border-default-200">
              <Terminal size={16} className="text-default-500" />
              <span className="text-xs font-semibold text-default-600 uppercase tracking-wider">
                Console
              </span>
            </div>
            <CardBody className="p-4 font-mono text-sm overflow-auto">
              {pyodideError ? (
                <div className="text-danger whitespace-pre-wrap">
                  Python 런타임 로드 실패: {pyodideError}
                </div>
              ) : !isPyodideReady ? (
                <div className="flex items-center gap-2 text-default-500">
                  <span className="animate-pulse">
                    Python 런타임 다운로드 중... (최초 1회, 약 6MB)
                  </span>
                </div>
              ) : isLoading ? (
                <div className="flex items-center gap-2 text-primary">
                  <span className="animate-pulse">실행 중...</span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="text-danger whitespace-pre-wrap mb-4">
                      {error}
                    </div>
                  )}
                  {output && (
                    <div className="text-success whitespace-pre-wrap">
                      {output}
                    </div>
                  )}
                  {!output && !error && (
                    <div className="text-default-400 italic">
                      코드를 실행하면 결과가 여기에 표시됩니다.
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
