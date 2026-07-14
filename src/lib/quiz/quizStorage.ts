import type { ExamRecord, WrongNote } from '@/types/quiz.type';

/** 정보처리기사 CBT localStorage 헬퍼 (클라이언트 전용) */

const KEY_WRONG = 'quiz-wrong-notes';
const KEY_HISTORY = 'quiz-exam-history';
const KEY_SOLVED = 'quiz-solved-ids';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.error('[QuizStorage] 읽기 실패:', key, error);
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('[QuizStorage] 쓰기 실패:', key, error);
  }
}

/* ===== 오답노트 ===== */

export function getWrongNotes(): WrongNote[] {
  return read<WrongNote[]>(KEY_WRONG, []);
}

export function addWrongNote(id: string): void {
  const notes = getWrongNotes();
  const existing = notes.find((note) => note.id === id);
  const now = new Date().toISOString();
  if (existing) {
    existing.wrongCount += 1;
    existing.lastWrongAt = now;
  } else {
    notes.push({ id, wrongCount: 1, lastWrongAt: now });
  }
  write(KEY_WRONG, notes);
}

export function removeWrongNote(id: string): void {
  write(
    KEY_WRONG,
    getWrongNotes().filter((note) => note.id !== id),
  );
}

export function clearWrongNotes(): void {
  write(KEY_WRONG, []);
}

/* ===== 모의고사 기록 ===== */

export function getExamHistory(): ExamRecord[] {
  return read<ExamRecord[]>(KEY_HISTORY, []);
}

export function upsertExamRecord(record: ExamRecord): void {
  const history = getExamHistory();
  const idx = history.findIndex((item) => item.id === record.id);
  if (idx >= 0) {
    history[idx] = record;
  } else {
    history.unshift(record);
  }
  write(KEY_HISTORY, history.slice(0, 50));
}

/* ===== 푼 문제 (정답 이력) ===== */

export function getSolvedIds(): string[] {
  return read<string[]>(KEY_SOLVED, []);
}

export function markSolved(id: string): void {
  const solved = getSolvedIds();
  if (!solved.includes(id)) {
    solved.push(id);
    write(KEY_SOLVED, solved);
  }
}
