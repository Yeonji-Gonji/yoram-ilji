'use client';

import clsx from 'clsx';
import { ChevronDownIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { resolveCorrect } from '@/lib/quiz/grading';
import { getQuestionById } from '@/lib/quiz/questionBank';
import {
  clearWrongNotes,
  getWrongNotes,
  markSolved,
  removeWrongNote,
} from '@/lib/quiz/quizStorage';
import type { QuizQuestion, WrongNote } from '@/types/quiz.type';
import { QuestionCard } from './QuestionCard';

type NoteItem = { note: WrongNote; question: QuizQuestion };

/** 오답노트: 틀린 문제 목록 + 즉석 재도전(맞히면 목록에서 제거) */
export function ReviewClient() {
  const [items, setItems] = useState<NoteItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [override, setOverride] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = () => {
    const notes = getWrongNotes();
    setItems(
      notes
        .map((note) => ({ note, question: getQuestionById(note.id) }))
        .filter((item): item is NoteItem => Boolean(item.question))
        .sort(
          (a, b) =>
            new Date(b.note.lastWrongAt).getTime() -
            new Date(a.note.lastWrongAt).getTime(),
        ),
    );
  };

  useEffect(() => {
    setMounted(true);
    reload();
  }, []);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    setInputs([]);
    setRevealed(false);
    setOverride(null);
  };

  const handleResolve = (question: QuizQuestion, correct: boolean) => {
    if (correct) {
      markSolved(question.id);
      removeWrongNote(question.id);
      reload();
      setOpenId(null);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="p-10 text-center border rounded-2xl border-light-400 bg-light-50 dark:border-dark-700 dark:bg-dark-800">
        <p className="text-lg font-semibold">오답노트가 비어 있습니다</p>
        <p className="mt-2 text-sm text-dark-500 dark:text-dark-300">
          모의고사·연습에서 틀린 문제가 자동으로 쌓입니다.
        </p>
        <Link
          href="/quiz/exam"
          className="inline-block px-5 py-2 mt-4 text-sm font-semibold text-white rounded-xl bg-point transition-colors hover:bg-point-dark">
          모의고사 풀러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-500 dark:text-dark-300">
          틀린 문제 {items.length}개 · 다시 풀어 맞히면 목록에서 사라집니다
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('오답노트를 전부 비울까요?')) {
              clearWrongNotes();
              reload();
            }
          }}
          className="inline-flex items-center gap-1 text-xs text-red-500 shrink-0 whitespace-nowrap transition-colors hover:text-red-600 cursor-pointer">
          <Trash2Icon className="size-3.5" /> 전체 비우기
        </button>
      </div>

      {items.map(({ note, question }) => {
        const open = openId === note.id;
        return (
          <div
            key={note.id}
            className="border rounded-2xl border-light-400 bg-light-50 dark:border-dark-700 dark:bg-dark-800">
            <button
              type="button"
              onClick={() => toggleOpen(note.id)}
              className="flex items-center w-full gap-3 p-4 text-left cursor-pointer">
              <span className="rounded-full bg-light-300 px-2.5 py-0.5 text-xs shrink-0 dark:bg-dark-700">
                {question.categoryLabel}
              </span>
              <span className="flex-1 text-sm truncate">
                {question.question}
              </span>
              <span className="text-xs shrink-0 text-red-500">
                {note.wrongCount}회 오답
              </span>
              <ChevronDownIcon
                className={clsx(
                  'size-4 shrink-0 transition-transform',
                  open && 'rotate-180',
                )}
              />
            </button>
            {open && (
              <div className="px-4 pb-4 space-y-3">
                <QuestionCard
                  question={question}
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
                  onOverride={
                    revealed
                      ? (correct) => {
                          setOverride(correct);
                          handleResolve(question, correct);
                        }
                      : undefined
                  }
                  onEnter={
                    revealed
                      ? undefined
                      : () => {
                          setRevealed(true);
                          const correct = resolveCorrect(question, inputs, null);
                          if (correct === true) handleResolve(question, true);
                        }
                  }
                />
                {!revealed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setRevealed(true);
                      const correct = resolveCorrect(question, inputs, null);
                      if (correct === true) handleResolve(question, true);
                    }}
                    className="w-full py-2.5 text-sm font-semibold border-2 rounded-xl border-point text-point transition-colors hover:bg-point hover:text-white cursor-pointer">
                    정답 확인
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleOpen(note.id)}
                    className="w-full py-2.5 text-sm border rounded-xl border-light-500 transition-colors hover:border-point dark:border-dark-600 cursor-pointer">
                    접기
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
