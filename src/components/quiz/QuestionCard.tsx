'use client';

import clsx from 'clsx';
import { CheckIcon, CircleHelpIcon, XIcon } from 'lucide-react';
import { isAutoGradable, isBlankCorrect, resolveCorrect } from '@/lib/quiz/grading';
import type { QuizQuestion } from '@/types/quiz.type';
import { CodeBlock } from './CodeBlock';
import { PassageText } from './PassageText';

interface QuestionCardProps {
  question: QuizQuestion;
  /** 카드 상단 표기 (예: "문제 3 / 20") */
  heading?: string;
  inputs: string[];
  onInputChange: (index: number, value: string) => void;
  /** true면 정답·해설·채점 결과 공개 */
  revealed: boolean;
  /** 자가 채점(정답/오답 처리) 콜백. 미지정 시 버튼 숨김 */
  onOverride?: (correct: boolean) => void;
  overrideValue?: boolean | null;
  disabled?: boolean;
}

/** 문제 1개 표시 + 답 입력 + (공개 시) 채점·해설. 모든 모드 공용 카드 */
export function QuestionCard({
  question,
  heading,
  inputs,
  onInputChange,
  revealed,
  onOverride,
  overrideValue = null,
  disabled = false,
}: QuestionCardProps) {
  const autoGradable = isAutoGradable(question);
  const finalCorrect = revealed
    ? resolveCorrect(question, inputs, overrideValue)
    : null;
  const isEssay = question.type === 'essay';

  return (
    <div className="rounded-2xl border border-light-400 bg-light-50 p-5 sm:p-7 dark:border-dark-700 dark:bg-dark-800">
      {/* 헤더: 위치·카테고리·회차·채점 상태 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {heading && (
          <span className="text-sm font-semibold text-point">{heading}</span>
        )}
        <span className="rounded-full bg-light-300 px-2.5 py-0.5 text-xs dark:bg-dark-700">
          {question.categoryLabel}
        </span>
        {question.examRound && (
          <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs text-sky-600 dark:text-sky-500">
            {question.examRound}
          </span>
        )}
        {isEssay && (
          <span className="rounded-full bg-point/10 px-2.5 py-0.5 text-xs text-point">
            서술형
          </span>
        )}
        {revealed && (
          <span
            className={clsx(
              'ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              finalCorrect === true &&
                'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
              finalCorrect === false &&
                'bg-red-500/15 text-red-600 dark:text-red-400',
              finalCorrect === null &&
                'bg-amber-500/15 text-amber-600 dark:text-amber-400',
            )}>
            {finalCorrect === true && (
              <>
                <CheckIcon className="size-3.5" /> 정답
              </>
            )}
            {finalCorrect === false && (
              <>
                <XIcon className="size-3.5" /> 오답
              </>
            )}
            {finalCorrect === null && (
              <>
                <CircleHelpIcon className="size-3.5" /> 직접 채점 필요
              </>
            )}
          </span>
        )}
      </div>

      {/* 문제 지시문 */}
      <p className="mb-4 text-[15px] font-medium leading-relaxed whitespace-pre-wrap sm:text-base">
        {question.question}
      </p>

      {/* 박스 지문 */}
      {question.passage && (
        <div className="p-4 mb-4 border rounded-xl border-light-400 bg-light-200 dark:border-dark-600 dark:bg-dark-900">
          <PassageText text={question.passage} />
        </div>
      )}

      {/* 코드 지문 */}
      {question.code && (
        <div className="mb-4">
          <CodeBlock code={question.code} language={question.language} />
        </div>
      )}

      {/* 그림 문제 안내 */}
      {question.figure && (
        <div className="p-4 mb-4 text-sm border rounded-xl border-amber-400/40 bg-amber-500/10">
          <p className="font-semibold text-amber-600 dark:text-amber-400">
            그림 포함 문제
          </p>
          {question.figureDesc && (
            <p className="mt-1 whitespace-pre-wrap">{question.figureDesc}</p>
          )}
          {question.sourcePdf && (
            <a
              href={encodeURI(question.sourcePdf)}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-xs underline text-sky-600 dark:text-sky-500">
              원본 PDF에서 그림 보기 (문제 {question.number}번)
            </a>
          )}
        </div>
      )}

      {/* <보기> */}
      {question.choices && question.choices.length > 0 && (
        <div className="p-4 mb-4 border rounded-xl border-light-400 dark:border-dark-600">
          <p className="mb-2 text-xs font-semibold text-dark-500 dark:text-dark-300">
            〈보기〉
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
            {question.choices.map((choice, idx) => (
              <li key={idx} className="whitespace-pre-wrap">
                • {choice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 답 입력 */}
      <div className="space-y-3">
        {question.answers.map((answer, idx) => {
          const value = inputs[idx] ?? '';
          const blankCorrect =
            revealed && autoGradable ? isBlankCorrect(answer, value) : null;
          const multiline = isEssay || answer.answer.includes('\n');
          return (
            <div key={idx}>
              <div className="flex items-start gap-2">
                {answer.label && (
                  <span className="mt-2 text-sm font-semibold shrink-0">
                    {answer.label}
                  </span>
                )}
                {multiline ? (
                  <textarea
                    value={value}
                    onChange={(e) => onInputChange(idx, e.target.value)}
                    disabled={disabled || revealed}
                    rows={isEssay ? 3 : 4}
                    placeholder={isEssay ? '서술형 답안 작성' : '답안 입력 (여러 줄)'}
                    className={clsx(
                      'w-full rounded-xl border bg-light-100 px-4 py-2.5 text-sm outline-none transition-colors dark:bg-dark-900',
                      'focus:border-point disabled:opacity-70',
                      blankCorrect === true && 'border-emerald-500',
                      blankCorrect === false && 'border-red-500',
                      blankCorrect === null &&
                        'border-light-500 dark:border-dark-600',
                    )}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onInputChange(idx, e.target.value)}
                    disabled={disabled || revealed}
                    placeholder="답안 입력"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={clsx(
                      'w-full rounded-xl border bg-light-100 px-4 py-2.5 text-sm outline-none transition-colors dark:bg-dark-900',
                      'focus:border-point disabled:opacity-70',
                      blankCorrect === true && 'border-emerald-500',
                      blankCorrect === false && 'border-red-500',
                      blankCorrect === null &&
                        'border-light-500 dark:border-dark-600',
                    )}
                  />
                )}
              </div>
              {/* 공개 시 정답 표시 */}
              {revealed && (
                <div className="mt-1.5 pl-1 text-sm">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    정답:{' '}
                  </span>
                  <span className="whitespace-pre-wrap">{answer.answer}</span>
                  {answer.aliases && answer.aliases.length > 0 && (
                    <span className="ml-2 text-xs text-dark-500 dark:text-dark-300">
                      (허용: {answer.aliases.join(', ')})
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 해설 + 자가 채점 */}
      {revealed && (
        <div className="mt-5 space-y-3">
          {question.explanation && (
            <div className="p-4 text-sm leading-relaxed border rounded-xl border-light-400 bg-light-200 dark:border-dark-600 dark:bg-dark-900">
              <p className="mb-1 text-xs font-semibold text-point">해설</p>
              <p className="whitespace-pre-wrap">{question.explanation}</p>
            </div>
          )}
          {onOverride && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-xs text-dark-500 dark:text-dark-300">
                {autoGradable
                  ? '자동 채점이 틀렸다면 직접 조정:'
                  : '정답과 비교해 직접 채점:'}
              </span>
              <button
                type="button"
                onClick={() => onOverride(true)}
                className={clsx(
                  'rounded-lg border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                  overrideValue === true
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'border-light-500 hover:border-emerald-500 dark:border-dark-600',
                )}>
                맞았음
              </button>
              <button
                type="button"
                onClick={() => onOverride(false)}
                className={clsx(
                  'rounded-lg border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                  overrideValue === false
                    ? 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400'
                    : 'border-light-500 hover:border-red-500 dark:border-dark-600',
                )}>
                틀렸음
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
