'use client';

import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon, TimerIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { resolveCorrect } from '@/lib/quiz/grading';
import { buildExam, categories } from '@/lib/quiz/questionBank';
import {
  addWrongNote,
  markSolved,
  upsertExamRecord,
} from '@/lib/quiz/quizStorage';
import type { ExamRecord, QuizQuestion } from '@/types/quiz.type';
import { QuestionCard } from './QuestionCard';

type Phase = 'setup' | 'run' | 'result';

const SIZE_OPTIONS = [10, 20, 30];

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 모의고사 모드: 범위·문항 수 설정 → 응시(타이머) → 일괄 채점·결과 */
export function ExamRunner() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [size, setSize] = useState(20);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string[]>>({});
  const [overrides, setOverrides] = useState<Record<string, boolean | null>>(
    {},
  );
  const [elapsed, setElapsed] = useState(0);
  const examIdRef = useRef('');

  // 응시 중 경과 시간
  useEffect(() => {
    if (phase !== 'run') return;
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const graded = useMemo(
    () =>
      questions.map((question) => ({
        question,
        correct: resolveCorrect(
          question,
          inputs[question.id] ?? [],
          overrides[question.id],
        ),
      })),
    [questions, inputs, overrides],
  );

  const correctCount = graded.filter((g) => g.correct === true).length;
  const ungradedCount = graded.filter((g) => g.correct === null).length;
  const score =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  /** 채점 결과를 기록·오답노트에 반영 (제출 시 1회 + override 변경 시 갱신) */
  const persistResult = (finalElapsed: number) => {
    const wrongIds = graded
      .filter((g) => g.correct !== true)
      .map((g) => g.question.id);
    const record: ExamRecord = {
      id: examIdRef.current,
      at: new Date().toISOString(),
      total: questions.length,
      correct: correctCount,
      score,
      elapsedSec: finalElapsed,
      categories:
        selectedCategories.length > 0
          ? selectedCategories
          : categories.map((c) => c.id),
      wrongIds,
    };
    upsertExamRecord(record);
  };

  const startExam = () => {
    const set = buildExam(selectedCategories, size);
    if (set.length === 0) return;
    examIdRef.current = `exam-${Date.now()}`;
    setQuestions(set);
    setInputs({});
    setOverrides({});
    setIndex(0);
    setElapsed(0);
    setPhase('run');
  };

  const submitExam = () => {
    const unanswered = questions.filter((q) =>
      (inputs[q.id] ?? []).every((v) => !v?.trim()),
    ).length;
    // Enter 제출 실수 방지를 위해 항상 확인 후 제출
    const message =
      unanswered > 0
        ? `안 푼 문제가 ${unanswered}개 있습니다. 제출할까요?`
        : '시험을 제출할까요?';
    if (!window.confirm(message)) return;
    setPhase('result');
  };

  // 결과 화면 진입·override 변경 시 기록 저장 + 오답노트 갱신
  useEffect(() => {
    if (phase !== 'result') return;
    persistResult(elapsed);
    graded.forEach((g) => {
      if (g.correct === true) {
        markSolved(g.question.id);
      } else if (g.correct === false) {
        addWrongNote(g.question.id);
      }
    });
  }, [phase, overrides]);

  /* ===== 설정 화면 ===== */
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold">
            출제 범위{' '}
            <span className="font-normal text-dark-500 dark:text-dark-300">
              (미선택 시 전체)
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      active
                        ? prev.filter((id) => id !== category.id)
                        : [...prev, category.id],
                    )
                  }
                  className={clsx(
                    'rounded-full border px-4 py-2 text-sm transition-colors cursor-pointer',
                    active
                      ? 'border-point bg-point/10 font-semibold text-point'
                      : 'border-light-500 hover:border-point dark:border-dark-600',
                  )}>
                  {category.label}{' '}
                  <span className="text-xs opacity-60">{category.count}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold">문항 수</h2>
          <div className="flex gap-2">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={clsx(
                  'rounded-xl border px-5 py-2.5 text-sm transition-colors cursor-pointer',
                  size === option
                    ? 'border-point bg-point/10 font-semibold text-point'
                    : 'border-light-500 hover:border-point dark:border-dark-600',
                )}>
                {option}문제
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-dark-500 dark:text-dark-300">
            실제 실기 시험은 20문제 · 150분 (문제당 5점, 60점 합격)
          </p>
        </section>

        <button
          type="button"
          onClick={startExam}
          className="w-full py-3.5 text-base font-semibold text-white transition-colors rounded-xl bg-point hover:bg-point-dark cursor-pointer sm:w-auto sm:px-10">
          모의고사 시작
        </button>
      </div>
    );
  }

  const current = questions[index];
  const answeredSet = new Set(
    questions
      .filter((q) => (inputs[q.id] ?? []).some((v) => v?.trim()))
      .map((q) => q.id),
  );

  /* ===== 응시 화면 ===== */
  if (phase === 'run') {
    return (
      <div className="space-y-4">
        {/* 상태 바 */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 -mx-1 border rounded-xl border-light-400 bg-light-100/90 backdrop-blur dark:border-dark-700 dark:bg-dark-900/90">
          <span className="text-sm font-semibold">
            {index + 1} / {questions.length}
          </span>
          <span className="inline-flex items-center gap-1 text-sm tabular-nums text-dark-500 dark:text-dark-300">
            <TimerIcon className="size-4" />
            {formatElapsed(elapsed)}
          </span>
          <button
            type="button"
            onClick={submitExam}
            className="px-4 py-1.5 ml-auto text-sm font-semibold text-white transition-colors rounded-lg bg-point hover:bg-point-dark cursor-pointer">
            제출
          </button>
        </div>

        <QuestionCard
          question={current}
          heading={`문제 ${index + 1}`}
          inputs={inputs[current.id] ?? []}
          onInputChange={(idx, value) =>
            setInputs((prev) => {
              const next = [...(prev[current.id] ?? [])];
              next[idx] = value;
              return { ...prev, [current.id]: next };
            })
          }
          revealed={false}
          onEnter={submitExam}
        />

        {/* 이전/다음 */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm border rounded-xl border-light-500 transition-colors hover:border-point disabled:opacity-40 dark:border-dark-600 cursor-pointer">
            <ChevronLeftIcon className="size-4" /> 이전
          </button>
          <button
            type="button"
            onClick={() =>
              setIndex((prev) => Math.min(questions.length - 1, prev + 1))
            }
            disabled={index === questions.length - 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm border rounded-xl border-light-500 transition-colors hover:border-point disabled:opacity-40 dark:border-dark-600 cursor-pointer">
            다음 <ChevronRightIcon className="size-4" />
          </button>
        </div>

        {/* 문제 바로가기 */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(idx)}
              className={clsx(
                'size-8 rounded-lg border text-xs font-medium transition-colors cursor-pointer',
                idx === index && 'border-point text-point font-bold',
                idx !== index &&
                  (answeredSet.has(q.id)
                    ? 'border-transparent bg-point/15 text-point'
                    : 'border-light-500 dark:border-dark-600'),
              )}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ===== 결과 화면 ===== */
  return (
    <div className="space-y-5">
      <div className="p-6 text-center border rounded-2xl border-light-400 bg-light-50 dark:border-dark-700 dark:bg-dark-800">
        <p className="text-sm text-dark-500 dark:text-dark-300">채점 결과</p>
        <p className="mt-1 text-4xl font-bold text-point">{score}점</p>
        <p className="mt-2 text-sm">
          {questions.length}문제 중 {correctCount}개 정답 · 소요{' '}
          {formatElapsed(elapsed)}
          {ungradedCount > 0 && (
            <span className="block mt-1 text-amber-600 dark:text-amber-400">
              직접 채점이 필요한 문제 {ungradedCount}개: 아래에서 맞았음/틀렸음을
              선택하면 점수에 반영됩니다
            </span>
          )}
        </p>
        <p
          className={clsx(
            'mt-2 text-sm font-semibold',
            score >= 60
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400',
          )}>
          {score >= 60 ? '합격권 (60점 이상)' : '불합격권 (60점 미만)'}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-point transition-colors hover:bg-point-dark cursor-pointer">
            새 모의고사
          </button>
          <Link
            href="/quiz/review"
            className="px-5 py-2 text-sm border rounded-xl border-light-500 transition-colors hover:border-point dark:border-dark-600">
            오답노트 보기
          </Link>
        </div>
      </div>

      {graded.map((g, idx) => (
        <QuestionCard
          key={g.question.id}
          question={g.question}
          heading={`문제 ${idx + 1}`}
          inputs={inputs[g.question.id] ?? []}
          onInputChange={() => undefined}
          revealed
          overrideValue={overrides[g.question.id] ?? null}
          onOverride={(correct) =>
            setOverrides((prev) => ({ ...prev, [g.question.id]: correct }))
          }
        />
      ))}
    </div>
  );
}
