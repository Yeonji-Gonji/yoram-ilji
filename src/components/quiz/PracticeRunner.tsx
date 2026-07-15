'use client';

import clsx from 'clsx';
import { ChevronRightIcon, RotateCcwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resolveCorrect } from '@/lib/quiz/grading';
import { categories, getQuestions, shuffle } from '@/lib/quiz/questionBank';
import {
  addWrongNote,
  getSolvedIds,
  markSolved,
} from '@/lib/quiz/quizStorage';
import type { QuizQuestion } from '@/types/quiz.type';
import { QuestionCard } from './QuestionCard';

interface PracticeRunnerProps {
  /** URL로 진입 시 초기 카테고리 (?category=sql) */
  initialCategory?: string;
}

/** 유형별 연습 모드: 한 문제씩 풀고 즉시 정답·해설 확인 */
export function PracticeRunner({ initialCategory }: PracticeRunnerProps) {
  const [category, setCategory] = useState<string | null>(
    initialCategory && categories.some((c) => c.id === initialCategory)
      ? initialCategory
      : null,
  );
  const [skipSolved, setSkipSolved] = useState(false);
  const [queue, setQueue] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [inputs, setInputs] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [override, setOverride] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ done: 0, correct: 0 });
  const [solvedCount, setSolvedCount] = useState(0);

  // 카테고리 선택/옵션 변경 시 문제 큐 재구성
  useEffect(() => {
    if (!category) return;
    const solved = new Set(getSolvedIds());
    const pool = getQuestions([category]);
    setSolvedCount(pool.filter((q) => solved.has(q.id)).length);
    const filtered = skipSolved
      ? pool.filter((q) => !solved.has(q.id))
      : pool;
    setQueue(shuffle(filtered));
    setIndex(0);
    setInputs([]);
    setRevealed(false);
    setOverride(null);
    setStats({ done: 0, correct: 0 });
  }, [category, skipSolved]);

  // 정답 공개 상태에서는 입력창이 비활성화되므로 전역 Enter로 다음 문제 이동
  useEffect(() => {
    if (!revealed) return;
    const onKey = (e: KeyboardEvent) => {
      // 정답 확인 Enter를 길게 눌러 발생하는 오토리핏은 무시(공개 직후
      // 같은 키 눌림으로 곧바로 다음 문제로 넘어가는 것 방지)
      if (e.key === 'Enter' && !e.isComposing && !e.repeat) {
        setIndex((prev) => prev + 1);
        setInputs([]);
        setRevealed(false);
        setOverride(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed]);

  /* ===== 카테고리 선택 화면 ===== */
  if (!category) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className="flex items-center justify-between p-5 text-left border rounded-2xl border-light-400 bg-light-50 transition-colors hover:border-point dark:border-dark-700 dark:bg-dark-800 cursor-pointer">
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-dark-500 dark:text-dark-300">
                {item.count}문제
              </p>
            </div>
            <ChevronRightIcon className="size-5 text-dark-400" />
          </button>
        ))}
      </div>
    );
  }

  const current = queue[index];
  const finished = queue.length === 0 || index >= queue.length;
  const categoryLabel =
    categories.find((c) => c.id === category)?.label ?? category;

  const checkAnswer = () => {
    setRevealed(true);
    const correct = resolveCorrect(current, inputs, null);
    // 자동 채점 가능한 문제는 즉시 기록. 자가 채점 문제는 override 선택 시 기록
    if (correct === true) {
      markSolved(current.id);
      setStats((prev) => ({ done: prev.done + 1, correct: prev.correct + 1 }));
    } else if (correct === false) {
      addWrongNote(current.id);
      setStats((prev) => ({ ...prev, done: prev.done + 1 }));
    }
  };

  const handleOverride = (correct: boolean) => {
    const wasAuto = resolveCorrect(current, inputs, null);
    // 이전 판정과 다를 때만 통계·저장 보정
    if (override === null) {
      if (wasAuto === null) {
        setStats((prev) => ({
          done: prev.done + 1,
          correct: prev.correct + (correct ? 1 : 0),
        }));
      } else if (wasAuto !== correct) {
        setStats((prev) => ({
          ...prev,
          correct: prev.correct + (correct ? 1 : -1),
        }));
      }
    } else if (override !== correct) {
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + (correct ? 1 : -1),
      }));
    }
    if (correct) {
      markSolved(current.id);
    } else {
      addWrongNote(current.id);
    }
    setOverride(correct);
  };

  const nextQuestion = () => {
    setIndex((prev) => prev + 1);
    setInputs([]);
    setRevealed(false);
    setOverride(null);
  };

  return (
    <div className="space-y-4">
      {/* 상태 바 */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg border-light-500 transition-colors hover:border-point dark:border-dark-600 cursor-pointer">
          <RotateCcwIcon className="size-3.5" /> 유형 다시 선택
        </button>
        <span className="font-semibold">{categoryLabel}</span>
        <span className="text-dark-500 dark:text-dark-300">
          {finished ? queue.length : index + 1} / {queue.length}
        </span>
        <span className="ml-auto text-xs text-dark-500 dark:text-dark-300">
          이번 세션 {stats.done}문제 중 {stats.correct}개 정답
        </span>
      </div>

      <label className="flex items-center gap-2 text-xs cursor-pointer text-dark-500 dark:text-dark-300">
        <input
          type="checkbox"
          checked={skipSolved}
          onChange={(e) => setSkipSolved(e.target.checked)}
          className="accent-point"
        />
        맞힌 적 있는 문제 제외 (현재 {solvedCount}문제 해결)
      </label>

      {finished ? (
        <div className="p-8 text-center border rounded-2xl border-light-400 bg-light-50 dark:border-dark-700 dark:bg-dark-800">
          <p className="text-lg font-semibold">
            {queue.length === 0
              ? '풀 문제가 없습니다'
              : '이 유형의 문제를 모두 풀었습니다!'}
          </p>
          {queue.length > 0 && (
            <p className="mt-2 text-sm text-dark-500 dark:text-dark-300">
              {queue.length}문제 중 {stats.correct}개 정답
            </p>
          )}
          <button
            type="button"
            onClick={() => setCategory(null)}
            className="px-5 py-2 mt-4 text-sm font-semibold text-white rounded-xl bg-point transition-colors hover:bg-point-dark cursor-pointer">
            다른 유형 풀기
          </button>
        </div>
      ) : (
        <>
          <QuestionCard
            question={current}
            heading={`문제 ${index + 1}`}
            inputs={inputs}
            onInputChange={(idx, value) =>
              setInputs((prev) => {
                const next = [...prev];
                next[idx] = value;
                return next;
              })
            }
            revealed={revealed}
            overrideValue={override}
            onOverride={revealed ? handleOverride : undefined}
            onEnter={revealed ? nextQuestion : checkAnswer}
          />

          <div className="sticky bottom-4">
            {revealed ? (
              <button
                type="button"
                onClick={nextQuestion}
                className="w-full py-3 text-base font-semibold text-white rounded-xl bg-point shadow-lg transition-colors hover:bg-point-dark cursor-pointer">
                다음 문제
              </button>
            ) : (
              <button
                type="button"
                onClick={checkAnswer}
                className="w-full py-3 text-base font-semibold rounded-xl border-2 border-point text-point bg-light-100 shadow-lg transition-colors hover:bg-point hover:text-white dark:bg-dark-900 cursor-pointer">
                정답 확인
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
