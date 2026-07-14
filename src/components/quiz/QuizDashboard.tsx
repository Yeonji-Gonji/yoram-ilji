'use client';

import clsx from 'clsx';
import {
  BookOpenCheckIcon,
  ClipboardListIcon,
  NotebookPenIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { allQuestions, categories } from '@/lib/quiz/questionBank';
import {
  getExamHistory,
  getSolvedIds,
  getWrongNotes,
} from '@/lib/quiz/quizStorage';
import type { ExamRecord } from '@/types/quiz.type';

/** 시험일: 2026-07-19 (정보처리기사 실기) */
const EXAM_DATE = new Date('2026-07-19T09:00:00+09:00');

const MODES = [
  {
    href: '/quiz/exam',
    icon: ClipboardListIcon,
    title: '모의고사',
    desc: '실전처럼 무작위 출제 · 일괄 채점',
  },
  {
    href: '/quiz/practice',
    icon: BookOpenCheckIcon,
    title: '유형별 연습',
    desc: '한 문제씩 즉시 정답·해설 확인',
  },
  {
    href: '/quiz/review',
    icon: NotebookPenIcon,
    title: '오답노트',
    desc: '틀린 문제만 모아 재도전',
  },
];

/** CBT 홈: D-day, 모드 선택, 유형별 진행률, 최근 모의고사 기록 */
export function QuizDashboard() {
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [history, setHistory] = useState<ExamRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSolvedIds(getSolvedIds());
    setWrongCount(getWrongNotes().length);
    setHistory(getExamHistory().slice(0, 5));
  }, []);

  const dday = Math.ceil(
    (EXAM_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const solvedSet = new Set(solvedIds);
  const totalSolved = allQuestions.filter((q) => solvedSet.has(q.id)).length;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <section className="text-center">
        <p className="text-sm font-semibold text-point">
          {dday > 0 ? `시험까지 D-${dday}` : dday === 0 ? '시험 당일!' : '시험 종료'}
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          정보처리기사 실기 CBT
        </h1>
        <p className="mt-2 text-sm text-dark-500 dark:text-dark-300">
          총 {allQuestions.length}문제
          {mounted && (
            <>
              {' '}
              · 해결 {totalSolved}문제
              {wrongCount > 0 && (
                <span className="text-red-500"> · 오답 {wrongCount}개</span>
              )}
            </>
          )}
        </p>
      </section>

      {/* 모드 선택 */}
      <section className="grid gap-3 sm:grid-cols-3">
        {MODES.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="p-5 border rounded-2xl border-light-400 bg-light-50 transition-colors hover:border-point dark:border-dark-700 dark:bg-dark-800">
            <mode.icon className="size-6 text-point" />
            <p className="mt-3 font-semibold">{mode.title}</p>
            <p className="mt-1 text-xs text-dark-500 dark:text-dark-300">
              {mode.desc}
            </p>
          </Link>
        ))}
      </section>

      {/* 유형별 진행률 */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">유형별 진행률</h2>
        <div className="space-y-2">
          {categories.map((category) => {
            const solved = mounted
              ? allQuestions.filter(
                  (q) => q.category === category.id && solvedSet.has(q.id),
                ).length
              : 0;
            const ratio =
              category.count > 0 ? Math.round((solved / category.count) * 100) : 0;
            return (
              <Link
                key={category.id}
                href={`/quiz/practice?category=${category.id}`}
                className="flex items-center gap-3 p-3 border rounded-xl border-light-400 bg-light-50 transition-colors hover:border-point dark:border-dark-700 dark:bg-dark-800">
                <span className="w-40 text-sm truncate shrink-0">
                  {category.label}
                </span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-light-300 dark:bg-dark-700">
                  <div
                    className="h-full transition-all rounded-full bg-point"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
                <span className="w-16 text-right text-xs tabular-nums text-dark-500 shrink-0 dark:text-dark-300">
                  {solved}/{category.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 최근 모의고사 */}
      {mounted && history.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">최근 모의고사</h2>
          <div className="overflow-hidden border rounded-xl border-light-400 dark:border-dark-700">
            {history.map((record, idx) => (
              <div
                key={record.id}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 text-sm bg-light-50 dark:bg-dark-800',
                  idx > 0 && 'border-t border-light-400 dark:border-dark-700',
                )}>
                <span className="text-xs text-dark-500 dark:text-dark-300">
                  {new Date(record.at).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="ml-auto tabular-nums">
                  {record.correct}/{record.total}
                </span>
                <span
                  className={clsx(
                    'w-14 text-right font-bold tabular-nums',
                    record.score >= 60
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500',
                  )}>
                  {record.score}점
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
